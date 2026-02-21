import { useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import app from '@/lib/firebase';

const db = getFirestore(app);

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  essences?: string[];
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Essence {
  id?: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Banner {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export function useFirestoreProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      return products;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produtos';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (product: Product): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, product: Partial<Product>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'products', id), {
        ...product,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, getById, create, update, remove, loading, error };
}

export function useFirestoreEssences() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async (): Promise<Essence[]> => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'essences'));
      const essences: Essence[] = [];
      querySnapshot.forEach((doc) => {
        essences.push({ id: doc.id, ...doc.data() } as Essence);
      });
      return essences;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar essências';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (essence: Essence): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, 'essences'), {
        ...essence,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar essência';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, essence: Partial<Essence>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'essences', id), {
        ...essence,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar essência';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'essences', id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover essência';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, create, update, remove, loading, error };
}

export function useFirestoreBanners() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async (): Promise<Banner[]> => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'banners'));
      const banners: Banner[] = [];
      querySnapshot.forEach((doc) => {
        banners.push({ id: doc.id, ...doc.data() } as Banner);
      });
      return banners;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar banners';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const create = async (banner: Banner): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, 'banners'), {
        ...banner,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar banner';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, banner: Partial<Banner>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'banners', id), {
        ...banner,
        updatedAt: Timestamp.now(),
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar banner';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover banner';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { getAll, create, update, remove, loading, error };
}
