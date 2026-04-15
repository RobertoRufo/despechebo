import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Check if already seeded
const [rows] = await connection.query("SELECT COUNT(*) as cnt FROM packing_items");
const count = rows[0].cnt;
if (count > 0) {
  console.log(`Already seeded (${count} packing items). Skipping.`);
  await connection.end();
  process.exit(0);
}

const DEFAULT_ITEMS = [
  // Documents
  { category: "Documents", text: "Passport (valid 6+ months)", sortOrder: 1 },
  { category: "Documents", text: "Travel insurance info", sortOrder: 2 },
  { category: "Documents", text: "Airbnb confirmation (HMESCMBRRJ)", sortOrder: 3 },
  { category: "Documents", text: "Flight tickets / boarding passes", sortOrder: 4 },
  { category: "Documents", text: "Credit/debit cards (notify bank)", sortOrder: 5 },
  // Clothes
  { category: "Clothes", text: "7 days of outfits", sortOrder: 10 },
  { category: "Clothes", text: "Going-out shirts (at least 3)", sortOrder: 11 },
  { category: "Clothes", text: "Smart shoes / dress shoes", sortOrder: 12 },
  { category: "Clothes", text: "Comfortable walking shoes", sortOrder: 13 },
  { category: "Clothes", text: "Light jacket / layer", sortOrder: 14 },
  { category: "Clothes", text: "Underwear & socks (8 pairs)", sortOrder: 15 },
  { category: "Clothes", text: "Swimwear (just in case)", sortOrder: 16 },
  // Toiletries
  { category: "Toiletries", text: "Toothbrush & toothpaste", sortOrder: 20 },
  { category: "Toiletries", text: "Deodorant", sortOrder: 21 },
  { category: "Toiletries", text: "Cologne / perfume", sortOrder: 22 },
  { category: "Toiletries", text: "Sunscreen SPF 50+", sortOrder: 23 },
  { category: "Toiletries", text: "Hair products", sortOrder: 24 },
  { category: "Toiletries", text: "Razors / shaving kit", sortOrder: 25 },
  { category: "Toiletries", text: "Pain reliever / Ibuprofen", sortOrder: 26 },
  { category: "Toiletries", text: "Antacids / stomach meds", sortOrder: 27 },
  // Tech
  { category: "Tech", text: "Phone charger", sortOrder: 30 },
  { category: "Tech", text: "EU power adapter (Type C/F)", sortOrder: 31 },
  { category: "Tech", text: "Portable battery pack", sortOrder: 32 },
  { category: "Tech", text: "Earbuds / headphones", sortOrder: 33 },
  { category: "Tech", text: "Camera (optional)", sortOrder: 34 },
  // Misc
  { category: "Misc", text: "Cash in Euros (€200+)", sortOrder: 40 },
  { category: "Misc", text: "Reusable water bottle", sortOrder: 41 },
  { category: "Misc", text: "Snacks for the flight", sortOrder: 42 },
  { category: "Misc", text: "Eye mask & neck pillow", sortOrder: 43 },
];

for (const item of DEFAULT_ITEMS) {
  await connection.query(
    "INSERT INTO packing_items (text, category, sortOrder, checkedBy) VALUES (?, ?, ?, NULL)",
    [item.text, item.category, item.sortOrder]
  );
}

console.log(`Seeded ${DEFAULT_ITEMS.length} packing items.`);
await connection.end();
