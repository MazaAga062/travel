"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Booking,
  ChecklistGroup,
  ChecklistItem,
  ConfirmedTrip,
  TravelStyle,
  TripInput,
} from "@/domain/trip";
import { track } from "@/lib/analytics";
import { loadConfirmedTrip, saveConfirmedTrip } from "@/lib/storage";
import {
  calculateBookedAmount,
  calculateReadiness,
  calculateTripCost,
  createConfirmedTrip,
  generateMockTrip,
  updateChecklistStatus,
} from "@/lib/trip-utils";

type ActiveSearchField = "destination" | "dates" | "travelers" | "style" | null;
type SearchState = {
  destination: string | null;
  startDate: string | null;
  endDate: string | null;
  adults: number;
  children: number;
  infants: number;
};

const defaultSearchState: SearchState = {
  destination: "Vietnam",
  startDate: "2026-12-01",
  endDate: "2026-12-14",
  adults: 1,
  children: 0,
  infants: 0,
};

const flightOptions = [
  { id: "qatar", airline: "Qatar Airways", route: "Baku → Hanoi", stops: "1 stop", amount: 720 },
  { id: "turkish", airline: "Turkish Airlines", route: "Baku → Hanoi", stops: "1 stop", amount: 780 },
  { id: "etihad", airline: "Etihad", route: "Baku → Hanoi", stops: "1 stop", amount: 820 },
];

const destinationSuggestions = [
  {
    id: "vietnam",
    label: "Vietnam",
    description: "Culture, food, beaches & nature",
    status: "Available",
    flag: "VN",
    available: true,
  },
  {
    id: "indonesia",
    label: "Indonesia",
    description: "Coming soon",
    status: "Coming soon",
    flag: "ID",
    available: false,
  },
  {
    id: "thailand",
    label: "Thailand",
    description: "Coming soon",
    status: "Coming soon",
    flag: "TH",
    available: false,
  },
  {
    id: "japan",
    label: "Japan",
    description: "Coming soon",
    status: "Coming soon",
    flag: "JP",
    available: false,
  },
];

const styleContent: Record<
  TravelStyle,
  { title: string; subtitle: string; description: string; badge?: string }
> = {
  active: {
    title: "Active",
    subtitle: "Adventure",
    description: "More activities, more movement, more places.",
  },
  chill: {
    title: "Chill",
    subtitle: "Relax",
    description: "Beaches, slow travel and free time.",
  },
  mixed: {
    title: "Mixed",
    subtitle: "Balanced",
    description: "Culture, activities and relaxation.",
    badge: "Recommended",
  },
};

const weekdayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const flexibilityChips = ["Exact dates", "± 1 day", "± 2 days", "± 3 days", "± 7 days"];
function searchStateToTripInput(state: SearchState, travelStyle: TravelStyle): TripInput {
  return {
    destination: state.destination ?? "Vietnam",
    startDate: state.startDate ?? "2026-12-01",
    endDate: state.endDate ?? "2026-12-14",
    travelers: Math.max(1, state.adults + state.children),
    travelStyle,
  };
}

function getTravelerSummary(state: SearchState): string {
  const total = state.adults + state.children;

  if (state.children > 0) {
    return `${state.adults} adult${state.adults > 1 ? "s" : ""}, ${state.children} child${state.children > 1 ? "ren" : ""}`;
  }

  return `${Math.max(1, total)} traveler${total > 1 ? "s" : ""}`;
}

