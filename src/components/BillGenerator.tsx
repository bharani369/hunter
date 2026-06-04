import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText, Plus, Trash2, Download } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useToast } from './ToastContainer';

export default function BillGenerator() {
  const { products } = useProducts();
  const showToast = useToast();
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  
  const [items, setItems] = useState<{ productId: string, qty: number }[]>([]);

  const handleAddItem = () => {
    if (products.length > 0) {
      setItems([...items, { productId: products[0].id, qty: 1 }]);
    } else {
      showToast('No products available to bill.');
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const generatePDF = () => {
    if (!customerName || items.length === 0) {
      showToast("Please enter customer name and at least one item.");
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 116, 240); // fk-blue
    doc.text("HUNTER", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Mens & Juniors Clothing", 14, 28);
    doc.text("123 Fashion Street, Style City", 14, 33);
    doc.text("Phone: +91 99999 99999", 14, 38);

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("INVOICE", 150, 22);
    
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30);
    doc.text(`Invoice #: INV-${Math.floor(1000 + Math.random() * 9000)}`, 150, 35);
    
    // Customer Info
    doc.setDrawColor(200);
    doc.line(14, 45, 196, 45);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Billed To:", 14, 53);
    doc.setFontSize(10);
    doc.text(`Name: ${customerName}`, 14, 59);
    doc.text(`Phone: ${customerPhone || 'N/A'}`, 14, 64);

    // Table Data
    const tableData = items.map((item, index) => {
      const product = products.find(p => p.id === item.productId);
      const name = product ? product.name : 'Unknown';
      const price = product ? product.price : 0;
      const total = price * item.qty;
      return [
        index + 1,
        name,
        `Rs. ${price.toFixed(2)}`,
        item.qty,
        `Rs. ${total.toFixed(2)}`
      ];
    });

    const subtotal = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
    const tax = subtotal * 0.18; // 18% GST example
    const totalAmount = subtotal + tax;

    autoTable(doc, {
      startY: 75,
      head: [['#', 'Item Description', 'Unit Price', 'Qty', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [40, 116, 240] },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 15 },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 35, halign: 'right' }
      }
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.text("Subtotal:", 140, finalY);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, 180, finalY, { align: 'right' });
    
    doc.text("GST (18%):", 140, finalY + 8);
    doc.text(`Rs. ${tax.toFixed(2)}`, 180, finalY + 8, { align: 'right' });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 140, finalY + 18);
    doc.text(`Rs. ${totalAmount.toFixed(2)}`, 180, finalY + 18, { align: 'right' });

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("Thank you for shopping with HUNTER!", 105, 280, { align: 'center' });

    doc.save(`Hunter_Bill_${customerName.replace(/\\s+/g, '_')}_${new Date().getTime()}.pdf`);
    
    // Reset after success
    setCustomerName('');
    setCustomerPhone('');
    setItems([]);
    showToast('Bill Generated & Downloaded!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-12">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-fk-blue" />
        Generate Bill (PDF)
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input 
            type="text" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-fk-blue focus:ring-1 focus:ring-fk-blue"
            placeholder="e.g. John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input 
            type="text" 
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-fk-blue focus:ring-1 focus:ring-fk-blue"
            placeholder="e.g. 9876543210"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cart Items</label>
        {items.length === 0 ? (
          <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded border border-dashed border-gray-200">No items added yet.</div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1">
                  <select 
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-fk-blue"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <input 
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(index, 'qty', parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-fk-blue"
                  />
                </div>
                <button 
                  onClick={() => removeItem(index)}
                  className="bg-red-50 text-red-500 p-2 rounded-md hover:bg-red-100 transition"
                  title="Remove Item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <button 
          onClick={handleAddItem}
          className="flex items-center gap-2 text-fk-blue font-medium hover:bg-blue-50 px-4 py-2 rounded-md transition"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
        <button 
          onClick={generatePDF}
          className="flex items-center gap-2 bg-fk-green text-white font-medium px-6 py-2 rounded-md shadow hover:bg-green-700 transition"
        >
          <Download className="w-4 h-4" /> Generate PDF
        </button>
      </div>
    </div>
  );
}
