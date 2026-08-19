# BirTravel MVP — Full Product & Implementation Specification

## 1. Product

**Name:** BirTravel
**Type:** Travel planning and trip preparation MVP
**Channel:** Birbank ecosystem
**Primary platform:** Mobile-first web experience / embeddable Birbank feature
**MVP market:** Azerbaijan
**Supported destination in MVP:** Vietnam
**Supported trip duration:** 14 days
**AI integration:** Mocked only
**Travel integrations:** Mocked only

---

# 2. Product Vision

BirTravel helps a user move from:

> **“I want to travel somewhere”**

to:

> **“My trip is planned, booked, organized and ready.”**

The product should make independent travel feel almost as easy as buying a package tour, while preserving the flexibility of independent travel.

The user should not need to manually combine:

* Instagram;
* TikTok;
* YouTube;
* ChatGPT;
* flight search;
* hotel platforms;
* visa websites;
* email;
* Telegram;
* Notes.

BirTravel should combine this fragmented journey into one persistent **Trip**.

---

# 3. Core Product Principle

BirTravel is **not an AI chatbot**.

The main product object is:

# Trip

AI is only a mechanism for creating and updating a Trip.

For MVP, AI must be simulated using deterministic static mock data.

The user experience should behave **as if AI already exists**, but no LLM API should be connected.

---

# 4. Problem

Planning an independent international trip requires too many disconnected actions.

Example:

A user from Baku wants to travel to Vietnam for 14 days.

The user needs to understand:

* whether December is a good season;
* visa requirements;
* currency;
* which cities are worth visiting;
* the best sequence between cities;
* how many days to spend in each place;
* how to travel between destinations;
* whether to use flight, train, bus or transfer;
* where to stay;
* hotel costs;
* food costs;
* local transport costs;
* activities;
* total budget;
* flight prices;
* insurance;
* eSIM;
* documents.

Today the user has to research and coordinate this manually.

The problem is not lack of information.

The problem is:

> **Travel planning is fragmented and difficult to execute.**

---

# 5. Customer Story

## Before BirTravel

I decide to travel to Vietnam.

I search Instagram and TikTok for interesting places.

I watch YouTube videos about Hanoi, Da Nang, Hoi An and Phu Quoc.

I ask ChatGPT to create an itinerary.

I separately check whether I need a visa.

I search flights elsewhere.

I use a hotel platform to find accommodation.

I research how to move between cities.

I save some places in Instagram.

My itinerary is in Notes.

My flight confirmation is in email.

My visa PDF is in Telegram.

My hotel reservations are in another application.

Before departure I have to manually check whether everything is ready.

---

## After BirTravel

I open BirTravel.

I enter:

**Vietnam**

and select:

**1–14 December**

I choose:

**Mixed**

BirTravel appears to generate my trip.

I receive:

* the best route;
* the recommended sequence of destinations;
* transport between cities;
* approximate travel times;
* hotel costs;
* food costs;
* activities;
* top visual spots;
* estimated budget;
* total trip cost.

For example:

**Hanoi → Ha Long Bay → Da Nang → Hoi An → Ho Chi Minh City**

I review the itinerary.

I press:

# Confirm Trip

The itinerary becomes my persistent Trip.

BirTravel automatically creates:

* booking checklist;
* hotel tasks;
* visa task;
* insurance task;
* eSIM task;
* transfer tasks;
* Travel Readiness Score;
* Travel Wallet.

I simulate buying my flight.

The flight is saved inside my Trip.

I book hotels.

They are automatically added to my Travel Wallet.

I upload my visa.

Before departure I open one screen and see:

> **Trip Readiness: 92%**

Everything related to the trip is in one place.

---

# 6. MVP Goal

The MVP must validate the core experience:

> **Can BirTravel turn travel intent into a structured Trip that users want to confirm and prepare through?**

The MVP should demonstrate the full product experience without building real travel infrastructure.

