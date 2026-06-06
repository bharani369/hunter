import React, { useState } from 'react';
import { useToast } from './ToastContainer';

export default function AdminSettings() {
  const showToast = useToast();
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  const [storeName, setStoreName] = useState('Hunter Mens & Juniors');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings saved successfully!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Store Configuration</h2>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
          <input 
            type="text" 
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-fk-blue"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Support/Orders Number</label>
          <input 
            type="text" 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-fk-blue"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button type="submit" className="bg-fk-blue text-white px-6 py-2 rounded shadow font-medium hover:bg-[#1f5cc0] transition">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
