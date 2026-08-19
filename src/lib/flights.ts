export const FLIGHTS_API_BASE_URL = "https://birtravel-api.mezahiragaev.workers.dev";
export const DEFAULT_ORIGIN_AIRPORT_CODE = "GYD";
export const DESTINATION_AIRPORT_CODES: Record<string, string> = {
  Vietnam: "SGN",
};

export type FlightOffer = {
  origin: string;
  destination: string;
  price: number;
  currency: string;
  airline: string;
  flight_number: string;
  departure_at: string;
  duration: number;
  transfers: number;
};

type FlightsApiResponse = {
  flights?: FlightOffer[];
};

export async function fetchCheapestFlight(
  destinationCode: string,
  signal?: AbortSignal,
): Promise<FlightOffer | null> {
  const url = new URL("/flights", FLIGHTS_API_BASE_URL);
  url.searchParams.set("origin", DEFAULT_ORIGIN_AIRPORT_CODE);
  url.searchParams.set("destination", destinationCode);
  url.searchParams.set("currency", "azn");

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error(`Flights request failed with status ${response.status}`);
  }

  const data = (await response.json()) as FlightsApiResponse;
  if (!Array.isArray(data.flights) || data.flights.length === 0) {
    return null;
  }

  return data.flights.reduce((cheapest, current) =>
    current.price < cheapest.price ? current : cheapest,
  );
}
