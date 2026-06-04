import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { REVIEWS } from '../data';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import HeroBanner from '../components/HeroBanner';
import WelcomePopup from '../components/WelcomePopup';

// Add these imports at the top
import shirtingImg from '../assets/images/shirting_3d_1780557656110.png';
import juniorsImg from '../assets/images/juniors_3d_1780557673426.png';

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

export default function Home() {
  const { products } = useProducts();
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 24 * 60 * 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')} Left`;
  };

  return (
    <div className="bg-fk-light w-full min-h-screen">
      <WelcomePopup />
      <div className="max-w-[1248px] mx-auto px-2 lg:px-4 py-2 lg:py-4 space-y-2 lg:space-y-4">
        
        {/* TOP BANNER */}
        <div className="relative w-full max-w-full lg:max-w-[768px] mx-auto auto-rows-auto overflow-hidden rounded-sm mb-4">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg3QQyrSp_Rtj0ybVuuzh-Ujc1HgkFS6xu5u0iToW1Kt0t7ys3JN3yRH09WaHH_tJHSdBWbcublgRjtk_qCvknDCbXaSAObcgHNVroyjcZxRFieee3Xj_4RIWHZy7sVq5jxDMTKLKwe5Q6h6W65rjuDMNimJbm7Ce49jhyDfP5NOq7qP_M-qhCvF8btXrZY/s1600/unnamed%20(1)yr5y.jpg" 
            alt="Top Banner" 
            className="w-full h-auto object-cover opacity-90"
          />
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

        {/* DEAL OF THE DAY */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mt-4">
           {/* Header */}
           <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                 <h2 className="text-[18px] lg:text-[22px] font-medium text-fk-text">Deal of the Day</h2>
                 <div className="flex items-center gap-2 text-fk-gray text-[14px]">
                    <span className="text-lg">⏱️</span>
                    <span className="font-medium text-fk-red">{formatTime(timeLeft)}</span>
                 </div>
              </div>
              <Link to="/shop" className="hidden lg:block bg-fk-blue text-white px-4 py-2 rounded-sm font-medium text-[13px] shadow">VIEW ALL</Link>
           </div>
           {/* Horizontal scroll grid */}
           <div className="flex overflow-x-auto scrollbar-hide space-x-0 divide-x divide-gray-100 border-b border-gray-100 relative pb-1">
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
              {/* Background 3D Image on the right side at 70% opacity filling the right side */}
              <img 
                 src={shirtingImg} 
                 alt="Best Shirting 3D Showcase" 
                 referrerPolicy="no-referrer"
                 className="absolute right-0 top-0 h-full w-[48%] sm:w-[45%] md:w-[40%] object-contain object-right opacity-70 z-0 select-none pointer-events-none transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-700 ease-out" 
              />
              {/* Fade in left side: dark blue gradient masking to transparent of the right side */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#102A43] via-[#102A43]/90 md:via-[#102A43]/70 to-transparent z-10 pointer-events-none" />
              
              {/* Left Column: Content */}
              <div className="relative h-full flex flex-col justify-center pl-4 sm:pl-8 md:pl-10 z-20">
                 <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#fff200] mb-1">Elite Collection</span>
                 <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-1">Best Shirting</h3>
                 <p className="font-bold text-[10px] sm:text-sm text-blue-100 bg-white/10 backdrop-blur-sm self-start px-2.5 py-0.5 rounded border border-white/10 mb-3">Under ₹599</p>
                 <div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-[#fff200] hover:bg-[#fff200]/90 text-[#1A1A5E] hover:shadow-lg px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm transition-all duration-300 inline-block">Explore Collection</span>
                 </div>
              </div>
           </Link>

           <Link to="/shop" className="block rounded-lg shadow-md overflow-hidden aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/6] relative group bg-[#5C200B] border border-orange-950/20">
              {/* Background 3D Image on the right side at 70% opacity filling the right side */}
              <img 
                 src={juniorsImg} 
                 alt="Juniors Wear 3D Showcase" 
                 referrerPolicy="no-referrer"
                 className="absolute right-0 top-0 h-full w-[48%] sm:w-[45%] md:w-[40%] object-contain object-right opacity-70 z-0 select-none pointer-events-none transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-700 ease-out" 
              />
              {/* Fade in left side: dark bronze/orange gradient masking to transparent of the right side */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5C200B] via-[#5C200B]/90 md:via-[#5C200B]/70 to-transparent z-10 pointer-events-none" />
              
              {/* Left Column: Content */}
              <div className="relative h-full flex flex-col justify-center pl-4 sm:pl-8 md:pl-10 z-20">
                 <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#fff200] mb-1">Trending Styles</span>
                 <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-1">Juniors Wear</h3>
                 <p className="font-bold text-[10px] sm:text-sm text-orange-100 bg-white/10 backdrop-blur-sm self-start px-2.5 py-0.5 rounded border border-white/10 mb-3">Fresh New Arrivals</p>
                 <div>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-[#fff200] hover:bg-[#fff200]/90 text-[#1A1A5E] hover:shadow-lg px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm transition-all duration-300 inline-block">View Kids Store</span>
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

        {/* TRUST SIGNALS */}
        <div className="bg-white rounded-sm shadow-sm p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-4 border-t border-gray-100">
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
           <div className="flex flex-col items-center gap-3">
             <span className="text-3xl">⭐</span>
             <h4 className="text-[14px] font-medium text-fk-text">4.8 Rated</h4>
             <p className="text-[12px] text-fk-gray">8771+ Reviews</p>
           </div>
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
