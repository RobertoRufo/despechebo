import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const journalPosts = mysqlTable("journal_posts", {
  id: int("id").autoincrement().primaryKey(),
  posterName: varchar("posterName", { length: 64 }).notNull(),
  photoUrl: text("photoUrl").notNull(),
  photoKey: text("photoKey").notNull(),
  caption: text("caption"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JournalPost = typeof journalPosts.$inferSelect;
export type InsertJournalPost = typeof journalPosts.$inferInsert;

export const itineraryItems = mysqlTable("itinerary_items", {
  id: int("id").autoincrement().primaryKey(),
  dayIndex: int("dayIndex").notNull(), // 0 = Apr 29, 7 = May 6
  sortOrder: int("sortOrder").notNull().default(0),
  time: varchar("time", { length: 32 }),
  title: varchar("title", { length: 256 }).notNull(),
  venue: varchar("venue", { length: 256 }),
  address: text("address"),
  mapsUrl: text("mapsUrl"),
  badge: mysqlEnum("badge", ["confirmed", "tbd", "hot"]).default("tbd").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ItineraryItem = typeof itineraryItems.$inferSelect;
export type InsertItineraryItem = typeof itineraryItems.$inferInsert;
