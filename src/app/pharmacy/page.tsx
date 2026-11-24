'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storage';
import { PharmacyOrder, Medicine, Prescription } from '@/types';
import AuthGate from '@/components/AuthGate';
import { 
  Pill, 
  PackageCheck, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Search 
} from 'lucide-react';

export default function PharmacyDeskPage() {
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

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
    setOrders(StorageService.getPharmacyOrders());
    setMedicines(StorageService.getMedicines());
    setPrescriptions(StorageService.getPrescriptions());
  };

  const handleUpdateStatus = (orderId: string, status: PharmacyOrder['status']) => {
    StorageService.updatePharmacyOrderStatus(orderId, status);
  };

  const handleAdjustStock = (medId: string, delta: number) => {
    StorageService.updateMedicineStock(medId, delta);
  };

  const filteredMedicines = medicines.filter(m => 
    !searchFilter || 
    m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <AuthGate
      requiredRole="pharmacy"
      portalName="Side Medicine Dispensary"
      description="This workspace is restricted to licensed pharmacists to review incoming doctor prescriptions, fulfill medication orders, and track pharmacy stock."
      icon={<Pill className="w-7 h-7 text-purple-700" />}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Side Medicine <span className="font-vibes text-3xl sm:text-5xl text-purple-600 font-normal px-1">Dispensary Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Receive digital prescriptions, dispense orders for clinic counter pickup, and manage drug inventory.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Incoming Prescription Orders Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-purple-600" />
                <span>Prescription Orders for Fulfillment ({orders.length})</span>
              </h3>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No active medicine orders yet. Prescriptions sent from patient records will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <strong className="text-slate-900 text-sm block">{ord.patientName}</strong>
                        <span className="text-[11px] text-slate-500">
                          Contact: {ord.patientPhone} • {ord.deliveryType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          ord.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'Ready for Pickup'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Ordered Items:
                      </span>
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs py-0.5">
                          <span className="text-slate-700 font-medium">
                            {item.quantity} × {item.medicineName}
                          </span>
                          <span className="text-slate-900 font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-xs">
                        <span>Total Payable:</span>
                        <span className="text-purple-700 text-sm">₹{ord.totalAmount}</span>
                      </div>
                    </div>

                    {/* Status Pipeline Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">Update Status:</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Preparing')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            ord.status === 'Preparing'
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                          }`}
                        >
                          Packing
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Ready for Pickup')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            ord.status === 'Ready for Pickup'
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                          }`}
                        >
                          Ready at Counter
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'Completed')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            ord.status === 'Completed'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
                          }`}
                        >
                          Dispensed & Closed
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Medicine Inventory Manager */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>Medicine Inventory</span>
              </h3>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search inventory..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredMedicines.map((med) => (
                <div
                  key={med.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs flex items-center justify-between"
                >
                  <div>
                    <strong className="text-slate-900 block">{med.name}</strong>
                    <span className="text-[10px] text-slate-400 block">{med.genericName}</span>
                    <span className="text-emerald-700 font-bold">₹{med.price}</span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className={`text-xs font-bold block ${med.stock < 20 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {med.stock} units
                    </span>

                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleAdjustStock(med.id, -5)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-[10px] font-bold"
                        title="Reduce 5 units"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleAdjustStock(med.id, 10)}
                        className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-bold"
                        title="Add 10 units"
                      >
                        +10
                      </button>
                    </div>
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

