import { tripTemplates } from "@/data/trip-templates";
import type {
  Booking,
  BudgetBreakdown,
  ChecklistItem,
  ConfirmedTrip,
  TripInput,
  TripTemplate,
} from "@/domain/trip";

export function generateMockTrip(input: TripInput): TripTemplate {
  return tripTemplates[input.travelStyle];
}

export function calculateTripCost(template: TripTemplate, travelers: number): BudgetBreakdown {
  const internationalFlights = template.internationalFlightEstimate * travelers;
  const domesticFlights = template.domesticFlightEstimate * travelers;
  const hotels = template.stops.reduce((sum, stop) => sum + stop.hotelPricePerNight * stop.nights, 0);
  const food = template.stops.reduce(
    (sum, stop) => sum + stop.foodPerDay * (stop.endDay - stop.startDay + 1) * travelers,
    0,
  );
  const localTransport = template.stops.reduce(
    (sum, stop) => sum + stop.localTransportPerDay * (stop.endDay - stop.startDay + 1),
    0,
  );
  const intercityTransport = template.transfers.reduce((sum, transfer) => sum + transfer.price, 0);
  const activities =
    template.stops.reduce(
      (sum, stop) =>
        sum + stop.activities.reduce((activitySum, activity) => activitySum + activity.price, 0),
      0,
    ) * travelers;
  const insurance = template.insuranceEstimate * travelers;
  const esim = template.esimEstimate * travelers;
  const total =
    internationalFlights +
    domesticFlights +
    hotels +
    food +
    localTransport +
    intercityTransport +
    activities +
    insurance +
    esim;

  return {
    internationalFlights,
    domesticFlights,
    hotels,
    food,
    localTransport,
    intercityTransport,
    activities,
    insurance,
    esim,
    total,
  };
}

export function calculateBookedAmount(bookings: Booking[]): number {
  return bookings.reduce((sum, booking) => sum + booking.amount, 0);
}

export function generateChecklist(template: TripTemplate): ChecklistItem[] {
  const hotelItems = template.stops.map((stop) => ({
    id: `hotel-${stop.id}`,
    label: `${stop.city} hotel`,
    group: "booking" as const,
    kind: "hotel" as const,
    status: "pending" as const,
    stopId: stop.id,
  }));

  const transferItems = template.transfers.map((transfer) => ({
    id: `transfer-${transfer.id}`,
    label: `${transfer.from} → ${transfer.to}`,
    group: "transfers" as const,
    kind: "transfer" as const,
    status: "pending" as const,
    transferId: transfer.id,
  }));

  return [
    {
      id: "flight-main",
      label: "International flight",
      group: "booking",
      kind: "internationalFlight",
      status: "pending",
    },
    ...hotelItems,
    {
      id: "passport",
      label: "Check passport validity",
      group: "documents",
      kind: "passport",
      status: "pending",
    },
    {
      id: "visa",
      label: "Vietnam visa",
      group: "documents",
      kind: "visa",
      status: "pending",
    },
    {
      id: "insurance",
      label: "Travel insurance",
      group: "documents",
      kind: "insurance",
      status: "pending",
    },
    {
      id: "esim",
      label: "Vietnam eSIM",
      group: "connectivity",
      kind: "esim",
      status: "pending",
    },
    ...transferItems,
    {
      id: "checkin",
      label: "Online check-in",
      group: "beforeDeparture",
      kind: "departure",
      status: "pending",
    },
    {
      id: "download-docs",
      label: "Download documents",
      group: "beforeDeparture",
      kind: "departure",
      status: "pending",
    },
    {
      id: "essentials",
      label: "Prepare travel essentials",
      group: "beforeDeparture",
      kind: "departure",
      status: "pending",
    },
  ];
}

const readinessWeights = {
  passport: 10,
  visa: 20,
  internationalFlight: 20,
  hotel: 20,
  insurance: 5,
  esim: 5,
  transfer: 10,
  departure: 10,
} as const;

export function calculateReadiness(checklist: ChecklistItem[]): number {
  const groups = {
    passport: checklist.filter((item) => item.kind === "passport"),
    visa: checklist.filter((item) => item.kind === "visa"),
    internationalFlight: checklist.filter((item) => item.kind === "internationalFlight"),
    hotel: checklist.filter((item) => item.kind === "hotel"),
    insurance: checklist.filter((item) => item.kind === "insurance"),
    esim: checklist.filter((item) => item.kind === "esim"),
    transfer: checklist.filter((item) => item.kind === "transfer"),
    departure: checklist.filter((item) => item.kind === "departure"),
  };

  const score = Object.entries(groups).reduce((sum, [kind, items]) => {
    if (!items.length) {
      return sum;
    }

    const completed = items.filter((item) => item.status === "completed").length;
    return sum + (completed / items.length) * readinessWeights[kind as keyof typeof readinessWeights];
  }, 0);

  return Math.round(score);
}

export function createConfirmedTrip(input: TripInput): ConfirmedTrip {
  const template = generateMockTrip(input);
  const checklist = generateChecklist(template);

  return {
    id: `trip-${template.style}`,
    status: "confirmed",
    input,
    template,
    checklist,
    bookings: [],
    documents: [],
    bookedAmount: 0,
    readiness: calculateReadiness(checklist),
    createdAt: new Date().toISOString(),
  };
}

export function updateChecklistStatus(
  checklist: ChecklistItem[],
  itemId: string,
  status: ChecklistItem["status"],
): ChecklistItem[] {
  return checklist.map((item) => (item.id === itemId ? { ...item, status } : item));
}