---

# 7. Core User Flow

The most important end-to-end flow is:

```text
BirTravel Home
      ↓
Destination Search
      ↓
Select Vietnam
      ↓
Select Dates
      ↓
Choose Travel Style
Active / Chill / Mixed
      ↓
Generate Trip
      ↓
Mock AI Loading
      ↓
Generated 14-Day Itinerary
      ↓
Route + Logistics + Places + Costs
      ↓
Review Trip
      ↓
Confirm Trip
      ↓
Trip Project Created
      ↓
Trip Dashboard
      ↓
Checklist + Readiness + Next Action
      ↓
Mock Flight Booking
      ↓
Mock Hotel Booking
      ↓
Visa / Insurance / eSIM / Transfers
      ↓
Travel Wallet
      ↓
Trip Ready
```

This flow must be implemented before secondary functionality.

---

# 8. MVP Scope

## Included

* destination search;
* date selection;
* 3 travel styles;
* simulated AI generation;
* 3 predefined Vietnam itineraries;
* route optimization;
* intercity logistics;
* trip cost calculation;
* visual destination cards;
* photo spots;
* activity recommendations;
* hotel cost estimates;
* food cost estimates;
* local transportation estimates;
* total estimated trip budget;
* Trip confirmation;
* persistent Trip;
* dynamic checklist;
* Travel Readiness;
* mock flight booking;
* mock hotel booking;
* mock insurance purchase;
* mock eSIM purchase;
* transfer information;
* Travel Wallet;
* document upload;
* lightweight Travel Mode;
* contextual Bir ecosystem offers;
* local persistence;
* analytics events.

---

# 9. Out of Scope

Do NOT implement:

* OpenAI;
* any other LLM;
* real AI generation;
* real-time flight APIs;
* real hotel inventory;
* payment processing;
* real visa validation;
* real insurance purchase;
* real eSIM purchase;
* real airline ticket issuance;
* authentication;
* backend;
* production database;
* social/community;
* reviews;
* collaborative trip planning;
* expense sharing;
* advanced maps;
* restaurant booking;
* taxi booking;
* loyalty engine;
* production document storage;
* dynamic recommendation engine.

Everything outside the core experience should be mocked.

---

# 10. Home Screen

The first screen must focus on trip planning.

Do not start from a complex dashboard.

Hero:

# Where do you want to go?

Main search field:

**Search destination**

For MVP only:

**Vietnam**

needs to work end-to-end.

The UI may visually show other destinations as disabled/demo content.

---

## Search fields

### Destination

Vietnam

### Dates

Calendar selector.

Default:

**1 December 2026 → 14 December 2026**

### Travelers

Default:

**1 traveler**

Allowed:

1–4.

Primary CTA:

# Continue

---

# 11. Travel Style Selection

After destination and dates are selected, show:

# How do you want to travel?

Three visual cards.

---

## Active

Subtitle:

**Adventure**

Description:

> See more, move more, experience more.

Characteristics:

* high activity;
* more destinations;
* more transfers;
* nature;
* hiking;
* adventure;
* nightlife;
* fewer free days.

Route:

**Hanoi → Ha Giang → Da Nang → Hoi An → Ho Chi Minh City**

---

## Chill

Subtitle:

**Relax**

Description:

> Slow down and enjoy Vietnam without rushing.

Characteristics:

* minimal transfers;
* fewer destinations;
* beaches;
* resorts;
* cafes;
* spa;
* sunsets;
* free days.

Route:

**Da Nang → Hoi An → Phu Quoc**

---

## Mixed

Subtitle:

**Balanced**

Badge:

**Recommended**

Description:

> Vietnam highlights with enough time to relax.

Characteristics:

* culture;
* nature;
* food;
* beaches;
* activities;
* free time;
* balanced mobility.

Route:

**Hanoi → Ha Long Bay → Da Nang → Hoi An → Ho Chi Minh City**

