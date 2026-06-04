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
  const { user, logout, showLogin } = useAuth();
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
          <Link to="/" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E]">
            Home
          </Link>
          <Link to="/shop" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E]">
            Shop
          </Link>
          <Link to="/about" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E]">
            About Us
          </Link>
          <Link to="/contact" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E]">
            Contact
          </Link>
          <Link to="/track" className="whitespace-nowrap hover:text-[#1A1A5E]/70 transition-all text-[#1A1A5E]">
            Track Order
          </Link>
          <Link to="/admin" className="whitespace-nowrap text-[#D97706] font-extrabold hover:bg-[#D97706]/10 px-3 py-1 rounded border border-[#D97706]/20 transition-all">
            Admin Panel
          </Link>
        </div>

        {/* Desktop Search & Actions Bar - Right */}
        <div className="hidden lg:flex items-center gap-4 shrink-0 justify-end">
          {/* Search Bar - Desktop */}
          <div className="relative w-48 xl:w-60" onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}>
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
            {showSuggestions && searchQuery && (
              <div className="absolute top-[36px] right-0 w-64 bg-white text-fk-text shadow-xl border border-gray-100 rounded-md overflow-hidden z-50">
                {suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map(item => (
                      <li key={item.id}>
                        <Link 
                          to={`/product/${item.id}`}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                          onClick={() => setShowSuggestions(false)}
                        >
                          <Search className="w-3 h-3 text-fk-gray" />
                          <span className="text-xs truncate">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-3 py-2.5 text-xs text-fk-gray">No products found</div>
                )}
              </div>
            )}
          </div>

          {user ? (
            <div className="relative group shrink-0">
              <Link to="/account" className="bg-[#1A1A5E] text-white px-4 py-1.5 rounded-sm font-bold text-xs hover:bg-[#1A1A5E]/90 shadow-sm transition flex items-center gap-1">
                <span>{user.displayName?.split(' ')[0] || 'Account'}</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-100 rounded-sm shadow-xl hidden group-hover:block text-fk-text text-sm overflow-hidden z-50">
                <Link to="/account" className="block px-4 py-2 hover:bg-gray-50 font-medium border-b border-gray-50 flex items-center gap-2 text-fk-text"><User className="w-4 h-4 text-fk-blue" /> My Profile</Link>
                <Link to="/account" className="block px-4 py-2 hover:bg-gray-50 font-medium border-b border-gray-50 flex items-center gap-2 text-fk-text"><ShoppingBag className="w-4 h-4 text-fk-blue" /> Orders</Link>
                <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-50 font-medium border-b border-gray-50 flex items-center gap-2 text-fk-text"><Heart className="w-4 h-4 text-fk-blue" /> Wishlist</Link>
                <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2">Logout</button>
              </div>
            </div>
          ) : (
            <div className="relative group shrink-0">
              <button onClick={showLogin} className="bg-[#1A1A5E] text-white px-4 py-1.5 rounded-sm font-bold text-xs hover:bg-[#1A1A5E]/90 shadow-sm transition flex items-center gap-1">
                <span>Login</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-gray-100 rounded-sm shadow-xl hidden group-hover:block text-fk-text text-xs overflow-hidden z-50 p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-[#212121]">New customer?</span>
                  <button onClick={showLogin} className="text-fk-blue hover:underline font-bold">Sign Up</button>
                </div>
                <div className="border-t border-gray-100 my-2 pt-2 space-y-2">
                  <Link to="/account" className="block py-1 px-1 hover:bg-gray-50 rounded-sm font-medium text-sm flex items-center gap-2 text-[#212121]"><User className="w-4 h-4 text-fk-blue" /> My Profile</Link>
                  <Link to="/account" className="block py-1 px-1 hover:bg-gray-50 rounded-sm font-medium text-sm flex items-center gap-2 text-[#212121]"><ShoppingBag className="w-4 h-4 text-fk-blue" /> Orders</Link>
                  <Link to="/wishlist" className="block py-1 px-1 hover:bg-gray-50 rounded-sm font-medium text-sm flex items-center gap-2 text-[#212121]"><Heart className="w-4 h-4 text-fk-blue" /> Wishlist</Link>
                </div>
              </div>
            </div>
          )}

          <Link to="/wishlist" className="flex items-center gap-2 hover:text-[#1A1A5E]/80 transition relative text-[#1A1A5E]">
            <span className="relative">
               <Heart className="w-[18px] h-[18px] stroke-[2.5px]" />
               {wishlistItems.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-[#1A1A5E] text-white text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold">
                   {wishlistItems.length}
                 </span>
               )}
            </span>
          </Link>
          <Link to="/cart" className="flex items-center gap-2 hover:text-[#1A1A5E]/80 transition relative text-[#1A1A5E]">
            <span className="relative">
               <ShoppingCart className="w-[18px] h-[18px] fill-[#1A1A5E]" />
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
               <Heart className="w-[22px] h-[22px] stroke-[2.5px]" />
               {wishlistItems.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-[#1A1A5E] text-white text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold">
                   {wishlistItems.length}
                 </span>
               )}
           </Link>
           <Link to="/cart" className="relative mr-1 hover:scale-105 transition-transform">
               <ShoppingCart className="w-[22px] h-[22px] fill-[#1A1A5E]" />
               <span className="absolute -top-2 -right-2 bg-[#1A1A5E] text-white text-[10px] w-[15px] h-[15px] flex items-center justify-center rounded-full font-bold">
                 {cartCount}
               </span>
           </Link>
           <button onClick={() => setMobileMenuOpen(true)} className="hover:scale-105 transition-transform active:scale-95">
             <Menu className="w-6 h-6" />
           </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-2 pb-2 relative" onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}>
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
         {showSuggestions && searchQuery && (
           <div className="absolute top-[40px] left-2 right-2 bg-white text-fk-text shadow-lg border border-gray-100 rounded-sm overflow-hidden z-50">
             {suggestions.length > 0 ? (
               <ul>
                 {suggestions.map(item => (
                   <li key={item.id}>
                     <Link 
                       to={`/product/${item.id}`}
                       className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                       onClick={() => setShowSuggestions(false)}
                     >
                       <Search className="w-4 h-4 text-fk-gray" />
                       <span className="text-sm font-medium">{item.name}</span>
                     </Link>
                   </li>
                 ))}
               </ul>
             ) : (
               <div className="px-4 py-3 text-sm text-fk-gray">No products found</div>
             )}
           </div>
         )}
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
              {user ? (
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
              ) : (
                <motion.button 
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { type: "spring" } }
                  }}
                  onClick={() => { showLogin(); setMobileMenuOpen(false); }} 
                  className="py-3 px-4 w-full bg-[#1A1A5E] hover:bg-[#1A1A5E]/90 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-md shadow-black/10 text-center"
                >
                  Login / Sign up
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
