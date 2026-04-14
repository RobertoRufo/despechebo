import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertJournalPost, InsertItineraryItem, InsertPackingItem, InsertItineraryLike, itineraryItems, itineraryLikes, journalPosts, packingItems, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) { console.error("[Database] Failed to upsert user:", error); throw error; }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Journal Posts ─────────────────────────────────────────────────────────────

export async function getJournalPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(journalPosts).orderBy(desc(journalPosts.createdAt));
}

export async function createJournalPost(post: InsertJournalPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(journalPosts).values(post);
  const id = (result as any).insertId as number;
  const rows = await db.select().from(journalPosts).where(eq(journalPosts.id, id)).limit(1);
  return rows[0];
}

export async function deleteJournalPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(journalPosts).where(eq(journalPosts.id, id));
}

// ─── Itinerary Items ───────────────────────────────────────────────────────────

export async function getItineraryItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(itineraryItems).orderBy(asc(itineraryItems.dayIndex), asc(itineraryItems.sortOrder));
}

export async function getItineraryItemsByDay(dayIndex: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(itineraryItems)
    .where(eq(itineraryItems.dayIndex, dayIndex))
    .orderBy(asc(itineraryItems.sortOrder));
}

export async function createItineraryItem(item: InsertItineraryItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(itineraryItems).values(item);
  const id = (result as any).insertId as number;
  const rows = await db.select().from(itineraryItems).where(eq(itineraryItems.id, id)).limit(1);
  return rows[0];
}

export async function updateItineraryItem(id: number, data: Partial<InsertItineraryItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(itineraryItems).set(data).where(eq(itineraryItems.id, id));
  const rows = await db.select().from(itineraryItems).where(eq(itineraryItems.id, id)).limit(1);
  return rows[0];
}

export async function deleteItineraryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(itineraryItems).where(eq(itineraryItems.id, id));
}

export async function countItineraryItems(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select().from(itineraryItems);
  return rows.length;
}

// ─── Itinerary Likes ──────────────────────────────────────────────────────────

export async function getLikesForItem(itemId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(itineraryLikes).where(eq(itineraryLikes.itemId, itemId));
}

const ALL_CREW = ["Roberto", "Jorge", "Sebastian", "Pablo"] as const;

export async function toggleItineraryLike(itemId: number, memberName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const allLikes = await db.select().from(itineraryLikes).where(eq(itineraryLikes.itemId, itemId));
  const existing = allLikes.find(r => r.memberName === memberName);
  if (existing) {
    // Unlike — remove the like
    await db.delete(itineraryLikes).where(eq(itineraryLikes.id, existing.id));
    // Downgrade badge from hot to tbd if it was hot
    const item = await db.select().from(itineraryItems).where(eq(itineraryItems.id, itemId)).then(r => r[0]);
    if (item?.badge === 'hot') {
      await db.update(itineraryItems).set({ badge: 'tbd' }).where(eq(itineraryItems.id, itemId));
    }
    return { liked: false, hot: false };
  } else {
    await db.insert(itineraryLikes).values({ itemId, memberName });
    // Check if all 4 crew members have now liked this item
    const updatedLikes = await db.select().from(itineraryLikes).where(eq(itineraryLikes.itemId, itemId));
    const likedNames = updatedLikes.map(r => r.memberName);
    const allLiked = ALL_CREW.every(name => likedNames.includes(name));
    if (allLiked) {
      await db.update(itineraryItems).set({ badge: 'hot' }).where(eq(itineraryItems.id, itemId));
    }
    return { liked: true, hot: allLiked };
  }
}

// ─── Packing Items ─────────────────────────────────────────────────────────────

export async function getPackingItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(packingItems).orderBy(asc(packingItems.sortOrder), asc(packingItems.createdAt));
}

export async function createPackingItem(item: InsertPackingItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(packingItems).values(item);
  const id = (result as any).insertId as number;
  const rows = await db.select().from(packingItems).where(eq(packingItems.id, id)).limit(1);
  return rows[0];
}

export async function togglePackingItem(id: number, checkedBy: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(packingItems).set({ checkedBy }).where(eq(packingItems.id, id));
  const rows = await db.select().from(packingItems).where(eq(packingItems.id, id)).limit(1);
  return rows[0];
}

export async function deletePackingItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(packingItems).where(eq(packingItems.id, id));
}

export async function countPackingItems(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select().from(packingItems);
  return rows.length;
}
