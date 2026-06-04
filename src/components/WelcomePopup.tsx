import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, PartyPopper, ShoppingBag } from "lucide-react";
import birthdayIllustration from "../assets/images/birthday_party_illustration_1780586369934.png";

interface WelcomePopupProps {
  onExplore?: () => void;
}

export default function WelcomePopup({ onExplore }: WelcomePopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the popup automatically on load
    // Check session storage so it doesn't annoy the user on every single click, but loads fresh per session
    const hasSeenWelcome = sessionStorage.getItem("hunter_has_seen_welcome_v2");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800); // smooth delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hunter_has_seen_welcome_v2", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="welcome-popup-overlay" className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          
          {/* Backdrop Blur & Dark Overlay */}
          <motion.div
            id="welcome-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#121212]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            id="welcome-popup-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.22)] border-2 border-[#fff200] max-h-[90vh] flex flex-col z-10"
          >
            {/* Close Button */}
            <button
              id="welcome-popup-close-btn"
              onClick={handleClose}
              className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/40 hover:bg-[#fff200] text-white hover:text-[#1A1A5E] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Illustration Area */}
            <div className="relative h-48 sm:h-56 bg-gradient-to-b from-[#fff200]/20 to-[#fff200]/5 flex items-center justify-center overflow-hidden shrink-0">
              {/* Confetti Deco */}
              <div className="absolute top-4 left-6 animate-bounce">
                <PartyPopper className="w-6 h-6 text-[#1A1A5E] rotate-6" />
              </div>
              <div className="absolute top-12 right-8 animate-pulse">
                <Sparkles className="w-5 h-5 text-[#fb641b]" />
              </div>
              <div className="absolute -bottom-6 left-12 w-24 h-24 bg-[#fff200]/10 rounded-full blur-xl" />
              <div className="absolute -top-6 right-12 w-32 h-32 bg-[#fb641b]/10 rounded-full blur-xl" />

              {/* Real generated Birthday Stock Illustration */}
              <img
                src={birthdayIllustration}
                alt="Birthday Party Stock Illustration"
                referrerPolicy="no-referrer"
                className="h-full w-auto object-contain z-10 scale-102 hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Typography Content */}
            <div className="p-6 text-center flex-grow overflow-y-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff200] border border-[#1A1A5E]/10 rounded-full text-xs font-black uppercase tracking-wider text-[#1A1A5E] mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                FEAST & CELEBRATIONS
              </div>

              {/* Bold Title */}
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1A5E] leading-tight tracking-tight mb-2">
                Your outfit starts here.
              </h2>
              
              {/* Secondary Message */}
              <h3 className="text-lg font-bold text-[#fb641b] mb-4">
                Welcome! to hunter
              </h3>

              {/* Supporting Text */}
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm mx-auto font-medium mb-6">
                Explore our elite new seasonal arrivals, handcrafted shirting, and juniors wear. Ready to turn heads at any celebration!
              </p>

              {/* Action Button */}
              <div className="flex flex-col gap-2.5 sm:flex-row justify-center items-stretch sm:items-center">
                <button
                  id="welcome-popup-start-shopping"
                  onClick={() => {
                    handleClose();
                    if (onExplore) onExplore();
                  }}
                  className="bg-[#1A1A5E] text-white hover:bg-[#1A1A5E]/90 px-6 py-3 rounded font-black text-xs sm:text-sm uppercase tracking-widest inline-flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-[#fff200]" />
                  Start Shopping
                </button>
                <button
                  id="welcome-popup-dismiss"
                  onClick={handleClose}
                  className="bg-gray-100 hover:bg-gray-200 text-[#1A1A5E] px-6 py-3 rounded font-bold text-xs sm:text-sm uppercase tracking-widest transition-all"
                >
                  Explore First
                </button>
              </div>

              {/* Footer notice */}
              <div className="text-[10px] text-gray-400 mt-6 font-semibold select-none bg-gray-50 py-1.5 rounded-sm border border-gray-100">
                🎉 Special Combo: Buy 2 Get 1 Free is live in-store!
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