Mixed is the default recommended scenario.

Primary CTA:

# Generate my trip

---

# 12. Mock AI Generation

No actual AI API.

When user clicks:

**Generate my trip**

show a short generation state.

Examples:

**Building your route...**

**Optimizing travel order...**

**Comparing transport options...**

**Estimating your budget...**

**Finding must-see places...**

Use approximately 1–2 seconds simulated delay.

Then return the predefined TripTemplate corresponding to the selected style.

Example resolver:

```ts
generateMockTrip({
  destination,
  dates,
  travelStyle,
})
```

No random content.

No API call.

---

# 13. Trip Data Model

Do not store itinerary as plain text.

Use structured data.

```ts
type TravelStyle = "active" | "chill" | "mixed";

type TripStop = {
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

type Transfer = {
  id: string;
  from: string;
  to: string;
  mode: string;
  duration: string;
  price: number;
  alternativeModes?: TransferAlternative[];
  recommendationReason: string;
};

type Activity = {
  id: string;
  name: string;
  price: number;
  duration?: string;
  description?: string;
};

type PhotoSpot = {
  id: string;
  name: string;
  image: string;
  description: string;
  bestTime?: string;
  estimatedCost?: number;
  badge?: "Must see" | "Photo spot";
};

type TripTemplate = {
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
```

---

# 14. Vietnam Mixed Scenario

This is the primary demo itinerary.

Route:

# Baku → Hanoi → Ha Long Bay → Da Nang → Hoi An → Ho Chi Minh City → Baku

---

## Days 1–3 — Hanoi

Recommended area:

**Old Quarter**

Activities:

* Hoan Kiem Lake;
* Old Quarter;
* Train Street;
* Temple of Literature;
* street food tour;
* Vietnamese coffee;
* rooftop evening.

Photo spots:

**Hanoi Train Street**

**Hoan Kiem Lake**

**Old Quarter**

Show:

* hotel/night;
* food/day;
* local transport/day;
* activities;
* total destination cost.

---

## Days 4–5 — Ha Long Bay

Recommended:

* cruise;
* kayaking;
* islands;
* viewpoints;
* scenic boat experience.

Transfer:

### Hanoi → Ha Long Bay

Recommended:

**Shared limousine / shuttle**

Duration:

~2.5–3 hours

Estimated:

~25 AZN

Reason:

> Best balance between convenience, travel time and price.

---

## Days 6–8 — Da Nang

Recommended:

* My Khe Beach;
* Golden Bridge;
* Ba Na Hills;
* Dragon Bridge;
* cafes;
* beach time.

Photo spots:

**Golden Bridge**

**My Khe Beach**

**Dragon Bridge**

---

## Days 9–10 — Hoi An

Recommended:

* Ancient Town;
* lantern streets;
* Japanese Covered Bridge;
* evening walk;
* cafes;
* beach/free time.

Transfer:

### Da Nang → Hoi An

Recommended:

**Taxi / private car**

Duration:

~45 minutes

Estimated:

~20 AZN

Reason:

> Fast, direct and convenient for a short distance.

---

## Days 11–14 — Ho Chi Minh City

Recommended:

* city exploration;
* markets;
* food tour;
* rooftop;
* nightlife;
* optional day trip;
* free time.

---

# 15. Active Scenario

Route:

# Hanoi → Ha Giang → Da Nang → Hoi An → Ho Chi Minh City

The itinerary must feel clearly more intensive.

Include:

* Ha Giang Loop;
* trekking;
* mountain viewpoints;
* adventure activities;
* nightlife;
* more transfers;
* early starts;
* fewer free days.

Show a higher activity count and higher transport complexity.

---

# 16. Chill Scenario

Route:

# Da Nang → Hoi An → Phu Quoc

The itinerary must feel substantially slower.

Include:

* beaches;
* resorts;
* cafe culture;
* spa;
* sunsets;
* beach clubs;
* slow sightseeing;
* free days.

