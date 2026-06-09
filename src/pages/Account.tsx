import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LazyImage } from '../components/LazyImage';
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-logger';
import { 
  User as UserIcon, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  LogOut, 
  Edit, 
  Check, 
  ChevronRight, 
  Smartphone, 
  Mail, 
  FileText, 
  Package, 
  Trash2,
  Calendar,
  Crown,
  Award,
  Gift,
  Sparkles
} from 'lucide-react';
import { WA_PHONE } from '../data';

// Local storage key for custom user details
const LOCAL_PROFILE_KEY = 'hunter_custom_profile';

interface CustomProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | '';
  loyaltyPoints?: number;
}

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Account() {
  useDocumentTitle('My Account');
  const { user, logout } = useAuth();
  const { items, removeFromCart, updateQuantity, addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'cart'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile Form state
  const [profile, setProfile] = useState<CustomProfile>({
    firstName: 'Guest',
    lastName: 'Hunter',
    phone: '',
    email: '',
    gender: '',
    loyaltyPoints: 0,
  });

  // Load profile from firestore or local storage
  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists() && active) {
            const data = snap.data();
            const loadedProfile: CustomProfile = {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              phone: data.phone || '',
              email: data.email || '',
              gender: data.gender || '',
              loyaltyPoints: data.loyaltyPoints || 0,
            };
            setProfile(loadedProfile);
            localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(loadedProfile));
            return;
          }
        } catch (error) {
          console.error("Error fetching profile from Firestore", error);
        }
      }

      // Fallback to local storage or defaults
      const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (saved && active) {
        try {
          const parsed = JSON.parse(saved);
          setProfile({
            firstName: parsed.firstName || '',
            lastName: parsed.lastName || '',
            phone: parsed.phone || '',
            email: parsed.email || '',
            gender: parsed.gender || '',
            loyaltyPoints: parsed.loyaltyPoints || 0,
          });
        } catch (e) {
          console.error(e);
        }
      } else if (user && active) {
        const names = user.displayName?.split(' ') || ['Guest', 'Hunter'];
        setProfile({
          firstName: names[0] || 'Guest',
          lastName: names.slice(1).join(' ') || 'Hunter',
          phone: user.phoneNumber || '',
          email: user.email || '',
          gender: '',
          loyaltyPoints: 0,
        });
      }
    };

    fetchProfile();
    return () => {
      active = false;
    };
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));

    // Save/update to firestore if logged in
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          email: profile.email,
          gender: profile.gender,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error("Error saving profile to Firestore", error);
      }
    }

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Real-time Orders history
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // map db values to expected values if needed
        date: new Date(doc.data().datePlaced).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      })).sort((a: any, b: any) => new Date(b.datePlaced).getTime() - new Date(a.datePlaced).getTime());
      setOrders(ordersList);
    }, (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, 'orders');
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="bg-[#F1F3F6] min-h-screen py-4 lg:py-8">
      <div className="max-w-[1248px] mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar Menu */}
          <div className="w-full lg:w-[280px] shrink-0 space-y-4">
            
            {/* User Greeting Card */}
            <div className="bg-white p-4 rounded-sm shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-[#E1F5FE]">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-xl font-bold text-fk-blue shrink-0">
                    {(profile.firstName?.[0] || 'H').toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400">Hello,</p>
                <h3 className="font-semibold text-fk-text leading-tight text-base truncate max-w-[180px]">
                  {profile.firstName} {profile.lastName}
                </h3>
              </div>
            </div>

            {/* Menu Options Bar */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden text-sm">
              
              {/* Account details tab */}
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 transition-colors ${activeTab === 'profile' ? 'bg-[#F2F8FD] font-bold text-fk-blue' : 'text-fk-text'}`}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-fk-blue" />
                  <span>Profile Information</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {/* My Orders tab */}
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 transition-colors ${activeTab === 'orders' ? 'bg-[#F2F8FD] font-bold text-fk-blue' : 'text-fk-text'}`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-fk-blue" />
                  <span>My Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#fb641b]/10 text-[#fb641b] text-xs px-2 py-0.5 rounded-full font-semibold">Active</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              </button>

              {/* My Wishlist tab */}
              <button 
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 transition-colors ${activeTab === 'wishlist' ? 'bg-[#F2F8FD] font-bold text-fk-blue' : 'text-fk-text'}`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-fk-blue" />
                  <span>My Wishlist</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-semibold">{wishlistItems.length}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              </button>

              {/* My Cart Tab */}
              <button 
                onClick={() => setActiveTab('cart')}
                className={`w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 transition-colors ${activeTab === 'cart' ? 'bg-[#F2F8FD] font-bold text-fk-blue' : 'text-fk-text'}`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-fk-blue" />
                  <span>My Cart</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-fk-yellow/20 text-[#D77F14] text-xs px-2 py-0.5 rounded-full font-semibold">{items.length}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </div>
              </button>

              {/* Log Out */}
              {user && (
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left p-4 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Main Panel */}
          <div className="flex-1 bg-white rounded-sm shadow-sm p-4 lg:p-8 min-h-[500px]">
            
            {/* Header / Heading Banner */}
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-fk-text capitalize">
                {activeTab === 'profile' && 'Personal Information'}
                {activeTab === 'orders' && 'Order History'}
                {activeTab === 'wishlist' && 'Saved Wishlist'}
                {activeTab === 'cart' && 'My Active Cart'}
              </h2>
              <p className="text-xs text-fk-gray">
                {activeTab === 'profile' && 'Update your profile information and contact details'}
                {activeTab === 'orders' && 'Real-time status of your recently purchased orders'}
                {activeTab === 'wishlist' && 'Products that you saved to purchase later'}
                {activeTab === 'cart' && 'View products currently in your cart'}
              </p>
            </div>

            {/* TAB CONTENT: PROFILE */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                {saveSuccess && (
                  <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-sm text-sm font-semibold flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Profile updated successfully! Information saved locally.</span>
                  </div>
                )}



                <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  {/* Name section */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-base font-bold text-fk-text">Personal Information</h3>
                      {!isEditing && (
                        <button 
                          type="button" 
                          onClick={() => setIsEditing(true)}
                          className="text-fk-blue font-semibold hover:underline flex items-center gap-1 text-sm bg-blue-50 px-2 py-0.5 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-fk-gray mb-1 font-medium">First Name</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={profile.firstName || ''}
                          onChange={e => setProfile({...profile, firstName: e.target.value})}
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 outline-none focus:border-fk-blue transition disabled:bg-gray-50 text-sm font-semibold disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-fk-gray mb-1 font-medium">Last Name</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={profile.lastName || ''}
                          onChange={e => setProfile({...profile, lastName: e.target.value})}
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 outline-none focus:border-fk-blue transition disabled:bg-gray-50 text-sm font-semibold disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender selection */}
                  <div>
                    <span className="block text-xs text-fk-gray mb-2 font-medium">Your Gender</span>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-fk-text">
                        <input 
                          type="radio" 
                          name="gender" 
                          disabled={!isEditing}
                          checked={profile.gender === 'male'}
                          onChange={() => setProfile({...profile, gender: 'male'})}
                          className="w-4 h-4 text-fk-blue focus:ring-fk-blue disabled:opacity-50"
                        />
                        <span>Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-fk-text">
                        <input 
                          type="radio" 
                          name="gender" 
                          disabled={!isEditing}
                          checked={profile.gender === 'female'}
                          onChange={() => setProfile({...profile, gender: 'female'})}
                          className="w-4 h-4 text-fk-blue focus:ring-fk-blue disabled:opacity-50"
                        />
                        <span>Female</span>
                      </label>
                    </div>
                  </div>

                  {/* Contact section */}
                  <div className="pt-4 border-t border-gray-50 space-y-4">
                    <h3 className="text-base font-bold text-fk-text">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-fk-gray mb-1 font-medium">Email Address</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            disabled={!isEditing}
                            value={profile.email || ''}
                            onChange={e => setProfile({...profile, email: e.target.value})}
                            className="w-full border border-gray-200 rounded-sm pl-10 pr-4 py-2.5 outline-none focus:border-fk-blue transition disabled:bg-gray-50 text-sm font-semibold disabled:text-gray-500"
                            placeholder="your.email@gmail.com"
                          />
                          <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-fk-gray mb-1 font-medium">Mobile (WhatsApp No.)</label>
                        <div className="relative">
                          <input 
                            type="tel" 
                            disabled={!isEditing}
                            value={profile.phone || ''}
                            onChange={e => setProfile({...profile, phone: e.target.value})}
                            className="w-full border border-gray-200 rounded-sm pl-10 pr-4 py-2.5 outline-none focus:border-fk-blue transition disabled:bg-gray-50 text-sm font-semibold disabled:text-gray-500"
                            placeholder="e.g. 9876543210"
                            maxLength={10}
                          />
                          <Smartphone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <button 
                        type="submit" 
                        className="bg-fk-blue hover:bg-fk-blue/90 text-white font-bold px-6 py-2 rounded-sm shadow-sm text-sm"
                      >
                        Save Details
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="border border-gray-300 font-bold hover:bg-gray-50 px-6 py-2 rounded-sm text-sm text-fk-text"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>


              </div>
            )}

            {/* TAB CONTENT: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                {/* Current Orders Section */}
                <div>
                  <h3 className="text-lg font-bold text-fk-text mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-fk-blue">local_shipping</span>
                    Current Active Orders
                  </h3>
                  <div className="space-y-6">
                    {orders.filter(o => !o.status.includes('Delivered')).map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-sm hover:shadow-md transition">
                        
                        {/* Order header information */}
                        <div className="bg-blue-50/50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 text-xs text-fk-gray">
                          <div className="flex gap-4">
                            <div>
                              <p className="uppercase">Order ID</p>
                              <span className="font-bold text-fk-text text-sm uppercase">{order.id}</span>
                            </div>
                            <div>
                              <p className="uppercase">Date Placed</p>
                              <span className="font-bold text-fk-text text-sm">{order.date}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="uppercase">WhatsApp Support</p>
                            <a 
                              href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(`Hi Hunter! I want to check order with ID ${order.id}`)}`}
                              target="_blank" 
                              rel="noreferrer"
                              className="text-fk-blue font-bold hover:underline block"
                            >
                              Message on WhatsApp
                            </a>
                          </div>
                        </div>

                        {/* Order products list */}
                        <div className="divide-y divide-gray-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                              <div className="flex gap-3">
                                <LazyImage src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-gray-100 rounded-sm shadow-sm" wrapperClassName="shrink-0" />
                                <div>
                                  <h4 className="font-semibold text-fk-text text-sm line-clamp-1">{item.name}</h4>
                                  <p className="text-xs text-fk-gray mt-1">Size: <span className="text-fk-text font-medium">{item.size}</span> | Colour: <span className="text-fk-text font-medium">{item.colour}</span></p>
                                  <p className="text-xs text-fk-gray">Quantity: <span className="text-fk-text font-medium">{item.quantity}</span></p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:items-end gap-2 text-right">
                                <span className="font-bold text-fk-text text-sm">₹{item.price * item.quantity}</span>
                                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-[pulse_1s_ease-in-out_infinite]"></span>
                                  <span className="text-xs font-bold text-amber-700">{order.status}</span>
                                </div>
                                <span className="text-[11px] text-fk-gray font-medium">{order.expectedText}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Status Tracker */}
                        <div className="px-4 py-6 bg-white border-t border-gray-100 mt-2">
                           <div className="relative max-w-sm ml-auto mr-auto sm:ml-0">
                             <div className="overflow-hidden h-[4px] mb-4 text-xs flex rounded-full bg-gray-200">
                               <div style={{ width: "60%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-fk-blue"></div>
                             </div>
                             <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-gray-400 absolute w-full top-[-10px] sm:top-[-11px]">
                               <div className="text-fk-blue relative flex flex-col items-center">
                                 <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-fk-blue rounded-full shadow-sm mb-1 z-10 mx-auto"></div>
                                 <span className="mt-1 whitespace-nowrap flex leading-none pt-1">Ordered</span>
                               </div>
                               <div className="text-fk-blue relative flex flex-col items-center">
                                 <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-fk-blue rounded-full shadow-sm mb-1 z-10 mx-auto"></div>
                                 <span className="mt-1 whitespace-nowrap flex leading-none pt-1">Shipped</span>
                               </div>
                               <div className="relative flex flex-col items-center opacity-40">
                                 <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 rounded-full shadow-sm mb-1 z-10 mx-auto"></div>
                                 <span className="mt-1 whitespace-nowrap flex leading-none pt-1">Out for Delivery</span>
                               </div>
                               <div className="relative flex flex-col items-center opacity-40">
                                 <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-gray-300 rounded-full shadow-sm mb-1 z-10 mx-auto"></div>
                                 <span className="mt-1 whitespace-nowrap flex leading-none pt-1">Delivered</span>
                               </div>
                             </div>
                           </div>
                        </div>

                        {/* Order Footer with Action Buttons */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-sm">
                          <Link 
                            to="/track"
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-fk-text font-bold px-4 py-2 rounded-sm text-xs transition"
                          >
                            Real-time Track Status
                          </Link>
                          <a 
                            href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(`Hi Hunter! I have a question regarding order HW98246`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-fk-blue hover:bg-fk-blue/90 text-white font-bold px-4 py-2 rounded-sm text-xs transition flex items-center justify-center"
                          >
                            Help Support
                          </a>
                        </div>
                      </div>
                    ))}
                    {orders.filter(o => !o.status.includes('Delivered')).length === 0 && (
                      <div className="text-center py-6 text-gray-500 text-sm font-medium bg-gray-50 rounded border border-gray-100">
                        No active orders at the moment.
                      </div>
                    )}
                  </div>
                </div>

                {/* Past Orders Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-fk-text mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">task_alt</span>
                    Past Order History
                  </h3>
                  <div className="space-y-6">
                    {orders.filter(o => o.status.includes('Delivered')).map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-sm hover:shadow-md transition opacity-80 hover:opacity-100">
                        {/* Order header information */}
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 text-xs text-fk-gray">
                          <div className="flex gap-4">
                            <div>
                              <p className="uppercase">Order ID</p>
                              <span className="font-bold text-fk-text text-sm uppercase">{order.id}</span>
                            </div>
                            <div>
                              <p className="uppercase">Date Placed</p>
                              <span className="font-bold text-fk-text text-sm">{order.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order products list */}
                        <div className="divide-y divide-gray-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                              <div className="flex gap-3">
                                <LazyImage src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-gray-100 rounded-sm grayscale-[0.2]" wrapperClassName="shrink-0" />
                                <div>
                                  <h4 className="font-semibold text-fk-text text-sm line-clamp-1">{item.name}</h4>
                                  <p className="text-xs text-fk-gray mt-1">Size: <span className="text-fk-text font-medium">{item.size}</span> | Colour: <span className="text-fk-text font-medium">{item.colour}</span></p>
                                  <p className="text-xs text-fk-gray">Quantity: <span className="text-fk-text font-medium">{item.quantity}</span></p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:items-end gap-2 text-right">
                                <span className="font-bold text-fk-text text-sm">₹{item.price * item.quantity}</span>
                                <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                                  <span className="text-xs font-bold text-green-700">{order.status}</span>
                                </div>
                                <span className="text-[11px] text-fk-gray font-medium">{order.expectedText}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 rounded-b-sm">
                          <button className="bg-fk-blue hover:bg-[#1a50b5] text-white font-bold px-4 py-2 rounded-sm text-xs transition flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">refresh</span> Buy Again
                          </button>
                        </div>
                      </div>
                    ))}
                    {orders.filter(o => o.status.includes('Delivered')).length === 0 && (
                      <div className="text-center py-6 text-gray-500 text-sm font-medium bg-gray-50 rounded border border-gray-100">
                        No past orders found.
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 rounded border border-blue-100 text-xs text-fk-gray leading-5 mt-8">
                   <p className="font-bold text-fk-blue mb-1">💡 Having trouble finding your order?</p>
                   Make sure to track the exact same mobile number you used while placing the order on WhatsApp. For custom designs or wholesale bulk booking, ping us with your bill payment screenshot.
                </div>
              </div>
            )}

            {/* TAB CONTENT: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16 text-fk-gray">
                     <div className="text-5xl mb-3">❤️</div>
                     <p className="font-bold text-[#212121] text-base mb-1">Your Wishlist is Empty</p>
                     <p className="text-xs mb-6">Explore shirts & outfits and instantly keep them noted!</p>
                     <Link to="/shop" className="bg-[#fb641b] hover:bg-[#ea5c19] text-white font-bold px-8 py-2.5 rounded-sm shadow-sm text-xs transition uppercase">Show Shirts</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wishlistItems.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-sm p-4 hover:shadow-md transition relative flex gap-4">
                        <LazyImage src={product.image} alt={product.name} className="w-20 h-20 object-cover border border-gray-100 rounded-sm" wrapperClassName="shrink-0" />
                        <div className="flex-grow min-w-0 pr-8">
                          <span className="text-[11px] bg-fk-blue/10 text-fk-blue text-xs font-semibold px-2 py-0.5 rounded uppercase">{product.tag || 'Trending'}</span>
                          <h4 className="font-bold text-fk-text text-sm line-clamp-1 mt-1">{product.name}</h4>
                          
                          {product.reviews && product.reviews > 0 ? (
                            <div className="flex items-center gap-2 mt-1">
                               <div className="bg-fk-green text-white text-[11px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                 {product.rating} ★
                               </div>
                               <span className="text-[11px] text-fk-gray">({product.reviews})</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-fk-gray/70 italic mt-1 font-medium">No ratings yet</div>
                          )}
                          
                          <div className="flex items-baseline gap-2 mt-2">
                            <span className="font-bold text-sm">₹{product.price}</span>
                            <span className="text-xs text-fk-gray line-through">₹{product.originalPrice}</span>
                            <span className="text-xs text-emerald-600 font-bold">{Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}% off</span>
                          </div>
                        </div>

                        {/* Remove from Wishlist icon */}
                        <button 
                          onClick={() => toggleWishlist(product)}
                          className="absolute right-3 top-3 text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-full transition"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Option to Add directly to cart */}
                        <div className="absolute right-3 bottom-3">
                          <Link 
                            to={`/product/${product.id}`}
                            className="bg-fk-blue text-white text-xs px-3 py-1.5 rounded-sm hover:bg-fk-blue/90 font-bold"
                          >
                            Buy Now
                          </Link>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MY CART */}
            {activeTab === 'cart' && (
              <div>
                {items.length === 0 ? (
                  <div className="text-center py-16 text-fk-gray">
                     <div className="text-5xl mb-3">🛒</div>
                     <p className="font-bold text-[#212121] text-base mb-1">Your Cart is Empty</p>
                     <p className="text-xs mb-6 font-medium">Add items to order them directly via WhatsApp or UPI.</p>
                     <Link to="/shop" className="bg-[#fb641b] hover:bg-[#ea5c19] text-white font-bold px-8 py-2.5 rounded-sm shadow-sm text-xs transition uppercase">Explore Shop</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="divide-y divide-gray-100">
                      {items.map((item) => (
                        <div key={item.cartId} className="py-4 first:pt-0 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                          <div className="flex gap-4">
                            <LazyImage src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-gray-100 rounded-sm" wrapperClassName="shrink-0" />
                            <div>
                              <h4 className="font-bold text-fk-text text-sm line-clamp-1">{item.name}</h4>
                              <p className="text-xs text-fk-gray mt-1">Size: <span className="text-fk-text font-semibold">{item.selectedSize}</span> {item.selectedColour && <>| Colour: <span className="text-fk-text font-semibold">{item.selectedColour}</span></>}</p>
                              <div className="font-bold text-sm mt-1">₹{item.price} <span className="text-xs text-fk-gray font-normal line-through ml-1">₹{item.originalPrice}</span></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-gray-200 rounded-sm text-sm overflow-hidden bg-white">
                              <button 
                                onClick={() => updateQuantity(item.cartId, Math.max(1, item.quantity - 1))}
                                className="px-2.5 py-1 hover:bg-gray-100 border-r border-gray-200 transition"
                              >
                                -
                              </button>
                              <span className="px-3 font-semibold text-fk-text">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                className="px-2.5 py-1 hover:bg-gray-100 border-l border-gray-200 transition"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove button */}
                            <button 
                              onClick={() => removeFromCart(item.cartId)}
                              className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-sm">
                      <div>
                        <p className="text-xs text-fk-gray font-medium">Total cart value to pay:</p>
                        <span className="text-lg font-bold text-fk-text">
                          ₹{items.reduce((sum, i) => sum + (i.price * i.quantity), 0)}
                        </span>
                      </div>
                      <Link 
                        to="/cart"
                        className="bg-[#fb641b] hover:bg-[#ea5c19] text-white font-bold px-8 py-3 rounded-sm shadow-sm text-xs transition uppercase flex items-center justify-center"
                      >
                        Place Order in Cart
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
