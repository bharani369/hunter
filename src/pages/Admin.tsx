import React, { useState, useRef, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';
import { Trash2, Edit2, Plus, Image as ImageIcon, BarChart3, AlertCircle } from 'lucide-react';
import { useToast } from '../components/ToastContainer';
import { CATEGORIES } from '../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import BillGenerator from '../components/BillGenerator';

import AdminOrders from '../components/AdminOrders';
import AdminSettings from '../components/AdminSettings';
import AdminReviews from '../components/AdminReviews';

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Admin() {
  useDocumentTitle('Admin Dashboard');
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const showToast = useToast();
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings' | 'reviews'>('products');

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({
    name: '',
    description: '',
    category: 'Shirts',
    price: '',
    originalPrice: '',
    discount: '',
    stock: '',
    rating: 4.5,
    reviews: 0,
    sizes: ['M', 'L', 'XL'],
    colours: [],
    tag: '',
    image: '',
    additionalImages: []
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) {
      showToast('Please enter a valid image URL');
      return;
    }
    setCurrentProduct((prev: any) => ({
      ...prev,
      additionalImages: [...(prev.additionalImages || []), newImageUrl.trim()]
    }));
    setNewImageUrl('');
    showToast('Image URL added successfully!');
  };

  // Mock data for Daily Sales
  const mockDailySales = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      sales: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 50000) + 5000
    }));
  }, []);

  // Stock levels data
  const stockData = useMemo(() => {
    return products.map(p => ({
      name: p.name.substring(0, 15) + (p.name.length > 15 ? '...' : ''),
      stock: p.stock || 0
    }));
  }, [products]);

  // If user is logged in via correct email, auto-authenticate
  const isAuthorizedAdminUser = user && user.email === 'bharanicreator@gmail.com';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'huntershop28' && adminPassword === 'hunter@88') {
      setIsAdminAuthenticated(true);
    } else {
      showToast('Invalid username or password');
    }
  };

  if (!isAuthorizedAdminUser && !isAdminAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-2">Enter your credentials to access the dashboard</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                value={adminUsername}
                onChange={e => setAdminUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-fk-blue focus:ring-1 focus:ring-fk-blue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-fk-blue focus:ring-1 focus:ring-fk-blue"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-fk-blue text-white rounded-md py-2.5 font-medium hover:bg-[#1f5cc0] transition mt-6"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 text-center border-t pt-4">
             <p className="text-sm text-gray-500 mb-2">Or login as customer using administrator email</p>
             <p className="text-xs text-gray-400">bharanicreator@gmail.com</p>
          </div>
        </div>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    setIsUploading(true);
    let processedFiles = 0;
    const base64Images: string[] = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          base64Images.push(canvas.toDataURL('image/jpeg', 0.8));
          processedFiles++;
          
          if (processedFiles === files.length) {
            // first image is main, rest are additional
            const mainImg = base64Images[0];
            const extraImgs = base64Images.slice(1);
            setCurrentProduct(prev => ({ 
              ...prev, 
              image: mainImg,
              additionalImages: [...(prev.additionalImages || []), ...extraImgs] 
            }));
            setIsUploading(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (!files.length) return;

    setIsUploading(true);
    let processedFiles = 0;
    const base64Images: string[] = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          base64Images.push(canvas.toDataURL('image/jpeg', 0.8));
          processedFiles++;
          
          if (processedFiles === files.length) {
            setCurrentProduct(prev => ({ 
              ...prev, 
              additionalImages: [...(prev.additionalImages || []), ...base64Images] 
            }));
            setIsUploading(false);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.image) {
      showToast('Name and Image are required!');
      return;
    }

    const formattedProduct = {
      ...currentProduct,
      price: Number(currentProduct.price) || 0,
      originalPrice: Number(currentProduct.originalPrice) || 0,
      discount: Number(currentProduct.discount) || 0,
      stock: Number(currentProduct.stock) || 0,
    };
    
    setIsSaving(true);
    try {
      if (isEditing && currentProduct.id) {
        await updateProduct(currentProduct.id, formattedProduct);
        showToast('Product updated successfully!');
      } else {
        await addProduct(formattedProduct as Omit<Product, 'id'>);
        showToast('Product added successfully!');
      }
      resetForm();
    } catch (err) {
      console.error(err);
      showToast('Error saving product!');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirmId === id) {
      try {
        await deleteProduct(id);
        showToast('Product deleted!');
        setDeleteConfirmId(null);
      } catch (err) {
        console.error(err);
        showToast('Error deleting product');
      }
    } else {
      setDeleteConfirmId(id);
      showToast('Click Delete again to confirm');
      setTimeout(() => setDeleteConfirmId(null), 3000);
    }
  };

  const resetForm = () => {
    setCurrentProduct({
      name: '',
      description: '',
      category: 'Shirts',
      price: '',
      originalPrice: '',
      discount: '',
      stock: '',
      rating: 4.5,
      reviews: 0,
      sizes: ['M', 'L', 'XL'],
      colours: [],
      tag: '',
      image: '',
      additionalImages: []
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 space-x-8">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-4 text-sm font-medium transition-colors ${
            activeTab === 'products' ? 'text-fk-blue border-b-2 border-fk-blue' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Menu & Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-4 text-sm font-medium transition-colors ${
            activeTab === 'orders' ? 'text-fk-blue border-b-2 border-fk-blue' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Live Orders
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-4 text-sm font-medium transition-colors ${
            activeTab === 'settings' ? 'text-fk-blue border-b-2 border-fk-blue' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 text-sm font-medium transition-colors ${
            activeTab === 'reviews' ? 'text-fk-blue border-b-2 border-fk-blue' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Customer Reviews
        </button>
      </div>

      {activeTab === 'orders' && <AdminOrders />}
      
      {activeTab === 'settings' && <AdminSettings />}

      {activeTab === 'reviews' && <AdminReviews />}

      {activeTab === 'products' && (
        <>
          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-fk-blue" />
            Daily Sales (Past 7 Days)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockDailySales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="sales" name="Sales Unit" stroke="#2874F0" strokeWidth={3} dot={{ r: 4, fill: '#2874F0', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-fk-green" />
            Current Stock Levels
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={60} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="stock" name="Units in Stock" fill="#388E3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bill Generator Section */}
      <BillGenerator />

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {isEditing ? <Edit2 className="w-5 h-5 text-fk-blue" /> : <Plus className="w-5 h-5 text-fk-green" />}
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
        
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input 
                type="text" 
                value={currentProduct.name} 
                onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={currentProduct.category}
                  onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag (Optional)</label>
                <input 
                  type="text" 
                  value={currentProduct.tag} 
                  onChange={e => setCurrentProduct({...currentProduct, tag: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue"
                  placeholder="e.g. BESTSELLER"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={currentProduct.description} 
                onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue min-h-[80px]"
                placeholder="Product description..."
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  value={currentProduct.price} 
                  onChange={e => {
                    const price = e.target.value === '' ? '' : Number(e.target.value);
                    let discount: string | number = '';
                    if (price !== '' && currentProduct.originalPrice !== '' && Number(currentProduct.originalPrice) > 0) {
                      discount = Math.round(((Number(currentProduct.originalPrice) - Number(price)) / Number(currentProduct.originalPrice)) * 100);
                    }
                    setCurrentProduct({...currentProduct, price, discount});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original (₹)</label>
                <input 
                  type="number" 
                  value={currentProduct.originalPrice} 
                  onChange={e => {
                    const originalPrice = e.target.value === '' ? '' : Number(e.target.value);
                    let discount: string | number = '';
                    if (originalPrice !== '' && currentProduct.price !== '' && Number(originalPrice) > 0) {
                      discount = Math.round(((Number(originalPrice) - Number(currentProduct.price)) / Number(originalPrice)) * 100);
                    }
                    setCurrentProduct({...currentProduct, originalPrice, discount});
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                <input 
                  type="number" 
                  value={currentProduct.discount} 
                  readOnly
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input 
                  type="number" 
                  value={currentProduct.stock} 
                  onChange={e => setCurrentProduct({...currentProduct, stock: e.target.value === '' ? '' : Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (Comma separated)</label>
              <input 
                type="text" 
                value={currentProduct.sizes?.join(', ')} 
                onChange={e => setCurrentProduct({...currentProduct, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue"
                placeholder="S, M, L, XL"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Additional Product Images (for Main Detail Slideshow)</label>
              
              {/* Option A: Upload Files */}
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-3 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">Option 1: Upload Files</span>
                  <button 
                    type="button"
                    onClick={() => multiFileInputRef.current?.click()}
                    className="bg-fk-blue text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-opacity-90 transition shadow-sm"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Browse Local Files'}
                  </button>
                </div>
                <input 
                  type="file" 
                  multiple
                  ref={multiFileInputRef} 
                  onChange={handleAdditionalImagesUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Option B: Add URLs */}
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 space-y-2 mb-3">
                <span className="text-xs font-medium text-gray-600 block">Option 2: Add Image URL</span>
                <div className="flex gap-2">
                  <input 
                    type="url"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    placeholder="https://example.com/other-image.jpg"
                    className="flex-1 w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-fk-blue focus:ring-1 focus:ring-fk-blue"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-gray-700 transition shrink-0"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Grid preview with indices */}
              {currentProduct.additionalImages && currentProduct.additionalImages.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-500 block">Slideshow Images Queue ({currentProduct.additionalImages.length})</span>
                  <div className="flex gap-2 flex-wrap max-h-48 overflow-y-auto p-1.5 border border-gray-200 rounded-lg bg-white">
                    {currentProduct.additionalImages.map((img: string, idx: number) => (
                      <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden group shadow-sm bg-gray-50">
                        <img src={img} alt={`Var ${idx}`} className="w-full h-full object-cover" />
                        <div className="absolute top-0.5 left-0.5 bg-black/60 text-white text-[9px] px-1 rounded font-mono font-bold">
                          #{idx + 1}
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            const newImgs = [...(currentProduct.additionalImages || [])];
                            newImgs.splice(idx, 1);
                            setCurrentProduct({...currentProduct, additionalImages: newImgs});
                          }}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove from slideshow"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gray-50 min-h-[200px]">
              {currentProduct.image ? (
                <>
                  <img src={currentProduct.image} alt="Preview" className="h-40 object-contain mb-4 z-10 relative" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-gray-900 px-4 py-2 rounded-md font-medium text-sm shadow-md flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" /> Change Image
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 z-10 w-full">
                  <ImageIcon className="w-10 h-10 text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-600">Drag & drop or click to upload</p>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-300 transition w-full"
                  >
                    Select File
                  </button>
                </div>
              )}
              <input 
                type="file" 
                multiple
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fk-blue"></div>
                </div>
              )}
            </div>
            
            <div className="text-center">OR</div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Image URL</label>
              <input 
                type="url" 
                value={currentProduct.image?.startsWith('http') ? currentProduct.image : ''} 
                onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-fk-blue"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="md:col-span-2 border-t pt-4 flex flex-col gap-3 justify-end mt-2">
            {isSaving && (
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-fk-blue transition-all duration-300 animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '100%' }}></div>
              </div>
            )}
            <div className="flex gap-3 justify-end">
              {isEditing && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  disabled={isSaving}
                  className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                disabled={isUploading || isSaving}
                className="px-8 py-2 bg-fk-blue text-white rounded-md font-medium shadow hover:bg-[#1f5cc0] transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  isEditing ? 'Update Product' : 'Add Product'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-800">Current Stock ({products.length})</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b">
                  <th className="p-4 font-medium">Product</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Sizes</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50/50 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm max-w-[200px] truncate" title={product.name}>{product.name}</p>
                        {product.tag && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">{product.tag}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{product.category}</td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
                      <div className="text-xs text-gray-500 line-through">₹{product.originalPrice}</div>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      <div><span className="font-semibold text-gray-600">Sizes:</span> {product.sizes.join(', ')}</div>

                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => startEdit(product)}
                        className="p-2 text-fk-blue hover:bg-blue-50 rounded-full transition mr-1"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className={`p-2 rounded-full transition ${deleteConfirmId === product.id ? 'text-white bg-red-500 hover:bg-red-600' : 'text-red-500 hover:bg-red-50'}`}
                        title={deleteConfirmId === product.id ? "Confirm Delete" : "Delete"}
                      >
                        {deleteConfirmId === product.id ? <AlertCircle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