Keep transfers minimal.

---

# 17. Generated Itinerary Screen

The user must see a complete trip experience.

Top section:

### Vietnam

**14 days**

**Mixed**

Estimated:

**~2,600 AZN / traveler**

CTA:

**Confirm this trip**

---

## Required sections

### Route

Show:

Hanoi
↓
Ha Long Bay
↓
Da Nang
↓
Hoi An
↓
Ho Chi Minh

---

### Trip Summary

* pace;
* destinations;
* transfers;
* activities;
* estimated budget.

---

### Daily / Stop Timeline

Each stop contains:

* destination;
* dates;
* nights;
* recommended area;
* main activities;
* free time;
* photo spots;
* cost information.

---

### Logistics

Every destination change must show:

* origin;
* destination;
* recommended transport;
* duration;
* estimated price;
* reason.

---

# 18. Logistics Recommendation Logic

Logistics is a key product feature.

The product should communicate:

> BirTravel optimizes both money and limited vacation time.

Example:

### Hanoi → Da Nang

Option 1:

**Flight**

1h 20m

90 AZN

Option 2:

**Train**

15h

45 AZN

Highlight:

# Recommended: Flight

Reason:

> For a 14-day trip, the saved travel time is worth the additional cost.

No real algorithm is required for MVP.

Recommendations come from predefined mock data.

---

# 19. Visual Discovery

Every destination should show top visual places.

Example cards:

### Hanoi Train Street

Badge:

**Photo spot**

Best time:

08:00–09:00

---

### Ha Long Bay

Badge:

**Must see**

---

### Golden Bridge

Badge:

**Photo spot**

---

### Hoi An Lantern Streets

Badge:

**Must see**

Use real-looking travel photography from centralized placeholder/public image sources.

Do not scrape Instagram.

---

# 20. Trip Economics

Trip cost must be calculated dynamically from structured mock data.

Show:

## International Flights

Example:

**700 AZN / traveler**

---

## Domestic Flights

Based on route.

---

## Hotels

Formula:

```text
hotel price/night × nights
```

---

## Food

Formula:

```text
food/day × trip days × travelers
```

---

## Local Transport

Formula:

```text
transport/day × destination days
```

---

## Intercity Transportation

Sum all transfers.

---

## Activities

Sum activities.

---

## Insurance

Example:

**40 AZN / traveler**

---

## eSIM

Example:

**25 AZN / traveler**

---

# 21. Estimated Total Cost

Show:

# Estimated Trip Cost

Example breakdown:

| Category              |     Estimated |
| --------------------- | ------------: |
| International flights |       700 AZN |
| Domestic flights      |       180 AZN |
| Hotels                |       700 AZN |
| Food                  |       420 AZN |
| Local transport       |       150 AZN |
| Intercity transport   |       100 AZN |
| Activities            |       220 AZN |
| Insurance             |        40 AZN |
| eSIM                  |        25 AZN |
| **Total**             | **2,535 AZN** |

Also show:

> **Estimated range: 2,400–2,900 AZN**

All prices must visibly say:

**Estimated**

or:

**Demo price**

Do not present them as real-time pricing.

---

# 22. Cost Details

The user should be able to understand every total.

Example:

### Hotels

13 nights

Average:

55 AZN/night

Total:

715 AZN

---

### Food

14 days

Average:

30 AZN/day

Total:

420 AZN

---

### Transportation

Show transfer-by-transfer costs.

No unexplained cost totals.

---

# 23. Change Scenario

On itinerary screen allow:

**Change travel style**

User can switch:

Active ↔ Chill ↔ Mixed

Simply load another predefined template.

No AI regeneration.

---

# 24. Confirm Trip

Main CTA:

# Confirm this trip

Before confirmation:

```text
Trip state = planning
```

After confirmation:

```text
Trip state = confirmed
```

Create a persistent Trip object.

