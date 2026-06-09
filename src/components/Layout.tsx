import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import Header from './Header';
import CategoryNav from './CategoryNav';
import Footer from './Footer';
import WhatsAppChat from './WhatsAppChat';
import ToastContainer from './ToastContainer';
import { useCart } from '../context/CartContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function Layout() {
  const { cartCount } = useCart();
  const [navigating, setNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);
  const isOnline = useOnlineStatus();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for premium feel
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Connect Lenis to requestAnimationFrame
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Clean up
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Scroll to the top of the page smoothly using Lenis on navigation
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { 
        duration: 0.8, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        immediate: false 
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // When location changes, play the loading bar
    setNavigating(true);
    setProgress(15);

    const step1 = setTimeout(() => setProgress(45), 100);
    const step2 = setTimeout(() => setProgress(75), 250);
    const step3 = setTimeout(() => setProgress(92), 400);
    const step4 = setTimeout(() => {
      setProgress(100);
      const fadeTimeout = setTimeout(() => {
        setNavigating(false);
      }, 200);
      return () => clearTimeout(fadeTimeout);
    }, 550);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
    };
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Offline Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-[10000] bg-red-500 text-white text-center py-2 px-4 shadow-md font-medium text-sm flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">wifi_off</span>
            You are currently offline. Please check your internet connection.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Page Progress Indicator */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed top-0 left-0 right-0 h-[3px] z-[9999] bg-black/10 pointer-events-none"
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              className="h-full bg-gradient-to-r from-[#F5A623] via-yellow-400 to-amber-500 shadow-[0_1px_10px_rgba(245,166,35,0.85)]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Page Loader Intermediary */}
      <AnimatePresence>
        {navigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#121212]/30 backdrop-blur-[3px] z-[9990] flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-md px-6 py-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 border border-white/40"
            >
              <div className="relative flex items-center justify-center">
                {/* Loader Spinner */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
                  className="w-[72px] h-[72px] border-[3.5px] border-[#1A1A5E]/10 border-t-[#F5A623] rounded-full"
                />
                {/* Round Company Logo in Center */}
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcSMYEwkeaD-VBL4AVJwCLm-NCBDkslRaAu_PDpq4uougJJENcwSGVcrkfIokdRiSMWQB3xqr6tKrNy071rNpzjzq6AaxBCaXRPdwbRY1XJgD7uiCaaBiCKp-V53Ny7UK6HRm2kJatWV-TBxCJg1EF8CalkL4Q12m-IJDSTjuIcjUhV8ns3MDsxmKevvpl/s1600/452052041_529242162776191_3750077501653396213_n.jpg" 
                  alt="Company Logo" 
                  className="absolute w-[54px] h-[54px] rounded-full object-cover border border-gray-100"
                />
              </div>
              
              {/* Only Numeric Percentage */}
              <span className="text-sm font-black text-[#1A1A5E] font-mono tracking-widest mt-1">
                {progress}%
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />
      <CategoryNav />
      <main className="flex-grow pb-16 lg:pb-0 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <WhatsAppChat />
      <ToastContainer />
      
      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-[#fff200] border-t border-white/30 z-[180] px-4 py-2 pb-3.5 flex justify-around items-center text-[11px] font-semibold shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
            location.pathname === '/' 
              ? 'text-[#1A1A5E] font-extrabold scale-105 active:scale-95' 
              : 'hover:text-[#1A1A5E] text-[#1A1A5E]/70 active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span>Home</span>
        </Link>
        <Link 
          to="/shop" 
          className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
            location.pathname.startsWith('/shop') || location.pathname.startsWith('/product')
              ? 'text-[#1A1A5E] font-extrabold scale-105 active:scale-95' 
              : 'hover:text-[#1A1A5E] text-[#1A1A5E]/70 active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">shopping_bag_speed</span>
          <span>Shop</span>
        </Link>
        <Link 
          to="/cart" 
          className={`flex flex-col items-center gap-0.5 transition-all duration-200 relative ${
            location.pathname === '/cart' 
              ? 'text-[#1A1A5E] font-extrabold scale-105 active:scale-95' 
              : 'hover:text-[#1A1A5E] text-[#1A1A5E]/70 active:scale-95'
          }`}
        >
          <span className="relative flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#1A1A5E] text-white text-[9px] font-bold w-[16px] h-[16px] flex items-center justify-center rounded-full leading-tight border border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </span>
          <span>Cart</span>
        </Link>
        <Link 
          to="/account" 
          className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
            location.pathname === '/account' 
              ? 'text-[#1A1A5E] font-extrabold scale-105 active:scale-95' 
              : 'hover:text-[#1A1A5E] text-[#1A1A5E]/70 active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
          <span>Account</span>
        </Link>
      </div>
    </div>
  );
}
