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

## Packing Checklist (New)
- [x] packing_items table: id, text, checked_by (nullable), checked_at (nullable), sort_order, created_at
- [x] DB helpers: getPackingItems, createPackingItem, togglePackingItem, deletePackingItem
- [x] tRPC: packing.list (public), packing.create (PIN), packing.toggle (PIN), packing.delete (PIN)
- [x] PackingSection frontend component with real-time toggle, add item, delete item
- [x] Seed default packing list items
- [x] Add "Packing" to StickyNav
- [x] Add PackingSection to Home.tsx

## Caricatures (Fix)
- [x] Upload real caricature PNG files to CDN via manus-upload-file --webdev
- [x] Update CrewSection.tsx with real CDN URLs

## Spanish Translation & Itinerary Fixes
- [x] Reverted all UI to English (decision made to keep in English) (nav, hero, badges, buttons, forms, sections)
- [x] Replaced museums with art gallery (Galería Marlborough, Espacio Fundación Telefónica)
- [x] Itinerary data in English
- [x] Packing list categories in English

## Badge System Redesign
- [x] Add itinerary_likes table (itemId, crewName, unique constraint)
- [x] Updated badge enum: reservation_confirmed / tbd / hot
- [x] DB helpers: toggleLike, getLikesForItems
- [x] tRPC: itinerary.getLikes + itinerary.toggleLike procedures
- [x] Auto-promote badge to "hot" when all 4 crew members liked
- [x] ItinerarySection: like buttons showing who liked each item
- [x] ItinerarySection: updated badge labels in English
- [x] Edit form: updated badge options (Confirmed Reservation / TBD)
- [x] Fixed itinerary DB: replaced museums with art galleries, added quality suggestions
- [x] Seeded default packing list items

## Flights Section Upgrade
- [x] Use 🛫 for departures and 🛬 for arrivals
- [x] Show leg-by-leg times with exact departure/arrival
- [x] ATL layover lounge info (Sky Club not accessible, alternatives listed)
- [x] MAD layover lounge info (Sala VIP Iberia / Melia)
- [x] Reverted all Spanish strings in PackingSection and JournalSection to English
- [x] Updated Berria Wine Bar to Confirmed Reservation, 7:00 PM Apr 30, party of 4, under Roberto Rufo

## Theme Redesign (Spanish Fiesta)
- [ ] Redesign index.css: white/cream base, Spanish red (#C60B1E) and gold (#F1BF00), warm typography
- [ ] Update PasswordGate: festive white/red/gold look with flamenco emojis
- [ ] Update HeroSection: bright background, bold red/gold hero text, Spanish flag colors
- [ ] Update StickyNav: white/cream nav bar with red accents
- [ ] Update all section cards: cream/white cards with red/gold borders and accents
- [ ] Add flamenco/Spain emojis throughout (💃🕺🇪🇸🌹🥂🎉🏟️)
- [ ] Update badge colors to match new theme
