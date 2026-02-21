import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, essences, banners, orders, orderItems, productEssences, siteConfig } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
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

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== PRODUCTS ==========

export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.isActive, true));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductWithEssences(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const product = await getProductById(productId);
  if (!product) return undefined;

  const productEssencesList = await db
    .select()
    .from(productEssences)
    .where(eq(productEssences.productId, productId));

  const essenceIds = productEssencesList.map(pe => pe.essenceId);
  const essenceList = essenceIds.length > 0 
    ? await db.select().from(essences).where(eq(essences.id, essenceIds[0]))
    : [];

  return {
    ...product,
    essences: essenceList,
    productEssences: productEssencesList,
  };
}

export async function createProduct(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(products).set({ isActive: false }).where(eq(products.id, id));
}

// ========== ESSENCES ==========

export async function getAllEssences() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(essences);
}

export async function getEssenceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(essences).where(eq(essences.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createEssence(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(essences).values(data);
}

export async function updateEssence(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(essences).set(data).where(eq(essences.id, id));
}

export async function deleteEssence(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(essences).where(eq(essences.id, id));
}

// ========== PRODUCT ESSENCES ==========

export async function getProductEssences(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(productEssences).where(eq(productEssences.productId, productId));
}

export async function addProductEssence(productId: number, essenceId: number, priceModifier?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(productEssences).values({
    productId,
    essenceId,
    priceModifier: priceModifier || "0",
  });
}

export async function removeProductEssence(productId: number, essenceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(productEssences).where(
    and(eq(productEssences.productId, productId), eq(productEssences.essenceId, essenceId))
  );
}

// ========== BANNERS ==========

export async function getAllBanners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(banners).where(eq(banners.isActive, true));
}

export async function getBannerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBanner(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(banners).values(data);
}

export async function updateBanner(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(banners).set(data).where(eq(banners.id, id));
}

export async function deleteBanner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(banners).set({ isActive: false }).where(eq(banners.id, id));
}

// ========== ORDERS ==========

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderWithItems(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const order = await getOrderById(orderId);
  if (!order) return undefined;

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));

  return {
    ...order,
    items,
  };
}

export async function createOrder(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orders).values(data);
}

export async function updateOrder(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(orders).set(data).where(eq(orders.id, id));
}

export async function createOrderItem(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(orderItems).values(data);
}

// ========== SITE CONFIG ==========

export async function getSiteConfig(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteConfig).where(eq(siteConfig.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllSiteConfig() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteConfig);
}

export async function setSiteConfig(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getSiteConfig(key);
  if (existing) {
    return db.update(siteConfig).set({ value, description }).where(eq(siteConfig.key, key));
  } else {
    return db.insert(siteConfig).values({ key, value, description });
  }
}
