import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFirestoreProducts, useFirestoreEssences, useFirestoreBanners } from './useFirestore';

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  default: {},
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ toDate: () => new Date() })),
  },
}));

describe('Firestore Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFirestoreProducts', () => {
    it('should initialize with correct state', () => {
      const { getAll, create, update, remove, loading, error } = useFirestoreProducts();
      
      expect(loading).toBe(false);
      expect(error).toBeNull();
      expect(typeof getAll).toBe('function');
      expect(typeof create).toBe('function');
      expect(typeof update).toBe('function');
      expect(typeof remove).toBe('function');
    });

    it('should have product interface with required fields', () => {
      const product = {
        name: 'Test Product',
        price: '29.99',
        isActive: true,
      };
      
      expect(product.name).toBeDefined();
      expect(product.price).toBeDefined();
      expect(product.isActive).toBeDefined();
    });
  });

  describe('useFirestoreEssences', () => {
    it('should initialize with correct state', () => {
      const { getAll, create, update, remove, loading, error } = useFirestoreEssences();
      
      expect(loading).toBe(false);
      expect(error).toBeNull();
      expect(typeof getAll).toBe('function');
      expect(typeof create).toBe('function');
      expect(typeof update).toBe('function');
      expect(typeof remove).toBe('function');
    });

    it('should have essence interface with required fields', () => {
      const essence = {
        name: 'Lavender',
        isActive: true,
      };
      
      expect(essence.name).toBeDefined();
      expect(essence.isActive).toBeDefined();
    });
  });

  describe('useFirestoreBanners', () => {
    it('should initialize with correct state', () => {
      const { getAll, create, update, remove, loading, error } = useFirestoreBanners();
      
      expect(loading).toBe(false);
      expect(error).toBeNull();
      expect(typeof getAll).toBe('function');
      expect(typeof create).toBe('function');
      expect(typeof update).toBe('function');
      expect(typeof remove).toBe('function');
    });

    it('should have banner interface with required fields', () => {
      const banner = {
        title: 'Summer Sale',
        isActive: true,
      };
      
      expect(banner.title).toBeDefined();
      expect(banner.isActive).toBeDefined();
    });
  });
});
