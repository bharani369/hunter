import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

export interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedSize: string;
  selectedColour?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number, colour?: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('hunter_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart");
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('hunter_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, size: string, quantity = 1, colour?: string) => {
    setItems(prevItems => {
      // Check if product with same size and colour already exists
      const existing = prevItems.find(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.selectedColour === colour
      );
      if (existing) {
        return prevItems.map(item => 
          item.cartId === existing.cartId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      const itemCartId = `${product.id}-${size}-${colour ? colour.replace(/\s+/g, '-') : ''}-${Date.now()}`;
      return [...prevItems, { 
        ...product, 
        cartId: itemCartId, 
        quantity, 
        selectedSize: size, 
        selectedColour: colour 
      }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) return;
    setItems(prevItems => prevItems.map(item => 
      item.cartId === cartId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
