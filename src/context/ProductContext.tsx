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
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

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
      
      setRawProducts(fetchedProducts);
      setProductsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const reviewsRef = collection(db, 'reviews');
    const unsubscribe = onSnapshot(reviewsRef, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetchedReviews);
      setReviewsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Compute products with exact, verified, and real dynamic reviews & rating scores
  const products = rawProducts.map(product => {
    const productReviews = reviews.filter(r => r.productId === product.id);
    if (productReviews.length > 0) {
      const sum = productReviews.reduce((acc, curr) => acc + (curr.rating || 0), 0);
      return {
        ...product,
        rating: Number((sum / productReviews.length).toFixed(1)),
        reviews: productReviews.length
      };
    } else {
      return {
        ...product,
        rating: 0,
        reviews: 0
      };
    }
  });

  const loading = productsLoading || reviewsLoading;

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
