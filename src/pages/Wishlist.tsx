import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 mt-[100px] text-center min-h-[50vh]">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't saved any items yet. Start exploring our collection to find something you love!</p>
        <Link 
          to="/shop" 
          className="bg-fk-blue text-white px-8 py-3 rounded-md font-medium hover:bg-blue-800 transition-colors shadow-sm"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-[100px]">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 border-b border-gray-100 pb-4">My Wishlist <span className="text-gray-400 text-lg font-normal ml-2">({wishlistItems.length} items)</span></h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mt-8">
        {wishlistItems.map((product) => (
          <div key={product.id} className="relative group">
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur text-red-500 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110"
              title="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
