import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db helpers so tests don't need a real DB
vi.mock("./db", () => ({
  getJournalPosts: vi.fn().mockResolvedValue([]),
  createJournalPost: vi.fn().mockResolvedValue({ id: 1, posterName: "Roberto", photoUrl: "https://example.com/photo.jpg", photoKey: "journal/test.jpg", caption: "Test", createdAt: new Date() }),
  deleteJournalPost: vi.fn().mockResolvedValue(undefined),
  getItineraryItems: vi.fn().mockResolvedValue([]),
  createItineraryItem: vi.fn().mockResolvedValue({ id: 1, dayIndex: 0, sortOrder: 0, time: "9:00 PM", title: "Test Activity", venue: "Test Venue", address: null, mapsUrl: null, badge: "tbd", createdAt: new Date(), updatedAt: new Date() }),
  updateItineraryItem: vi.fn().mockResolvedValue({ id: 1, dayIndex: 0, sortOrder: 0, time: "10:00 PM", title: "Updated Activity", venue: null, address: null, mapsUrl: null, badge: "confirmed", createdAt: new Date(), updatedAt: new Date() }),
  deleteItineraryItem: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ url: "https://cdn.example.com/photo.jpg", key: "journal/test.jpg" }),
}));

function makeCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

const CORRECT_PIN = "DESPECHEBO";
const WRONG_PIN = "WRONGPIN";

describe("site.verifyPin", () => {
  it("returns success for correct PIN", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.site.verifyPin({ pin: CORRECT_PIN });
    expect(result).toEqual({ success: true });
  });

  it("throws UNAUTHORIZED for wrong PIN", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.site.verifyPin({ pin: WRONG_PIN })).rejects.toThrow("Wrong PIN");
  });
});

describe("journal.list", () => {
  it("returns empty array when no posts", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const posts = await caller.journal.list();
    expect(Array.isArray(posts)).toBe(true);
  });
});

describe("journal.create", () => {
  it("creates a post with correct PIN and valid crew name", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const post = await caller.journal.create({
      pin: CORRECT_PIN,
      posterName: "Roberto",
      photoUrl: "https://example.com/photo.jpg",
      photoKey: "journal/test.jpg",
      caption: "Test caption",
    });
    expect(post).toBeDefined();
    expect(post?.posterName).toBe("Roberto");
  });

  it("rejects invalid crew name", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.journal.create({
        pin: CORRECT_PIN,
        posterName: "InvalidName" as any,
        photoUrl: "https://example.com/photo.jpg",
        photoKey: "journal/test.jpg",
      })
    ).rejects.toThrow();
  });

  it("rejects wrong PIN", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.journal.create({
        pin: WRONG_PIN,
        posterName: "Roberto",
        photoUrl: "https://example.com/photo.jpg",
        photoKey: "journal/test.jpg",
      })
    ).rejects.toThrow("Invalid PIN");
  });
});

describe("itinerary.list", () => {
  it("returns array of items", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const items = await caller.itinerary.list();
    expect(Array.isArray(items)).toBe(true);
  });
});

describe("itinerary.create", () => {
  it("creates an item with correct PIN", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const item = await caller.itinerary.create({
      pin: CORRECT_PIN,
      dayIndex: 0,
      title: "Test Activity",
      badge: "tbd",
    });
    expect(item).toBeDefined();
    expect(item?.title).toBe("Test Activity");
  });

  it("rejects wrong PIN", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.itinerary.create({ pin: WRONG_PIN, dayIndex: 0, title: "Test", badge: "tbd" })
    ).rejects.toThrow("Invalid PIN");
  });

  it("rejects out-of-range dayIndex", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(
      caller.itinerary.create({ pin: CORRECT_PIN, dayIndex: 8, title: "Test", badge: "tbd" })
    ).rejects.toThrow();
  });
});

describe("itinerary.delete", () => {
  it("deletes with correct PIN", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.itinerary.delete({ pin: CORRECT_PIN, id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("rejects wrong PIN", async () => {
    const caller = appRouter.createCaller(makeCtx());
    await expect(caller.itinerary.delete({ pin: WRONG_PIN, id: 1 })).rejects.toThrow("Invalid PIN");
  });
});
