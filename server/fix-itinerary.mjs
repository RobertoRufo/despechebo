import { drizzle } from 'drizzle-orm/mysql2';
import { sql, eq, like } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

// First, let's see what we have
const rows = await db.execute(sql`SELECT id, dayIndex, title, badge, time FROM itinerary_items ORDER BY dayIndex, sortOrder`);
console.log('Current items:');
rows[0].forEach(r => console.log(`  [Day ${r.dayIndex}] id=${r.id} badge=${r.badge} time=${r.time} title=${r.title}`));

// Fix all Spanish text to English and update badges
const updates = [
  // Day 0 (Apr 29 - Arrival)
  { match: 'Aterrizaje', newTitle: '✈️ Flight Arrives — Madrid Barajas (MAD)', time: '12:15 PM', badge: 'tbd' },
  { match: 'Check-in', newTitle: '🏠 Check-in — Airbnb Calle del Espíritu Santo', time: '3:00 PM', badge: 'tbd' },
  { match: 'Aperitivo', newTitle: '🍷 Aperitivo Walk — Malasaña neighborhood', time: '6:00 PM', badge: 'tbd' },
  { match: 'Cena', newTitle: '🍽️ Dinner — Ten con Ten', time: '9:00 PM', badge: 'reservation_confirmed' },

  // Day 1 (Apr 30 - Explore)
  { match: 'Brunch', newTitle: '☕ Brunch — Café Federal (Calle del Tribunal)', time: '10:30 AM', badge: 'tbd' },
  { match: 'Retiro', newTitle: '🌳 Afternoon Walk — Parque del Retiro', time: '1:00 PM', badge: 'tbd' },
  { match: 'Berria', newTitle: '🍷 Drinks — Berria Wine Bar (Party of 4, under Roberto Rufo)', time: '7:00 PM', badge: 'reservation_confirmed' },
  { match: 'Chitón', newTitle: '🎉 Night Out — CHITÓN', time: '11:00 PM', badge: 'tbd' },
  { match: 'CHITÓN', newTitle: '🎉 Night Out — CHITÓN', time: '11:00 PM', badge: 'tbd' },

  // Day 2 (May 1 - Labor Day ⚠️)
  { match: 'Día del Trabajo', newTitle: '⚠️ Labor Day — Many places closed, plan ahead', time: null, badge: 'tbd' },
  { match: 'Labor Day', newTitle: '⚠️ Labor Day — Many places closed, plan ahead', time: null, badge: 'tbd' },
  { match: 'Mercado', newTitle: '🛒 El Rastro Flea Market (open on Labor Day!)', time: '10:00 AM', badge: 'tbd' },
  { match: 'Rastro', newTitle: '🛒 El Rastro Flea Market (open on Labor Day!)', time: '10:00 AM', badge: 'tbd' },
  { match: 'Museo', newTitle: '🎨 Galería Marlborough Madrid — contemporary art', time: '1:00 PM', badge: 'tbd' },
  { match: 'museo', newTitle: '🎨 Galería Marlborough Madrid — contemporary art', time: '1:00 PM', badge: 'tbd' },
  { match: 'Galería', newTitle: '🎨 Galería Marlborough Madrid — contemporary art', time: '1:00 PM', badge: 'tbd' },
  { match: 'Numa', newTitle: '🍽️ Dinner — Numa Pompilio', time: '9:00 PM', badge: 'reservation_confirmed' },

  // Day 3 (May 2 - Sightseeing)
  { match: 'Plaza Mayor', newTitle: '📸 Plaza Mayor & Puerta del Sol — morning stroll', time: '10:00 AM', badge: 'tbd' },
  { match: 'Almuerzo', newTitle: '🥘 Lunch — Taberna La Bola (traditional cocido madrileño)', time: '2:00 PM', badge: 'tbd' },
  { match: 'HOT', newTitle: '🔥 Night Out — HOT Madrid', time: '11:00 PM', badge: 'tbd' },
  { match: 'Hot Madrid', newTitle: '🔥 Night Out — HOT Madrid', time: '11:00 PM', badge: 'tbd' },

  // Day 4 (May 3 - Culture)
  { match: 'Prado', newTitle: '🎨 Museo del Prado (world-class art, worth it!)', time: '10:00 AM', badge: 'tbd' },
  { match: 'Tapas', newTitle: '🍢 Tapas Crawl — La Latina neighborhood', time: '2:00 PM', badge: 'tbd' },
  { match: 'Flamenco', newTitle: '💃 Flamenco Show — Corral de la Morería', time: '8:00 PM', badge: 'tbd' },

  // Day 5 (May 4 - Gran Vía)
  { match: 'Gran Vía', newTitle: '🛍️ Gran Vía Shopping & Sightseeing', time: '11:00 AM', badge: 'tbd' },
  { match: 'Rooftop', newTitle: '🌆 Rooftop Drinks — The Hat Madrid (panoramic views)', time: '6:00 PM', badge: 'tbd' },
  { match: 'rooftop', newTitle: '🌆 Rooftop Drinks — The Hat Madrid (panoramic views)', time: '6:00 PM', badge: 'tbd' },

  // Day 6 (May 5 - Last Night)
  { match: 'Despedida', newTitle: '🥂 Farewell Dinner — DiverXO or Coque (splurge night)', time: '9:00 PM', badge: 'tbd' },
  { match: 'despedida', newTitle: '🥂 Farewell Dinner — DiverXO or Coque (splurge night)', time: '9:00 PM', badge: 'tbd' },
  { match: 'Última', newTitle: '🎊 Last Night Out — Sala But or Fabrik', time: '11:30 PM', badge: 'tbd' },
  { match: 'última', newTitle: '🎊 Last Night Out — Sala But or Fabrik', time: '11:30 PM', badge: 'tbd' },

  // Day 7 (May 6 - Departure)
  { match: 'Vuelo', newTitle: '✈️ Flight Home — MAD departs 12:45 PM', time: '10:00 AM', badge: 'tbd' },
  { match: 'vuelo', newTitle: '✈️ Flight Home — MAD departs 12:45 PM', time: '10:00 AM', badge: 'tbd' },
  { match: 'Checkout', newTitle: '🏠 Check-out — Airbnb', time: '11:00 AM', badge: 'tbd' },
  { match: 'checkout', newTitle: '🏠 Check-out — Airbnb', time: '11:00 AM', badge: 'tbd' },
];

// Apply targeted updates by matching title substrings
let updated = 0;
for (const u of updates) {
  const result = await db.execute(
    sql`UPDATE itinerary_items SET title = ${u.newTitle}, badge = ${u.badge}${u.time !== undefined ? sql`, time = ${u.time}` : sql``} WHERE title LIKE ${`%${u.match}%`}`
  );
  const affected = result[0].affectedRows;
  if (affected > 0) {
    console.log(`  ✓ Updated "${u.match}" → "${u.newTitle}" (${affected} rows)`);
    updated += affected;
  }
}

console.log(`\nTotal rows updated: ${updated}`);

// Verify final state
const final = await db.execute(sql`SELECT id, dayIndex, title, badge, time FROM itinerary_items ORDER BY dayIndex, sortOrder`);
console.log('\nFinal itinerary:');
final[0].forEach(r => console.log(`  [Day ${r.dayIndex}] ${r.time || '--:--'} | ${r.badge} | ${r.title}`));

process.exit(0);
