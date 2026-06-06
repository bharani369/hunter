import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { CATEGORIES } from '../data';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { useSEO } from '../hooks/useSEO';

export default function Shop() {
  const { products, loading } = useProducts();
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const searchQ = queryParams.get('q')?.toLowerCase() || '';

  const [activeCategory, setActiveCategory] = useState<string[]>([]);
  const [activePriceRanges, setActivePriceRanges] = useState<string[]>([]);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeSort, setActiveSort] = useState('Relevance');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useSEO('Shop Collection | Hunter', 'Browse our extensive collection of high-quality clothing at Hunter.');

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => p.sizes?.forEach(size => sizes.add(size)));
    return Array.from(sizes);
  }, [products]);

  const PRICE_RANGES = [
    { id: 'under-500', label: 'Under ₹500', min: 0, max: 499 },
    { id: '500-1000', label: '₹500 - ₹999', min: 500, max: 999 },
    { id: '1000-1500', label: '₹1000 - ₹1499', min: 1000, max: 1499 },
    { id: 'above-1500', label: '₹1500 & Above', min: 1500, max: Infinity },
  ];

  const clearFilters = () => {
    setActiveCategory([]);
    setActivePriceRanges([]);
    setActiveSizes([]);
  };

  const toggleCategory = (cat: string) => {
    setActiveCategory(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const togglePriceRange = (id: string) => {
    setActivePriceRanges(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleSize = (size: string) => {
    setActiveSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQ) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQ));
    }

    if (activeCategory.length > 0) {
      result = result.filter(p => activeCategory.includes(p.category));
    }

    if (activeSizes.length > 0) {
      result = result.filter(p => p.sizes?.some(size => activeSizes.includes(size)));
    }

    if (activePriceRanges.length > 0) {
      result = result.filter(p => {
        return activePriceRanges.some(rangeId => {
          const range = PRICE_RANGES.find(r => r.id === rangeId);
          return range && p.price >= range.min && p.price <= range.max;
        });
      });
    }

    switch(activeSort) {
      case 'Price: Low to High':
        result.sort((a,b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a,b) => b.price - a.price);
        break;
      case 'Top Rated':
        result.sort((a,b) => b.rating - a.rating);
        break;
      case 'Newest First':
        result = result.filter(p => p.tag === 'NEW' || p.tag === 'TRENDING').concat(result.filter(p => p.tag !== 'NEW' && p.tag !== 'TRENDING'));
        break;
    }
    
    return result;
  }, [activeCategory, activeSort, searchQ]);

  return (
    <div className="bg-fk-light w-full min-h-screen pb-10">
      <div className="max-w-[1248px] mx-auto px-2 lg:px-4 py-2 lg:py-4 flex flex-col lg:flex-row gap-2 lg:gap-4">
        
        {/* LEFT SIDEBAR FILTERS - Desktop */}
        <div className="hidden lg:block w-[280px] shrink-0 bg-white shadow-sm overflow-hidden rounded-sm h-max">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
             <h2 className="text-[18px] font-medium text-fk-text">Filters</h2>
             {(activeCategory.length > 0 || activePriceRanges.length > 0 || activeSizes.length > 0) && (
               <button onClick={clearFilters} className="text-fk-blue text-[12px] font-medium uppercase">Clear all</button>
             )}
          </div>

          <div className="p-4 border-b border-gray-100 text-[14px]">
             <h3 className="font-medium text-fk-text mb-3 uppercase text-[12px] text-[#878787]">Categories</h3>
             <ul className="space-y-2">
               {CATEGORIES.map(cat => (
                 <li key={cat.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleCategory(cat.name)}>
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${activeCategory.includes(cat.name) ? 'bg-fk-blue border-fk-blue text-white' : 'border-gray-300 bg-white group-hover:border-fk-blue'}`}>
                       {activeCategory.includes(cat.name) && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-[#212121] group-hover:text-fk-blue">{cat.name}</span>
                 </li>
               ))}
             </ul>
          </div>

          <div className="p-4 border-b border-gray-100 text-[14px]">
             <h3 className="font-medium text-fk-text mb-3 uppercase text-[12px] text-[#878787]">Price Range</h3>
             <ul className="space-y-2">
               {PRICE_RANGES.map(range => (
                 <li key={range.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => togglePriceRange(range.id)}>
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${activePriceRanges.includes(range.id) ? 'bg-fk-blue border-fk-blue text-white' : 'border-gray-300 bg-white group-hover:border-fk-blue'}`}>
                       {activePriceRanges.includes(range.id) && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-[#212121] group-hover:text-fk-blue">{range.label}</span>
                 </li>
               ))}
             </ul>
          </div>

          <div className="p-4 border-b border-gray-100 text-[14px]">
             <h3 className="font-medium text-fk-text mb-3 uppercase text-[12px] text-[#878787]">Size</h3>
             <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
               {availableSizes.map(size => (
                 <li key={size} className="flex items-center gap-3 cursor-pointer group" onClick={() => toggleSize(size)}>
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${activeSizes.includes(size) ? 'bg-fk-blue border-fk-blue text-white' : 'border-gray-300 bg-white group-hover:border-fk-blue'}`}>
                       {activeSizes.includes(size) && <span className="text-[10px]">✓</span>}
                    </div>
                    <span className="text-[#212121] group-hover:text-fk-blue">{size}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1">
           <div className="bg-white shadow-sm rounded-sm mb-2 p-4">
              <div className="text-[12px] text-[#878787] mb-2">
                Home {activeCategory.length ? `> ${activeCategory.join(', ')}` : '> All Men\'s Fashion'} {searchQ && `> Search: "${searchQ}"`}
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="text-[16px] font-medium text-[#212121] inline-block mr-2">
                      {searchQ ? `Search Results for "${searchQ}"` : "Men's Fashion"}
                    </h1>
                    <span className="text-[#878787] text-[12px]">(Showing {filteredProducts.length} products)</span>
                 </div>
                 
                 {/* Sort Tabs - Desktop */}
                 <div className="hidden md:flex items-center text-[14px]">
                    <span className="font-medium mr-4 text-fk-text">Sort By</span>
                    {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest First'].map(sort => (
                      <button 
                         key={sort}
                         onClick={() => setActiveSort(sort)}
                         className={`px-4 py-1 hover:text-fk-blue transition border-b-2 ${activeSort === sort ? 'border-fk-blue text-fk-blue font-medium' : 'border-transparent text-fk-text'}`}
                      >
                        {sort}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Mobile Filter & Sort Buttons */}
           <div className="flex lg:hidden bg-white shadow-sm mb-2 rounded-sm border-b border-gray-200">
               <button className="flex-1 py-3 flex items-center justify-center gap-2 border-r border-gray-200 text-sm font-medium" onClick={() => setShowMobileFilter(true)}>
                  <span className="text-xl leading-none">⇋</span> Sort
               </button>
               <button className="flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium" onClick={() => setShowMobileFilter(true)}>
                  <span className="text-xl leading-none">⚙</span> Filter
               </button>
           </div>

           {/* Product Grid */}
           {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[2px] bg-gray-100">
               {[...Array(8)].map((_, i) => (
                 <div key={i} className="bg-white p-4 flex flex-col w-full h-[320px] animate-pulse">
                   <div className="w-full h-[200px] bg-gray-200 mb-4 rounded-sm"></div>
                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                   <div className="h-6 bg-gray-200 rounded w-1/4 mt-auto"></div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[2px] bg-gray-100">
               {filteredProducts.map(product => (
                 <div key={product.id} className="bg-white">
                   <ProductCard product={product} />
                 </div>
               ))}
               {filteredProducts.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white">
                     <div className="text-6xl mb-4">🔍</div>
                     <h2 className="text-xl font-medium mb-2">Sorry, no results found!</h2>
                     <p className="text-fk-gray">Please check the spelling or try searching for something else</p>
                  </div>
               )}
             </div>
           )}
        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[220] bg-black/50 lg:hidden flex flex-col justify-end">
           <div className="bg-white rounded-t-xl h-[80vh] flex flex-col animate-[slideUp_0.3s_ease-out]">
              <div className="flex justify-between items-center p-4 border-b">
                 <h2 className="text-lg font-bold text-fk-text">Filters & Sort</h2>
                 <button onClick={() => setShowMobileFilter(false)} className="text-2xl leading-none text-fk-gray">&times;</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                 <div>
                    <h3 className="font-bold text-sm mb-3">Sort By</h3>
                    <select value={activeSort} onChange={(e) => setActiveSort(e.target.value)} className="w-full border rounded p-2 text-sm">
                       {['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest First', 'Top Rated'].map(sort => (
                          <option key={sort} value={sort}>{sort}</option>
                       ))}
                    </select>
                 </div>
                 <div>
                    <h3 className="font-bold text-sm mb-3">Categories</h3>
                    <div className="space-y-2">
                      {CATEGORIES.map(cat => (
                         <label key={cat.id} className="flex items-center gap-3">
                            <input type="checkbox" checked={activeCategory.includes(cat.name)} onChange={() => toggleCategory(cat.name)} className="w-4 h-4" />
                            <span className="text-sm">{cat.name}</span>
                         </label>
                      ))}
                    </div>
                 </div>
              </div>
              <div className="p-4 border-t flex gap-4">
                 <button onClick={() => { clearFilters(); setActiveSort('Relevance'); }} className="flex-1 py-3 border border-gray-300 font-medium rounded hover:bg-gray-50 transition-colors">Clear</button>
                 <button onClick={() => setShowMobileFilter(false)} className="flex-1 py-3 bg-[#1A1A5E] hover:bg-[#1A1A5E]/90 text-white font-medium rounded">Apply</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
