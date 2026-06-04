import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { WA_PHONE } from '../data';

import { useProducts } from '../context/ProductContext';
import { useToast } from '../components/ToastContainer';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, showLogin } = useAuth();
  const { products, updateProduct } = useProducts();
  const showToast = useToast();

  const totalOriginal = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const totalDiscounted = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalDiscount = totalOriginal - totalDiscounted;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleOrderWhatsApp = async () => {
    if (!user) {
      showLogin();
      return;
    }
    
    // Check stock for all items
    for (const item of items) {
      const p = products.find(prod => prod.id === item.id);
      if (p && p.stock !== undefined && p.stock < item.quantity) {
        showToast(`Not enough stock for ${item.name}! Only ${p.stock} left.`);
        return;
      }
    }

    // Process stock reductions
    for (const item of items) {
      const p = products.find(prod => prod.id === item.id);
      if (p && p.stock !== undefined) {
         try {
            await updateProduct(p.id, { stock: p.stock - item.quantity });
         } catch(e) {
            console.error("Stock update failed");
         }
      }
    }
    
    let msg = `*Hi Hunter! I want to order these items from my Cart:*\n\n`;
    items.forEach((item, index) => {
      msg += `${index + 1}. ${item.name}\nSize: ${item.selectedSize}${item.selectedColour ? `\nColour: ${item.selectedColour}` : ''}\nQty: ${item.quantity}\nPrice: ₹${item.price * item.quantity}\n\n`;
    });
    msg += `*Total Amount:* ₹${totalDiscounted}`;
    
    if (clearCart) {
      clearCart();
    }
    
    window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="bg-fk-light min-h-screen py-2 lg:py-8 w-full">
      <div className="max-w-[1248px] mx-auto px-2 lg:px-4 flex flex-col lg:flex-row gap-4">
        
        {/* Left: Cart Items */}
        <div className="w-full lg:w-[68%]">
           <div className="bg-white shadow-sm rounded-sm">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-sm">
                 <h2 className="text-[18px] font-medium text-fk-text">My Cart ({itemCount})</h2>
              </div>
              
              {items.length === 0 ? (
                 <div className="p-10 flex flex-col items-center justify-center text-center bg-white min-h-[400px]">
                    <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" className="w-[200px] mb-6" alt="Empty Cart" />
                    <h3 className="text-[18px] font-medium mb-2">Your cart is empty!</h3>
                    <p className="text-[14px] text-fk-gray mb-6">Add items to it now.</p>
                    <Link to="/shop" className="bg-fk-blue text-white px-10 py-2.5 rounded-sm shadow text-[14px] font-medium">Shop Now</Link>
                 </div>
              ) : (
                 <div className="flex flex-col">
                    {items.map(item => (
                       <div key={item.cartId} className="flex flex-col p-4 border-b border-gray-100 hover:bg-gray-50 transition">
                          <div className="flex gap-4">
                             <div className="w-[112px] shrink-0">
                                <img src={item.image} alt={item.name} className="w-full object-contain aspect-square" />
                                {/* Qty buttons underneath image */}
                                <div className="flex items-center justify-center gap-2 mt-4">
                                   <button 
                                      onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                      className="w-7 h-7 rounded-full border border-[#c2c2c2] flex items-center justify-center font-medium bg-white hover:bg-gray-50"
                                      disabled={item.quantity <= 1}
                                   >-</button>
                                   <div className="w-10 h-7 border border-[#c2c2c2] flex items-center justify-center text-[14px] font-medium bg-white">
                                      {item.quantity}
                                   </div>
                                   <button 
                                      onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                      className="w-7 h-7 rounded-full border border-[#c2c2c2] flex items-center justify-center font-medium bg-white hover:bg-gray-50"
                                   >+</button>
                                </div>
                             </div>
                             
                             <div className="flex-1">
                                <div className="flex justify-between">
                                  <Link to={`/product/${item.id}`} className="text-[#212121] text-[16px] hover:text-fk-blue font-medium mb-1 line-clamp-1">{item.name}</Link>
                                  <div className="text-[12px] text-[#878787]">Delivery in 2 days</div>
                                </div>
                                <div className="text-[14px] text-[#878787] mb-3 flex flex-wrap gap-x-4">
                                  <span>Size: {item.selectedSize}</span>
                                  {item.selectedColour && <span>Colour: {item.selectedColour}</span>}
                                </div>
                                <div className="text-[14px] text-[#878787] mb-3">Seller: Hunter Mens & Juniors</div>
                                
                                <div className="flex items-end gap-2 mb-4">
                                  <span className="text-[14px] text-[#878787] line-through leading-none">₹{item.originalPrice * item.quantity}</span>
                                  <span className="text-[20px] font-medium text-[#212121] leading-none">₹{item.price * item.quantity}</span>
                                  <span className="text-[14px] font-bold text-[#388E3C] leading-none">{item.discount}% Off</span>
                                </div>

                                <div className="flex items-center gap-6 text-[16px] font-medium mt-auto">
                                   <button className="text-[#212121] hover:text-fk-blue uppercase">Save for later</button>
                                   <button onClick={() => removeFromCart(item.cartId)} className="text-[#212121] hover:text-fk-blue uppercase">Remove</button>
                                </div>
                             </div>
                          </div>
                       </div>
                    ))}
                    
                    <div className="sticky bottom-[54px] lg:bottom-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-end rounded-b-sm z-10 border-t border-gray-100">
                       <button onClick={handleOrderWhatsApp} className="bg-[#fb641b] text-white px-12 py-3 lg:py-4 rounded-sm font-semibold text-[16px] w-full lg:w-auto shadow-md">
                         ORDER ON WHATSAPP
                       </button>
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-[32%] sticky top-[70px]">
           <div className="bg-white shadow-sm rounded-sm p-4 text-[#212121]">
              <h3 className="text-[#878787] font-medium text-[16px] pb-3 border-b border-gray-100 uppercase">Price Details</h3>
              
               <div className="py-4 space-y-4 text-[15px] border-b border-gray-100">
                 <div className="flex justify-between">
                    <span>Price ({itemCount} items)</span>
                    <span>₹{totalOriginal}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-[#388E3C]">- ₹{totalDiscount}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-[#388E3C]">Free</span>
                 </div>
              </div>
              
              <div className="py-4 flex justify-between font-bold text-[18px] border-b border-gray-100 border-dashed">
                 <span>Total Amount</span>
                 <span>₹{totalDiscounted}</span>
              </div>
              
              <div className="py-3 text-[#388E3C] font-medium text-[15px]">
                 You will save ₹{totalDiscount} on this order
              </div>
           </div>
           
           <div className="mt-4 flex items-center justify-between text-[#878787] text-[13px] px-2 font-medium">
             <span className="flex items-center gap-1.5">
               <span className="text-lg">🛡️</span> Safe and Secure Payments
             </span>
             <span className="flex items-center gap-1.5">
               <span className="text-lg">🔄</span> Easy returns
             </span>
           </div>
        </div>

      </div>
    </div>
  );
}
