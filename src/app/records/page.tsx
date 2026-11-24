'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storage';
import { Prescription, Appointment, PharmacyOrder, AuthUser } from '@/types';
import AuthGate from '@/components/AuthGate';
import { 
  FileText, 
  Printer, 
  Pill, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  ArrowRight,
  Heart,
  Stethoscope,
  Activity,
  Download,
  Lock,
  Shield
} from 'lucide-react';

export default function RecordsPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [orderSent, setOrderSent] = useState<boolean>(false);

  useEffect(() => {
    StorageService.initialize();
    setAuthUser(StorageService.getAuthUser());
    loadData();

    const handleStorageChange = () => {
      setAuthUser(StorageService.getAuthUser());
      loadData();
    };

    window.addEventListener('clinic_storage_change', handleStorageChange);
    return () => window.removeEventListener('clinic_storage_change', handleStorageChange);
  }, []);

  const loadData = () => {
    const rxList = StorageService.getPrescriptions();
    const aptList = StorageService.getAppointments();
    setPrescriptions(rxList);
    setAppointments(aptList);
    if (rxList.length > 0 && !selectedRx) {
      setSelectedRx(rxList[0]);
    }
  };

  const handleSendToPharmacy = (rx: Prescription) => {
    const medicines = StorageService.getMedicines();

    const orderItems = rx.items.map((item) => {
      const match = medicines.find(m => m.name.toLowerCase().includes(item.medicineName.toLowerCase()) || item.medicineName.toLowerCase().includes(m.name.toLowerCase()));
      return {
        medicineName: item.medicineName,
        quantity: 1,
        price: match ? match.price : 120,
      };
    });

    const total = orderItems.reduce((acc, curr) => acc + curr.price, 0);

    StorageService.createPharmacyOrder({
      prescriptionId: rx.id,
      patientName: rx.patientName,
      patientPhone: '+91 99887 76655',
      items: orderItems,
      totalAmount: total,
      deliveryType: 'Clinic Pickup',
      status: 'Received',
    });

    setOrderSent(true);
    setTimeout(() => setOrderSent(false), 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AuthGate
      portalName="Medical Records & Prescriptions"
      description="Protected Health Information (PHI). Please sign in to view your doctor consultation histories, diagnostic notes, and digital prescriptions."
      icon={<FileText className="w-7 h-7 text-emerald-700" />}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Patient <span className="font-vibes text-4xl sm:text-5xl text-emerald-600 font-normal px-1">Consultation & Prescriptions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View clinical notes, vitals, medical diagnosis, and forward prescriptions to Side Medicine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedRx && (
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
          )}
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 text-base">No Medical Prescriptions Yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Prescriptions issued by doctors during consultation will automatically appear here.
          </p>
          <a
            href="/doctor"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition"
          >
            Switch to Doctor Desk to Write an Rx
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List of Prescriptions */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 px-1">
              Prescription History ({prescriptions.length})
            </h3>

            {prescriptions.map((rx) => {
              const isSelected = selectedRx?.id === rx.id;
              return (
                <button
                  key={rx.id}
                  onClick={() => setSelectedRx(rx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs space-y-2 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{rx.patientName}</span>
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {rx.tokenNumber}
                    </span>
                  </div>

                  <p className="text-slate-600 font-medium">{rx.doctorName}</p>
                  <p className="text-[11px] text-slate-400">{rx.clinicName}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>{rx.date}</span>
                    <span className="font-semibold text-slate-700">{rx.items.length} Medicines</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Printable Digital Prescription View */}
          <div className="lg:col-span-2">
            {selectedRx && (
              <div 
                id="printable-prescription" 
                className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6 text-slate-800"
              >
                {/* Official Letterhead */}
                <div className="flex flex-col sm:flex-row justify-between pb-6 border-b-2 border-emerald-600 gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedRx.clinicName}</h2>
                    <p className="text-xs text-slate-500">{selectedRx.clinicAddress}</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">Government Regd. OPD & Day Care Center</p>
                  </div>

                  <div className="text-left sm:text-right text-xs space-y-0.5">
                    <strong className="text-sm font-bold text-slate-900 block">{selectedRx.doctorName}</strong>
                    <span className="text-slate-600">{selectedRx.doctorSpecialty}</span>
                    <span className="text-[11px] text-slate-400 block">Reg. No: MED-IN-94820</span>
                  </div>
                </div>

                {/* Patient Information & Vitals Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name:</span>
                    <strong className="text-slate-900">{selectedRx.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Gender:</span>
                    <strong className="text-slate-900">{selectedRx.patientAge} Years / {selectedRx.patientGender}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Consultation Date:</span>
                    <strong className="text-slate-900">{selectedRx.date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">OPD Token:</span>
                    <strong className="text-emerald-700 font-mono font-bold">{selectedRx.tokenNumber}</strong>
                  </div>
                </div>

                {/* Recorded Vitals */}
                {selectedRx.vitals && (
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Vitals:</span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                      BP: <strong>{selectedRx.vitals.bp}</strong>
                    </span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                      Pulse: <strong>{selectedRx.vitals.pulse}</strong>
                    </span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                      Temp: <strong>{selectedRx.vitals.temp}</strong>
                    </span>
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                      Weight: <strong>{selectedRx.vitals.weight}</strong>
                    </span>
                  </div>
                )}

                {/* Clinical Diagnosis */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
                  <span className="text-emerald-800 font-bold uppercase text-[10px] block mb-0.5">Clinical Diagnosis:</span>
                  <p className="font-semibold text-slate-800 text-sm">{selectedRx.diagnosis}</p>
                </div>

                {/* Rx Symbol & Medication Table */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-black text-emerald-800 font-serif">℞</div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Prescribed Medications:</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px]">
                        <tr>
                          <th className="p-3">#</th>
                          <th className="p-3">Medicine & Strength</th>
                          <th className="p-3">Frequency</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3">Special Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedRx.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-400">{idx + 1}</td>
                            <td className="p-3">
                              <strong className="text-slate-900 block">{item.medicineName}</strong>
                              <span className="text-[11px] text-slate-500">{item.dosage}</span>
                            </td>
                            <td className="p-3 font-semibold text-slate-800">{item.frequency}</td>
                            <td className="p-3 text-slate-600">{item.duration}</td>
                            <td className="p-3 text-slate-500 text-[11px]">{item.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Advice & Signature Block */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
                  <div className="space-y-1 max-w-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Doctor Advice:</span>
                    <p className="text-slate-600 text-xs italic">{selectedRx.doctorAdvice}</p>
                  </div>

                  <div className="text-center sm:text-right space-y-1 shrink-0">
                    <div className="w-32 h-10 border-b border-dashed border-slate-400 mx-auto sm:ml-auto flex items-end justify-center pb-1 text-emerald-800 font-serif italic text-sm">
                      {selectedRx.doctorName.split(' ')[1]}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 block">Digitally Signed & Certified</span>
                    <span className="text-[10px] text-slate-400">{selectedRx.doctorName}</span>
                  </div>
                </div>

                {/* Action Bar: Send to Side Medicine Dispensary */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    {orderSent ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Prescription sent to Side Medicine Pharmacy counter!</span>
                      </span>
                    ) : (
                      <span>Need your medicines? Forward directly to our attached dispensary.</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSendToPharmacy(selectedRx)}
                    disabled={orderSent}
                    className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Pill className="w-4 h-4" />
                    <span>{orderSent ? 'Order Created in Pharmacy' : 'Order at Side Medicine Counter'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </AuthGate>
);
}

