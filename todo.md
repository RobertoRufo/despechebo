# Despedida App TODO

## Core Features
- [x] Password gate (PIN: DESPECHEBO) — blocks all content until correct PIN entered
- [x] Hero section with countdown timer to Apr 29 2026 and Spanish flag accent
- [x] Full 8-day itinerary (Apr 29 – May 6) with day cards, status badges, Google Maps links, copy-address buttons
- [x] Flights section: DL1397+DL0108 outbound, DL0109+DL1060 return
- [x] Airbnb section: address, check-in/out, host Mar's phone, confirmation code HMESCMBRRJ
- [x] Crew section with AI caricatures: Roberto, Jorge, Sebastian, Pablo
- [x] Journal upload: name selector (Roberto/Jorge/Sebastian/Pablo), photo upload, caption, post
- [x] Journal feed: reverse-chronological, poster name, photo, caption, timestamp
- [x] Sticky top navigation with smooth scroll and active-state highlighting
- [x] Mobile-first responsive design

## Backend
- [x] journal_posts table in drizzle schema (id, poster_name, photo_url, photo_key, caption, created_at)
- [x] DB helpers for journal posts
- [x] tRPC procedure: journal.list (public)
- [x] tRPC procedure: journal.create (public, with PIN check)
- [x] tRPC procedure: journal.upload (file upload to S3)

## Frontend
- [x] Global dark navy/gold/red CSS theme in index.css
- [x] PasswordGate component
- [x] HeroSection with live countdown
- [x] ItinerarySection (8 day cards)
- [x] FlightsSection
- [x] AirbnbSection
- [x] CrewSection with caricature images from CDN
- [x] JournalUpload component
- [x] JournalFeed component
- [x] StickyNav component

## Assets
- [x] Upload caricature PNGs to CDN (Roberto, Jorge, Sebastian, Pablo)

## Editable Itinerary
- [x] itinerary_items table: id, day_index, sort_order, time, title, venue, address, maps_url, badge (confirmed/tbd/hot), created_at, updated_at
- [x] Seed default 8-day itinerary data into DB
- [x] tRPC procedure: itinerary.listByDay (public)
- [x] tRPC procedure: itinerary.create (PIN-protected)
- [x] tRPC procedure: itinerary.update (PIN-protected)
- [x] tRPC procedure: itinerary.delete (PIN-protected)
- [x] tRPC procedure: itinerary.reorder (PIN-protected)
- [x] Edit Mode toggle button visible after PIN unlock
- [x] Add activity form per day (time, title, venue, address, maps_url, badge)
- [x] Inline edit existing activity
- [x] Delete activity with confirmation
- [x] Optimistic UI updates for all itinerary mutations
