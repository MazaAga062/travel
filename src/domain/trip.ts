export type TravelStyle = "active" | "chill" | "mixed";

export type Activity = {
  id: string;
  name: string;
  price: number;
  duration?: string;
  description?: string;
};

export type PhotoSpot = {
  id: string;
  name: string;
  image: string;
  description: string;
  bestTime?: string;
  estimatedCost?: number;
  badge?: "Must see" | "Photo spot";
};

export type TripStop = {
  id: string;
  city: string;
  startDay: number;
  endDay: number;
  nights: number;
  recommendedArea: string;
  hotelPricePerNight: number;
  foodPerDay: number;
  localTransportPerDay: number;
  description: string;
  activities: Activity[];
  photoSpots: PhotoSpot[];
};

export type TransferAlternative = {
  mode: string;
  duration: string;
  price: number;
};

export type Transfer = {
  id: string;
  from: string;
  to: string;
  mode: string;
  duration: string;
  price: number;
  alternativeModes?: TransferAlternative[];
  recommendationReason: string;
};

export type TripTemplate = {
  style: TravelStyle;
  country: string;
  durationDays: number;
  stops: TripStop[];
  transfers: Transfer[];
  internationalFlightEstimate: number;
  domesticFlightEstimate: number;
  insuranceEstimate: number;
  esimEstimate: number;
};

export type TripInput = {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  travelStyle: TravelStyle;
};

export type TripStatus = "planning" | "confirmed" | "upcoming" | "active" | "completed";

export type ChecklistGroup =
  | "booking"
  | "documents"
  | "connectivity"
  | "transfers"
  | "beforeDeparture";

export type ChecklistKind =
  | "internationalFlight"
  | "hotel"
  | "passport"
  | "visa"
  | "insurance"
  | "esim"
  | "transfer"
  | "departure";

export type ChecklistItem = {
  id: string;
  label: string;
  group: ChecklistGroup;
  kind: ChecklistKind;
  status: "pending" | "completed";
  stopId?: string;
  transferId?: string;
};

export type BookingType = "flight" | "hotel" | "insurance" | "esim";

export type Booking = {
  id: string;
  type: BookingType;
  title: string;
  amount: number;
  createdAt: string;
  stopId?: string;
  details?: string;
};

export type TravelDocument = {
  id: string;
  type: "visa" | "flight" | "hotel" | "insurance" | "transfer" | "other";
  name: string;
  createdAt: string;
};

export type ConfirmedTrip = {
  id: string;
  status: TripStatus;
  input: TripInput;
  template: TripTemplate;
  checklist: ChecklistItem[];
  bookings: Booking[];
  documents: TravelDocument[];
  bookedAmount: number;
  readiness: number;
  createdAt: string;
};

export type BudgetBreakdown = {
  internationalFlights: number;
  domesticFlights: number;
  hotels: number;
  food: number;
  localTransport: number;
  intercityTransport: number;
  activities: number;
  insurance: number;
  esim: number;
  total: number;
};