Save it to browser storage.

Navigate to:

# Trip Dashboard

---

# 25. Trip Dashboard

This is the main screen after confirmation.

Example:

# Vietnam

1–14 December

Mixed

---

## Travel Readiness

Example:

# 28% Ready

Use a prominent progress component.

---

## Critical Alert

Example:

⚠️ **Vietnam visa not added**

---

## Next Action

Example:

### Book your international flight

Estimated:

720 AZN

CTA:

**Find flights**

---

## Budget

Estimated:

**2,535 AZN**

Booked:

**0 AZN**

---

## Route Preview

Hanoi → Ha Long → Da Nang → Hoi An → Ho Chi Minh

---

## Checklist

3 / 14 completed

---

## Bookings

Flights

Hotels

Insurance

eSIM

---

## Documents

0 files

---

# 26. Dynamic Checklist

Generate checklist automatically from the confirmed itinerary.

---

## Booking

* International flight
* Hanoi hotel
* Ha Long Bay accommodation
* Da Nang hotel
* Hoi An hotel
* Ho Chi Minh hotel

---

## Documents

* Check passport validity
* Vietnam visa
* Travel insurance

---

## Connectivity

* Vietnam eSIM

---

## Transfers

* Airport → Hanoi hotel
* Hanoi → Ha Long
* Ha Long → Da Nang
* Da Nang → Hoi An
* Hoi An → Ho Chi Minh

---

## Before Departure

* Online check-in
* Download documents
* Prepare travel essentials

Each item supports:

```text
pending
completed
```

Allow manual completion.

Mock purchases automatically complete corresponding tasks.

---

# 27. Travel Readiness Score

Use weighted completion.

Example:

```ts
const readinessWeights = {
  passport: 10,
  visa: 20,
  internationalFlight: 20,
  hotels: 20,
  insurance: 5,
  esim: 5,
  transfers: 10,
  departurePreparation: 10,
};
```

Total:

100.

For multiple hotels, distribute hotel weight.

For multiple transfers, distribute transfer weight.

Show:

# XX% Ready

Critical requirements must remain visible separately.

Example:

**86% Ready**

⚠️ **Visa still missing**

---

# 28. Mock Flight Booking

When user selects:

**Find flights**

show 3 options.

---

### Qatar Airways

Baku → Hanoi

1 stop

**720 AZN**

Demo price

CTA:

**Book**

---

### Turkish Airlines

Baku → Hanoi

1 stop

**780 AZN**

---

### Etihad

Baku → Hanoi

1 stop

**820 AZN**

No payment.

After booking:

* create Booking;
* complete flight checklist;
* update booked amount;
* update readiness;
* create Travel Wallet flight entry;
* show success state.

---

# 29. Mock Hotel Booking

Each destination should have 3 hotel options.

### Budget

### Recommended

### Premium

Each contains:

* image;
* hotel name;
* area;
* rating;
* price/night;
* nights;
* total price.

Highlight one as:

**Recommended**

After booking:

* create Booking;
* associate with TripStop;
* complete hotel checklist;
* update booked amount;
* update readiness;
* save confirmation in Travel Wallet.

---

# 30. Mock Insurance

Card:

### Travel Insurance

Vietnam

14 days

**40 AZN**

CTA:

**Get insurance**

After confirmation:

* create mock purchase;
* complete insurance checklist;
* update readiness;
* add document/entry to Travel Wallet.

---

# 31. Mock eSIM

Card:

### Vietnam eSIM

10 GB

15 days

**25 AZN**

CTA:

**Get eSIM**

After confirmation:

* create purchase;
* complete checklist;
* update readiness;
* add to Travel Wallet.

---

# 32. Transfers

Show:

### Hanoi Airport → Old Quarter

Recommended:

**Taxi / Grab**

Duration:

~40 minutes

Estimated:

~15 AZN

CTA:

**Mark as arranged**

