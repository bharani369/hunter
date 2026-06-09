import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';                
import { useProducts } from '../context/ProductContext';
import { useSEO } from '../hooks/useSEO';
import HeroBanner from '../components/HeroBanner';
import WelcomePopup from '../components/WelcomePopup';
import RecentlyViewed from '../components/RecentlyViewed';

// Add these imports at the top
import { motion } from 'motion/react';
import shirtingImg from '../assets/images/shirting_3d_1780557656110.png';
import juniorsImg from '../assets/images/juniors_3d_1780557673426.png';

const TypingText = ({ text, className, delay = 0, breakIndex = -1 }: { text: string, className?: string, delay?: number, breakIndex?: number }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.05,
          },
        },
      }}
    >
      {text.split("").map((char, index) => (
        <span key={`${char}-${index}`}>
          <motion.span
            variants={{
              hidden: { opacity: 0, scale: 0.5 },
              visible: { opacity: 1, scale: 1 }
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
          {breakIndex === index && <br className="md:hidden" />}
        </span>
      ))}
    </motion.div>
  );
};

const GALLERY_IMAGES = [
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHbIOvI3qz7woecH8Xeq-9Vl33bT3QS_mvZ1paIuaCUq-AuAbR_VPNmtmUgGGIgxQaTQiSrn7eQkyQsJsTVpwl8AqnK75IrOed3lrPDl14VKFAlyLJ5cLFCY2y9zvlzfPS0PosP2zBSY8A5wJpzLfvXppsMxWixd2-MZ5I83CjHcQnw1uuYIqtsxYv8GHL/s320/unnamed%20(12).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi47JUKxS4EfanJ8TQrULsTMcbESk5hVc_OMNW6z9uGpYZnEPDOV4h2AVu9gAKnDbL4WjpCwx7Ip4NGoT5wxUlV45u_BFPNhR8TZsSWC1bNHupGHZK93if7TiWW828TAIs_NzMJyIyAre2lFNHyQMddqNaMJ7A2KASC14DwVSdgNCb0Df_qxUG0KGTa9qCH/s320/unnamed%20(11).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEga_MjhQXU7RPFpdWKvan3hFD8u8bIucBKjzTdg6feY4Pv2D00AsWP5CSJsdIEvxxVw46XM6wn_TqpiQRK9wGijSZFqTsy2UEY36NV_na01pHzLteopZynpjEaV8rl6G3X-3w6szzlOZUYUXiGONE3OLFqtSdcxmRBvG7vwm5AqJzsiRESUUOBUh9UolU3J/s320/unnamed%20(10).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjjNKzwq-TmgepAoep8I5Ue5WE8LCSYtZFWDefQIgV4EIRkzqIFzojv0hMmgLNSzFlTaQBE3-VwUR1tticxxwnDmjYf4EJxtldRxJIaopPx9f0ZSVDiGJczlf8gT_a5REPptzhWBZtSuupnD067JqLVOR7AqNs2eQK7e1Cup7U9kBEo_Q-Zd-ydwltYlHP/s320/unnamed%20(9).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrlzUs1V3b245qfiyUl_uNTM2xar_YND9zk2KiVz02IpmF1_CdY3Inhu3mCYudJZ1wJnpUsPRDfQkuVcF-t5NDfDMvJqjwlnLlC4128tfurYw7T8H_dKo3TN_BgQzkkqIt1MglrcdbLbb1qaOES9lYb_Uy_jnbGHyqEKiJHw8o1okwoMMGeB-0EVLjZigg/s320/unnamed%20(8).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiruPR3bxiFwXbfKN3jD3aVhTgq4N3LHrlgmIII0pqsE3cvfFTQNABgg9UfWGpfJwhEdXa9r0FuWPs-QrEx9RGKjLXxGf-FCPyFdQREGs83J4gZh-g878USSKKPhn4wey7_rj2zJQIJYI70kz2L2LphzsbkKT6RfSg2U_ELJhrKWlViANScAOszB0mmpkrG/s320/unnamed%20(7).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgNFYwqfjdO3ZImZkcbD5_pygDOI9BHJS9ynm3efzeOBzftQYXmv2GVWmd5OXfGM_KU-CVy_GoB_UgaGDvkgjxo9SalUYv60IcnfsQ7u5GccVLnwT7_bM7eafSy8jDIEcIn4lqycW6Y1j26NpOIZX0qNCJxzSp82DbNLZhWZmbYQ-3G_B3cZV-6vu3QtA4h/s320/unnamed%20(6).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjS954XuocwW3Xk8mjeFoSepcGORLGePwUAe2I-2P6VBMupQW5x0eLUt2sGW74OgnokbXpVxcaD7dVV3VtWpcBxNnYKoOOH3t2xSc3aBNelz9WtuMFu_UkGVcwhJB8cjTMazTm8VUUcppA1grrg1OexTRg1KGhu-k104hFZ2B7e4tvIr1EYwI3G6JvoSTYW/s320/unnamed%20(5).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi6SqoNfkX_9LP7cF9Ll1daXyV-nq3xMT7v1lo_S80vdXEVOsOgmao7iqq1-B31HTGVMSa43_wdgWdGg1rElymvCOL-jLwyc-K0Bsddu9qj_2aqdhYcbRt0asVCzdRhvLbBtEJwM15EvAwQ12Xyb8zrePEf-eAxUfjbYqPGtyUgZBW57-eDxXsyKGyU1PW8/s320/unnamed%20(4).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgJy_a9aG8MywlOUTAEx7EtvJ021vV_18Aje4_F2zkRb5F_SK_2oSUObqTJkQ61z977lwAA3EU9hTrrJr4FluAMlBmIEWQKBw_qT3jq_VQV_b6enttrxzOsmYuK2Yiu308BjYsUohFM2QilurMsWpYgZvC56wk3kpFO0yttWFJU0fR6IIkc-OnCaHIUZBwt/s320/unnamed%20(3).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKOK6lGziFYoxiwURAoKA_HypZ-sSn_2PWS3DBD0Vykb-T9e7dJiEvSgJvdS5wbN7s3C4sFFX0tnucW487WvkNC_B5tdvWs83N6B79ocn5NnFwsarIA_nHnV-52ioRbPAXj8KLAwmI3qw-gXLVPgcsnLh423dEJj0vz50XElWE1s6DrLvBGVTA91YxkieL/s320/unnamed%20(2).jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9ospt9ioO1d4WEVff_Sk915jIdFJeubgRn_qWksFwT0KvU3XvgGfCO3QFrMxDTzTVWbbDumyhfxx0_W4KtcO14faKbHV_d9yqgX9mVe97_c94jCS3iza33blV5iVFMMxXAevHuAwrhYAKKyphre77fryiie9kJpD2i0RQhELpc3t7hSTLHMnvS5ZvCgNM/s320/unnamed%20(1).jpg"
];

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle();
  const { products } = useProducts();
  const spotlightScrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useSEO('Hunter | The Style Store', 'Discover the latest clothing styles at Hunter. Shop modern outfits, shirting, and more.');

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="bg-fk-light w-full min-h-screen">
      <WelcomePopup />
      <div className="max-w-[1248px] mx-auto px-2 lg:px-4 py-2 lg:py-4 space-y-2 lg:space-y-4">
        
        {/* EYE-CATCHING HERO SECTION */}
        <div className="relative w-full rounded-sm overflow-hidden shadow-lg mb-6">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3" 
            alt="Lifestyle Fashion" 
            className="w-full h-[350px] md:h-[450px] lg:h-[550px] object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-4">
            <TypingText text="New Collection Arrival" delay={0.2} className="text-[#fff200] font-bold tracking-widest uppercase text-sm md:text-base mb-2 drop-shadow-sm" />
            <TypingText text="Elevate Your Style" delay={1.4} breakIndex={11} className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-md tracking-wider uppercase leading-tight" />
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 2.5, duration: 0.8 }}
            >
              <p className="text-sm md:text-lg text-gray-100 mb-8 max-w-xl font-medium drop-shadow-sm hidden sm:block">
                Discover the latest premium menswear. Expertly crafted for ultimate comfort and contemporary elegance.
              </p>
              <Link 
                to="/shop" 
                className="bg-gradient-to-r from-[#fff200] to-[#fffde7] hover:from-[#fce000] hover:to-white text-[#1A1A5E] px-8 py-3.5 md:px-10 md:py-4 rounded-sm font-bold text-base md:text-lg shadow shadow-[#fff200]/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#fff200]/50 inline-flex items-center gap-2 uppercase tracking-wide"
              >
                Shop Now
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">shopping_bag_speed</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* IMAGE GALLERY SCROLL */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mb-4 border border-gray-100">
          <div className="relative w-full overflow-hidden flex py-4">
             <style>
               {`
                 @keyframes scrollHorizontally {
                   0% { transform: translateX(0); }
                   100% { transform: translateX(-50%); }
                 }
                 .animate-scrollHorizontally {
                   animation: scrollHorizontally 30s linear infinite;
                 }
                 .animate-scrollHorizontally:hover {
                   animation-play-state: paused;
                 }
               `}
             </style>
             <div className="flex w-max animate-scrollHorizontally gap-4 px-4">
               {/* Original set */}
               {GALLERY_IMAGES.map((img, i) => (
                 <div key={`gallery1-${i}`} className="w-[180px] h-[220px] md:w-[220px] md:h-[280px] shrink-0 rounded-md overflow-hidden bg-gray-100">
                   <img src={img} className="w-full h-full object-cover hover:scale-110 transition duration-500" alt={`Gallery ${i}`} />
                 </div>
               ))}
               {/* Duplicated set for infinite loop */}
               {GALLERY_IMAGES.map((img, i) => (
                 <div key={`gallery2-${i}`} className="w-[180px] h-[220px] md:w-[220px] md:h-[280px] shrink-0 rounded-md overflow-hidden bg-gray-100">
                   <img src={img} className="w-full h-full object-cover hover:scale-110 transition duration-500" alt={`Gallery copy ${i}`} />
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* HERO CAROUSEL BANNERS - Interactive Premium Version */}
        <HeroBanner />

        {/* BRAND IN SPOTLIGHT */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mt-4 relative">
           {/* Header */}
           <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                 <h2 className="text-[18px] lg:text-[22px] font-medium text-fk-text uppercase">Brand in Spotlight</h2>
              </div>
              <Link to="/shop" className="hidden lg:block bg-fk-blue text-white px-4 py-2 rounded-sm font-medium text-[13px] shadow">VIEW ALL</Link>
           </div>
           
           {/* Scroll Arrow */}
           <button 
             onClick={() => spotlightScrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
             className="absolute right-2 top-24 z-20 lg:hidden bg-white/90 p-2 rounded-full shadow-lg border border-gray-100"
           >
             <ChevronRight className="w-5 h-5 text-fk-blue" />
           </button>

           {/* Horizontal scroll grid */}
           <div className="flex overflow-x-auto scrollbar-hide space-x-0 divide-x divide-gray-100 border-b border-gray-100 relative pb-1" ref={spotlightScrollRef}>
              {products.slice(0, 7).map(product => (
                 <div key={product.id} className="min-w-[170px] max-w-[170px] lg:min-w-[200px] lg:max-w-[200px] flex-shrink-0 p-4 hover:shadow-[0_3px_16px_0_rgba(0,0,0,.11)] transition cursor-pointer bg-white group z-10">
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="h-[150px] w-full flex items-center justify-center mb-4">
                        <img src={product.image} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" alt={product.name} loading="lazy" />
                      </div>
                      <div className="text-center">
                        <div className="text-[14px] font-medium text-[#212121] truncate mb-1">{product.name}</div>
                        <div className="text-[15px] text-[#388E3C] font-normal mb-1">From ₹{product.price}</div>
                      </div>
                    </Link>
                 </div>
              ))}
           </div>
        </div>

        {/* 2 COLUMN BANNERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
           <Link to="/shop" className="block rounded-lg shadow-md overflow-hidden aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/6] relative group bg-[#102A43] border border-blue-900/25">
              {/* Background 3D Image filling the whole card */}
              <img 
                 src={shirtingImg} 
                 alt="Best Shirting 3D Showcase" 
                 referrerPolicy="no-referrer"
                 className="absolute top-0 left-0 h-full w-full object-cover object-center sm:object-[center_30%] opacity-50 z-0 select-none pointer-events-none transform group-hover:scale-105 transition-all duration-700 ease-out" 
              />
              {/* Dark gradient from left covering most text area */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#102A43] via-[#102A43]/80 to-[#102A43]/10 z-10 pointer-events-none" />
              
              {/* Left Column: Content */}
              <div className="relative h-full flex flex-col justify-center pl-4 sm:pl-8 md:pl-10 z-20">
                 <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#fff200] mb-1">Elite Collection</span>
                 <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-1">Best Shirting</h3>
                 <p className="font-bold text-[10px] sm:text-sm text-blue-100 bg-white/10 backdrop-blur-sm self-start px-2.5 py-0.5 rounded border border-white/10 mb-3">Under ₹599</p>
                 <div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#fff200] to-[#fffde7] hover:from-[#fce000] hover:to-white text-[#1A1A5E] hover:shadow-lg px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm transition-all duration-300 inline-block shadow-sm">Explore Collection</span>
                 </div>
              </div>
           </Link>

           <Link to="/shop" className="block rounded-lg shadow-md overflow-hidden aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/6] relative group bg-[#5C200B] border border-orange-950/20">
              {/* Background 3D Image filling the whole card */}
              <img 
                 src={juniorsImg} 
                 alt="Juniors Wear 3D Showcase" 
                 referrerPolicy="no-referrer"
                 className="absolute top-0 left-0 h-full w-full object-cover object-center sm:object-[center_30%] opacity-50 z-0 select-none pointer-events-none transform group-hover:scale-105 transition-all duration-700 ease-out" 
              />
              {/* Dark gradient from left covering most text area */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5C200B] via-[#5C200B]/80 to-[#5C200B]/10 z-10 pointer-events-none" />
              
              {/* Left Column: Content */}
              <div className="relative h-full flex flex-col justify-center pl-4 sm:pl-8 md:pl-10 z-20">
                 <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#fff200] mb-1">Trending Styles</span>
                 <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-1">Juniors Wear</h3>
                 <p className="font-bold text-[10px] sm:text-sm text-orange-100 bg-white/10 backdrop-blur-sm self-start px-2.5 py-0.5 rounded border border-white/10 mb-3">Fresh New Arrivals</p>
                 <div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#fff200] to-[#fffde7] hover:from-[#fce000] hover:to-white text-[#1A1A5E] hover:shadow-lg px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm transition-all duration-300 inline-block shadow-sm">View Kids Store</span>
                 </div>
              </div>
           </Link>
        </div>

        {/* TOP PICKS SCROLLER */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mt-4">
           <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
              <h2 className="text-[18px] lg:text-[22px] font-medium text-fk-text">More Top Picks For You</h2>
           </div>
           <div className="flex overflow-x-auto scrollbar-hide space-x-0 divide-x divide-gray-100 pb-2">
              {products.slice(7, 16).map(product => (
                 <div key={product.id} className="min-w-[170px] max-w-[170px] lg:min-w-[200px] lg:max-w-[200px] flex-shrink-0 p-4 hover:shadow-[0_3px_16px_0_rgba(0,0,0,.11)] transition cursor-pointer bg-white group z-10">
                    <Link to={`/product/${product.id}`} className="block text-center text-sm">
                      <div className="h-[150px] w-full flex items-center justify-center mb-4">
                         <img src={product.image} className="max-h-full max-w-full object-contain group-hover:scale-105 transition" alt={product.name} loading="lazy" />
                      </div>
                      <div className="font-medium text-fk-text truncate mb-1">{product.name}</div>
                      <div className="text-fk-green font-normal mb-1">Top Rated</div>
                      <div className="text-fk-gray font-medium">Explore Now</div>
                    </Link>
                 </div>
              ))}
           </div>
        </div>

        {/* Recently Viewed Items based on History */}
        <RecentlyViewed title="Based On Your Viewing History" />

        {/* ABOUT US SECTION */}
        <div id="about" className="bg-white rounded-sm shadow-sm p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 mt-4 border-t border-gray-100">
           <div className="w-full md:w-1/2">
             <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjcSMYEwkeaD-VBL4AVJwCLm-NCBDkslRaAu_PDpq4uougJJENcwSGVcrkfIokdRiSMWQB3xqr6tKrNy071rNpzjzq6AaxBCaXRPdwbRY1XJgD7uiCaaBiCKp-V53Ny7UK6HRm2kJatWV-TBxCJg1EF8CalkL4Q12m-IJDSTjuIcjUhV8ns3MDsxmKevvpl/s1600/452052041_529242162776191_3750077501653396213_n.jpg" alt="Store Front" className="w-full rounded-sm shadow-sm aspect-video object-cover" />
           </div>
           <div className="w-full md:w-1/2 text-[15px] text-[#212121] leading-relaxed relative">
             <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-fk-text relative z-10">About Hunter Mens & Juniors</h2>
             <p className="mb-4 text-fk-gray">From a modest beginning in Namakkal to becoming one of the most trusted fashion hubs in Tamil Nadu, Hunter stands as a testament to quality and style.</p>
             <p className="mb-6 text-fk-gray">We believe that fashion is an extension of your personality. Whether you're dressing up for a boardroom meeting, a casual weekend getaway, or styling your little ones, our curated collections ensure you look exceptional without compromising on comfort.</p>
             <div className="bg-fk-light p-4 border border-gray-100 rounded text-sm text-fk-blue font-medium shadow-sm">
                Established in 2018 | 2 Premium Retail Outlets | Shipping Pan-India
             </div>
           </div>
        </div>

        {/* TRUST SIGNALS */}
        <div className="bg-white rounded-sm shadow-sm p-6 grid grid-cols-2 lg:grid-cols-3 gap-6 text-center mt-4 border-t border-gray-100">
           <div className="flex flex-col items-center gap-3">
             <span className="text-3xl">🛡️</span>
             <h4 className="text-[14px] font-medium text-fk-text">100% Secure</h4>
             <p className="text-[12px] text-fk-gray">Verified Gateway</p>
           </div>
           <div className="flex flex-col items-center gap-3">
             <span className="text-3xl">🚚</span>
             <h4 className="text-[14px] font-medium text-fk-text">Pan-India Delivery</h4>
             <p className="text-[12px] text-fk-gray">Via WhatsApp Order</p>
           </div>
           {/* Rating removed */}
           <div className="flex flex-col items-center gap-3">
             <span className="text-3xl">🔄</span>
             <h4 className="text-[14px] font-medium text-fk-text">Easy Exchange</h4>
             <p className="text-[12px] text-fk-gray">7 Days Policy</p>
           </div>
        </div>

        {/* STORE LOCATOR BANNER */}
        <div className="bg-[#172337] rounded-sm p-6 md:p-8 flex flex-col md:flex-row justify-between items-center text-white mt-4 gap-6">
           <div>
             <h3 className="text-2xl font-bold mb-2">Visit Us In Store</h3>
             <p className="text-gray-400 max-w-xl text-sm">Experience the premium collection in person at our Namakkal and Tiruchengode retail stores. Quality you can touch.</p>
           </div>
           <Link to="/contact" className="bg-white text-fk-blue px-8 py-3 rounded-sm font-bold text-sm shadow shrink-0 w-full md:w-auto text-center">
             Store Locator
           </Link>
        </div>

      </div>
    </div>
  );
}
