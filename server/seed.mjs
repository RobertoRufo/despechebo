import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Check if already seeded
const [rows] = await connection.query("SELECT COUNT(*) as cnt FROM itinerary_items");
const count = rows[0].cnt;
if (count > 0) {
  console.log(`Already seeded (${count} items). Skipping.`);
  await connection.end();
  process.exit(0);
}

// Default itinerary data — 8 days Apr 29 – May 6
const items = [
  // Day 0 — Apr 29 (Arrival)
  { dayIndex: 0, sortOrder: 0, time: "12:15 PM", title: "Land at Adolfo Suárez Madrid–Barajas Airport", venue: "MAD Airport", address: "Av. de la Hispanidad, s/n, 28042 Madrid", mapsUrl: "https://maps.google.com/?q=Adolfo+Suarez+Madrid+Barajas+Airport", badge: "confirmed" },
  { dayIndex: 0, sortOrder: 1, time: "2:00 PM", title: "Check in to Airbnb", venue: "Airbnb — Calle del Espíritu Santo 2", address: "Calle del Espíritu Santo 2, Madrid 28004", mapsUrl: "https://maps.google.com/?q=Calle+del+Espiritu+Santo+2+Madrid", badge: "confirmed" },
  { dayIndex: 0, sortOrder: 2, time: "4:00 PM", title: "Explore Malasaña neighbourhood", venue: "Malasaña", address: "Malasaña, Madrid 28004", mapsUrl: "https://maps.google.com/?q=Malasana+Madrid", badge: "confirmed" },
  { dayIndex: 0, sortOrder: 3, time: "9:00 PM", title: "Welcome dinner — Ten con Ten", venue: "Ten con Ten", address: "Calle de Ayala, 6, 28001 Madrid", mapsUrl: "https://maps.google.com/?q=Ten+con+Ten+Madrid", badge: "confirmed" },

  // Day 1 — Apr 30
  { dayIndex: 1, sortOrder: 0, time: "10:00 AM", title: "Brunch at Café de la Luz", venue: "Café de la Luz", address: "Calle de la Puebla, 8, 28004 Madrid", mapsUrl: "https://maps.google.com/?q=Cafe+de+la+Luz+Madrid", badge: "tbd" },
  { dayIndex: 1, sortOrder: 1, time: "12:00 PM", title: "Visit Museo del Prado", venue: "Museo del Prado", address: "Calle de Ruiz de Alarcón, 23, 28014 Madrid", mapsUrl: "https://maps.google.com/?q=Museo+del+Prado+Madrid", badge: "tbd" },
  { dayIndex: 1, sortOrder: 2, time: "3:00 PM", title: "Stroll through Retiro Park", venue: "Parque del Retiro", address: "Plaza de la Independencia, 7, 28001 Madrid", mapsUrl: "https://maps.google.com/?q=Parque+del+Retiro+Madrid", badge: "tbd" },
  { dayIndex: 1, sortOrder: 3, time: "9:00 PM", title: "Dinner — Berria", venue: "Berria", address: "Calle de Alcalá, 20, 28014 Madrid", mapsUrl: "https://maps.google.com/?q=Berria+Madrid", badge: "confirmed" },

  // Day 2 — May 1 (Labor Day)
  { dayIndex: 2, sortOrder: 0, time: "All Day", title: "⚠️ Labor Day — Many venues closed", venue: "", address: "", mapsUrl: "", badge: "tbd" },
  { dayIndex: 2, sortOrder: 1, time: "11:00 AM", title: "Explore La Latina neighbourhood", venue: "La Latina", address: "La Latina, Madrid 28005", mapsUrl: "https://maps.google.com/?q=La+Latina+Madrid", badge: "tbd" },
  { dayIndex: 2, sortOrder: 2, time: "2:00 PM", title: "Lunch at a local tapas bar", venue: "TBD", address: "", mapsUrl: "", badge: "tbd" },
  { dayIndex: 2, sortOrder: 3, time: "9:00 PM", title: "Night out — CHITÓN", venue: "CHITÓN", address: "Calle de Valverde, 14, 28004 Madrid", mapsUrl: "https://maps.google.com/?q=CHITON+Madrid", badge: "hot" },

  // Day 3 — May 2
  { dayIndex: 3, sortOrder: 0, time: "12:00 PM", title: "Late brunch / recovery morning", venue: "TBD", address: "", mapsUrl: "", badge: "tbd" },
  { dayIndex: 3, sortOrder: 1, time: "3:00 PM", title: "Visit Palacio Real", venue: "Palacio Real de Madrid", address: "Calle de Bailén, s/n, 28071 Madrid", mapsUrl: "https://maps.google.com/?q=Palacio+Real+Madrid", badge: "tbd" },
  { dayIndex: 3, sortOrder: 2, time: "6:00 PM", title: "Sunset drinks at a rooftop bar", venue: "TBD Rooftop Bar", address: "", mapsUrl: "", badge: "tbd" },
  { dayIndex: 3, sortOrder: 3, time: "9:30 PM", title: "Dinner — Numa Pompilio", venue: "Numa Pompilio", address: "Calle de Lagasca, 3, 28001 Madrid", mapsUrl: "https://maps.google.com/?q=Numa+Pompilio+Madrid", badge: "confirmed" },

  // Day 4 — May 3
  { dayIndex: 4, sortOrder: 0, time: "10:00 AM", title: "Mercado de San Miguel", venue: "Mercado de San Miguel", address: "Plaza de San Miguel, s/n, 28005 Madrid", mapsUrl: "https://maps.google.com/?q=Mercado+de+San+Miguel+Madrid", badge: "tbd" },
  { dayIndex: 4, sortOrder: 1, time: "2:00 PM", title: "Lunch at Sobrino de Botín (world's oldest restaurant)", venue: "Sobrino de Botín", address: "Calle de los Cuchilleros, 17, 28005 Madrid", mapsUrl: "https://maps.google.com/?q=Sobrino+de+Botin+Madrid", badge: "tbd" },
  { dayIndex: 4, sortOrder: 2, time: "10:00 PM", title: "Night out — HOT Madrid", venue: "HOT Madrid", address: "Calle de Barceló, 11, 28004 Madrid", mapsUrl: "https://maps.google.com/?q=HOT+Madrid", badge: "hot" },

  // Day 5 — May 4
  { dayIndex: 5, sortOrder: 0, time: "12:00 PM", title: "Brunch & explore Gran Vía", venue: "Gran Vía", address: "Gran Vía, Madrid 28013", mapsUrl: "https://maps.google.com/?q=Gran+Via+Madrid", badge: "tbd" },
  { dayIndex: 5, sortOrder: 1, time: "4:00 PM", title: "Flamenco show", venue: "TBD Flamenco Venue", address: "", mapsUrl: "", badge: "tbd" },
  { dayIndex: 5, sortOrder: 2, time: "9:00 PM", title: "Dinner — TBD", venue: "TBD", address: "", mapsUrl: "", badge: "tbd" },

  // Day 6 — May 5
  { dayIndex: 6, sortOrder: 0, time: "11:00 AM", title: "Visit Thyssen-Bornemisza Museum", venue: "Museo Thyssen-Bornemisza", address: "Paseo del Prado, 8, 28014 Madrid", mapsUrl: "https://maps.google.com/?q=Museo+Thyssen+Madrid", badge: "tbd" },
  { dayIndex: 6, sortOrder: 1, time: "3:00 PM", title: "Last afternoon in Malasaña — shopping & cafés", venue: "Malasaña", address: "Malasaña, Madrid 28004", mapsUrl: "https://maps.google.com/?q=Malasana+Madrid", badge: "tbd" },
  { dayIndex: 6, sortOrder: 2, time: "9:00 PM", title: "Farewell dinner — TBD", venue: "TBD", address: "", mapsUrl: "", badge: "tbd" },
  { dayIndex: 6, sortOrder: 3, time: "11:30 PM", title: "Last night out in Madrid", venue: "TBD", address: "", mapsUrl: "", badge: "tbd" },

  // Day 7 — May 6 (Departure)
  { dayIndex: 7, sortOrder: 0, time: "Morning", title: "Pack up & check out of Airbnb", venue: "Airbnb — Calle del Espíritu Santo 2", address: "Calle del Espíritu Santo 2, Madrid 28004", mapsUrl: "https://maps.google.com/?q=Calle+del+Espiritu+Santo+2+Madrid", badge: "confirmed" },
  { dayIndex: 7, sortOrder: 1, time: "12:45 PM", title: "Depart MAD → ATL → AUS (DL0109 + DL1060)", venue: "MAD Airport Terminal 1", address: "Av. de la Hispanidad, s/n, 28042 Madrid", mapsUrl: "https://maps.google.com/?q=Adolfo+Suarez+Madrid+Barajas+Airport", badge: "confirmed" },
];

for (const item of items) {
  await connection.query(
    "INSERT INTO itinerary_items (dayIndex, sortOrder, time, title, venue, address, mapsUrl, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [item.dayIndex, item.sortOrder, item.time || null, item.title, item.venue || null, item.address || null, item.mapsUrl || null, item.badge]
  );
}

console.log(`Seeded ${items.length} itinerary items.`);
await connection.end();
