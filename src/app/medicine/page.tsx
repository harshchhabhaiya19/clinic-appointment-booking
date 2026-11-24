'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storage';
import { Medicine, PharmacyOrder } from '@/types';
import AuthGate from '@/components/AuthGate';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Truck,
  Building,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';

export default function MedicinePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Cart state: { [medicineId]: quantity }
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [deliveryType, setDeliveryType] = useState<'Clinic Pickup' | 'Home Delivery'>('Clinic Pickup');

  useEffect(() => {
    StorageService.initialize();
    loadData();

    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('clinic_storage_change', handleStorageChange);
    return () => window.removeEventListener('clinic_storage_change', handleStorageChange);
  }, []);

  const loadData = () => {
    setMedicines(StorageService.getMedicines());
    setOrders(StorageService.getPharmacyOrders());
  };

  const categories = ['all', ...Array.from(new Set(medicines.map(m => m.category)))];

  const filteredMedicines = medicines.filter(m => {
    const matchCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchSearch = !searchQuery.trim() || 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (medId: string) => {
    setCart(prev => ({ ...prev, [medId]: (prev[medId] || 0) + 1 }));
  };

  const removeFromCart = (medId: string) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[medId] > 1) {
        next[medId] -= 1;
      } else {
        delete next[medId];
      }
      return next;
    });
  };

  const clearCart = () => setCart({});

  const cartItems = Object.entries(cart).map(([medId, qty]) => {
    const med = medicines.find(m => m.id === medId);
    return {
      med,
      quantity: qty,
      subtotal: (med?.price || 0) * qty,
    };
  }).filter(item => item.med !== undefined);

  const cartTotal = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    StorageService.createPharmacyOrder({
      patientName: 'Rahul Verma (Patient)',
      patientPhone: '+91 99887 76655',
      items: cartItems.map(item => ({
        medicineName: item.med!.name,
        quantity: item.quantity,
        price: item.med!.price,
      })),
      totalAmount: cartTotal,
      deliveryType,
      status: 'Received',
    });

    // Deduct stock in storage
    cartItems.forEach(item => {
      StorageService.updateMedicineStock(item.med!.id, -item.quantity);
    });

    clearCart();
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 4000);
  };

  return (
    <AuthGate
      portalName="Side Medicine Dispensary Store"
      description="Please sign in to order doctor-prescribed medications, view your attached clinic pharmacy orders, and arrange counter pickup."
      icon={<Pill className="w-7 h-7 text-purple-700" />}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Side Medicine & <span className="font-vibes text-4xl sm:text-5xl text-purple-600 font-normal px-1">Dispensary Store</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Order prescribed medications, vitamins, and clinical health supplies directly for clinic counter pickup.
          </p>
        </div>
      </div>

      {orderSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-bold">Your medicine order has been placed! The dispensary staff has received it.</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700">Check "Orders" below</span>
        </div>
      )}

      {/* Main Grid: Medicine Catalog + Live Cart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Catalog */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine brand or generic composition..."
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full font-medium capitalize transition ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMedicines.map((med) => {
              const inCartQty = cart[med.id] || 0;
              return (
                <div
                  key={med.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{med.name}</h4>
                        <p className="text-[11px] text-purple-700 font-medium">{med.genericName}</p>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                        {med.dosageForm}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">{med.instructions}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Mfg: {med.manufacturer}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-extrabold text-slate-900">₹{med.price}</span>
                      <span className={`text-[10px] block font-medium ${med.stock < 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {med.stock > 0 ? `${med.stock} in stock` : 'Out of Stock'}
                      </span>
                    </div>

                    {inCartQty > 0 ? (
                      <div className="flex items-center gap-2 bg-purple-50 p-1 rounded-xl border border-purple-200">
                        <button
                          onClick={() => removeFromCart(med.id)}
                          className="w-6 h-6 rounded-lg bg-white shadow-xs flex items-center justify-center text-purple-700 hover:bg-purple-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-purple-900 px-1">{inCartQty}</span>
                        <button
                          onClick={() => addToCart(med.id)}
                          disabled={inCartQty >= med.stock}
                          className="w-6 h-6 rounded-lg bg-purple-600 text-white shadow-xs flex items-center justify-center hover:bg-purple-700 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(med.id)}
                        disabled={med.stock <= 0}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl text-xs font-semibold transition"
                      >
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Side Medicine Cart & Active Orders */}
        <div className="space-y-6">
          {/* Cart Box */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-purple-600" />
                <span>Side Medicine Cart</span>
              </h3>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-slate-400 hover:text-red-500"
                >
                  Clear
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Your cart is empty. Click "+ Add" on medicines to order for pickup.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map(item => (
                    <div key={item.med!.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50">
                      <div>
                        <strong className="text-slate-800 block">{item.med!.name}</strong>
                        <span className="text-[10px] text-slate-400">{item.quantity} × ₹{item.med!.price}</span>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-sm">
                    <span>Total Amount:</span>
                    <span className="text-purple-700">₹{cartTotal}</span>
                  </div>

                  {/* Delivery / Pickup Mode */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Fulfillment Mode:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('Clinic Pickup')}
                        className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                          deliveryType === 'Clinic Pickup'
                            ? 'bg-purple-50 text-purple-700 border-purple-400'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <Building className="w-3.5 h-3.5" />
                        <span>Clinic Pickup</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('Home Delivery')}
                        className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 ${
                          deliveryType === 'Home Delivery'
                            ? 'bg-purple-50 text-purple-700 border-purple-400'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Home Delivery</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full mt-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
                  >
                    Place Dispensary Order (₹{cartTotal})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Orders List */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Pharmacy Orders ({orders.length})</span>
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {orders.map((ord) => (
                <div key={ord.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ord.patientName}</span>
                    <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                      {ord.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {ord.items.map(i => `${i.quantity}x ${i.medicineName}`).join(', ')}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-400">
                    <span>{ord.deliveryType}</span>
                    <strong className="text-slate-800 text-xs">₹{ord.totalAmount}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthGate>
);
}

