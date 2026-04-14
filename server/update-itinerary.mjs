import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// ─── Step 1: Replace Museo del Prado (Day 1) with Galería Marlborough ───────
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Galería Marlborough — arte contemporáneo',
    venue = 'Galería Marlborough Madrid',
    address = 'Calle de Orfila, 5, 28010 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Galeria+Marlborough+Madrid',
    badge = 'tbd'
   WHERE title LIKE '%Prado%'`
);

// ─── Step 2: Replace Thyssen-Bornemisza Museum (Day 6) with Espacio Fundación Telefónica ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Espacio Fundación Telefónica — exposición de arte',
    venue = 'Espacio Fundación Telefónica',
    address = 'Calle de Fuencarral, 3, 28004 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Espacio+Fundacion+Telefonica+Madrid',
    badge = 'tbd'
   WHERE title LIKE '%Thyssen%'`
);

// ─── Step 3: Replace "Lunch at a local tapas bar" (Day 2) with a specific suggestion ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Tapas en El Brillante — bocadillos de calamares',
    venue = 'Bar El Brillante',
    address = 'Plaza del Emperador Carlos V, 8, 28012 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Bar+El+Brillante+Madrid',
    badge = 'tbd'
   WHERE title LIKE '%tapas bar%'`
);

// ─── Step 4: Replace "Sunset drinks at a rooftop bar" (Day 3) with a specific suggestion ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Cócteles en la terraza — Azotea del Círculo de Bellas Artes',
    venue = 'Azotea del Círculo de Bellas Artes',
    address = 'Calle de Alcalá, 42, 28014 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Azotea+Circulo+Bellas+Artes+Madrid',
    badge = 'tbd'
   WHERE title LIKE '%rooftop%'`
);

// ─── Step 5: Replace "Flamenco show" (Day 5) with a specific venue suggestion ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Espectáculo de flamenco — Corral de la Morería',
    venue = 'Corral de la Morería',
    address = 'Calle de la Morería, 17, 28005 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Corral+de+la+Moreria+Madrid',
    badge = 'tbd'
   WHERE title LIKE '%Flamenco%'`
);

// ─── Step 6: Replace "Dinner — TBD" (Day 5) with a quality suggestion ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Cena — DiverXO (experiencia gastronómica)',
    venue = 'DiverXO',
    address = 'Calle de Padre Damián, 23, 28036 Madrid',
    mapsUrl = 'https://maps.google.com/?q=DiverXO+Madrid',
    badge = 'tbd'
   WHERE title = 'Dinner — TBD' AND dayIndex = 5`
);

// ─── Step 7: Replace "Farewell dinner — TBD" (Day 6) with a quality suggestion ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Cena de despedida — Lakasa',
    venue = 'Lakasa',
    address = 'Plaza del Descubridor Diego de Ordás, 1, 28003 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Lakasa+Madrid',
    badge = 'tbd'
   WHERE title LIKE '%Farewell%'`
);

// ─── Step 8: Replace "Last night out in Madrid" (Day 6) with a specific spot ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Última noche — Sala But',
    venue = 'Sala But',
    address = 'Calle de Barceló, 11, 28004 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Sala+But+Madrid',
    badge = 'hot'
   WHERE title LIKE '%Last night%'`
);

// ─── Step 9: Replace "Late brunch / recovery morning" (Day 3) with a quality suggestion ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Brunch en Federal Café — el favorito del barrio',
    venue = 'Federal Café',
    address = 'Plaza del Conde de Barajas, 2, 28005 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Federal+Cafe+Madrid',
    badge = 'tbd'
   WHERE title LIKE '%recovery%'`
);

// ─── Step 10: Replace "Brunch & explore Gran Vía" (Day 5) with a quality brunch suggestion ───
await connection.query(
  `UPDATE itinerary_items SET
    title = 'Brunch en Honest Greens Gran Vía',
    venue = 'Honest Greens Gran Vía',
    address = 'Gran Vía, 23, 28013 Madrid',
    mapsUrl = 'https://maps.google.com/?q=Honest+Greens+Gran+Via+Madrid',
    badge = 'tbd'
   WHERE title LIKE '%Brunch%Gran Vía%'`
);

// ─── Step 11: Translate all remaining English titles to Spanish ───────────────
const translations = [
  ["Land at Adolfo Suárez Madrid–Barajas Airport", "Aterrizaje en el Aeropuerto Adolfo Suárez Madrid-Barajas"],
  ["Check in to Airbnb", "Check-in en el Airbnb"],
  ["Explore Malasaña neighbourhood", "Explorar el barrio de Malasaña"],
  ["Welcome dinner — Ten con Ten", "Cena de bienvenida — Ten con Ten"],
  ["Brunch at Café de la Luz", "Brunch en Café de la Luz"],
  ["Stroll through Retiro Park", "Paseo por el Parque del Retiro"],
  ["Dinner — Berria", "Cena — Berria"],
  ["⚠️ Labor Day — Many venues closed", "⚠️ Día del Trabajo — Muchos locales cerrados"],
  ["Explore La Latina neighbourhood", "Explorar el barrio de La Latina"],
  ["Night out — CHITÓN", "Noche de fiesta — CHITÓN"],
  ["Visit Palacio Real", "Visita al Palacio Real"],
  ["Dinner — Numa Pompilio", "Cena — Numa Pompilio"],
  ["Mercado de San Miguel", "Mercado de San Miguel"],
  ["Lunch at Sobrino de Botín (world's oldest restaurant)", "Almuerzo en Sobrino de Botín (el restaurante más antiguo del mundo)"],
  ["Night out — HOT Madrid", "Noche de fiesta — HOT Madrid"],
  ["Last afternoon in Malasaña — shopping & cafés", "Última tarde en Malasaña — compras y cafés"],
  ["Pack up & check out of Airbnb", "Hacer maletas y check-out del Airbnb"],
  ["Depart MAD → ATL → AUS (DL0109 + DL1060)", "Vuelo de regreso MAD → ATL → AUS (DL0109 + DL1060)"],
];

for (const [eng, esp] of translations) {
  await connection.query(
    "UPDATE itinerary_items SET title = ? WHERE title = ?",
    [esp, eng]
  );
}

// ─── Step 12: Ensure only original confirmed items keep "confirmed" badge ────
// Keep confirmed: Ten con Ten, Berria, Numa Pompilio, airport arrival, airbnb check-in/out, flights
// Everything else should be "tbd"
await connection.query(
  `UPDATE itinerary_items SET badge = 'tbd'
   WHERE badge = 'confirmed'
   AND title NOT LIKE '%Ten con Ten%'
   AND title NOT LIKE '%Berria%'
   AND title NOT LIKE '%Numa Pompilio%'
   AND title NOT LIKE '%Aterrizaje%'
   AND title NOT LIKE '%Check-in%'
   AND title NOT LIKE '%check-out%'
   AND title NOT LIKE '%Vuelo de regreso%'`
);

const [rows] = await connection.query("SELECT COUNT(*) as cnt FROM itinerary_items");
console.log(`✅ Updated itinerary. Total items: ${rows[0].cnt}`);
await connection.end();
