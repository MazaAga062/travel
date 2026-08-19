import type { ConfirmedTrip } from "@/domain/trip";

const STORAGE_KEY = "birtravel-confirmed-trip";

export function loadConfirmedTrip(): ConfirmedTrip | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ConfirmedTrip;
  } catch {
    return null;
  }
}

export function saveConfirmedTrip(trip: ConfirmedTrip): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
}