function getMonthData(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const shift = (firstDay.getDay() + 6) % 7;
  const days: Array<Date | null> = Array.from({ length: shift }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return {
    year,
    month,
    label: new Intl.DateTimeFormat("en-US", { month: "long" }).format(firstDay),
    days,
  };
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${`${date.getDate()}`.padStart(2, "0")}`;
}

function formatDateRange(startDate: string, endDate: string): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  });

  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`;
}

function formatCurrency(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(value)} AZN`;
}

function formatGroupName(group: ChecklistGroup): string {
  if (group === "beforeDeparture") {
    return "Before departure";
  }

  return group.charAt(0).toUpperCase() + group.slice(1);
}

export default function Page() {
  const [searchState, setSearchState] = useState<SearchState>(defaultSearchState);
  const [step, setStep] = useState<"search" | "loading" | "itinerary" | "dashboard">(
    "search",
  );
  const [generatedStyle, setGeneratedStyle] = useState<TravelStyle>("mixed");
  const [confirmedTrip, setConfirmedTrip] = useState<ConfirmedTrip | null>(null);
  const [activeField, setActiveField] = useState<ActiveSearchField>(null);
  const [isMobilePlannerOpen, setIsMobilePlannerOpen] = useState(false);
  const [whereQuery, setWhereQuery] = useState(defaultSearchState.destination ?? "");
  const [debouncedWhereQuery, setDebouncedWhereQuery] = useState(whereQuery);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [shouldAdvanceFromDates, setShouldAdvanceFromDates] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<SearchState[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem("birtravel-recent-searches");
      return raw ? (JSON.parse(raw) as SearchState[]) : [];
    } catch {
      return [];
    }
  });

  const destinationInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    track("birtravel_opened");
    const storedTrip = loadConfirmedTrip();

    if (storedTrip) {
      const timer = window.setTimeout(() => {
        setConfirmedTrip(storedTrip);
        setGeneratedStyle(storedTrip.input.travelStyle);
        setSearchState({
          destination: storedTrip.input.destination,
          startDate: storedTrip.input.startDate,
          endDate: storedTrip.input.endDate,
          adults: Math.max(1, storedTrip.input.travelers),
          children: 0,
          infants: 0,
        });
        setWhereQuery(storedTrip.input.destination);
        setStep("dashboard");
        track("trip_opened", { tripId: storedTrip.id });
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedWhereQuery(whereQuery);
    }, 220);

    return () => window.clearTimeout(timer);
  }, [whereQuery]);

  useEffect(() => {
    if (confirmedTrip) {
      saveConfirmedTrip(confirmedTrip);
    }
  }, [confirmedTrip]);

  useEffect(() => {
    if (activeField === "destination" || isMobilePlannerOpen) {
      const timer = window.setTimeout(() => {
        destinationInputRef.current?.focus();
      }, 20);

      return () => window.clearTimeout(timer);
    }
  }, [activeField, isMobilePlannerOpen]);

  useEffect(() => {
    if (
      activeField === "dates" &&
      shouldAdvanceFromDates &&
      searchState.startDate &&
      searchState.endDate
    ) {
      const timer = window.setTimeout(() => {
        setActiveField("travelers");
        setShouldAdvanceFromDates(false);
      }, 150);

      return () => window.clearTimeout(timer);
    }
  }, [activeField, searchState.endDate, searchState.startDate, shouldAdvanceFromDates]);

  useEffect(() => {
    if (step !== "loading") {
      return;
    }

    const sequence = [
      "Building your Vietnam route...",
      "Finding the best travel order...",
      "Optimizing transport...",
      "Finding must-see places...",
      "Estimating your trip budget...",
      "Your trip is ready",
    ];

    const timers = sequence.map((_, index) =>
      window.setTimeout(() => {
        setLoadingMessageIndex(index);
      }, index * 420),
    );

    const finish = window.setTimeout(() => {
      setStep("itinerary");
      track("trip_generated", { style: generatedStyle });
      track("itinerary_viewed", { style: generatedStyle });
    }, 2600);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(finish);
    };
  }, [generatedStyle, step]);

  const input = useMemo(
    () => searchStateToTripInput(searchState, generatedStyle),
    [generatedStyle, searchState],
  );

  const template = useMemo(
    () => generateMockTrip(input),
    [input],
  );

  const budget = useMemo(
    () => calculateTripCost(template, input.travelers),
    [input.travelers, template],
  );

  const heroSlides = useMemo(
    () =>
      template.stops
        .flatMap((stop) =>
          stop.photoSpots.slice(0, 2).map((spot) => ({
            id: spot.id,
            image: spot.image,
            title: spot.name,
            city: stop.city,
          })),
        )
        .slice(0, 5),
    [template],
  );

  const groupedChecklist = useMemo(() => {
    const source = confirmedTrip?.checklist ?? [];
    return source.reduce<Record<ChecklistGroup, ChecklistItem[]>>(
      (groups, item) => {
        groups[item.group].push(item);
        return groups;
      },
      {
        booking: [],
        documents: [],
        connectivity: [],
        transfers: [],
        beforeDeparture: [],
      },
    );
  }, [confirmedTrip]);

  const criticalItems = useMemo(
    () =>
      (confirmedTrip?.checklist ?? []).filter(
        (item) =>
          item.status === "pending" &&
          (item.kind === "visa" || item.kind === "internationalFlight" || item.kind === "passport"),
      ),
    [confirmedTrip],
  );

  const nextAction = useMemo(
    () =>
      criticalItems[0] ??
      (confirmedTrip?.checklist ?? []).find((item) => item.status === "pending") ??
      null,
    [confirmedTrip, criticalItems],
  );

  const priorityChecklist = useMemo(
    () => (confirmedTrip?.checklist ?? []).filter((item) => item.status === "pending").slice(0, 4),
    [confirmedTrip],
  );

  useEffect(() => {
    if (step !== "itinerary" || heroSlides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setHeroSlideIndex((current) => (current + 1) % heroSlides.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [heroSlides.length, step]);

  const filteredSuggestions = useMemo(() => {
    const normalized = debouncedWhereQuery.trim().toLowerCase();

    if (!normalized) {
      return destinationSuggestions;
    }

    return destinationSuggestions.filter(
      (item) =>
        item.label.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized),
    );
  }, [debouncedWhereQuery]);

  const totalTravelers = searchState.adults + searchState.children + searchState.infants;
  const isSearchValid = Boolean(
    searchState.destination === "Vietnam" &&
      searchState.startDate &&
      searchState.endDate &&
      searchState.adults >= 1 &&
      totalTravelers <= 4,
  );

  const baseMonthSource = searchState.startDate ?? "2026-12-01";
  const baseMonthDate = new Date(baseMonthSource);
  const monthsToShow = [
    getMonthData(baseMonthDate.getFullYear(), baseMonthDate.getMonth()),
    getMonthData(
      baseMonthDate.getMonth() === 11 ? baseMonthDate.getFullYear() + 1 : baseMonthDate.getFullYear(),
      (baseMonthDate.getMonth() + 1) % 12,
    ),
  ];

  const loadingMessages = [
    "Building your Vietnam route...",
    "Finding the best travel order...",
    "Optimizing transport...",
    "Finding must-see places...",
    "Estimating your trip budget...",
    "Your trip is ready",
  ];

  function persistRecentSearch(search: SearchState) {
    setRecentSearches((current) => {
      const next = [
        search,
        ...current.filter(
          (item) =>
            !(
              item.destination === search.destination &&
              item.startDate === search.startDate &&
              item.endDate === search.endDate &&
              item.adults === search.adults &&
              item.children === search.children &&
              item.infants === search.infants
            ),
        ),
      ].slice(0, 4);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("birtravel-recent-searches", JSON.stringify(next));
      }

      return next;
    });
  }

  function closeSearchOverlay() {
    setActiveField(null);
    setIsMobilePlannerOpen(false);
  }

  function openField(field: ActiveSearchField) {
    setStep("search");
    setIsMobilePlannerOpen(false);
    if (field !== "dates") {
      setShouldAdvanceFromDates(false);
    }
    setActiveField(field);
  }

  function handleSearchGenerate() {
    if (!isSearchValid) {
      return;
    }

    track("trip_creation_started");
    track("destination_selected", { destination: searchState.destination });
    track("dates_selected", { startDate: searchState.startDate, endDate: searchState.endDate });
    persistRecentSearch(searchState);
    closeSearchOverlay();
    setLoadingMessageIndex(0);
    setHeroSlideIndex(0);
    setStep("loading");
    track("travel_style_selected", { style: generatedStyle });
    track("trip_generation_started", { style: generatedStyle });
  }

  function handleGenerateStyle(style: TravelStyle) {
    setGeneratedStyle(style);
    track("travel_style_selected", { style });
  }

  function handleConfirmTrip() {
    const nextTrip = createConfirmedTrip(searchStateToTripInput(searchState, generatedStyle));
    setConfirmedTrip(nextTrip);
    setStep("dashboard");
    track("trip_confirmed", { style: generatedStyle });
  }

  function patchTrip(mutator: (trip: ConfirmedTrip) => ConfirmedTrip) {
    setConfirmedTrip((current) => {
      if (!current) {
        return current;
      }

      return mutator(current);
    });
  }

  function completeChecklistItem(itemId: string) {
    patchTrip((trip) => {
      const checklist = updateChecklistStatus(trip.checklist, itemId, "completed");
      return { ...trip, checklist, readiness: calculateReadiness(checklist) };
    });
    track("checklist_item_completed", { itemId });
  }

  function bookFlight(optionId: string) {
    const option = flightOptions.find((entry) => entry.id === optionId);
    if (!option) {
      return;
    }

    patchTrip((trip) => {
      const booking: Booking = {
        id: `flight-${option.id}`,
        type: "flight",
        title: `${option.airline} · ${option.route}`,
        amount: option.amount,
        createdAt: new Date().toISOString(),
        details: `${option.stops} · Demo price`,
      };
      const checklist = updateChecklistStatus(trip.checklist, "flight-main", "completed");
      const bookings = [...trip.bookings.filter((item) => item.type !== "flight"), booking];

      return {
        ...trip,
        checklist,
        bookings,
        bookedAmount: calculateBookedAmount(bookings),
        readiness: calculateReadiness(checklist),
      };
    });

    track("flight_booking_started", { optionId });
    track("flight_booked", { optionId, amount: option.amount });
  }

  function buyAddon(type: "insurance" | "esim") {
    patchTrip((trip) => {
      const amount =
        type === "insurance"
          ? trip.template.insuranceEstimate * trip.input.travelers
          : trip.template.esimEstimate * trip.input.travelers;
      const booking: Booking = {
        id: `${type}-${Date.now()}`,
        type,
        title: type === "insurance" ? "Travel insurance" : "Vietnam eSIM",
        amount,
        createdAt: new Date().toISOString(),
        details: "Mock purchase",
      };
      const checklist = updateChecklistStatus(trip.checklist, type, "completed");
      const bookings = [...trip.bookings.filter((item) => item.type !== type), booking];

      return {
        ...trip,
        checklist,
        bookings,
        bookedAmount: calculateBookedAmount(bookings),
        readiness: calculateReadiness(checklist),
      };
    });

    track(type === "insurance" ? "insurance_purchased" : "esim_purchased", {});
  }

  function markTransferDone(itemId: string) {
    completeChecklistItem(itemId);
    track("transfer_completed", { itemId });
  }

  function handleDestinationSelect(label: string, available: boolean) {
    if (!available) {
      return;
    }

    setSearchState((current) => ({ ...current, destination: label }));
    setWhereQuery(label);
    setActiveField("dates");
  }

  function applyRecentSearch(search: SearchState) {
    setSearchState(search);
    setWhereQuery(search.destination ?? "");
    setActiveField("dates");
  }

  function handleDateSelect(value: string) {
    setSearchState((current) => {
      if (!current.startDate || current.endDate) {
        setShouldAdvanceFromDates(false);
        return { ...current, startDate: value, endDate: null };
      }

      if (new Date(value) < new Date(current.startDate)) {
        setShouldAdvanceFromDates(true);
        return { ...current, startDate: value, endDate: current.startDate };
      }

      setShouldAdvanceFromDates(true);
      return { ...current, endDate: value };
    });
  }

  function updateTravelerCount(kind: "adults" | "children" | "infants", delta: number) {
    setSearchState((current) => {
      const next = { ...current };
      const total = current.adults + current.children + current.infants;

      if (kind === "adults") {
        next.adults = Math.max(1, current.adults + delta);
        return next;
      }

      if (kind !== "infants" && delta > 0 && total >= 4) {
        return current;
      }

      if (kind === "children") {
        next.children = Math.max(0, current.children + delta);
        if (next.children > 0 && next.adults < 1) {
          next.adults = 1;
        }
      }

      if (kind === "infants") {
        next.infants = Math.max(0, current.infants + delta);
      }

      return next;
    });
  }

  const isItineraryScreen = step === "itinerary";
  return (
    <main
      className={`flex min-h-screen w-full flex-col ${
        isItineraryScreen
          ? "mx-auto max-w-7xl gap-5 px-4 py-0 md:px-6"
          : "mx-auto max-w-7xl gap-8 px-4 py-5 md:px-6 md:py-6"
      }`}
    >
      {(activeField || isMobilePlannerOpen) && (
        <button
          type="button"
          aria-label="Close search overlay"
          onClick={closeSearchOverlay}
          className="fixed inset-0 z-10 bg-[rgba(15,23,42,0.18)]"
        />
      )}

      <header className="sticky top-4 z-20 rounded-[24px] border border-[color:var(--border)] bg-white/95 px-5 py-5 shadow-[var(--shadow-soft)] backdrop-blur md:px-6">
        <div className="hidden items-center gap-6 md:flex">
          <div className="shrink-0">
            <BrandLockup />
          </div>

          <div className="relative min-w-0 flex-1">
            <div className="flex items-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-1 shadow-[var(--shadow-soft)]">
              <SearchPillSegment
                label="Where"
                value={searchState.destination ?? "Search destinations"}
                active={activeField === "destination"}
                wide
                onClick={() => openField("destination")}
              />
              <Divider />
              <SearchPillSegment
                label="When"
                value={
                  searchState.startDate && searchState.endDate
                    ? formatDateRange(searchState.startDate, searchState.endDate)
                    : "Add dates"
                }
                active={activeField === "dates"}
                onClick={() => openField("dates")}
              />
              <Divider />
              <SearchPillSegment
                label="Who"
                value={getTravelerSummary(searchState)}
                active={activeField === "travelers"}
                onClick={() => openField("travelers")}
              />
              <Divider />
              <SearchPillSegment
                label="How"
                value={styleContent[generatedStyle].title}
                active={activeField === "style"}
                onClick={() => openField("style")}
              />
              <button
                type="button"
                disabled={!isSearchValid}
                onClick={handleSearchGenerate}
                className={`ml-2 flex h-14 items-center gap-2 rounded-full px-5 text-sm font-semibold transition ${
                  isSearchValid
                    ? "bg-[image:var(--brand-gradient)] text-white shadow-[0_18px_38px_rgba(91,33,182,0.3)]"
                    : "bg-[color:var(--surface)] text-[color:var(--text-soft)]"
                }`}
              >
                <span>Generate Trip</span>
              </button>
            </div>

            {activeField === "destination" && (
              <DestinationPopover
                query={whereQuery}
                onChangeQuery={setWhereQuery}
                suggestions={filteredSuggestions}
                recentSearches={recentSearches}
                inputRef={destinationInputRef}
                onSelectSuggestion={handleDestinationSelect}
                onSelectRecent={applyRecentSearch}
              />
            )}

            {activeField === "dates" && (
              <DatePopover
                months={monthsToShow}
                startDate={searchState.startDate}
                endDate={searchState.endDate}
                onSelectDate={handleDateSelect}
              />
            )}

            {activeField === "travelers" && (
              <TravelersPopover
                state={searchState}
                onChangeTraveler={updateTravelerCount}
              />
            )}

            {activeField === "style" && (
              <StylePopover selectedStyle={generatedStyle} onSelectStyle={handleGenerateStyle} />
            )}
          </div>
        </div>

        <div className="md:hidden">
          <div className="mb-4">
            <BrandLockup />
          </div>
          <button
            type="button"
            onClick={() => {
              setIsMobilePlannerOpen(true);
              setActiveField("destination");
            }}
            className="flex w-full items-center gap-3 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-5 py-4 text-left shadow-[var(--shadow-soft)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-lg text-[color:var(--brand-strong)]">
              ⌕
            </span>
            <span>
              <span className="block text-base font-semibold">Start planning</span>
              <span className="mt-1 block text-sm text-[color:var(--text-soft)]">
                {searchState.destination ?? "Search destinations"} ·{" "}
                {searchState.startDate && searchState.endDate
                  ? formatDateRange(searchState.startDate, searchState.endDate)
                  : "Add dates"}
              </span>
            </span>
          </button>
        </div>

        {isMobilePlannerOpen && (
          <div className="mt-5 rounded-[28px] border border-[color:var(--border)] bg-white p-4 shadow-[var(--shadow-card)] md:hidden">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold">Plan your trip</p>
              <button
                type="button"
                onClick={closeSearchOverlay}
                className="rounded-full bg-[color:var(--surface-muted)] px-3 py-2 text-sm font-semibold"
              >
                Close
              </button>
            </div>

            {activeField === "destination" && (
              <div className="space-y-4">
                <input
                  ref={destinationInputRef}
                  type="text"
                  value={whereQuery}
                  onChange={(event) => setWhereQuery(event.target.value)}
                  placeholder="Search destinations"
                  className="w-full rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-4 outline-none"
                />
                <div className="space-y-2">
                  {filteredSuggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (!item.available) {
                          return;
                        }

                        setSearchState((current) => ({ ...current, destination: item.label }));
                        setWhereQuery(item.label);
                        setActiveField("dates");
                      }}
                      className={`flex w-full items-start justify-between rounded-[20px] border px-4 py-4 text-left ${
                        item.available
                          ? "border-[color:var(--border)] bg-white"
                          : "border-[color:var(--border)] bg-[color:var(--surface-muted)] opacity-70"
                      }`}
                    >
                      <span>
                        <span className="block font-semibold">{item.label}</span>
                        <span className="mt-1 block text-sm text-[color:var(--text-soft)]">
                          {item.description}
                        </span>
                      </span>
                      <span className="text-xs font-semibold text-[color:var(--text-soft)]">
                        {item.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeField === "dates" && (
              <DatePopover
                months={monthsToShow}
                startDate={searchState.startDate}
                endDate={searchState.endDate}
                onSelectDate={handleDateSelect}
                mobile
              />
            )}

            {activeField === "travelers" && (
              <div className="space-y-4">
                <TravelersPopover state={searchState} onChangeTraveler={updateTravelerCount} mobile />
                <button
                  type="button"
                  onClick={() => setActiveField("style")}
                  className="w-full rounded-full border border-[color:var(--border)] bg-white px-5 py-4 text-base font-semibold"
                >
                  Continue to How
                </button>
              </div>
            )}

            {activeField === "style" && (
              <div className="space-y-4">
                <StylePopover selectedStyle={generatedStyle} onSelectStyle={handleGenerateStyle} mobile />
                <button
                  type="button"
                  disabled={!isSearchValid}
                  onClick={() => {
                    closeSearchOverlay();
                    handleSearchGenerate();
                  }}
                  className={`w-full rounded-full px-5 py-4 text-base font-semibold ${
                    isSearchValid
                      ? "bg-[image:var(--brand-gradient)] text-white shadow-[0_18px_38px_rgba(91,33,182,0.26)]"
                      : "bg-[color:var(--surface-muted)] text-[color:var(--text-soft)]"
                  }`}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {step === "loading" && (
        <section className="rounded-[40px] border border-[color:var(--border)] bg-white p-8 shadow-[var(--shadow-card)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand)]">
            birtravel planner
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em]">
            {loadingMessages[loadingMessageIndex]}
          </h2>
          <div className="mt-8 space-y-3">
            {loadingMessages.map((item, index) => (
              <div
                key={item}
                className={`rounded-[24px] border px-5 py-4 text-sm ${
                  index <= loadingMessageIndex
                    ? "border-[color:var(--brand)] bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]"
                    : "border-[color:var(--border)] bg-[color:var(--surface-muted)] text-[color:var(--text-soft)]"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      )}

      {step === "itinerary" && (
        <section className="mx-auto w-full max-w-[1460px] space-y-5 pb-28 pt-4">
          <section className="grid items-stretch gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <article className="rounded-[30px] bg-transparent px-2 py-4">
              <div className="inline-flex rounded-full bg-[color:var(--surface-accent)] px-4 py-2 text-sm font-semibold text-[color:var(--brand-strong)]">
                ✓ Your trip is ready
              </div>
              <h2 className="mt-6 max-w-[620px] text-[58px] font-extrabold leading-[0.98] tracking-[-0.065em] text-[color:var(--brand-ink)]">
                {template.country} in {template.durationDays} days:
                <br />
                Cities, Nature & Beach
              </h2>
              <p className="mt-6 text-[18px] font-medium text-[color:var(--text-soft)]">
                Hanoi → Ha Long Bay → Da Nang → Hoi An → Ho Chi Minh City
              </p>
              <p className="mt-3 max-w-[520px] text-[18px] leading-8 text-[color:var(--text-soft)]">
                Optimized loop route with minimal backtracking and the best of Vietnam.
              </p>
            </article>

            <article className="relative h-[390px] overflow-hidden rounded-[30px] border border-[color:var(--border)] bg-white shadow-[var(--shadow-card)]">
              <Image
                src={heroSlides[heroSlideIndex]?.image ?? template.stops[0]?.photoSpots[0]?.image ?? ""}
                alt={heroSlides[heroSlideIndex]?.title ?? template.country}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 52vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/18 via-transparent to-black/8" />
              {heroSlides.length > 1 ? (
                <>
                  <div className="absolute bottom-6 left-6 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-[color:var(--brand-ink)] shadow-[var(--shadow-soft)] backdrop-blur">
                    {heroSlides[heroSlideIndex]?.title} · {heroSlides[heroSlideIndex]?.city}
                  </div>
                  <div className="absolute bottom-6 right-6 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Previous place"
                      onClick={() =>
                        setHeroSlideIndex((current) =>
                          current === 0 ? heroSlides.length - 1 : current - 1,
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-xl text-[color:var(--brand-strong)] shadow-[var(--shadow-soft)] backdrop-blur"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Next place"
                      onClick={() => setHeroSlideIndex((current) => (current + 1) % heroSlides.length)}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-xl text-[color:var(--brand-strong)] shadow-[var(--shadow-soft)] backdrop-blur"
                    >
                      ›
                    </button>
                  </div>
                </>
              ) : null}
            </article>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["☼", "Season fit", "Great", "Dec is dry season in most regions. Pleasant weather throughout the trip.", "text-emerald-600"],
              ["🛂", "Visa for Azerbaijani citizens", "Required", "E-visa available. Processing: ~3 business days.", "text-[color:var(--brand)]"],
              ["◔", "Budget (per traveler)", `≈ ${formatCurrency(budget.total)}`, `Estimated total cost\nRange: ${formatCurrency(Math.round(budget.total * 0.95))} - ${formatCurrency(Math.round(budget.total * 1.15))}`, "text-orange-500"],
              ["✈", "Flights & difficulty", `≈ ${formatCurrency(700)}`, "1 stop · 14-18h total\nMedium difficulty", "text-blue-600"],
            ].map(([icon, label, value, meta, accent]) => (
              <article key={label} className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--surface-accent)] text-xl text-[color:var(--brand-strong)]">
                  {icon}
                </div>
                <p className="mt-4 text-sm text-[color:var(--text-soft)]">{label}</p>
                <p className={`mt-2 text-[18px] font-extrabold ${accent}`}>{value}</p>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-7 text-[color:var(--text-soft)]">{meta}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.24fr_0.76fr]">
            <div className="overflow-hidden rounded-[28px] border border-[color:var(--border)] bg-white shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-6 py-5">
                <h3 className="text-[20px] font-bold text-[color:var(--brand-ink)]">Your {template.durationDays}-day route</h3>
                <button type="button" className="rounded-full border border-[color:var(--brand-soft-strong)] px-4 py-2 text-sm font-semibold text-[color:var(--brand)]">
                  View full map
                </button>
              </div>
              <div className="px-4 py-4 md:px-6">
                <div className="relative">
                  <div className="absolute bottom-0 left-[24px] top-0 hidden w-px bg-[color:var(--brand-soft-strong)] md:block" />
                  {template.stops.map((stop, index) => (
                    <article
                      key={stop.id}
                      className="grid gap-4 border-b border-[color:var(--border)] py-4 last:border-b-0 md:grid-cols-[58px_150px_1fr_90px] md:items-start"
                    >
                      <div className="relative z-10 hidden md:block">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[image:var(--brand-gradient)] text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <p className="mt-3 text-xs text-[color:var(--text-soft)]">Days {stop.startDay}-{stop.endDay}</p>
                        {template.transfers[index] ? (
                          <p className="mt-7 text-xs text-[color:var(--text-soft)]">→ {template.transfers[index]?.duration}</p>
                        ) : null}
                      </div>
                      <div className="relative h-[120px] overflow-hidden rounded-[18px]">
                        <Image
                          src={stop.photoSpots[0]?.image ?? ""}
                          alt={stop.city}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 150px"
                        />
                      </div>
                      <div>
                        <h4 className="text-[22px] font-extrabold tracking-[-0.04em] text-[color:var(--brand-ink)]">{stop.city}</h4>
                        <p className="mt-2 text-[16px] leading-7 text-[color:var(--text-soft)]">{stop.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {stop.activities.slice(0, 4).map((activity) => (
                            <span key={activity.id} className="rounded-full bg-[color:var(--surface-accent)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-strong)]">
                              {activity.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-[color:var(--text-soft)]">
                        <p className="text-[24px] font-bold text-[color:var(--brand-ink)]">{formatCurrency(stop.hotelPricePerNight)}</p>
                        <p className="mt-1 text-xs">avg / night</p>
                        <p className="mt-5 text-xs">{stop.nights} nights</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
                <p className="text-[18px] font-bold text-[color:var(--brand-ink)]">Trip budget <span className="text-sm font-medium text-[color:var(--text-soft)]">(per traveler)</span></p>
                <p className="mt-4 text-[52px] font-extrabold leading-none tracking-[-0.06em] text-[color:var(--brand-ink)]">
                  ≈ {formatCurrency(budget.total)}
                </p>
                <p className="mt-3 text-[15px] text-[color:var(--text-soft)]">
                  Estimated range: {formatCurrency(Math.round(budget.total * 0.95))} - {formatCurrency(Math.round(budget.total * 1.15))} ⓘ
                </p>
                <div className="mt-6 space-y-5">
                  {[
                    ["Flights", 28, 700],
                    ["Hotels (13 nights)", 35, 885],
                    ["Transport", 10, 250],
                    ["Food", 15, 380],
                    ["Activities & attractions", 8, 200],
                    ["Other (eSIM, insurance, etc.)", 4, 120],
                  ].map(([label, percent, amount]) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>{label}</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-[color:var(--surface-accent)]">
                          <div className="h-2 rounded-full bg-[image:var(--brand-gradient)]" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-20 text-right text-sm font-medium">{formatCurrency(Number(amount))}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    "Not included: international travel insurance (recommended), personal shopping, tips.",
                    "Cards are widely accepted in cities. Carry some cash for markets and small shops.",
                    "Ways to save: eat local, use Grab for transport, book activities in advance.",
                  ].map((text, index) => (
                    <div key={text} className={`rounded-[18px] px-4 py-3 text-sm leading-6 ${index === 0 ? "bg-orange-50 text-orange-700" : index === 1 ? "bg-slate-50 text-slate-600" : "bg-[color:var(--surface-accent)] text-[color:var(--brand-strong)]"}`}>
                      {text}
                    </div>
                  ))}
                </div>
                <button type="button" className="mt-6 text-sm font-semibold text-[color:var(--brand)]">
                  View detailed breakdown →
                </button>
              </section>
            </div>
          </section>

          <section className="rounded-[28px] border border-[color:var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
            <h3 className="text-[20px] font-bold text-[color:var(--brand-ink)]">Travel smart</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["🚌", "Getting around", "Domestic flights save time between regions. Use Grab for city rides and trains/buses for local travel.", "Learn more →"],
                ["🏨", "Where to stay", "We chose well-reviewed, centrally located hotels with great value and easy access to attractions.", "See hotel picks →"],
                ["☼", "Weather strategy", "Start in the north, go central for beaches, then south for city vibes best weather along the way.", "See day-by-day plan →"],
              ].map(([icon, title, text, cta]) => (
                <article key={title} className="rounded-[22px] bg-[linear-gradient(180deg,#ffffff_0%,#faf8ff_100%)] p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--surface-accent)] text-2xl text-[color:var(--brand)]">
                    {icon}
                  </div>
                  <h4 className="mt-4 text-[18px] font-bold text-[color:var(--brand-ink)]">{title}</h4>
                  <p className="mt-3 text-[15px] leading-7 text-[color:var(--text-soft)]">{text}</p>
                  <button type="button" className="mt-4 text-sm font-semibold text-[color:var(--brand)]">
                    {cta}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-[1fr_1fr_0.9fr]">
            <button
              type="button"
              onClick={handleConfirmTrip}
              className="rounded-[22px] bg-[image:var(--brand-gradient)] px-6 py-6 text-left text-white shadow-[0_20px_40px_rgba(91,33,182,0.22)]"
            >
              <p className="text-[20px] font-bold">Save this trip</p>
              <p className="mt-2 text-sm text-white/85">Save to My Trips and start planning</p>
            </button>
            <button
              type="button"
              onClick={() => setStep("search")}
              className="rounded-[22px] border border-[color:var(--brand-soft-strong)] bg-white px-6 py-6 text-left"
            >
              <p className="text-[20px] font-bold text-[color:var(--brand)]">Generate another option</p>
              <p className="mt-2 text-sm text-[color:var(--text-soft)]">Create a different route or style</p>
            </button>
            <div className="rounded-[22px] bg-[linear-gradient(180deg,#faf7ff_0%,#ffffff_100%)] px-6 py-6">
              <p className="text-[18px] font-bold text-[color:var(--brand)]">This is just the beginning.</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">You can customize everything before booking.</p>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-center gap-4 px-2 pb-2 text-xs text-[color:var(--text-soft)]">
            <span>Generated: 16 Aug 2026, 14:32</span>
            <span>•</span>
            <span>Prices estimated as of 16 Aug 2026</span>
            <span>•</span>
            <span>Currency: AZN</span>
            <span>•</span>
            <span>FX rate: 1 USD = 1.70 AZN</span>
          </div>
        </section>
      )}

      {step === "dashboard" && confirmedTrip && (
        <section className="space-y-8">
          <section className="rounded-[40px] border border-[color:var(--border)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--brand)]">
              Trip dashboard
            </p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-4xl font-extrabold tracking-[-0.05em] md:text-6xl">
                  {confirmedTrip.template.country}
                </h2>
                <p className="mt-3 text-lg text-[color:var(--text-soft)]">
                  {confirmedTrip.input.startDate} → {confirmedTrip.input.endDate} ·{" "}
                  {styleContent[confirmedTrip.input.travelStyle].title}
                </p>
              </div>
              <div className="rounded-[28px] bg-[color:var(--surface-accent)] px-5 py-4">
                <p className="text-sm font-semibold text-[color:var(--brand-strong)]">
                  Travel Readiness
                </p>
                <p className="mt-1 text-3xl font-extrabold">{confirmedTrip.readiness}% Ready</p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[32px] border border-[color:var(--border)] bg-white p-6 shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold text-[color:var(--brand-strong)]">Next action</p>
              <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.04em]">
                {nextAction ? nextAction.label : "Trip is fully prepared"}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
                {nextAction?.kind === "internationalFlight"
                  ? "Flight booking is the highest-impact step for readiness and route confidence."
                  : nextAction?.kind === "visa"
                    ? "The visa is still critical before the trip can be considered ready."
                    : "Complete the next pending preparation step to move the trip forward."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {nextAction?.kind === "internationalFlight" ? (
                  <button
                    type="button"
                    onClick={() => track("flight_search_started")}
                    className="rounded-full bg-[image:var(--brand-gradient)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(91,33,182,0.3)]"
                  >
                    Find flights
                  </button>
                ) : nextAction ? (
                  <button
                    type="button"
                    onClick={() => completeChecklistItem(nextAction.id)}
                    className="rounded-full bg-[image:var(--brand-gradient)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(91,33,182,0.3)]"
                  >
                    Complete next step
                  </button>
                ) : null}
                <span className="rounded-full bg-[color:var(--brand-soft)] px-4 py-3 text-sm font-semibold text-[color:var(--brand-strong)]">
                  Estimated {formatCurrency(720)}
                </span>
              </div>
            </article>

            <article className="rounded-[32px] border border-[color:var(--border)] bg-white p-6 shadow-[var(--shadow-soft)]">
              <p className="text-sm font-semibold text-[color:var(--brand-strong)]">Critical items</p>
              <div className="mt-4 space-y-3">
                {criticalItems.length === 0 ? (
                  <p className="text-sm text-[color:var(--text-soft)]">No critical blockers right now.</p>
                ) : (
                  criticalItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-[20px] bg-[color:var(--surface-accent)] px-4 py-3"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => completeChecklistItem(item.id)}
                        className="rounded-full bg-white px-3 py-2 text-xs font-semibold"
                      >
                        Resolve
                      </button>
                    </div>
                  ))
                )}
              </div>
            </article>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard title="Budget" description={formatCurrency(budget.total)}>
              <p className="text-sm text-[color:var(--text-soft)]">
                Booked {formatCurrency(confirmedTrip.bookedAmount)}
              </p>
            </DashboardCard>

            <DashboardCard
              title="Route preview"
              description={confirmedTrip.template.stops.map((stop) => stop.city).join(" → ")}
            />

            <DashboardCard
              title="Checklist"
              description={`${confirmedTrip.checklist.filter((item) => item.status === "completed").length} / ${confirmedTrip.checklist.length} completed`}
            />

            <DashboardCard title="Documents" description={`${confirmedTrip.documents.length} files`} />
          </section>

          <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <Panel title="Mock flight booking">
                <div className="space-y-3">
                  {flightOptions.map((option, index) => (
                    <div
                      key={option.id}
                      className={`flex flex-col gap-3 rounded-[24px] border p-4 md:flex-row md:items-center md:justify-between ${
                        index === 0
                          ? "border-[color:var(--brand)] bg-[color:var(--brand-soft)]"
                          : "border-[color:var(--border)] bg-[color:var(--surface-muted)]"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">
                          {option.airline} {index === 0 ? "· Recommended" : ""}
                        </p>
                        <p className="text-sm text-[color:var(--text-soft)]">
                          {option.route} · {option.stops} · Demo price
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <strong>{formatCurrency(option.amount)}</strong>
                        <button
                          type="button"
                          onClick={() => bookFlight(option.id)}
                          className={`rounded-full px-4 py-2 text-sm font-semibold ${
                            index === 0
                              ? "bg-[image:var(--brand-gradient)] text-white"
                              : "bg-white"
                          }`}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Priority checklist">
                <div className="space-y-3">
                  {priorityChecklist.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        item.group === "transfers"
                          ? markTransferDone(item.id)
                          : completeChecklistItem(item.id)
                      }
                      className="flex w-full items-center justify-between rounded-[18px] border border-[color:var(--border)] bg-white px-4 py-3 text-left text-sm"
                    >
                      <span>{item.label}</span>
                      <span className="font-semibold text-[color:var(--brand-strong)]">Mark done</span>
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Full checklist">
                <div className="space-y-5">
                  {(Object.entries(groupedChecklist) as [ChecklistGroup, ChecklistItem[]][]).map(([group, items]) => (
                    <div key={group}>
                      <h4 className="text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--brand)]">
                        {formatGroupName(group)}
                      </h4>
                      <div className="mt-3 space-y-2">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() =>
                              item.status === "pending"
                                ? group === "transfers"
                                  ? markTransferDone(item.id)
                                  : completeChecklistItem(item.id)
                                : undefined
                            }
                            className={`flex w-full items-center justify-between rounded-[18px] border px-4 py-3 text-left text-sm ${
                              item.status === "completed"
                                ? "border-transparent bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]"
                                : "border-[color:var(--border)] bg-white text-[color:var(--text)]"
                            }`}
                          >
                            <span>{item.label}</span>
                            <span className="font-semibold">
                              {item.status === "completed" ? "Done" : "Mark done"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="space-y-4">
              <Panel title="Add-ons">
                <div className="space-y-3">
                  <AddonCard
                    title="Travel insurance"
                    meta="Vietnam · 14 days"
                    price={confirmedTrip.template.insuranceEstimate * confirmedTrip.input.travelers}
                    actionLabel="Get insurance"
                    onAction={() => buyAddon("insurance")}
                  />
                  <AddonCard
                    title="Vietnam eSIM"
                    meta="10 GB · 15 days"
                    price={confirmedTrip.template.esimEstimate * confirmedTrip.input.travelers}
                    actionLabel="Get eSIM"
                    onAction={() => buyAddon("esim")}
                  />
                </div>
              </Panel>

              <Panel title="Travel wallet">
                <div className="space-y-3">
                  {confirmedTrip.bookings.length === 0 ? (
                    <p className="text-sm text-[color:var(--text-soft)]">
                      Bookings will appear here as soon as you confirm them.
                    </p>
                  ) : (
                    confirmedTrip.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-[20px] border border-[color:var(--border)] px-4 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold">{booking.title}</p>
                            <p className="text-sm text-[color:var(--text-soft)]">
                              {booking.details}
                            </p>
                          </div>
                          <strong>{formatCurrency(booking.amount)}</strong>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Panel>

              <Panel title="Travel mode">
                <div className="space-y-3 text-sm text-[color:var(--text-soft)]">
                  <p className="font-semibold text-[color:var(--text)]">
                    Today — {confirmedTrip.template.stops[0]?.city}
                  </p>
                  <p>Hotel: {confirmedTrip.template.stops[0]?.recommendedArea}</p>
                  <p>
                    Today&apos;s activities:{" "}
                    {confirmedTrip.template.stops[0]?.activities.map((activity) => activity.name).join(", ")}
                  </p>
                  <p>
                    Next: {confirmedTrip.template.transfers[0]?.to} tomorrow ·{" "}
                    {confirmedTrip.template.transfers[0]?.duration}
                  </p>
                </div>
              </Panel>
            </div>
          </section>
        </section>
      )}
    </main>
  );
}

function BrandLockup() {
  return (
    <div className="min-w-0">
      <Image
        src="/birtravel-logo.png"
        alt="birtravel"
        width={302}
        height={84}
        priority
        className="h-11 w-auto md:h-12"
      />
    </div>
  );
}

function SearchPillSegment({
  label,
  value,
  active,
  wide,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  wide?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 items-center rounded-full px-5 text-left transition ${
        wide ? "flex-[1.25]" : "flex-1"
      } ${active ? "bg-white shadow-[0_18px_34px_rgba(15,23,42,0.12)]" : "bg-transparent"}`}
    >
      <span className="block">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text)]">
          {label}
        </span>
        <span className="mt-1 block truncate text-sm text-[color:var(--text-soft)]">{value}</span>
      </span>
    </button>
  );
}

function Divider() {
  return <span className="h-8 w-px bg-[color:var(--border)]" aria-hidden="true" />;
}

function DestinationPopover({
  query,
  onChangeQuery,
  suggestions,
  recentSearches,
  inputRef,
  onSelectSuggestion,
  onSelectRecent,
}: {
  query: string;
  onChangeQuery: (value: string) => void;
  suggestions: typeof destinationSuggestions;
  recentSearches: SearchState[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelectSuggestion: (value: string, available: boolean) => void;
  onSelectRecent: (value: SearchState) => void;
}) {
  return (
    <div className="absolute left-0 top-[calc(100%+14px)] z-30 w-[420px] rounded-[32px] border border-[color:var(--border)] bg-white p-5 shadow-[0_28px_70px_rgba(15,23,42,0.16)]">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => onChangeQuery(event.target.value)}
        placeholder="Search destinations"
        className="w-full rounded-[20px] border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-4 outline-none"
      />
      <div className="mt-5 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--brand)]">
            Recent / Suggested
          </p>
          <div className="mt-3 space-y-2">
            {recentSearches.length > 0 ? (
              recentSearches.map((search, index) => (
                <button
                  key={`${search.destination}-${search.startDate}-${index}`}
                  type="button"
                  onClick={() => onSelectRecent(search)}
                  className="flex w-full items-start justify-between rounded-[20px] bg-[color:var(--surface-muted)] px-4 py-3 text-left transition hover:bg-[color:var(--brand-soft)]"
                >
                  <span>
                    <span className="block font-semibold">{search.destination}</span>
                    <span className="mt-1 block text-sm text-[color:var(--text-soft)]">
                      {search.startDate && search.endDate
                        ? `${formatDateRange(search.startDate, search.endDate)} · ${getTravelerSummary(search)}`
                        : getTravelerSummary(search)}
                    </span>
                  </span>
                  <span className="text-xs font-semibold text-[color:var(--text-soft)]">Use</span>
                </button>
              ))
            ) : (
              <div className="rounded-[20px] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--text-soft)]">
                Vietnam is available now. More destinations are coming soon.
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={!item.available}
              onClick={() => onSelectSuggestion(item.label, item.available)}
              className={`flex w-full items-start justify-between rounded-[20px] border px-4 py-4 text-left transition ${
                item.available
                  ? "border-[color:var(--border)] bg-white hover:border-[color:var(--brand)] hover:bg-[color:var(--brand-soft)]"
                  : "border-[color:var(--border)] bg-[color:var(--surface-muted)] opacity-70"
              }`}
            >
              <span className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface-muted)] text-xs font-bold">
                  {item.flag}
                </span>
                <span>
                  <span className="block font-semibold">{item.label}</span>
                  <span className="mt-1 block text-sm text-[color:var(--text-soft)]">
                    {item.description}
                  </span>
                </span>
              </span>
              <span className="text-xs font-semibold text-[color:var(--text-soft)]">{item.status}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DatePopover({
  months,
  startDate,
  endDate,
  onSelectDate,
  mobile,
}: {
  months: ReturnType<typeof getMonthData>[];
  startDate: string | null;
  endDate: string | null;
  onSelectDate: (value: string) => void;
  mobile?: boolean;
}) {
  const content = (
    <div className="space-y-5">
      <div className="inline-flex rounded-full bg-[color:var(--surface-muted)] p-1">
        <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-[var(--shadow-soft)]">
          Dates
        </span>
        <span className="px-4 py-2 text-sm text-[color:var(--text-soft)]">Flexible</span>
      </div>

      <div className={`grid gap-6 ${mobile ? "grid-cols-1" : "grid-cols-2"}`}>
        {months.map((month) => (
          <div key={`${month.year}-${month.month}`} className="space-y-3">
            <h4 className="text-center text-base font-semibold">
              {month.label} {month.year}
            </h4>
            <div className="grid grid-cols-7 gap-2 text-center text-xs text-[color:var(--text-soft)]">
              {weekdayLabels.map((day) => (
                <span key={day}>{day}</span>
              ))}
              {month.days.map((day, index) => {
                if (!day) {
                  return <span key={`empty-${index}`} className="h-10" />;
                }

                const iso = toIsoDate(day);
                const selected =
                  (startDate && iso === startDate) || (endDate && iso === endDate);
                const inRange =
                  startDate &&
                  endDate &&
                  new Date(iso) > new Date(startDate) &&
                  new Date(iso) < new Date(endDate);

                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => onSelectDate(iso)}
                    className={`h-10 rounded-full text-sm transition ${
                      selected
                        ? "bg-[color:var(--brand)] font-semibold text-white"
                        : inRange
                          ? "bg-[color:var(--brand-soft)] text-[color:var(--brand-strong)]"
                          : "hover:bg-[color:var(--surface-muted)]"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {flexibilityChips.map((chip, index) => (
          <span
            key={chip}
            className={`rounded-full px-4 py-2 text-sm ${
              index === 0
                ? "bg-[color:var(--brand-soft)] font-semibold text-[color:var(--brand-strong)]"
                : "bg-[color:var(--surface-muted)] text-[color:var(--text-soft)]"
            }`}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );

  if (mobile) {
    return content;
  }

  return (
    <div className="absolute left-1/2 top-[calc(100%+14px)] z-30 w-[720px] -translate-x-1/2 rounded-[32px] border border-[color:var(--border)] bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.16)]">
      {content}
    </div>
  );
}

function TravelersPopover({
  state,
  onChangeTraveler,
  mobile,
}: {
  state: SearchState;
  onChangeTraveler: (kind: "adults" | "children" | "infants", delta: number) => void;
  mobile?: boolean;
}) {
  const content = (
    <div className="space-y-4">
      {[
        { key: "adults", label: "Adults", subtitle: "Age 13+" },
        { key: "children", label: "Children", subtitle: "Ages 2–12" },
        { key: "infants", label: "Infants", subtitle: "Under 2" },
      ].map((item) => {
        const value = state[item.key as keyof SearchState] as number;

        return (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 border-b border-[color:var(--border)] pb-4 last:border-b-0 last:pb-0"
          >
            <div>
              <p className="font-semibold">{item.label}</p>
              <p className="text-sm text-[color:var(--text-soft)]">{item.subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <CounterButton
                onClick={() => onChangeTraveler(item.key as "adults" | "children" | "infants", -1)}
                disabled={item.key === "adults" ? value <= 1 : value <= 0}
              >
                −
              </CounterButton>
              <span className="w-5 text-center font-semibold">{value}</span>
              <CounterButton
                onClick={() => onChangeTraveler(item.key as "adults" | "children" | "infants", 1)}
                disabled={item.key !== "infants" && state.adults + state.children + state.infants >= 4}
              >
                +
              </CounterButton>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (mobile) {
    return content;
  }

  return (
    <div className="absolute right-0 top-[calc(100%+14px)] z-30 w-[380px] rounded-[32px] border border-[color:var(--border)] bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.16)]">
      {content}
    </div>
  );
}

function StylePopover({
  selectedStyle,
  onSelectStyle,
  mobile,
}: {
  selectedStyle: TravelStyle;
  onSelectStyle: (style: TravelStyle) => void;
  mobile?: boolean;
}) {
  const content = (
    <div
      role="radiogroup"
      aria-label="Travel style"
      className={`grid gap-3 ${mobile ? "grid-cols-1" : "grid-cols-3"}`}
    >
      {(Object.keys(styleContent) as TravelStyle[]).map((style) => (
        <label
          key={style}
          className={`cursor-pointer rounded-[24px] border p-4 text-left transition ${
            selectedStyle === style
              ? "border-[color:var(--brand)] bg-[color:var(--brand-soft)] shadow-[0_16px_30px_rgba(91,33,182,0.12)]"
              : "border-[color:var(--border)] bg-white"
          }`}
        >
          <input
            type="radio"
            name={mobile ? "travel-style-mobile" : "travel-style"}
            value={style}
            checked={selectedStyle === style}
            onChange={() => onSelectStyle(style)}
            className="sr-only"
          />
          <span className="flex items-start justify-between gap-3">
            <span className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  selectedStyle === style
                    ? "border-[color:var(--brand)] bg-white"
                    : "border-[color:var(--border)] bg-white"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    selectedStyle === style ? "bg-[color:var(--brand)]" : "bg-transparent"
                  }`}
                />
              </span>
              <span>
                <p className="text-sm font-semibold text-[color:var(--brand-strong)]">
                  {styleContent[style].subtitle}
                </p>
                <h4 className="mt-1 text-xl font-extrabold tracking-[-0.03em]">
                  {styleContent[style].title}
                </h4>
              </span>
            </span>
            {styleContent[style].badge ? (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[color:var(--brand-strong)]">
                {styleContent[style].badge}
              </span>
            ) : null}
          </span>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
            {styleContent[style].description}
          </p>
        </label>
      ))}
    </div>
  );

  if (mobile) {
    return content;
  }

  return (
    <div className="absolute right-0 top-[calc(100%+14px)] z-30 w-[560px] rounded-[32px] border border-[color:var(--border)] bg-white p-5 shadow-[0_28px_70px_rgba(15,23,42,0.16)]">
      {content}
    </div>
  );
}

function CounterButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-full border text-lg ${
        disabled
          ? "border-[color:var(--border)] text-[color:var(--text-soft)] opacity-50"
          : "border-[color:var(--text)]"
      }`}
    >
      {children}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[32px] border border-[color:var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <h3 className="text-2xl font-extrabold tracking-[-0.04em]">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function DashboardCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="rounded-[28px] border border-[color:var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold text-[color:var(--brand-strong)]">{title}</p>
      <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">{description}</h3>
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}

function AddonCard({
  title,
  meta,
  price,
  actionLabel,
  onAction,
}: {
  title: string;
  meta: string;
  price: number;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-[color:var(--surface-muted)] p-4">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-[color:var(--text-soft)]">{meta}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <strong>{formatCurrency(price)}</strong>
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
