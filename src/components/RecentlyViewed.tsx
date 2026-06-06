import { useEffect, useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { History } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface RecentlyViewedProps {
  excludeId?: string;
  title?: string;
}

export default function RecentlyViewed({ excludeId, title = "Recently Viewed Products" }: RecentlyViewedProps) {
  const { products, loading } = useProducts();
  const [historyItems, setHistoryItems] = useState<Product[]>([]);

  useEffect(() => {
    const recentlyViewedKey = 'hunter_recently_viewed';
    const stored = localStorage.getItem(recentlyViewedKey);
    if (stored) {
      try {
        const viewedIds: string[] = JSON.parse(stored);
        
        // Match viewed IDs with the actual product data
        let items = viewedIds
          .map(id => products.find(p => p.id === id))
          .filter((p): p is Product => !!p);
          
        // Exclude the current product if specified (e.g. on details page)
        if (excludeId) {
          items = items.filter(p => p.id !== excludeId);
        }
        
        // Smoothly set the top 4 viewed items
        setHistoryItems(items.slice(0, 4));
      } catch (err) {
        console.error("Error parsing recently viewed history:", err);
      }
    }
  }, [products, excludeId]);

  if (loading || historyItems.length === 0) {
    return null; // Keep UI clean by hiding if there are no recently viewed items
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-sm shadow-sm p-4 lg:p-8 mt-4 border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
        <div className="p-1.5 rounded-full bg-fk-blue/10 text-fk-blue flex items-center justify-center">
          <History className="w-5 h-5 flex-shrink-0" />
        </div>
        <h2 className="text-[18px] lg:text-[22px] font-medium text-fk-text uppercase tracking-normal">{title}</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        {historyItems.map((product) => (
          <div key={product.id} className="w-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
