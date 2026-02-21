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
// ================= TYPES ==============================
// =====================================================

type Product = {
  id: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type Banner = {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  link?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type Essence = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

type OrderItem = {
  productId: number;
  quantity: number;
  unitPrice: string;
  subtotal: string;
};

type Order = {
  id: string;
  orderNumber: string;

  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  addressStreet: string;
  addressNumber: string;
  addressComplement?: string;
  addressCity: string;
  addressState: string;
  addressZip: string;

  totalAmount: string;
  shippingCost: string;

  items: OrderItem[];

  status: "pending" | "paid" | "cancelled";

  createdAt?: Date;
  updatedAt?: Date;
};

// =====================================================
// ================= PRODUCTS ==========================
// =====================================================

async function getAllProducts(): Promise<Product[]> {
  const snapshot = await db()
    .collection("products")
    .where("isActive", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
}

async function getProductById(id: string): Promise<Product | null> {
  const doc = await db().collection("products").doc(id).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  };
}

async function createProduct(data: Omit<Product, "id">) {
  const ref = await db().collection("products").add({
    ...data,
    isActive: true,
    createdAt: new Date(),
  });

  return { id: ref.id, ...data };
}

async function updateProduct(id: string, data: Partial<Product>) {
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

async function getAllBanners(): Promise<Banner[]> {
  const snapshot = await db()
    .collection("banners")
    .where("isActive", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Banner, "id">),
  }));
}

async function createBanner(data: Omit<Banner, "id">) {
  const ref = await db().collection("banners").add({
    ...data,
    isActive: true,
    createdAt: new Date(),
  });

  return { id: ref.id, ...data };
}

async function updateBanner(id: string, data: Partial<Banner>) {
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
// ================= ESSENCES ==========================
// =====================================================

async function getAllEssences(): Promise<Essence[]> {
  const snapshot = await db()
    .collection("essences")
    .where("isActive", "==", true)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Essence, "id">),
  }));
}

async function createEssence(data: Omit<Essence, "id">) {
  const ref = await db().collection("essences").add({
    ...data,
    isActive: true,
    createdAt: new Date(),
  });

  return { id: ref.id, ...data };
}

async function updateEssence(id: string, data: Partial<Essence>) {
  await db().collection("essences").doc(id).update({
    ...data,
    updatedAt: new Date(),
  });

  return { id, ...data };
}

async function deleteEssence(id: string) {
  await db().collection("essences").doc(id).update({
    isActive: false,
    updatedAt: new Date(),
  });

  return { id, success: true };
}

// =====================================================
// ================= ORDERS ============================
// =====================================================

async function getAllOrders(): Promise<Order[]> {
  const snapshot = await db()
    .collection("orders")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Order, "id">),
  }));
}

async function createOrder(data: Omit<Order, "id">) {
  const ref = await db().collection("orders").add({
    ...data,
    createdAt: new Date(),
  });

  return { id: ref.id, ...data };
}

async function updateOrderStatus(
  id: string,
  status: Order["status"]
) {
  await db().collection("orders").doc(id).update({
    status,
    updatedAt: new Date(),
  });

  return { id, status };
}

async function deleteOrder(id: string) {
  await db().collection("orders").doc(id).delete();
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
          imageUrl: z.string().optional(),
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

  essences: router({
    list: publicProcedure.query(() => getAllEssences()),

    create: adminProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(({ input }) => createEssence(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateEssence(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => deleteEssence(input.id)),
  }),

  orders: router({
    list: adminProcedure.query(() => getAllOrders()),

    create: publicProcedure
      .input(
        z.object({
          orderNumber: z.string(),

          customerName: z.string(),
          customerEmail: z.string().email(),
          customerPhone: z.string().optional(),

          addressStreet: z.string(),
          addressNumber: z.string(),
          addressComplement: z.string().optional(),
          addressCity: z.string(),
          addressState: z.string(),
          addressZip: z.string(),

          totalAmount: z.string(),
          shippingCost: z.string(),

          items: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              unitPrice: z.string(),
              subtotal: z.string(),
            })
          ),

          status: z
            .enum(["pending", "paid", "cancelled"])
            .default("pending"),
        })
      )
      .mutation(({ input }) => createOrder(input)),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum(["pending", "paid", "cancelled"]),
        })
      )
      .mutation(({ input }) =>
        updateOrderStatus(input.id, input.status)
      ),

    delete: adminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => deleteOrder(input.id)),
  }),
});

export type AppRouter = typeof appRouter;