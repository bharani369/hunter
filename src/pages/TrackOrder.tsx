import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-logger';

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function TrackOrder() {
  useDocumentTitle('Track Order');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter your Order ID.');
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const docRef = doc(db, 'orders', orderId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const orderData = docSnap.data();
        setResult({
          status: orderData.status,
          date: new Date(orderData.datePlaced).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          expected: orderData.expectedText || 'Delivery in 2-3 days'
        });
      } else {
        setError('Order not found. Please verify your Order ID.');
      }
    } catch (err) {
      setError('Error fetching order. Try again later.');
      try {
        handleFirestoreError(err, OperationType.GET, `orders/${orderId.trim()}`);
      } catch (e) {
        // Suppress nested bubble
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-fk-light min-h-screen py-4 w-full">
      <div className="max-w-[1248px] mx-auto px-4">
        
        <div className="bg-white shadow-sm rounded-sm mb-4">
           <div className="p-4 lg:p-8 border-b border-gray-100 flex flex-col md:flex-row gap-8">
              
              {/* Tracker Form */}
              <div className="w-full md:w-1/2">
                 <h1 className="text-[22px] font-medium text-[#212121] mb-2">Track Your Order</h1>
                 <p className="text-[14px] text-fk-gray mb-6">Enter your Order ID to check the real-time shipping status from our active admin orders list.</p>
                 
                 <form onSubmit={handleTrack} className="space-y-4 text-[14px]">
                    <div>
                       <label className="block text-fk-gray mb-1">Order ID</label>
                       <input 
                         type="text" 
                         value={orderId}
                         onChange={(e) => setOrderId(e.target.value)}
                         className="w-full border border-gray-300 rounded-sm p-3 outline-none focus:border-fk-blue transition" 
                         placeholder="e.g. 5xT2y..." 
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
                       
                       <div className="mt-4 p-4 border border-gray-100 rounded-sm bg-gray-50/50 shadow-sm">
                         <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                           <span className="font-bold text-gray-700">Date Placed:</span>
                           <span className="text-gray-900">{result.date}</span>
                         </div>
                         <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                           <span className="font-bold text-gray-700">Current Status:</span>
                           <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${result.status.includes('Delivered') ? 'bg-green-500' : 'bg-amber-500 animate-[pulse_1.5s_ease-in-out_infinite]'}`}></div>
                             <span className="text-gray-900 font-bold">{result.status}</span>
                           </div>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="font-bold text-gray-700">Expected:</span>
                           <span className="text-green-600 font-bold">{result.expected}</span>
                         </div>
                       </div>
                    </div>
                 ) : !loading && !error ? (
                    <div className="text-center text-fk-gray text-[14px]">
                       <div className="text-4xl mb-3 opacity-50">📦</div>
                       Enter your Order ID to track the real-time status of your shipment.
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
