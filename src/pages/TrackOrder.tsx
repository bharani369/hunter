import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ status: string; date: string; expected: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phoneNumber.trim()) {
      setError('Please enter both Order ID and WhatsApp Number.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      const upperId = orderId.trim().toUpperCase();
      
      // Mock logic based on order ID
      if (upperId.length < 5) {
        setError('Invalid Order ID format. Please check your WhatsApp confirmation message.');
        return;
      }

      setResult({
        status: 'Shipped - In Transit',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        expected: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }, 800);
  };

  return (
    <div className="bg-fk-light min-h-screen py-4 w-full">
      <div className="max-w-[1248px] mx-auto px-4">
        
        <div className="bg-white shadow-sm rounded-sm mb-4">
           <div className="p-4 lg:p-8 border-b border-gray-100 flex flex-col md:flex-row gap-8">
              
              {/* Tracker Form */}
              <div className="w-full md:w-1/2">
                 <h1 className="text-[22px] font-medium text-[#212121] mb-2">Track Your Order</h1>
                 <p className="text-[14px] text-fk-gray mb-6">Enter your Order ID (from WhatsApp) to check the current shipping status.</p>
                 
                 <form onSubmit={handleTrack} className="space-y-4 text-[14px]">
                    <div>
                       <label className="block text-fk-gray mb-1">Order ID</label>
                       <input 
                         type="text" 
                         value={orderId}
                         onChange={(e) => setOrderId(e.target.value)}
                         className="w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-fk-blue transition uppercase" 
                         placeholder="e.g. HW12345" 
                       />
                    </div>
                    <div>
                       <label className="block text-fk-gray mb-1">WhatsApp Number</label>
                       <input 
                         type="tel" 
                         value={phoneNumber}
                         onChange={(e) => setPhoneNumber(e.target.value)}
                         className="w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-fk-blue transition" 
                         placeholder="10-digit mobile number" 
                         maxLength={10}
                       />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-[#fb641b] hover:bg-[#ea5c19] text-white px-8 py-3 rounded-sm font-semibold uppercase shadow-sm transition disabled:opacity-70 mt-2 block w-full md:w-auto"
                    >
                       {loading ? 'Searching...' : 'Track Order'}
                    </button>
                    {error && (
                      <div className="text-[#E94560] text-[13px] font-medium mt-2">{error}</div>
                    )}
                 </form>
              </div>

              {/* Status Result Area */}
              <div className="w-full md:w-1/2 md:border-l md:border-gray-100 md:pl-8 flex flex-col justify-center min-h-[250px]">
                 {result ? (
                    <div className="animate-[slideUp_0.3s_ease-out]">
                       <h2 className="text-[18px] font-medium text-[#212121] mb-4">Order Status: <span className="uppercase text-fk-blue">{orderId}</span></h2>
                       
                       <div className="relative border-l-2 border-[#388E3C] ml-3 mt-4 space-y-6 pb-4">
                          <div className="relative pl-6">
                             <div className="absolute w-3 h-3 bg-[#388E3C] rounded-full -left-[7px] top-1.5"></div>
                             <h3 className="font-medium text-[#212121] text-[15px]">Order Confirmed</h3>
                             <p className="text-[12px] text-fk-gray">{result.date}</p>
                          </div>
                          
                          <div className="relative pl-6">
                             <div className="absolute w-3 h-3 bg-[#388E3C] rounded-full -left-[7px] top-1.5"></div>
                             <h3 className="font-medium text-[#388E3C] text-[15px]">Shipped</h3>
                             <p className="text-[12px] text-fk-gray">Package is in transit.</p>
                          </div>
                          
                          <div className="relative pl-6 opacity-40">
                             <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5"></div>
                             <h3 className="font-medium text-[#212121] text-[15px]">Out for Delivery</h3>
                          </div>
                          
                          <div className="relative pl-6 opacity-40">
                             <div className="absolute w-3 h-3 bg-gray-300 rounded-full -left-[7px] top-1.5"></div>
                             <h3 className="font-medium text-[#212121] text-[15px]">Delivered</h3>
                          </div>
                       </div>
                       
                       <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-sm text-[13px]">
                         <span className="font-medium">Expected Delivery by:</span> <span className="text-[#388E3C] font-bold">{result.expected}</span>
                       </div>
                    </div>
                 ) : !loading && !error ? (
                    <div className="text-center text-fk-gray text-[14px]">
                       <div className="text-4xl mb-3 opacity-50">📦</div>
                       Enter your details to track the real-time status of your shipment.
                    </div>
                 ) : null}
              </div>

           </div>
           
           <div className="p-4 lg:p-6 bg-gray-50 text-[13px] text-fk-gray rounded-b-sm border-t border-gray-100">
              <span className="font-medium text-[#212121] mb-1 block">Note regarding WhatsApp Orders:</span>
              Once you place an order via WhatsApp, you will receive an Order ID within 2-4 working hours. Please use that ID to track your shipment. For any issues, contact our support team.
           </div>
        </div>

      </div>
    </div>
  );
}
