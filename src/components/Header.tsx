import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, MoreVertical, ChevronDown, Menu, X, Heart, Home, ShoppingBag, Truck, Info, Phone, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const suggestions = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="bg-[#fff200] border-b border-[#1A1A5E]/15 sticky top-0 z-[300] shadow-sm text-[#1A1A5E]">
      <div className="max-w-[1248px] mx-auto px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Logo area */}
        <div className="flex items-center gap-2 shrink-0">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcSMYEwkeaD-VBL4AVJwCLm-NCBDkslRaAu_PDpq4uougJJENcwSGVcrkfIokdRiSMWQB3xqr6tKrNy071rNpzjzq6AaxBCaXRPdwbRY1XJgD7uiCaaBiCKp-V53Ny7UK6HRm2kJatWV-TBxCJg1EF8CalkL4Q12m-IJDSTjuIcjUhV8ns3MDsxmKevvpl/s1600/452052041_529242162776191_3750077501653396213_n.jpg" 
            alt="Company Logo" 
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-[#1A1A5E]/10 object-cover shrink-0" 
          />
          <Link to="/" className="flex flex-col items-start shrink-0 text-[#1A1A5E]">
            <span className="font-bold text-xl italic tracking-tight text-[#1A1A5E]">Hunter</span>
            <span className="text-[10px] text-[#1A1A5E]/80 -mt-1 font-extrabold hover:underline flex items-center gap-0.5">
              Mens & Juniors
            </span>
          </Link>
        </div>

        {/* Centered Desktop Navigation Links */}
        <div className="hidden lg:flex items-center justify-center gap-6 flex-1 font-bold text-[14.5px]">
          <Link to="/" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E] flex items-center gap-2">
            <i className="fa-solid fa-house"></i>
            Home
          </Link>
          <Link to="/shop" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E] flex items-center gap-2">
            <i className="fa-solid fa-shop"></i>
            Shop
          </Link>
          <Link to="/about" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E] flex items-center gap-2">
            <i className="fa-solid fa-circle-info"></i>
            About Us
          </Link>
          <Link to="/contact" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E] flex items-center gap-2">
            <i className="fa-solid fa-headset"></i>
            Contact
          </Link>
          <Link to="/track" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E] flex items-center gap-2">
            <i className="fa-solid fa-truck-fast"></i>
            Track Order
          </Link>
          <Link to="/admin" className="whitespace-nowrap text-[#D97706] font-extrabold hover:bg-[#D97706]/10 px-3 py-1 rounded border border-[#D97706]/20 transition-all">
            Admin Panel
          </Link>
        </div>

          {/* Desktop Search & Actions Bar - Right */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 justify-end">
          {/* Search Bar - Desktop */}
          <div className="relative w-56 xl:w-64" onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}>
            <form onSubmit={handleSearch} className="flex relative items-center w-full shadow-[0_2px_4px_0_rgba(0,0,0,0.06)] bg-white rounded-md h-[34px] border border-gray-200">
              <input 
                type="text" 
                placeholder="Search products..."
                className="w-full text-fk-text text-[13px] pl-3 pr-8 py-1 outline-none rounded-md bg-white border-0"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button type="submit" className="absolute right-2.5 text-[#1A1A5E] bg-white hover:text-[#1A1A5E]/80 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Search Suggestions */}
            <AnimatePresence>
              {showSuggestions && searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[38px] right-0 w-[320px] sm:w-[350px] bg-white text-fk-text shadow-2xl border border-gray-150 rounded-lg overflow-hidden z-[400]"
                >
                  <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-[10px] uppercase tracking-wider font-extrabold text-gray-400">
                    <span>Products Found ({suggestions.length})</span>
                    <span>Real-time suggestions</span>
                  </div>
                  {suggestions.length > 0 ? (
                    <div className="max-h-[340px] overflow-y-auto">
                      {suggestions.map(item => (
                        <Link 
                          key={item.id}
                          to={`/product/${item.id}`}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1A1A5E]/5 transition-all border-b border-gray-100 last:border-0 group"
                          onClick={() => {
                            setSearchQuery('');
                            setShowSuggestions(false);
                          }}
                        >
                          <div className="w-10 h-10 rounded bg-gray-100 border border-gray-150 overflow-hidden shrink-0 flex items-center justify-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-gray-805 group-hover:text-[#1A1A5E] truncate transition-colors">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-bold text-[#1A1A5E]">₹{item.price}</span>
                              {item.discount > 0 && (
                                <>
                                  <span className="text-[10px] text-gray-400 line-through">₹{item.originalPrice}</span>
                                  <span className="text-[10px] text-[#25D366] font-bold">-{item.discount}%</span>
                                </>
                              )}
                            </div>
                            <span className="text-[9px] bg-gray-100 text-gray-500 px-1 py-0.2 rounded font-medium mt-1 inline-block">
                              {item.category}
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-300 -rotate-90 group-hover:text-[#1A1A5E] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-gray-400 flex flex-col items-center gap-1">
                      <Search className="w-6 h-6 text-gray-355" />
                      <span>No matching products found</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-xs text-[#1A1A5E] font-extrabold flex items-center justify-center gap-1.5 transition-colors border-t border-gray-100"
                  >
                    <span>See all results for "{searchQuery}"</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/wishlist" className="flex items-center gap-2 hover:text-[#1A1A5E]/80 transition relative text-[#1A1A5E]">
            <span className="relative">
               <i className="fa-regular fa-heart text-[18px]"></i>
               {wishlistItems.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-[#1A1A5E] text-white text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold">
                   {wishlistItems.length}
                 </span>
               )}
            </span>
          </Link>
          <Link to="/cart" className="flex items-center gap-2 hover:text-[#1A1A5E]/80 transition relative text-[#1A1A5E]">
            <span className="relative">
               <i className="fa-solid fa-cart-shopping text-[18px]"></i>
               <span className="absolute -top-2 -right-2 bg-[#1A1A5E] text-white text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold">
                 {cartCount}
               </span>
            </span>
            <span className="font-bold text-xs">Cart</span>
          </Link>
        </div>

        {/* Mobile Header icons */}
        <div className="flex lg:hidden items-center gap-4 text-[#1A1A5E]">
           <Link to="/wishlist" className="relative mr-1 hover:scale-105 transition-transform">
               <i className="fa-regular fa-heart text-[22px]"></i>
               {wishlistItems.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-[#1A1A5E] text-white text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold">
                   {wishlistItems.length}
                 </span>
               )}
           </Link>
           <Link to="/cart" className="relative mr-1 hover:scale-105 transition-transform">
               <i className="fa-solid fa-cart-shopping text-[22px]"></i>
               <span className="absolute -top-2 -right-2 bg-[#1A1A5E] text-white text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold">
                 {cartCount}
               </span>
           </Link>
           <button onClick={() => setMobileMenuOpen(true)} className="hover:scale-105 transition-transform active:scale-95">
             <i className="fa-solid fa-bars text-[24px]"></i>
           </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-2 pb-2 relative" onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}>
         <form onSubmit={handleSearch} className="flex relative items-center w-full bg-white rounded-md h-[36px] shadow-sm border border-gray-200">
           <Search className="w-4 h-4 text-fk-gray absolute left-3" />
           <input 
             type="text" 
             placeholder="Search for Mens & Juniors..."
             className="w-full text-fk-text text-[14px] pl-9 pr-3 py-2 outline-none rounded-md bg-white"
             value={searchQuery}
             onChange={(e) => {
               setSearchQuery(e.target.value);
               setShowSuggestions(true);
             }}
             onFocus={() => setShowSuggestions(true)}
           />
         </form>
         
         {/* Mobile Search Suggestions */}
         <AnimatePresence>
           {showSuggestions && searchQuery && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.98, y: 5 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.98, y: 5 }}
               transition={{ duration: 0.12 }}
               className="absolute top-[42px] left-2 right-2 bg-white text-fk-text shadow-2xl border border-gray-150 rounded-lg overflow-hidden z-[450]"
             >
               <div className="p-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center text-[10px] uppercase tracking-wider font-extrabold text-gray-400">
                 <span>Items found ({suggestions.length})</span>
                 <span>Suggestions</span>
               </div>
               {suggestions.length > 0 ? (
                 <div className="max-h-[280px] overflow-y-auto">
                   {suggestions.map(item => (
                     <Link 
                       key={item.id}
                       to={`/product/${item.id}`}
                       className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#1A1A5E]/5 transition-all border-b border-gray-100 last:border-0 group"
                       onClick={() => {
                         setSearchQuery('');
                         setShowSuggestions(false);
                       }}
                     >
                       <div className="w-9 h-9 rounded bg-gray-100 border border-gray-150 overflow-hidden shrink-0">
                         <img 
                           src={item.image} 
                           alt={item.name} 
                           className="w-full h-full object-cover" 
                           referrerPolicy="no-referrer"
                         />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h4 className="text-xs font-semibold text-gray-800 truncate">{item.name}</h4>
                         <div className="flex items-center gap-1.5">
                           <span className="text-xs font-bold text-[#1A1A5E]">₹{item.price}</span>
                           {item.discount > 0 && (
                             <span className="text-[10px] text-[#25D366] font-bold">-{item.discount}% Off</span>
                           )}
                         </div>
                       </div>
                     </Link>
                   ))}
                 </div>
               ) : (
                 <div className="p-6 text-center text-xs text-gray-400">No products found</div>
               )}
               <button
                 type="button"
                 onClick={() => {
                   navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
                   setShowSuggestions(false);
                 }}
                 className="w-full text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-xs text-[#1A1A5E] font-extrabold flex items-center justify-center gap-1.5 transition-colors border-t border-gray-100"
               >
                 <span>See all results for "{searchQuery}"</span>
               </button>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[250] lg:hidden backdrop-blur-md bg-black/60"
        >
          <div className="fixed inset-0" onClick={() => setMobileMenuOpen(false)}></div>
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: '100%' },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { 
                  type: "spring", 
                  damping: 30, 
                  stiffness: 220,
                  staggerChildren: 0.04,
                  delayChildren: 0.1
                } 
              },
              exit: { 
                opacity: 0, 
                x: '100%',
                transition: { 
                  type: "tween",
                  duration: 0.25,
                  ease: "easeInOut"
                }
              }
            }}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 w-[300px] h-full bg-[#fff200] border-l border-white/30 shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col z-[260] overflow-y-auto"
          >
            {/* Header Area */}
            <div className="p-6 flex items-center justify-between border-b border-[#1A1A5E]/10 bg-[#1A1A5E]/5">
              <div className="flex items-center gap-2">
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcSMYEwkeaD-VBL4AVJwCLm-NCBDkslRaAu_PDpq4uougJJENcwSGVcrkfIokdRiSMWQB3xqr6tKrNy071rNpzjzq6AaxBCaXRPdwbRY1XJgD7uiCaaBiCKp-V53Ny7UK6HRm2kJatWV-TBxCJg1EF8CalkL4Q12m-IJDSTjuIcjUhV8ns3MDsxmKevvpl/s1600/452052041_529242162776191_3750077501653396213_n.jpg" 
                  alt="Company Logo" 
                  className="w-8 h-8 rounded-full border border-[#1A1A5E]/10 object-cover shrink-0" 
                />
                <span className="font-bold text-lg tracking-tight text-[#1A1A5E] italic">Hunter Menu</span>
              </div>
              <button 
                className="text-[#1A1A5E] hover:rotate-90 transition-transform duration-300 w-8 h-8 rounded-full bg-[#1A1A5E]/10 flex items-center justify-center border border-[#1A1A5E]/10" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5 text-[#1A1A5E]" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col p-5 gap-2.5 flex-grow">
              {[
                { label: 'Home', path: '/', icon: Home },
                { label: 'Shop', path: '/shop', icon: ShoppingBag },
                { label: 'Saved Wishlist', path: '/wishlist', icon: Heart, badge: wishlistItems.length },
                { label: 'My Account', path: '/account', icon: User },
                { label: 'Track Order', path: '/track', icon: Truck },
                { label: 'Contact Us', path: '/contact', icon: Phone },
                { label: 'Admin Panel', path: '/admin', icon: Shield, adminOnly: true }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    variants={{
                      hidden: { x: 30, opacity: 0 },
                      visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 22 } }
                    }}
                  >
                    <Link 
                      to={item.path} 
                      onClick={() => setMobileMenuOpen(false)} 
                      className="py-3 px-4 w-full bg-[#1A1A5E]/5 hover:bg-[#1A1A5E]/10 hover:shadow-sm border border-[#1A1A5E]/5 hover:border-[#1A1A5E]/15 text-[#1A1A5E] font-bold text-base rounded-xl transition-all duration-300 hover:translate-x-1 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 opacity-90 text-[#1A1A5E]" />
                        <span className="text-[#1A1A5E]">{item.label}</span>
                      </div>
                      
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="bg-[#1A1A5E] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Authentication Footer Container */}
            <div className="p-5 border-t border-[#1A1A5E]/10 bg-[#1A1A5E]/5 backdrop-blur-md">
              {user && (
                <motion.button 
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { type: "spring" } }
                  }}
                  onClick={() => { logout(); setMobileMenuOpen(false); }} 
                  className="py-3 px-4 w-full bg-red-600/15 hover:bg-red-600/25 border border-red-600/30 text-red-700 font-bold rounded-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  Logout
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
