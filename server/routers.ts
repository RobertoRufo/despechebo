import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  getJournalPosts,
  createJournalPost,
  deleteJournalPost,
  getItineraryItems,
  createItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

const SITE_PIN = "DESPECHEBO";

const CREW_NAMES = ["Roberto", "Jorge", "Sebastian", "Pablo"] as const;

function checkPin(pin: string) {
  if (pin !== SITE_PIN) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid PIN" });
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── PIN verification ────────────────────────────────────────────────────────
  site: router({
    verifyPin: publicProcedure
      .input(z.object({ pin: z.string() }))
      .mutation(({ input }) => {
        if (input.pin !== SITE_PIN) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Wrong PIN. Try again." });
        }
        return { success: true };
      }),
  }),

  // ─── Journal ─────────────────────────────────────────────────────────────────
  journal: router({
    list: publicProcedure.query(async () => {
      return getJournalPosts();
    }),

    uploadPhoto: publicProcedure
      .input(z.object({
        pin: z.string(),
        fileName: z.string(),
        fileBase64: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input }) => {
        checkPin(input.pin);
        const buffer = Buffer.from(input.fileBase64, "base64");
        const ext = input.fileName.split(".").pop() ?? "jpg";
        const key = `journal/${nanoid()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { url, key };
      }),

    create: publicProcedure
      .input(z.object({
        pin: z.string(),
        posterName: z.enum(CREW_NAMES),
        photoUrl: z.string().url(),
        photoKey: z.string(),
        caption: z.string().max(500).optional(),
      }))
      .mutation(async ({ input }) => {
        checkPin(input.pin);
        return createJournalPost({
          posterName: input.posterName,
          photoUrl: input.photoUrl,
          photoKey: input.photoKey,
          caption: input.caption ?? null,
        });
      }),

    delete: publicProcedure
      .input(z.object({ pin: z.string(), id: z.number() }))
      .mutation(async ({ input }) => {
        checkPin(input.pin);
        await deleteJournalPost(input.id);
        return { success: true };
      }),
  }),

  // ─── Itinerary ───────────────────────────────────────────────────────────────
  itinerary: router({
    list: publicProcedure.query(async () => {
      return getItineraryItems();
    }),

    create: publicProcedure
      .input(z.object({
        pin: z.string(),
        dayIndex: z.number().min(0).max(7),
        sortOrder: z.number().default(999),
        time: z.string().max(32).optional(),
        title: z.string().min(1).max(256),
        venue: z.string().max(256).optional(),
        address: z.string().optional(),
        mapsUrl: z.string().optional(),
        badge: z.enum(["confirmed", "tbd", "hot"]).default("tbd"),
      }))
      .mutation(async ({ input }) => {
        checkPin(input.pin);
        return createItineraryItem({
          dayIndex: input.dayIndex,
          sortOrder: input.sortOrder,
          time: input.time ?? null,
          title: input.title,
          venue: input.venue ?? null,
          address: input.address ?? null,
          mapsUrl: input.mapsUrl ?? null,
          badge: input.badge,
        });
      }),

    update: publicProcedure
      .input(z.object({
        pin: z.string(),
        id: z.number(),
        time: z.string().max(32).optional(),
        title: z.string().min(1).max(256).optional(),
        venue: z.string().max(256).optional(),
        address: z.string().optional(),
        mapsUrl: z.string().optional(),
        badge: z.enum(["confirmed", "tbd", "hot"]).optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        checkPin(input.pin);
        const { pin, id, ...data } = input;
        return updateItineraryItem(id, data);
      }),

    delete: publicProcedure
      .input(z.object({ pin: z.string(), id: z.number() }))
      .mutation(async ({ input }) => {
        checkPin(input.pin);
        await deleteItineraryItem(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