No real booking.

After completion:

* update transfer checklist;
* update readiness.

---

# 33. Travel Wallet

Travel Wallet belongs to a Trip.

Purpose:

> Important travel information should be available without searching email, Telegram or other applications.

Sections:

### Flights

### Hotels

### Visa

### Insurance

### eSIM

### Transfers

### Other Documents

---

# 34. Document Upload

User can add:

* visa;
* flight ticket;
* hotel confirmation;
* insurance;
* transfer confirmation;
* other document.

Supported:

* PDF;
* JPG;
* PNG.

For MVP:

* store metadata locally;
* use IndexedDB if persistent file storage is needed;
* do not build a backend only for this feature.

---

# 35. Travel Mode

Create a lightweight Travel Mode.

Example:

# Today — Hanoi

Hotel:

Old Quarter Hotel

Today's activities:

* Hoan Kiem Lake
* Train Street
* Street food tour

Next:

**Transfer to Ha Long tomorrow · 08:00**

Quick documents:

**Flight**

**Visa**

**Hotel**

**Insurance**

Travel Mode is secondary but should demonstrate continued value during travel.

---

# 36. Bir Ecosystem Offers

Show contextual mock offers.

Do not build actual integrations.

---

## Birbank Miles

Example:

### Travel smarter with Birbank Miles

Earn miles while spending abroad.

CTA:

**Learn more**

---

## Bir Marketplace

Section:

# Prepare for Vietnam

Mock products:

* power bank;
* travel adapter;
* backpack;
* suitcase;
* waterproof phone case.

CTA:

**Shop travel essentials**

These are visual placeholders only.

---

# 37. State Model

```ts
type TripStatus =
  | "planning"
  | "confirmed"
  | "upcoming"
  | "active"
  | "completed";
```

Generated itinerary and confirmed Trip must remain distinct states.

---

# 38. Core Entities

Use:

```text
User
Trip
TripTemplate
TripStop
Transfer
Activity
PhotoSpot
ChecklistItem
Booking
Document
BudgetBreakdown
```

Trip must remain the central domain object.

---

# 39. Persistence

Use browser persistence.

Persist:

* confirmed Trip;
* travel style;
* dates;
* travelers;
* checklist state;
* bookings;
* booked amount;
* documents metadata;
* readiness;
* Trip state.

Reloading the page must not lose a confirmed Trip.

---

# 40. Analytics

Create a centralized tracking abstraction.

Console logging is enough.

Events:

```text
birtravel_opened

trip_creation_started
destination_selected
dates_selected
travel_style_selected

trip_generation_started
trip_generated
itinerary_viewed
travel_style_changed

trip_confirmed
trip_opened

flight_search_started
flight_booking_started
flight_booked

hotel_search_started
hotel_booked

insurance_purchased
esim_purchased

transfer_completed

checklist_item_completed
document_uploaded

travel_wallet_opened
travel_mode_opened
```

---

# 41. MVP Funnel

The product funnel is:

```text
BirTravel Visitor
      ↓
Destination + Dates
      ↓
Travel Style Selected
      ↓
Generated Trip
      ↓
Itinerary Viewed
      ↓
Trip Confirmed
      ↓
Flight Booking
      ↓
Hotel / Insurance / eSIM Attach
      ↓
Trip Prepared
```

---

# 42. Core Product Metrics

Measure:

### Visitor → Generated Trip

```text
generated trips / BirTravel unique visitors
```

### Generated Trip → Confirmed Trip

```text
confirmed trips / generated trips
```

### Visitor → Flight Booking

```text
flight bookings / BirTravel visitors
```

### Trip → Flight Booking

```text
flight bookings / confirmed trips
```

### Hotel Attach Rate

```text
trips with hotel booking / confirmed trips
```

### Insurance Attach Rate

### eSIM Attach Rate

### Trip Revisit Rate

### Checklist Completion Rate

### Average Travel Readiness before departure

