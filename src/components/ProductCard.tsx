import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white rounded-sm border border-transparent hover:border-transparent hover:shadow-[0_3px_16px_0_rgba(0,0,0,.11)] transition-all duration-300 w-full flex flex-col h-full relative overflow-hidden">
      <button 
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur text-gray-500 hover:text-red-500 hover:scale-110 shadow-sm opacity-0 group-hover:opacity-100 transition-all focus:outline-none"
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>
      <div className="relative aspect-[4/5] p-4 bg-white flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
        {/* Badges */}
        {product.tag && (
          <div className="absolute top-0 left-0 bg-fk-red text-white text-[10px] uppercase font-bold py-1 px-2 rounded-br-sm shadow-sm">
            {product.tag}
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-2 flex flex-col flex-grow">
        <div className="text-[12px] text-fk-gray font-medium mb-1">HUNTER</div>
        <h3 className="text-[14px] font-medium text-fk-text mb-1 line-clamp-2 leading-tight group-hover:text-fk-blue">
          {product.name}
        </h3>
        
        {product.reviews && product.reviews > 0 ? (
          <div className="flex items-center gap-2 mb-2 mt-auto">
            <div className="bg-fk-green text-white text-[12px] px-1.5 py-0.5 rounded-[3px] font-bold flex items-center gap-1">
              {product.rating} <span className="text-[10px] leading-none">★</span>
            </div>
            <span className="text-[12px] text-fk-gray font-medium">({product.reviews.toLocaleString()})</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2 mt-auto text-[12px] text-fk-gray/70 font-medium italic">
            <span>No ratings yet</span>
          </div>
        )}

        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[16px] font-bold text-[#212121]">₹{product.price}</span>
          <span className="text-[14px] text-fk-gray line-through">₹{product.originalPrice}</span>
          <span className="text-[13px] font-bold text-fk-green">{product.discount}% off</span>
        </div>
      </div>
    </Link>
  );
}
