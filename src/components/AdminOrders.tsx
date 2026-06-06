import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useToast } from './ToastContainer';
import { handleFirestoreError, OperationType } from '../lib/firestore-logger';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    const q = query(collection(db, 'orders'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => new Date(b.datePlaced).getTime() - new Date(a.datePlaced).getTime());
      setOrders(ordersList);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      try {
        handleFirestoreError(error, OperationType.GET, 'orders');
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      showToast('Order status updated!');
    } catch (err) {
      console.error(err);
      showToast('Failed to update status.');
      try {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      } catch (e) {
        // Log to bypass react throw loop
      }
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('Ordered')) return <Package className="w-5 h-5 text-fk-blue" />;
    if (status.includes('Shipped')) return <Truck className="w-5 h-5 text-amber-500" />;
    if (status.includes('Delivered')) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <Clock className="w-5 h-5 text-gray-500" />;
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading live orders...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-gray-800">Live Orders ({orders.length})</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b">
              <th className="p-4 font-medium">Order ID & Date</th>
              <th className="p-4 font-medium">Items</th>
              <th className="p-4 font-medium">Total Amount</th>
              <th className="p-4 font-medium">Status / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4 align-top">
                  <div className="font-bold text-sm text-gray-900 uppercase">{order.id}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(order.datePlaced).toLocaleString()}</div>
                  <div className="text-xs text-fk-blue mt-1">{order.contactEmail}</div>
                </td>
                <td className="p-4 align-top">
                  <div className="space-y-2">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <img src={item.image} alt="" className="w-8 h-8 rounded border object-cover" />
                        <div className="text-xs text-gray-700">
                          <p className="font-medium truncate max-w-[150px]">{item.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity} | {item.size} {item.colour}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 align-top">
                  <div className="text-sm font-bold text-gray-900">₹{order.totalAmount}</div>
                </td>
                <td className="p-4 align-top">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-fk-blue bg-white"
                    >
                      <option value="Ordered">Ordered</option>
                      <option value="Shipped - In Transit">Shipped - In Transit</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 text-sm">No orders yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
