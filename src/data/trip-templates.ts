import type { TripTemplate } from "@/domain/trip";

const hanoiImage =
  "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&w=1200&q=80";
const halongImage =
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80";
const danangImage =
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80";
const hoianImage =
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80";
const hcmcImage =
  "https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1200&q=80";
const hagiangImage =
  "https://images.unsplash.com/photo-1700633819342-5a3092f1f5a5?auto=format&fit=crop&w=1200&q=80";
const phuquocImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

export const tripTemplates: Record<TripTemplate["style"], TripTemplate> = {
  mixed: {
    style: "mixed",
    country: "Vietnam",
    durationDays: 14,
    stops: [
      {
        id: "hanoi",
        city: "Hanoi",
        startDay: 1,
        endDay: 3,
        nights: 3,
        recommendedArea: "Old Quarter",
        hotelPricePerNight: 58,
        foodPerDay: 28,
        localTransportPerDay: 10,
        description: "Historic streets, coffee culture and a strong first feel for Vietnam.",
        activities: [
          { id: "hanoi-food", name: "Street food tour", price: 25, duration: "3h" },
          { id: "hanoi-coffee", name: "Vietnamese coffee crawl", price: 14 },
          { id: "hanoi-rooftop", name: "Rooftop evening", price: 18 },
        ],
        photoSpots: [
          { id: "train-street", name: "Hanoi Train Street", image: hanoiImage, description: "The iconic narrow railway street experience.", bestTime: "08:00-09:00", badge: "Photo spot" },
          { id: "hoan-kiem", name: "Hoan Kiem Lake", image: hanoiImage, description: "Classic calm city landmark for sunrise walks.", badge: "Must see" },
          { id: "old-quarter", name: "Old Quarter", image: hanoiImage, description: "Laneways, shopfronts and layered city scenes.", badge: "Photo spot" },
        ],
      },
      {
        id: "halong",
        city: "Ha Long Bay",
        startDay: 4,
        endDay: 5,
        nights: 2,
        recommendedArea: "Cruise route",
        hotelPricePerNight: 72,
        foodPerDay: 34,
        localTransportPerDay: 8,
        description: "Cruise views, kayaking and dramatic limestone islands.",
        activities: [
          { id: "halong-cruise", name: "Overnight cruise", price: 78, duration: "2 days" },
          { id: "halong-kayak", name: "Kayaking", price: 18, duration: "1.5h" },
        ],
        photoSpots: [
          { id: "halong-view", name: "Ha Long Bay viewpoint", image: halongImage, description: "Wide bay panoramas from the cruise deck.", badge: "Must see" },
        ],
      },
      {
        id: "danang",
        city: "Da Nang",
        startDay: 6,
        endDay: 8,
        nights: 3,
        recommendedArea: "My Khe Beach",
        hotelPricePerNight: 54,
        foodPerDay: 27,
        localTransportPerDay: 11,
        description: "Beach energy, cafes and easy access to scenic day trips.",
        activities: [
          { id: "danang-golden", name: "Golden Bridge visit", price: 32, duration: "Half day" },
          { id: "danang-bana", name: "Ba Na Hills", price: 39 },
        ],
        photoSpots: [
          { id: "golden-bridge", name: "Golden Bridge", image: danangImage, description: "One of the most recognizable visual stops in Vietnam.", badge: "Photo spot" },
          { id: "my-khe", name: "My Khe Beach", image: danangImage, description: "Open beach, soft light and wide coastal frames.", badge: "Must see" },
          { id: "dragon-bridge", name: "Dragon Bridge", image: danangImage, description: "Best in the evening for city lights.", badge: "Photo spot" },
        ],
      },
      {
        id: "hoian",
        city: "Hoi An",
        startDay: 9,
        endDay: 10,
        nights: 2,
        recommendedArea: "Ancient Town",
        hotelPricePerNight: 62,
        foodPerDay: 24,
        localTransportPerDay: 7,
        description: "Lantern-lit evenings, old streets and relaxed cafe time.",
        activities: [
          { id: "hoian-lantern", name: "Lantern boat evening", price: 16, duration: "1h" },
          { id: "hoian-cafe", name: "Ancient Town cafe morning", price: 12 },
        ],
        photoSpots: [
          { id: "lantern-streets", name: "Hoi An Lantern Streets", image: hoianImage, description: "Warm evening glow and classic old-town atmosphere.", badge: "Must see" },
          { id: "japanese-bridge", name: "Japanese Covered Bridge", image: hoianImage, description: "Historic centerpiece in the old district.", badge: "Photo spot" },
        ],
      },
      {
        id: "hcmc",
        city: "Ho Chi Minh City",
        startDay: 11,
        endDay: 14,
        nights: 3,
        recommendedArea: "District 1",
        hotelPricePerNight: 65,
        foodPerDay: 31,
        localTransportPerDay: 12,
        description: "High-energy finale with markets, rooftops and food-driven city nights.",
        activities: [
          { id: "hcmc-food", name: "Food tour", price: 28, duration: "3h" },
          { id: "hcmc-rooftop", name: "Rooftop evening", price: 20 },
        ],
        photoSpots: [
          { id: "saigon-skyline", name: "Saigon skyline", image: hcmcImage, description: "Best from late afternoon into sunset.", badge: "Photo spot" },
        ],
      },
    ],
    transfers: [
      { id: "airport-hanoi", from: "Hanoi Airport", to: "Old Quarter", mode: "Taxi / Grab", duration: "~40 minutes", price: 15, recommendationReason: "Most direct arrival option after an international flight." },
      { id: "hanoi-halong", from: "Hanoi", to: "Ha Long Bay", mode: "Shared limousine / shuttle", duration: "~2.5-3 hours", price: 25, recommendationReason: "Best balance between convenience, travel time and price." },
      { id: "halong-danang", from: "Ha Long Bay", to: "Da Nang", mode: "Flight via Hanoi", duration: "~5 hours total", price: 95, alternativeModes: [{ mode: "Train", duration: "16h+", price: 45 }], recommendationReason: "Saves a full day in a 14-day trip compared with rail." },
      { id: "danang-hoian", from: "Da Nang", to: "Hoi An", mode: "Taxi / private car", duration: "~45 minutes", price: 20, recommendationReason: "Fast, direct and convenient for a short distance." },
      { id: "hoian-hcmc", from: "Hoi An", to: "Ho Chi Minh City", mode: "Flight from Da Nang", duration: "~1h 20m", price: 85, alternativeModes: [{ mode: "Train", duration: "15h", price: 45 }], recommendationReason: "For a 14-day trip, the saved travel time is worth the additional cost." },
    ],
    internationalFlightEstimate: 700,
    domesticFlightEstimate: 180,
    insuranceEstimate: 40,
    esimEstimate: 25,
  },
  active: {
    style: "active",
    country: "Vietnam",
    durationDays: 14,
    stops: [
      {
        id: "hanoi-active",
        city: "Hanoi",
        startDay: 1,
        endDay: 2,
        nights: 2,
        recommendedArea: "Old Quarter",
        hotelPricePerNight: 55,
        foodPerDay: 30,
        localTransportPerDay: 12,
        description: "Quick city immersion before the mountain route begins.",
        activities: [
          { id: "active-night", name: "Night food crawl", price: 24 },
          { id: "active-temple", name: "Temple of Literature", price: 8 },
        ],
        photoSpots: [
          { id: "active-train", name: "Train Street", image: hanoiImage, description: "High-energy city icon.", badge: "Photo spot" },
        ],
      },
      {
        id: "hagiang",
        city: "Ha Giang",
        startDay: 3,
        endDay: 5,
        nights: 3,
        recommendedArea: "Loop base camp",
        hotelPricePerNight: 45,
        foodPerDay: 26,
        localTransportPerDay: 16,
        description: "Mountain roads, early starts and the most adventurous leg of the trip.",
        activities: [
          { id: "loop", name: "Ha Giang Loop", price: 96, duration: "2 days" },
          { id: "trek", name: "Viewpoint trek", price: 18 },
        ],
        photoSpots: [
          { id: "ma-pi-leng", name: "Ma Pi Leng Pass", image: hagiangImage, description: "Epic ridgelines and mountain curves.", badge: "Must see" },
        ],
      },
      {
        id: "danang-active",
        city: "Da Nang",
        startDay: 6,
        endDay: 8,
        nights: 3,
        recommendedArea: "My Khe Beach",
        hotelPricePerNight: 52,
        foodPerDay: 28,
        localTransportPerDay: 12,
        description: "Beach recovery with active day trips still in play.",
        activities: [
          { id: "active-bana", name: "Ba Na Hills", price: 39 },
          { id: "active-surf", name: "Surf lesson", price: 24 },
        ],
        photoSpots: [
          { id: "active-golden", name: "Golden Bridge", image: danangImage, description: "Fast visual hit on an active route.", badge: "Photo spot" },
        ],
      },
      {
        id: "hoian-active",
        city: "Hoi An",
        startDay: 9,
        endDay: 10,
        nights: 2,
        recommendedArea: "Ancient Town",
        hotelPricePerNight: 59,
        foodPerDay: 25,
        localTransportPerDay: 8,
        description: "Short cultural stop before the final city stretch.",
        activities: [{ id: "bike", name: "Countryside bike ride", price: 14 }],
        photoSpots: [
          { id: "active-hoian", name: "Lantern Streets", image: hoianImage, description: "Quick but memorable old-town evening.", badge: "Must see" },
        ],
      },
      {
        id: "hcmc-active",
        city: "Ho Chi Minh City",
        startDay: 11,
        endDay: 14,
        nights: 3,
        recommendedArea: "District 1",
        hotelPricePerNight: 64,
        foodPerDay: 32,
        localTransportPerDay: 13,
        description: "A packed finish with nightlife and optional day trips.",
        activities: [
          { id: "nightlife", name: "Rooftop nightlife", price: 24 },
          { id: "mekong", name: "Optional Mekong day trip", price: 38 },
        ],
        photoSpots: [
          { id: "active-skyline", name: "Saigon skyline", image: hcmcImage, description: "Best at dusk after a long active day.", badge: "Photo spot" },
        ],
      },
    ],
    transfers: [
      { id: "active-airport", from: "Hanoi Airport", to: "Old Quarter", mode: "Taxi / Grab", duration: "~40 minutes", price: 15, recommendationReason: "Fast arrival into the city." },
      { id: "active-hanoi-hagiang", from: "Hanoi", to: "Ha Giang", mode: "Sleeper bus", duration: "~6.5 hours", price: 32, recommendationReason: "Efficient overnight transfer for an early start adventure route." },
      { id: "active-hagiang-danang", from: "Ha Giang", to: "Da Nang", mode: "Bus + flight via Hanoi", duration: "~8 hours total", price: 120, recommendationReason: "Complex but time-efficient compared with rail-only travel." },
      { id: "active-danang-hoian", from: "Da Nang", to: "Hoi An", mode: "Taxi / private car", duration: "~45 minutes", price: 20, recommendationReason: "Keeps the pace high and logistics simple." },
      { id: "active-hoian-hcmc", from: "Hoi An", to: "Ho Chi Minh City", mode: "Flight from Da Nang", duration: "~1h 20m", price: 88, recommendationReason: "Best use of limited days on a dense itinerary." },
    ],
    internationalFlightEstimate: 710,
    domesticFlightEstimate: 208,
    insuranceEstimate: 40,
    esimEstimate: 25,
  },
  chill: {
    style: "chill",
    country: "Vietnam",
    durationDays: 14,
    stops: [
      {
        id: "danang-chill",
        city: "Da Nang",
        startDay: 1,
        endDay: 5,
        nights: 5,
        recommendedArea: "My Khe Beach",
        hotelPricePerNight: 60,
        foodPerDay: 26,
        localTransportPerDay: 8,
        description: "A soft landing with beach mornings and easy day structure.",
        activities: [
          { id: "beach-club", name: "Beach club day", price: 20 },
          { id: "spa", name: "Spa afternoon", price: 24 },
        ],
        photoSpots: [
          { id: "chill-beach", name: "My Khe Beach", image: danangImage, description: "Slow travel visuals and open coastline.", badge: "Must see" },
        ],
      },
      {
        id: "hoian-chill",
        city: "Hoi An",
        startDay: 6,
        endDay: 9,
        nights: 4,
        recommendedArea: "Ancient Town",
        hotelPricePerNight: 66,
        foodPerDay: 23,
        localTransportPerDay: 7,
        description: "Lantern evenings, cafes and unrushed exploration.",
        activities: [
          { id: "boat", name: "Lantern boat ride", price: 16 },
          { id: "cooking", name: "Cooking class", price: 26 },
        ],
        photoSpots: [
          { id: "chill-lantern", name: "Lantern Streets", image: hoianImage, description: "The slowest and most romantic part of the route.", badge: "Must see" },
        ],
      },
      {
        id: "phuquoc",
        city: "Phu Quoc",
        startDay: 10,
        endDay: 14,
        nights: 4,
        recommendedArea: "Long Beach",
        hotelPricePerNight: 82,
        foodPerDay: 29,
        localTransportPerDay: 9,
        description: "Resort finish with sunsets, spa time and minimal logistics.",
        activities: [
          { id: "sunset", name: "Sunset catamaran", price: 34 },
          { id: "relax-spa", name: "Resort spa", price: 28 },
        ],
        photoSpots: [
          { id: "phuquoc-sunset", name: "Long Beach sunset", image: phuquocImage, description: "Soft light and low-effort beauty.", badge: "Photo spot" },
        ],
      },
    ],
    transfers: [
      { id: "chill-airport", from: "Da Nang Airport", to: "My Khe Beach", mode: "Taxi / Grab", duration: "~20 minutes", price: 10, recommendationReason: "Short, easy arrival for a relaxed itinerary." },
      { id: "chill-danang-hoian", from: "Da Nang", to: "Hoi An", mode: "Taxi / private car", duration: "~45 minutes", price: 20, recommendationReason: "Simple and comfortable short transfer." },
      { id: "chill-hoian-phuquoc", from: "Hoi An", to: "Phu Quoc", mode: "Flight from Da Nang", duration: "~2h 30m total", price: 98, recommendationReason: "Minimizes fatigue and preserves resort time." },
    ],
    internationalFlightEstimate: 690,
    domesticFlightEstimate: 120,
    insuranceEstimate: 40,
    esimEstimate: 25,
  },
};
