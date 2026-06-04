import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data'; // Use to seed if empty

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {}
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productsRef = collection(db, 'products');
    
    // Listen to real-time changes
    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      let fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      // Auto seed if empty for the first time
      if (fetchedProducts.length === 0 && !snapshot.metadata.fromCache) {
        INITIAL_PRODUCTS.forEach(async (p) => {
          try {
            await setDoc(doc(productsRef, p.id), p);
          } catch (err) {
            // Ignore for unauthenticated users
          }
        });
        fetchedProducts = INITIAL_PRODUCTS;
      }
      
      setProducts(fetchedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const newDocRef = doc(collection(db, 'products'));
    await setDoc(newDocRef, { ...productData, id: newDocRef.id });
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, updates);
  };

  const deleteProduct = async (id: string) => {
    const docRef = doc(db, 'products', id);
    await deleteDoc(docRef);
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
