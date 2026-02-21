import { describe, expect, it } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: 'admin-user',
      email: 'admin@example.com',
      name: 'Admin User',
      loginMethod: 'manus',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {
      clearCookie: () => {},
    } as TrpcContext['res'],
  };
}

describe('Public Procedures', () => {
  it('should allow listing products without authentication', async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    const result = await publicCaller.products.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should allow listing essences without authentication', async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    const result = await publicCaller.essences.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should allow listing banners without authentication', async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    const result = await publicCaller.banners.list();
    expect(Array.isArray(result)).toBe(true);
  });


});

describe('Admin Procedures', () => {
  it('should require authentication for creating products', async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    try {
      await publicCaller.products.create({
        name: 'Test Vela',
        description: 'Test Description',
        price: '49.90',
      });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it('should require authentication for creating essences', async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    try {
      await publicCaller.essences.create({
        name: 'Lavanda',
        description: 'Test',
      });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it('should require authentication for creating banners', async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    try {
      await publicCaller.banners.create({
        title: 'Test Banner',
        displayOrder: 1,
      });
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });

  it('should require authentication for listing orders', async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    try {
      await publicCaller.orders.list();
      expect.fail('Should have thrown an error');
    } catch (error: any) {
      expect(error).toBeDefined();
    }
  });


});

describe('Auth Procedures', () => {
  it('should return null for unauthenticated user', async () => {
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);

    const result = await publicCaller.auth.me();
    expect(result).toBeNull();
  });

  it('should return user info for authenticated user', async () => {
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    const result = await adminCaller.auth.me();
    expect(result).toBeDefined();
    expect(result?.email).toBe('admin@example.com');
    expect(result?.role).toBe('admin');
  });

  it('should handle logout correctly', async () => {
    const adminCtx = createAdminContext();
    const adminCaller = appRouter.createCaller(adminCtx);

    const result = await adminCaller.auth.logout();
    expect(result).toEqual({ success: true });
  });
});