---

# 43. Business Metrics

Track:

* Flight GMV;
* Hotel GMV;
* Insurance GMV;
* eSIM GMV;
* Total Travel GMV;
* Revenue per Trip;
* Products per Trip;
* AI COGS per Generated Trip later;
* Contribution Margin per Trip later.

Real monetization is not required in MVP.

---

# 44. UI / Design Direction

BirTravel must visually feel like part of the **Birbank ecosystem**.

Primary public visual reference:

https://birbank.az/ru

Do not copy production code or proprietary assets.

Recreate the visual language with original components.

---

# 45. Design Principles

Use:

* clean light backgrounds;
* large rounded cards;
* generous spacing;
* strong card hierarchy;
* minimal typography;
* prominent CTAs;
* soft shadows/borders;
* premium but simple visuals;
* travel photography;
* mobile-first layout.

The product should feel like:

# Birbank → BirTravel

not like a standalone startup.

---

# 46. Screen Design Direction

## Home

* strong destination search;
* travel hero;
* simple navigation;
* existing Trips below search if available.

## Travel Style

* 3 large visual cards;
* Active;
* Chill;
* Mixed.

## Itinerary

* vertical route;
* destination cards;
* travel images;
* transfer cards;
* budget card.

## Trip Dashboard

Use Birbank-style information cards for:

* Readiness;
* Next Action;
* Budget;
* Checklist;
* Bookings;
* Documents.

## Booking Offers

Should look like native Birbank product cards, not embedded third-party widgets.

---

# 47. UI Anti-Patterns

Do not make the product look like:

* ChatGPT;
* generic chatbot;
* Booking.com;
* OTA search engine;
* travel blog;
* admin panel;
* overloaded marketplace.

Priority:

> **clarity → confidence → next action**

---

# 48. Technical Stack

First inspect the existing repository.

Reuse existing architecture where possible.

Do not migrate frameworks unnecessarily.

If starting from scratch:

* Next.js;
* TypeScript;
* Tailwind CSS;
* localStorage / IndexedDB;
* no backend;
* no database;
* no auth;
* no external APIs.

Keep dependencies minimal.

---

# 49. Suggested Project Structure

```text
/components

/features/trip-planning
/features/trips
/features/bookings
/features/checklist
/features/wallet

/data
/domain
/lib
```

Adapt to existing repository conventions.

---

# 50. Business Logic Functions

Create reusable pure functions.

```ts
calculateTripCost(trip)
```

```ts
calculateReadiness(checklist)
```

```ts
calculateHotelCost(stop)
```

```ts
calculateBookedAmount(bookings)
```

```ts
generateChecklist(trip)
```

```ts
generateMockTrip(input)
```

Do not duplicate these calculations inside UI components.

---

# 51. Tests

Add focused tests.

## Trip Cost

Verify:

* hotels;
* food;
* transfers;
* activities;
* insurance;
* eSIM;
* total.

## Readiness

Verify completing tasks updates score correctly.

## Booking

Flight booking must:

* create Booking;
* update booked amount;
* complete checklist;
* update readiness.

## Hotel Booking

Must associate hotel with correct TripStop.

## Mock Generation

Active, Chill and Mixed must resolve to different templates.

## Persistence

Confirmed Trip must survive serialization/reload.

---

# 52. Core MVP Acceptance Criteria

The MVP is complete when a user can:

