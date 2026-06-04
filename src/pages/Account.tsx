import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
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
  Calendar
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
}

export default function Account() {
  const { user, logout, showLogin } = useAuth();
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
  });

  // Load profile from local storage or firebase user
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else if (user) {
      const names = user.displayName?.split(' ') || ['Guest', 'Hunter'];
      setProfile({
        firstName: names[0] || 'Guest',
        lastName: names.slice(1).join(' ') || 'Hunter',
        phone: user.phoneNumber || '',
        email: user.email || '',
        gender: '',
      });
    }
  }, [user]);

  // If user log in, sync profile fields
  useEffect(() => {
    if (user && !localStorage.getItem(LOCAL_PROFILE_KEY)) {
      const names = user.displayName?.split(' ') || ['Guest', 'Hunter'];
      setProfile({
        firstName: names[0] || 'Guest',
        lastName: names.slice(1).join(' ') || 'Hunter',
        phone: user.phoneNumber || '',
        email: user.email || '',
        gender: '',
      });
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Simulated Orders history
  const [orders] = useState([
    {
      id: 'HW98246',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Delivered',
      items: [
        { name: 'Premium Cotton Solid Shirt', size: 'M', quantity: 1, price: 899, colour: 'Navy Blue', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=200' }
      ],
      totalPrice: 899,
      expectedText: 'Delivered on Mon, May 31'
    },
    {
      id: 'HW12763',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Shipped - In Transit',
      items: [
        { name: 'Hunter Club Fit Hooded T-Shirt', size: 'L', quantity: 1, price: 999, colour: 'Sunset Maroon', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=200' },
        { name: 'Pure Comfort Cargo Gym Trousers', size: 'XL', quantity: 1, price: 1199, colour: 'Oliver Green', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200' }
      ],
      totalPrice: 2198,
      expectedText: 'Delivered expected by Sunday, Jun 6'
    }
  ]);

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
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerpolicy="no-referrer" />
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
              {user ? (
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
              ) : (
                <button 
                  onClick={showLogin}
                  className="w-full text-left p-4 hover:bg-blue-50 flex items-center gap-3 text-fk-blue transition-colors font-bold"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Login / Sign Up</span>
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
                          value={profile.firstName}
                          onChange={e => setProfile({...profile, firstName: e.target.value})}
                          className="w-full border border-gray-200 rounded-sm px-4 py-2.5 outline-none focus:border-fk-blue transition disabled:bg-gray-50 text-sm font-semibold disabled:text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-fk-gray mb-1 font-medium">Last Name</label>
                        <input 
                          type="text" 
                          disabled={!isEditing}
                          value={profile.lastName}
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
                            value={profile.email}
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
                            value={profile.phone}
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

                {/* Additional Flipkart Style Promo Banner */}
                <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-fk-text text-sm mb-0.5">🚀 Hunter Coins & Rewards</h4>
                    <p className="text-xs text-fk-gray">Earn 5% flat cashback on your custom WhatsApp purchases. Trade them for discounts.</p>
                  </div>
                  <span className="text-[#388E3C] text-lg font-bold">120 Coins</span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-sm hover:shadow-md transition">
                    
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
                      
                      <div className="text-right">
                        <p className="uppercase">WhatsApp Tracking Link</p>
                        <a 
                          href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(`Hi Hunter! I want to check order with ID ${order.id}`)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-fk-blue font-bold hover:underline block"
                        >
                          Help on WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Order products list */}
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                          <div className="flex gap-3">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-gray-100 rounded-sm" />
                            <div>
                              <h4 className="font-semibold text-fk-text text-sm line-clamp-1">{item.name}</h4>
                              <p className="text-xs text-fk-gray mt-1">Size: <span className="text-fk-text font-medium">{item.size}</span> | Colour: <span className="text-fk-text font-medium">{item.colour}</span></p>
                              <p className="text-xs text-fk-gray">Quantity: <span className="text-fk-text font-medium">{item.quantity}</span></p>
                            </div>
                          </div>

                          <div className="flex flex-col sm:items-end gap-2 text-right">
                            <span className="font-bold text-fk-text text-sm">₹{item.price * item.quantity}</span>
                            <div className="flex items-center gap-1">
                              <span className={`w-2.5 h-2.5 rounded-full ${order.status.includes('Delivered') ? 'bg-[#388E3C]' : 'bg-amber-400'}`}></span>
                              <span className="text-xs font-semibold">{order.status}</span>
                            </div>
                            <span className="text-[11px] text-fk-gray">{order.expectedText}</span>
                          </div>
                        </div>
                      ))}
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
                        Help Support (WhatsApp)
                      </a>
                    </div>

                  </div>
                ))}

                <div className="p-4 bg-blue-50/50 rounded border border-blue-100 text-xs text-fk-gray leading-5">
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
                        <img src={product.image} alt={product.name} className="w-20 h-20 object-cover border border-gray-100 rounded-sm shrink-0" />
                        <div className="flex-grow min-w-0 pr-8">
                          <span className="text-[11px] bg-fk-blue/10 text-fk-blue text-xs font-semibold px-2 py-0.5 rounded uppercase">{product.tag || 'Trending'}</span>
                          <h4 className="font-bold text-fk-text text-sm line-clamp-1 mt-1">{product.name}</h4>
                          
                          <div className="flex items-center gap-2 mt-1">
                             <div className="bg-fk-green text-white text-[11px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                               {product.rating} ★
                             </div>
                             <span className="text-[11px] text-fk-gray">({product.reviews})</span>
                          </div>
                          
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
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-gray-100 rounded-sm shrink-0" />
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
