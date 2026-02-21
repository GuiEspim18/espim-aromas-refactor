import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import {
  publicProcedure,
  router,
  adminProcedure,
} from "./_core/trpc";
import { z } from "zod";
import { getFirebaseAdmin } from "./_core/firebaseAdmin";

// ================= FIREBASE =================
const db = () => getFirebaseAdmin().firestore();

// =====================================================
// ================= PRODUCTS ==========================
// =====================================================

async function getAllProducts() {
  const snapshot = await db()
    .collection("products")
    .where("isActive", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function getProductById(id: string) {
  const doc = await db().collection("products").doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

async function createProduct(data: any) {
  const ref = await db().collection("products").add({
    ...data,
    isActive: true,
    createdAt: new Date(),
  });

  return { id: ref.id, ...data };
}

async function updateProduct(id: string, data: any) {
  await db().collection("products").doc(id).update({
    ...data,
    updatedAt: new Date(),
  });

  return { id, ...data };
}

async function deleteProduct(id: string) {
  await db().collection("products").doc(id).update({
    isActive: false,
    updatedAt: new Date(),
  });

  return { id, success: true };
}

// =====================================================
// ================= BANNERS ===========================
// =====================================================

async function getAllBanners() {
  const snapshot = await db()
    .collection("banners")
    .where("isActive", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function createBanner(data: any) {
  const ref = await db().collection("banners").add({
    ...data,
    isActive: true,
    createdAt: new Date(),
  });

  return { id: ref.id, ...data };
}

async function updateBanner(id: string, data: any) {
  await db().collection("banners").doc(id).update({
    ...data,
    updatedAt: new Date(),
  });

  return { id, ...data };
}

async function deleteBanner(id: string) {
  await db().collection("banners").doc(id).update({
    isActive: false,
    updatedAt: new Date(),
  });

  return { id, success: true };
}

// =====================================================
// ================= APP ROUTER ========================
// =====================================================

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);

      ctx.res.clearCookie(COOKIE_NAME, {
        ...cookieOptions,
        maxAge: -1,
      });

      return { success: true } as const;
    }),
  }),

  products: router({
    list: publicProcedure.query(() => getAllProducts()),

    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => getProductById(input.id)),

    create: adminProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.string(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(({ input }) => createProduct(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => deleteProduct(input.id)),
  }),

  banners: router({
    list: publicProcedure.query(() => getAllBanners()),

    create: adminProcedure
      .input(
        z.object({
          title: z.string(),
          imageUrl: z.string(),
          link: z.string().optional(),
        })
      )
      .mutation(({ input }) => createBanner(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          imageUrl: z.string().optional(),
          link: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateBanner(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => deleteBanner(input.id)),
  }),
});

export type AppRouter = typeof appRouter;