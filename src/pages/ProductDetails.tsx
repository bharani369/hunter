import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Share2, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { WA_PHONE } from '../data';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../components/ToastContainer';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Review } from '../types';
import { useSEO } from '../hooks/useSEO';
import RecentlyViewed from '../components/RecentlyViewed';
import { motion, AnimatePresence } from 'motion/react';
import CheckoutModal from '../components/CheckoutModal';
import { LazyImage } from '../components/LazyImage';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ProductDetails() {
  const { id } = useParams();
  const { products, loading, updateProduct } = useProducts();
  const product = products.find(p => p.id === id);
  useDocumentTitle(product?.name || 'Product');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const showToast = useToast();
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [reviewSort, setReviewSort] = useState('recent');
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Dynamic reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [ratingInput, setRatingInput] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const q = query(collection(db, 'reviews'), where('productId', '==', id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
      setReviewsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `reviews?productId=${id}`);
    });
    return () => unsubscribe();
  }, [id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !product) return;
    if (!authorName.trim()) {
      showToast('Please enter your name to review.');
      return;
    }
    if (!reviewText.trim()) {
      showToast('Please write a review comment.');
      return;
    }
    setIsSubmitting(true);
    try {
      const finalAuthor = authorName.trim();
      const reviewId = doc(collection(db, 'reviews')).id;
      const newReview: Review & { createdAt: string; productId: string; productName: string; userId: string } = {
        id: reviewId,
        productId: id,
        productName: product.name,
        userId: 'guest',
        author: finalAuthor,
        text: reviewText.trim(),
        rating: ratingInput,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        createdAt: new Date().toISOString()
      };

      // Create review in Firestore
      await setDoc(doc(db, 'reviews', reviewId), newReview);

      // Recalculate and update the main product's metrics in real-time
      const updatedReviewsList = [...reviews, newReview];
      const totalRatingSum = updatedReviewsList.reduce((sum, r) => sum + r.rating, 0);
      const newAverageRating = Number((totalRatingSum / updatedReviewsList.length).toFixed(1));
      const newTotalReviews = updatedReviewsList.length;

      await updateProduct(product.id, {
        rating: newAverageRating,
        reviews: newTotalReviews
      });

      showToast('Review submitted successfully!');
      setReviewText('');
      setRatingInput(5);
    } catch (error) {
      console.error('Error adding review:', error);
      showToast('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [id]);



  const allImages = product ? [product.image, ...(product.additionalImages || [])] : [];

  const seoTitle = product ? `${product.name} - Buy Online | Hunter` : 'Product Details | Hunter';
  const seoDesc = product ? `Buy ${product.name} at Hunter. ${product.description ? product.description.substring(0, 100) + '...' : ''}` : 'View product details at Hunter';
  useSEO(seoTitle, seoDesc);

  useEffect(() => {
    setSelectedColour('');
  }, [product]);

  useEffect(() => {
    if (!product) return;
    try {
      const recentlyViewedKey = 'hunter_recently_viewed';
      const stored = localStorage.getItem(recentlyViewedKey);
      let viewedIds: string[] = [];
      if (stored) {
        viewedIds = JSON.parse(stored);
        if (!Array.isArray(viewedIds)) {
          viewedIds = [];
        }
      }
      
      viewedIds = viewedIds.filter((id) => id !== product.id);
      viewedIds.unshift(product.id);
      viewedIds = viewedIds.slice(0, 10);
      
      localStorage.setItem(recentlyViewedKey, JSON.stringify(viewedIds));
    } catch (err) {
      console.error("Error setting recently viewed history:", err);
    }
  }, [product]);

  useEffect(() => {
    if (!product || allImages.length <= 1 || !isAutoPlayEnabled) return;
    
    const interval = setInterval(() => {
      setCurrentSlideIndex(prev => {
        const next = (prev + 1) % allImages.length;
        if (sliderRef.current) {
          const slideWidth = sliderRef.current.clientWidth;
          sliderRef.current.scrollTo({ left: slideWidth * next, behavior: 'smooth' });
        }
        return next;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [allImages.length, isAutoPlayEnabled, product]);

  if (loading) return (
    <div className="bg-fk-light min-h-screen py-2 lg:py-4 w-full">
      <div className="max-w-[1248px] mx-auto px-2 lg:px-4">
        <div className="bg-white shadow-sm flex flex-col md:flex-row rounded-sm overflow-hidden animate-pulse">
          <div className="w-full md:w-[40%] border-r border-[#f0f0f0] p-4 lg:p-8 flex flex-col items-center">
             <div className="w-full aspect-square bg-gray-200 border border-[#f0f0f0] rounded-sm"></div>
             <div className="flex gap-2 w-full mt-4">
               {[...Array(4)].map((_, i) => <div key={i} className="w-16 h-16 shrink-0 bg-gray-200 rounded"></div>)}
             </div>
             <div className="flex gap-2 w-full mt-6">
               <div className="flex-1 h-14 bg-gray-200 rounded-sm"></div>
               <div className="flex-1 h-14 bg-gray-200 rounded-sm"></div>
             </div>
          </div>
          <div className="w-full md:w-[60%] p-4 lg:p-8 space-y-4">
             <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
             <div className="h-6 bg-gray-200 rounded w-3/4"></div>
             <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
             <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
             <div className="h-20 bg-gray-200 rounded w-full mb-6"></div>
             <div className="h-12 bg-gray-200 rounded w-full mb-2"></div>
             <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
  if (!product) return <div className="p-20 text-center">Product not found</div>;

  const isWishlisted = isInWishlist(product.id);

  const displayImage = allImages[currentSlideIndex] || product.image;

  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'highest') {
      return b.rating - a.rating;
    } else if (reviewSort === 'lowest') {
      return a.rating - b.rating;
    } else {
      const dateA = new Date('01 ' + (a.date || '')).getTime();
      const dateB = new Date('01 ' + (b.date || '')).getTime();
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return dateB - dateA;
      }
      return b.id.localeCompare(a.id);
    }
  });

  const handleAddToCart = () => {
    if (product.stock === 0) {
      showToast('Product is out of stock!');
      return;
    }
    if (!selectedSize && product.sizes.length > 0) {
      showToast('Please select a size first');
      return;
    }
    addToCart(product, selectedSize || 'Free Size', 1, selectedColour);
    showToast('Added to cart!');
  };

  const handleBuyNow = () => {
    if (product.stock === 0) {
      showToast('Product is out of stock!');
      return;
    }
    if (!selectedSize && product.sizes.length > 0) {
      showToast('Please select a size first');
      return;
    }
    
    setIsCheckoutOpen(true);
  };

  const handlePincodeCheck = () => {
    if (pincode.startsWith('6')) { // Tamil nadu starts with 6
       setDeliveryMsg('Delivery in 2-3 days by Courier.');
    } else {
       setDeliveryMsg('WhatsApp delivery available. Dispatch in 24 hrs.');
    }
  };

  const fallbackCopyText = (content: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 3000);
    } catch (err) {
      console.error('Fallback copy text execution failed:', err);
    }
  };

  const handleShareWhatsApp = () => {
    if (!product) {
      showToast('Product details are not available yet.');
      return;
    }

    const name = product.name || '';
    const image = product.image || '';
    const price = product.price;
    const originalPrice = product.originalPrice;
    const discount = product.discount;
    const rating = product.rating;

    if (!name || !image) {
      showToast('Product information is incomplete and cannot be shared.');
      return;
    }

    // Safely resolve the image URL
    let imageUrl = '';
    try {
      imageUrl = image.startsWith('http') 
        ? image 
        : `${window.location.origin}${image}`;
    } catch (e) {
      console.error("Failed to parse image path:", e);
      imageUrl = `${window.location.origin}`;
    }

    // Safely get product page URL
    const productUrl = window.location.href;

    // Build parts cleanly
    const namePart = `*${name.trim()}*`;
    const pricePart = price !== undefined ? `₹${price}` : 'N/A';
    const discPart = (originalPrice !== undefined && discount !== undefined) 
      ? ` (From ₹${originalPrice} - ${discount}% Off)` 
      : '';
    const ratingPart = rating !== undefined ? `${rating} ★` : 'N/A';

    // Construct the elegant message body
    const messageLines = [
      'Check out this amazing style on Hunter Mens & Juniors! 🔥',
      '',
      namePart,
      `💰 *Price:* ${pricePart}${discPart}`,
      `⭐ *Rating:* ${ratingPart}`,
      '',
      `📸 *Product Image:* ${imageUrl}`,
      '',
      `👉 *View Product here:* ${productUrl}`
    ];

    const text = messageLines.join('\n');

    // Copy to clipboard elegantly
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => {
            setShareState('copied');
            setTimeout(() => setShareState('idle'), 3000);
          })
          .catch((err) => {
            console.error('Clipboard write failed:', err);
            fallbackCopyText(text);
          });
      } else {
        fallbackCopyText(text);
      }
    } catch (err) {
      console.error('Clipboard copy API error:', err);
      fallbackCopyText(text);
    }

    // Encode properly
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

    // Safely attempt to launch WhatsApp API URI
    try {
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const alternativeLink = document.createElement('a');
        alternativeLink.href = whatsappUrl;
        alternativeLink.target = '_blank';
        alternativeLink.rel = 'noopener noreferrer';
        alternativeLink.click();
      }
    } catch (err) {
      console.error('Error opening WhatsApp share window:', err);
    }
  };

  return (
    <div className="bg-fk-light min-h-screen py-2 lg:py-4 w-full">
      <div className="max-w-[1248px] mx-auto px-2 lg:px-4">
        <div className="bg-white shadow-sm flex flex-col md:flex-row rounded-sm overflow-hidden">
          
           {/* LEFT: IMAGE W/ SLIDESHOW */}
           <div className="w-full md:w-[40%] border-r border-[#f0f0f0] p-4 lg:p-8 flex flex-col items-center">
              <div 
               className="relative w-full max-w-[500px] aspect-square group"
               onMouseEnter={() => setIsHovered(true)} 
               onMouseLeave={() => setIsHovered(false)}
             >
               <div 
                 ref={sliderRef}
                 className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide border border-[#f0f0f0] bg-white rounded-md"
                 onTouchStart={() => setIsAutoPlayEnabled(false)}
                 onScroll={(e) => {
                   const container = e.currentTarget;
                   const index = Math.round(container.scrollLeft / container.clientWidth);
                   if (index !== currentSlideIndex && !isNaN(index)) {
                     setCurrentSlideIndex(index);
                   }
                 }}
               >
                  {allImages.length === 0 ? (
                    <div className="w-full h-full shrink-0 snap-center flex justify-center items-center">
                      <LazyImage src={displayImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" wrapperClassName="w-full h-full flex" />
                    </div>
                  ) : (
                    allImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className="w-full h-full shrink-0 snap-center flex justify-center items-center relative"
                      >
                        <LazyImage 
                          src={img} 
                          alt={`${product.name} - ${idx + 1}`} 
                          className={`w-full h-full object-contain ${isHovered ? 'cursor-crosshair transform origin-center transition-transform duration-200 hover:scale-150' : ''}`}
                          wrapperClassName="w-full h-full flex"
                        />
                      </div>
                    ))
                  )}
               </div>

                {/* Left arrow navigation overlay */}
                {allImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAutoPlayEnabled(false);
                      const next = (currentSlideIndex - 1 + allImages.length) % allImages.length;
                      setCurrentSlideIndex(next);
                      if (sliderRef.current) {
                        sliderRef.current.scrollTo({ left: sliderRef.current.clientWidth * next, behavior: 'smooth' });
                      }
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg border border-gray-150 hover:scale-110 active:scale-90 transition-all duration-200"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                )}

                {/* Right arrow navigation overlay */}
                {allImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAutoPlayEnabled(false);
                      const next = (currentSlideIndex + 1) % allImages.length;
                      setCurrentSlideIndex(next);
                      if (sliderRef.current) {
                        sliderRef.current.scrollTo({ left: sliderRef.current.clientWidth * next, behavior: 'smooth' });
                      }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg border border-gray-150 hover:scale-110 active:scale-90 transition-all duration-200"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                )}
             </div>

             {/* Thumbnails (Manual Scroll) */}
             {allImages.length > 1 && (
               <div className="flex gap-2 w-full mt-4 overflow-x-auto pb-2 justify-start scrollbar-thin scroll-smooth">
                 {allImages.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => {
                       setIsAutoPlayEnabled(false);
                       setCurrentSlideIndex(idx);
                       if (sliderRef.current) {
                         sliderRef.current.scrollTo({ left: sliderRef.current.clientWidth * idx, behavior: 'smooth' });
                       }
                     }}
                     className={`w-16 h-16 shrink-0 border-2 rounded overflow-hidden transition-all duration-200 ${
                       currentSlideIndex === idx 
                         ? 'border-fk-blue scale-[1.03] shadow-md' 
                         : 'border-transparent hover:border-gray-300 opacity-75 hover:opacity-100'
                     }`}
                   >
                     <img src={img} alt={`View ${idx+1}`} className="w-full h-full object-cover" />
                   </button>
                 ))}
               </div>
             )}
             
             {/* CTA Buttons - Two in row */}
             <div className="flex flex-col gap-3 w-full mt-6">
                <button 
                  onClick={handleAddToCart}
                  className="relative overflow-hidden group w-full bg-[#ff9f00] hover:bg-[#fbac21] text-white py-4 rounded-sm font-semibold flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <ShoppingCart className="w-5 h-5 fill-current relative z-10" /> <span className="relative z-10">ADD TO CART</span>
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="relative overflow-hidden group w-full bg-[#fb641b] hover:bg-[#ea5c19] text-white py-4 rounded-sm font-semibold flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <span className="text-xl relative z-10">⚡</span> <span className="relative z-10">BUY NOW</span>
                </button>
                <button 
                  onClick={handleShareWhatsApp}
                  disabled={shareState === 'copied'}
                  className={`hidden relative overflow-hidden group w-full text-white py-4 rounded-sm font-semibold flex justify-center items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] ${
                    shareState === 'copied' ? 'bg-[#0f766e]' : 'bg-[#25D366] hover:bg-[#20ba5a]'
                  }`}
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  
                  <AnimatePresence mode="wait">
                    {shareState === 'copied' ? (
                      <motion.span
                        key="copied-label"
                        initial={{ opacity: 0, y: 12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex items-center gap-2 relative z-10 font-bold"
                      >
                        <Check className="w-5 h-5 text-white animate-[bounce_1.5s_infinite]" />
                        <span>LINK COPIED & SHARE OPENED!</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="share-label"
                        initial={{ opacity: 0, y: -12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.9 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="flex items-center gap-2 relative z-10"
                      >
                        <Share2 className="w-5 h-5 animate-[bounce_2s_infinite]" />
                        <span>SHARE ON WHATSAPP</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
             </div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="w-full md:w-[60%] p-4 lg:p-8">
             <div className="text-[12px] text-[#878787] mb-2 flex items-center gap-2">
               <Link to="/" className="hover:text-fk-blue">Home</Link> &gt; 
               <Link to={`/shop?category=${product.category}`} className="hover:text-fk-blue">{product.category}</Link> &gt; 
               <span>{product.name}</span>
             </div>

             <div className="font-bold text-[18px] text-[#878787] mt-2 mb-1 cursor-pointer hover:text-fk-blue transition">HUNTER</div>
             <div className="flex justify-between items-start mb-2">
               <h1 className="text-[18px] text-[#212121]">{product.name}</h1>
               <button 
                 onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
                 className="p-2 -mt-2 -mr-2 rounded-full hover:bg-gray-100 transition focus:outline-none"
                 title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
               >
                 <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-gray-600'}`} />
               </button>
             </div>
             
             {/* Ratings */}
             {reviews.length > 0 ? (
               <div className="flex items-center gap-2 mb-4">
                  <div className="bg-fk-green text-white text-[12px] px-2 py-0.5 rounded-[3px] font-bold flex items-center gap-1">
                    {product.rating} <span className="text-[10px] leading-none">★</span>
                  </div>
                  <span className="text-[14px] font-medium text-fk-gray">{reviews.length} Ratings & {reviews.length} Reviews</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 mb-4 text-[14px] text-fk-gray font-medium italic">
                 <span>No ratings or reviews yet for this product</span>
               </div>
             )}

             <div className="text-fk-green text-[14px] font-bold mb-1">Extra ₹{product.originalPrice - product.price} off</div>
             <div className="flex items-end gap-3 mb-2">
                <span className="text-[28px] font-medium text-[#212121] leading-none">₹{product.price}</span>
                <span className="text-[16px] text-[#878787] line-through leading-none">₹{product.originalPrice}</span>
                <span className="text-[16px] font-bold text-fk-green leading-none">{product.discount}% off</span>
             </div>
             <div className="text-[14px] text-[#212121] opacity-90 mb-6">inclusive of all taxes</div>

             {/* Offers Removed */}

             {/* Size Selector */}
             {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Free Size" && (
                <div className="mb-6 border-t border-b border-gray-100 py-4">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[14px] text-[#212121]"><span className="text-fk-gray font-medium w-16 inline-block">Size</span> {selectedSize}</span>
                      <span className="text-fk-blue text-[14px] font-medium cursor-pointer">Size Chart</span>
                   </div>
                   <div className="flex flex-wrap gap-3 mt-2 pr-8 pl-[64px]">
                      {product.sizes.map(size => (
                         <button 
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-12 h-10 border text-[14px] font-medium transition flex items-center justify-center ${selectedSize === size ? 'border-fk-blue border-2 text-fk-blue' : 'border-gray-300 text-[#212121] hover:border-fk-blue block'}`}
                         >
                           {size}
                         </button>
                      ))}
                   </div>
                </div>
             )}

             {/* Colour Selector */}
             {false && (
                <div className="mb-6 border-b border-gray-100 pb-4">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[14px] text-[#212121]"><span className="text-fk-gray font-medium w-16 inline-block">Colour</span> {selectedColour}</span>
                   </div>
                   <div className="flex flex-wrap gap-3 mt-2 pr-8 pl-[64px]">
                      {product.colours.map(colour => (
                         <button 
                            key={colour}
                            onClick={() => setSelectedColour(colour)}
                            className={`px-4 h-10 border text-[14px] font-medium transition flex items-center justify-center rounded-sm ${selectedColour === colour ? 'border-fk-blue border-2 text-fk-blue bg-blue-50/50' : 'border-gray-200 text-[#212121] hover:border-fk-blue bg-white'}`}
                         >
                           {colour}
                         </button>
                      ))}
                   </div>
                </div>
             )}



             {/* Services */}
             <div className="flex gap-4 mb-6">
                <div className="text-[14px] text-fk-gray font-medium w-16 xl:w-24">Services</div>
                <ul className="text-[14px] text-[#212121] space-y-2 flex-1">
                  <li className="flex items-center gap-2"><span className="text-[#388E3C] text-lg leading-none">↺</span> 7 Days Replacement Policy</li>
                  <li className="flex items-center gap-2"><span className="text-fk-blue text-lg leading-none">$</span> Cash on Delivery available</li>
                </ul>
             </div>

             {/* Description */}
             {product.description && (
               <div className="flex gap-4 mb-6">
                  <div className="text-[14px] text-fk-gray font-medium w-16 xl:w-24">Description</div>
                  <div className="text-[14px] text-[#212121] flex-1">
                    <p className="whitespace-pre-wrap leading-relaxed">{product.description}</p>
                  </div>
               </div>
             )}

             {/* Stock Status */}
             {product.stock !== undefined && (
               <div className="flex gap-4 mb-6">
                  <div className="text-[14px] text-fk-gray font-medium w-16 xl:w-24">Stock</div>
                  <div className="text-[14px] flex-1">
                    {product.stock > 0 ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium inline-block relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>In Stock ({product.stock} available)</span>
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium inline-block">Out of Stock</span>
                    )}
                  </div>
               </div>
             )}

             {/* Seller Info */}
             <div className="flex gap-4">
                <div className="text-[14px] text-fk-gray font-medium w-16 xl:w-24">Seller</div>
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                     <span className="text-[16px] text-fk-blue font-medium">Hunter Mens & Juniors</span>
                     <div className="bg-fk-blue text-white text-[12px] px-1.5 rounded-full font-bold">4.8★</div>
                   </div>
                   <ul className="list-disc pl-5 text-[14px] space-y-1 mt-2">
                     <li>Premium Original Products</li>
                     <li>Namakkal & Tiruchengode Branches</li>
                   </ul>
                </div>
             </div>
             
          </div>

        </div>

        {/* Reviews Section */}
        <div className="bg-white shadow-sm mt-4 p-4 lg:p-8 rounded-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
             <div className="flex items-center gap-3 flex-wrap">
               <h2 className="text-[24px] font-medium text-[#212121]">Ratings & Reviews</h2>
               <div className="bg-fk-green text-white px-2 py-1 rounded text-lg font-bold flex items-center gap-1 shadow-sm">
                 {product.rating} <Star className="w-4 h-4 fill-current" />
               </div>
               <span className="text-fk-gray text-sm">{reviews.length} Ratings & {reviews.length} Reviews</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[14px] text-fk-gray font-medium whitespace-nowrap">Sort by:</span>
               <select 
                 value={reviewSort}
                 onChange={(e) => setReviewSort(e.target.value)}
                 className="border rounded px-3 py-1.5 text-sm bg-white outline-none cursor-pointer hover:border-fk-blue transition w-40"
               >
                 <option value="recent">Most Recent</option>
                 <option value="highest">Highest Rated</option>
                 <option value="lowest">Lowest Rated</option>
               </select>
             </div>
          </div>

          {/* Write a Review Section */}
          <div className="border border-gray-100 rounded-lg p-5 mb-8 bg-gray-50/50">
            <h3 className="text-[18px] font-semibold text-[#212121] mb-3">Rate & Review this Product</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Star Rating Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Rating</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRatingInput(starValue)}
                        className="p-1 focus:outline-none transition transform hover:scale-110"
                        title={`${starValue} Star${starValue > 1 ? 's' : ''}`}
                      >
                        <Star 
                          className={`w-7 h-7 transition-colors duration-150 ${
                            starValue <= ratingInput 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300 hover:text-yellow-400'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name field */}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Name</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white outline-none focus:border-fk-blue focus:ring-1 focus:ring-fk-blue font-medium text-gray-800"
                    required
                  />
                  </div>
                </div>

              {/* Textarea for review */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Review</label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you like or dislike about this product? Share your real experience!"
                  rows={3}
                  className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white outline-none focus:border-fk-blue focus:ring-1 focus:ring-fk-blue text-gray-800 leading-relaxed"
                  required
                />
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-fk-blue text-white px-5 py-2 rounded text-sm font-semibold hover:bg-opacity-90 transition shadow-sm disabled:bg-gray-400 flex items-center justify-center gap-1.5 min-w-[130px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="grid gap-6">
            {reviewsLoading ? (
              <div className="py-10 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-fk-blue border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading reviews...
              </div>
            ) : sortedReviews.length === 0 ? (
              <div className="py-12 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50/30">
                <p className="font-medium text-gray-600 mb-1">No reviews yet for this product</p>
                <p className="text-sm text-gray-400">Be the first to share your thoughts and rate this product!</p>
              </div>
            ) : (
              sortedReviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 mb-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`text-white text-[12px] px-1.5 py-0.5 rounded-[3px] font-bold flex items-center gap-1 ${review.rating >= 4 ? 'bg-fk-green' : review.rating === 3 ? 'bg-fk-yellow text-black' : 'bg-red-500'}`}>
                      {review.rating} <span className="text-[10px] leading-none">★</span>
                    </div>
                    <span className="font-semibold text-[#212121]">{review.text.substring(0, 40)}{review.text.length > 40 ? '...' : ''}</span>
                  </div>
                  <p className="text-[14px] text-[#212121] mb-3 leading-relaxed opacity-90">{review.text}</p>
                  <div className="flex items-center gap-4 text-[12px] text-[#878787]">
                    <span className="font-medium text-gray-500">{review.author}</span>
                    <span className="pl-4 border-l border-gray-300">{review.date}</span>
                    <div className="ml-auto flex gap-4 text-gray-400">
                      <button className="flex items-center gap-1 hover:text-fk-blue transition"><span className="text-lg leading-none font-sans">👍</span></button>
                      <button className="flex items-center gap-1 hover:text-red-500 transition"><span className="text-lg leading-none font-sans">👎</span></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recently Viewed Items */}
        <RecentlyViewed excludeId={product.id} />

        {/* Dynamic Interactive Checkout Modal Popup */}
        {product && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            singleItemMode={true}
            items={[{
              id: product.id,
              name: product.name,
              price: product.price,
              originalPrice: product.originalPrice,
              discount: product.discount,
              quantity: 1,
              selectedSize: selectedSize || 'Free Size',
              selectedColour: selectedColour,
              image: product.image
            }]}
            onSuccess={() => setIsCheckoutOpen(false)}
          />
        )}

      </div>
    </div>
  );
}
