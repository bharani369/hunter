import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";

// Image imports matching exact relative paths
import hunterHeroImg from "../assets/images/hunter_hero_banner_1780585387394.png";
import shirtingImg from "../assets/images/shirting_3d_1780557656110.png";
import juniorsImg from "../assets/images/juniors_3d_1780557673426.png";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  tag: string;
  badgeBg: string;
  textColor: string;
  accentText: string;
}

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const slides: Slide[] = [
    {
      id: 1,
      tag: "NEW SEASON DESIGNS",
      badgeBg: "bg-amber-500/95 text-white",
      subtitle: "HUNTER MENS & JUNIORS",
      title: "Elevate Your Premium Wardrobe",
      description: "Discover our meticulously crafted new shirts, coordinates, and juniors collections. Built for maximum comfort and sharp profiles.",
      image: hunterHeroImg,
      ctaText: "Shop New Arrivals",
      ctaLink: "/shop",
      textColor: "text-white",
      accentText: "text-[#F5A623]",
    },
    {
      id: 2,
      tag: "FLAT VALUE OFFERS",
      badgeBg: "bg-[#1A1A5E] text-white border border-[#F5A623]/30",
      subtitle: "EVERYDAY SMART CASUALS",
      title: "Best-in-Class Shirting Under ₹599",
      description: "Premium cotton-blends, double-pocket corduroys, and formal linen aesthetics. Tailored to keep you breeze-cool through summer.",
      image: shirtingImg,
      ctaText: "Explore Shirting",
      ctaLink: "/shop?category=Shirts",
      textColor: "text-white",
      accentText: "text-[#F5A623]",
    },
    {
      id: 3,
      tag: "FESTIVAL SPECIALS",
      badgeBg: "bg-[#25D366] text-white",
      subtitle: "BUY More SAVE More",
      title: "Ultimate Bundle: Buy 2 Get 1 FREE",
      description: "Unbeatable combos on classic solids, checked styles, and street-smart hoodies. Add your favorites to cart to unlock immediate discount.",
      image: juniorsImg,
      ctaText: "Shop Combos",
      ctaLink: "/shop",
      textColor: "text-white",
      accentText: "text-[#F5A623]",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    }),
  };

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-[#111] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#F5A623]/20 h-[260px] sm:h-[340px] md:h-[400px]">
      {/* Slider Content */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center"
          >
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-102 hover:scale-105 transition-transform duration-10000 ease-out"
              />
              <div className="absolute inset-y-0 left-0 w-full md:w-[70%] bg-gradient-to-r from-black/95 via-black/80 to-transparent z-10" />
              <div className="absolute inset-0 bg-black/40 z-0" />
            </div>

            {/* Slide Information */}
            <div className="relative z-20 w-full md:w-[65%] px-6 sm:px-12 md:pl-16 flex flex-col justify-center items-start text-left select-none text-white">
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow ${currentSlide.badgeBg} mb-3`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F5A623] animate-pulse" />
                {currentSlide.tag}
              </motion.span>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[#F5A623] text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-1 sm:mb-2"
              >
                {currentSlide.subtitle}
              </motion.p>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2 sm:mb-3 drop-shadow-md text-white"
              >
                {currentSlide.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ delay: 0.5 }}
                className="text-xs sm:text-sm text-gray-200 line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 max-w-lg leading-relaxed font-medium"
              >
                {currentSlide.description}
              </motion.p>

              {/* Call To Action Buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3"
              >
                <Link
                  to={currentSlide.ctaLink}
                  className="bg-[#F5A623] text-[#1A1A5E] hover:bg-[#F5A623]/90 px-5 sm:px-7 py-2 rounded-sm font-black text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 duration-150"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {currentSlide.ctaText}
                </Link>
                <Link
                  to="/shop"
                  className="hidden sm:inline-flex items-center gap-1.5 text-white/90 hover:text-white font-bold text-xs uppercase tracking-wider border-b-2 border-white/30 hover:border-white transition-all ml-2"
                >
                  View Shop
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Nav Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 border border-white/10 hover:bg-[#F5A623] hover:text-[#1A1A5E] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95 shadow"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/45 border border-white/10 hover:bg-[#F5A623] hover:text-[#1A1A5E] text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105 active:scale-95 shadow"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Nav Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-35 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 sm:w-8 bg-[#F5A623]"
                : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Aesthetic Border Glow */}
      <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-sm z-40" />
    </div>
  );
}
