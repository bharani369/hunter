import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Phone, MapPin, Sparkles, 
  ArrowRight, Lock, CheckCircle2, 
  ShoppingBag, Loader2, Calendar, 
  ChevronRight, Award, Zap, PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from './ToastContainer';
import { WA_PHONE } from '../data';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, addDoc, collection } from 'firebase/firestore';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
  selectedSize: string;
  selectedColour?: string;
  image: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  singleItemMode?: boolean; // Set to true if checking out directly from the ProductDetails Buy Now button
  onSuccess?: () => void;
}

export default function CheckoutModal({ isOpen, onClose, items, singleItemMode = false, onSuccess }: CheckoutModalProps) {
  const { user } = useAuth();
  const { clearCart } = useCart();
  const { products, updateProduct } = useProducts();
  const showToast = useToast();

  // Contact Info States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Loading States
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'details' | 'redirecting'>('details');
  const [generatedOrderId, setGeneratedOrderId] = useState('');

  // Estimated arrival
  const deliveryDaysText = "2-3 business days";

  // Total Calculations
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalSavings = items.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const loyaltyPointsEarned = Math.round(totalAmount / 10);

  // Fetch saved delivery details on mount
  useEffect(() => {
    if (isOpen) {
      // Set default name from auth first
      if (user) {
        setName(user.displayName || '');
        
        // Fetch saved profile details
        setLoadingProfile(true);
        const fetchUserData = async () => {
          try {
            const docRef = doc(db, 'users', user.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              const data = snap.data();
              if (data.phone) setPhone(data.phone);
              if (data.address) setAddress(data.address);
              if (data.fullName && !user.displayName) setName(data.fullName);
            }
          } catch (err) {
            console.error('Error fetching user data for checkout', err);
          } finally {
            setLoadingProfile(false);
          }
        };
        fetchUserData();
      } else {
        // Reset states for guest checking
        setName('');
        setPhone('');
        setAddress('');
      }
      setStep('details');
    }
  }, [isOpen, user?.uid]);

  // Handle automatic redirect effect
  useEffect(() => {
    if (step === 'redirecting') {
      handleFinalWhatsAppRedirect();
    }
  }, [step]);

  if (!isOpen) return null;

  // Helper to compile a crystal-clear, emoji-compatible message text for WhatsApp
  const getWhatsAppMessageText = (orderId: string) => {
    let msg = `*Hi Hunter! I have placed an order and want to verify it!🛒*\n\n`;
    msg += `👤 *Customer Details:*\n`;
    msg += `🔹 *Name:* ${name.trim()}\n`;
    msg += `🔹 *Phone:* ${phone.trim()}\n`;
    msg += `🔹 *Address:* ${address.trim()}\n\n`;
    
    if (orderId) {
      msg += `🆔 *Order ID:* #${orderId}\n\n`;
    }

    msg += `📦 *Order Items:*\n`;
    items.forEach((item, index) => {
      msg += `${index + 1}. *${item.name}*\n`;
      msg += `   - Size: ${item.selectedSize}\n`;
      if (item.selectedColour) msg += `   - Colour: ${item.selectedColour}\n`;
      msg += `   - Quantity: ${item.quantity}\n`;
      msg += `   - Price: Rs. ${item.price * item.quantity}\n\n`;
    });

    msg += `💰 *Summary:*\n`;
    msg += `- *Subtotal:* Rs. ${totalAmount}\n`;
    msg += `- *Delivery:* FREE 🚚\n`;
    msg += `- *Total Savings:* Rs. ${totalSavings} (Save ${Math.round((totalSavings / (totalAmount + totalSavings)) * 100) || 0}%)\n\n`;
    msg += `Looking forward to quick delivery confirmation! Thank you, Hunter! 🏹`;
    return msg;
  };

  // Helper to open or redirect to WhatsApp immediately & bypass popup blockers
  const redirectToWhatsApp = (orderId: string) => {
    const msg = getWhatsAppMessageText(orderId);
    const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
    
    // Check if we are inside an iframe environment (e.g. AI Studio development environment preview)
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  // Handle final redirect logic
  const handleFinalWhatsAppRedirect = () => {
    // Reset checkout status/triggers
    onClose();
    if (onSuccess) {
      onSuccess();
    }

    // Redirect
    redirectToWhatsApp(generatedOrderId);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      showToast('Please enter a valid phone number');
      return;
    }
    if (!address.trim() || address.trim().length < 15) {
      showToast('Please enter a complete delivery address (min 15 chars)');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Stock reduction validation & update
      for (const item of items) {
        const prod = products.find(p => p.id === item.id);
        if (prod && prod.stock !== undefined && prod.stock < item.quantity) {
          showToast(`Not enough stock for ${item.name}! Only ${prod.stock} left.`);
          setIsSubmitting(false);
          return;
        }
      }

      // Update actual product stocks
      for (const item of items) {
        const prod = products.find(p => p.id === item.id);
        if (prod && prod.stock !== undefined) {
          await updateProduct(prod.id, { stock: prod.stock - item.quantity });
        }
      }

      // 2. Award loyalty points and save checkout address back to profile (if logged in)
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          let existingPoints = 0;
          if (snap.exists()) {
            existingPoints = snap.data().loyaltyPoints || 0;
          }
          const updatedPoints = existingPoints + loyaltyPointsEarned;

          // Save address, phone, points back to user profile
          await setDoc(userDocRef, {
            fullName: name.trim(),
            address: address.trim(),
            phone: phone.trim(),
            loyaltyPoints: updatedPoints,
            lastUpdated: new Date().toISOString()
          }, { merge: true });

          // No loyalty points toast as requested

        } catch (err) {
          console.error("Failed to update user profile loyalty coordinates", err);
        }
      }

      // 3. Create full Order document in Firestore
      let newOrderId = Math.random().toString(36).substring(2, 8).toUpperCase();
      try {
        const newOrder = {
          userId: user?.uid || 'guest',
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          items: items.map(i => ({
            productId: i.id,
            name: i.name,
            size: i.selectedSize,
            colour: i.selectedColour || '',
            quantity: i.quantity,
            price: i.price,
            image: i.image
          })),
          totalAmount,
          status: 'Ordered',
          datePlaced: new Date().toISOString(),
          expectedText: 'Delivery in 2-3 days',
          loyaltyPointsEarned
        };
        const orderDoc = await addDoc(collection(db, 'orders'), newOrder);
        newOrderId = orderDoc.id;
      } catch (err) {
        console.error("Firestore database order log failed", err);
      }

      setGeneratedOrderId(newOrderId);

      // 4. Clear cart if triggered in cart flow, not single-buy flow
      if (!singleItemMode && clearCart) {
        clearCart();
      }

      // Automatically & immediately redirect or open WhatsApp!
      redirectToWhatsApp(newOrderId);

      // Initiate gorgeous transition
      setStep('redirecting');

    } catch (err) {
      console.error(err);
      showToast('An error occurred during order routing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        
        {/* Full-Screen Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step === 'details' ? onClose : undefined}
          className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        {/* Floating Ambient Cool Animated Glow Blobs (Behind the popup) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0.15, 0.35, 0.15], scale: [1, 1.25, 1], x: [0, 45, 0], y: [0, -35, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[320px] h-[320px] rounded-full bg-yellow-400/30 blur-[110px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.3, 1], x: [0, -50, 0], y: [0, 45, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full bg-yellow-300/20 blur-[120px]"
          />
        </div>
 
        {/* Modal Window Container (Premium Yellow-White Crystal Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="w-full max-w-lg rounded-2xl relative z-10 overflow-hidden bg-gradient-to-br from-yellow-400/80 via-white/95 to-yellow-50/90 backdrop-blur-3xl border border-white/60 text-neutral-900 shadow-[0_20px_60px_rgba(234,179,8,0.3)] flex flex-col my-auto max-h-[96vh] md:max-h-[85vh]"
        >
          {/* Animated laser-thin flowing top accent bar */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" />

          {/* STEP A: MAIN DETAILS CAPTURE */}
          {step === 'details' ? (
            <div className="w-full p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-yellow-400/30 border border-yellow-400/40 block">
                    <ShoppingBag className="w-5 h-5 text-yellow-700 animate-pulse" />
                  </span>
                  <span>Order Information</span>
                </h2>

                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                  {/* CUSTOMER NAME FIELD */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950/80 flex items-center gap-1.5 pl-1">
                      <User className="w-3.5 h-3.5 text-yellow-600" />
                      Full Name / Receiver Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Bharani Kumar"
                        className="w-full pl-4 pr-4 py-3 bg-white/70 backdrop-blur-md border border-yellow-300/60 rounded-xl focus:bg-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-300 text-sm text-neutral-900 placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  {/* PHONE NUMBER FIELD */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950/80 flex items-center gap-1.5 pl-1">
                      <Phone className="w-3.5 h-3.5 text-yellow-600" />
                      Contact Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full pl-4 pr-4 py-3 bg-white/70 backdrop-blur-md border border-yellow-300/60 rounded-xl focus:bg-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-300 text-sm text-neutral-900 placeholder:text-zinc-400"
                      />
                    </div>
                  </div>

                  {/* ADDRESS FIELD */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-amber-950/80 flex items-center gap-1.5 pl-1">
                      <MapPin className="w-3.5 h-3.5 text-yellow-600" />
                      Complete Shipping/Delivery Address
                    </label>
                    <div className="relative">
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="No. 12, Hunter Showroom Road, Anna Nagar West, Chennai, Tamil Nadu - 600040"
                        className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-yellow-300/60 rounded-xl focus:bg-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all duration-300 text-sm text-neutral-900 resize-none leading-relaxed placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer buttons section */}
              <div className="mt-8 pt-4 border-t border-yellow-300/40 flex flex-col sm:flex-row gap-3 items-center justify-end">
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-3 rounded-xl border border-yellow-400/40 hover:border-yellow-500 hover:bg-yellow-500/10 transition text-sm font-semibold text-amber-950 flex-1 sm:flex-none"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting || loadingProfile}
                    className="px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 active:scale-[0.98] text-black font-extrabold uppercase shadow-md shadow-yellow-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 flex-1 sm:flex-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Place & Order via WhatsApp</span>
                        <ArrowRight className="w-4 h-4 text-black" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STEP B: SPLENDID SUCCESS REDIRECTING DASHBOARD (Glassmorphic) */
            <div className="w-full p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden bg-white/20 backdrop-blur-2xl min-h-[450px]">
              {/* Cosmic animating backdrop bubbles inside the container */}
              <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                <div className="absolute w-[200px] h-[200px] rounded-full bg-yellow-400/20 blur-[60px] -top-10 -left-10 animate-pulse" />
                <div className="absolute w-[180px] h-[180px] rounded-full bg-yellow-300/15 blur-[80px] -bottom-10 -right-10 animate-pulse" />
              </div>

              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative z-10"
              >
                {/* Floating Success Verification badge */}
                <div className="w-20 h-20 rounded-full bg-emerald-550/10 border-4 border-emerald-500/25 flex items-center justify-center mx-auto mb-6 relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                  </motion.div>
                  {/* Floating particles wrapper */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="absolute -inset-2 border-2 border-dashed border-emerald-500/20 rounded-full" 
                  />
                </div>

                <div className="space-y-2 mb-8 max-w-lg mx-auto">
                  <h3 className="text-2xl md:text-3xl font-black text-amber-950 tracking-tight leading-normal">
                    Order Saved Successfully!
                  </h3>
                  <p className="text-zinc-700 text-sm md:text-base leading-relaxed px-4">
                    Your details have been locked into the Hunter live server. Redirecting you to WhatsApp to coordinate final delivery with our executives.
                  </p>
                </div>

                {/* Delivery card specifications visualization (Glass Styled) */}
                <div className="bg-white/60 backdrop-blur-md border border-yellow-300/40 rounded-2xl p-4 md:px-8 max-w-md mx-auto mb-10 flex gap-4 text-left items-center">
                  <div className="w-12 h-12 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center shrink-0">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-yellow-800 font-mono tracking-wider uppercase font-bold">RECEIVER ADDRESS MATCH</p>
                    <p className="text-xs text-amber-950 font-bold truncate mt-0.5">{name} ({phone})</p>
                    <p className="text-[11px] text-zinc-650 line-clamp-1 mt-0.5">{address}</p>
                  </div>
                </div>

                {/* WhatsApp Button Trigger */}
                <div className="space-y-4 max-w-sm mx-auto">
                  <button
                    onClick={handleFinalWhatsAppRedirect}
                    className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 text-[15px] hover:scale-[1.01] active:scale-[0.99] transition duration-300"
                  >
                    <PhoneCall className="w-5 h-5 text-white" />
                    <span>Open WhatsApp Chat Now</span>
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