1. Open BirTravel.
2. See destination search.
3. Select Vietnam.
4. Select trip dates.
5. Select number of travelers.
6. Choose Active, Chill or Mixed.
7. Click Generate Trip.
8. See simulated AI loading.
9. Receive a 14-day itinerary.
10. See a meaningfully different itinerary for every travel style.
11. See the optimal destination sequence.
12. See transport between destinations.
13. See transfer duration.
14. See transfer price.
15. See recommendation reasoning.
16. See hotel price/night.
17. See food cost/day.
18. See local transport cost/day.
19. See activities.
20. See visual/photo spots.
21. See full trip economics.
22. See estimated total cost.
23. Change travel style.
24. Confirm the Trip.
25. Open persistent Trip Dashboard.
26. See Travel Readiness.
27. See critical missing items.
28. See Next Action.
29. See dynamic checklist.
30. Simulate flight booking.
31. Simulate hotel booking.
32. Simulate insurance purchase.
33. Simulate eSIM purchase.
34. Mark transfers arranged.
35. Upload travel document.
36. Access Travel Wallet.
37. See booked vs estimated spend.
38. Refresh without losing Trip.
39. Open lightweight Travel Mode.
40. See contextual Bir ecosystem offers.

---

# 53. Implementation Priority

## P0 — Core MVP

Must be completed first:

**Home**

↓

**Destination + Dates**

↓

**Travel Style**

↓

**Mock Trip Generation**

↓

**Generated Itinerary**

↓

**Logistics**

↓

**Trip Economics**

↓

**Confirm Trip**

↓

**Trip Dashboard**

↓

**Checklist**

↓

**Travel Readiness**

↓

**Mock Flight Booking**

This complete end-to-end flow is mandatory.

---

## P1

After P0 works:

* hotel booking;
* insurance;
* eSIM;
* transfers;
* Travel Wallet.

---

## P2

If time remains:

* document upload;
* Travel Mode;
* Birbank Miles offer;
* Bir Marketplace offer;
* improved animations;
* additional visual polish.

---

# 54. Implementation Workflow for Codex

## Step 1

Inspect the repository.

Understand:

* framework;
* routing;
* styling;
* current components;
* tests;
* existing conventions.

Do not make changes yet.

---

## Step 2

Inspect the public Birbank visual reference.

Identify only:

* spacing;
* typography hierarchy;
* card style;
* button style;
* surfaces;
* density.

Do not spend excessive time browsing.

---

## Step 3

Create a concise implementation plan.

Do not write a long architecture document.

---

## Step 4

Implement the first complete flow:

```text
Home
→ Destination
→ Dates
→ Style
→ Mock Generation
→ Itinerary
→ Confirm
→ Dashboard
```

Verify before proceeding.

---

## Step 5

Implement:

```text
Checklist
→ Readiness
→ Next Action
```

---

## Step 6

Implement:

```text
Mock Flights
→ Mock Hotels
```

---

## Step 7

Implement:

```text
Insurance
→ eSIM
→ Transfers
```

---

## Step 8

Implement:

```text
Travel Wallet
→ Documents
```

---

## Step 9

Implement:

```text
Travel Mode
→ Bir ecosystem mock offers
```

---

## Step 10

Run:

* tests;
* lint;
* type checking;
* production build.

Fix regressions.

---

# 55. Token Efficiency Rules for Codex

Do not repeatedly summarize this specification.

Do not reread the whole repository after every change.

Read only files relevant to the current task.

Do not produce long progress reports.

Do not overengineer.

Do not add unnecessary dependencies.

Do not refactor unrelated code.

Prefer existing project conventions.

If a minor implementation detail is ambiguous, choose the simplest reasonable option.

Ask a question only when ambiguity blocks implementation.

When reporting progress, keep it short:

* what was implemented;
* blockers;
* validation result.

---

# 56. Final Product Definition

The MVP is successful as an implementation when the user experiences:

# PLAN

> Where should I go, in what order, how should I move, what should I see and how much will it cost?

↓

# CONFIRM

> This is the trip I want.

↓

# PREPARE

> What do I need to buy, book, arrange and upload?

↓

# TRAVEL

> Everything I need for the trip is available in one place.

The critical MVP story is:

> **Search destination → choose dates → choose travel style → generate a realistic 14-day trip → understand route/logistics/economics → confirm it → prepare through checklist/bookings/documents.**

Everything else is secondary.
