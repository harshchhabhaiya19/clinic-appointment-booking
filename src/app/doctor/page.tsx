'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storage';
import { Doctor, Appointment, PrescriptionItem, Medicine } from '@/types';
import AuthGate from '@/components/AuthGate';
import { 
  Stethoscope, 
  Users, 
  PlayCircle, 
  CheckCircle, 
  Plus, 
  Trash2, 
  FileText, 
  Clock, 
  Save, 
  Sparkles 
} from 'lucide-react';

export default function DoctorPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('Take rest, drink plenty of water, and follow medication schedule.');
  const [bp, setBp] = useState('120/80 mmHg');
  const [pulse, setPulse] = useState('74 bpm');
  const [temp, setTemp] = useState('98.6 °F');
  const [weight, setWeight] = useState('68 kg');
  const [rxItems, setRxItems] = useState<PrescriptionItem[]>([
    {
      medicineName: 'Dolo 650',
      dosage: '650mg',
      frequency: '1-0-1 (After Food)',
      duration: '3 Days',
      instructions: 'Take if fever persists',
    },
  ]);
  const [rxSaved, setRxSaved] = useState(false);

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
    const apts = StorageService.getAppointments();
    setAppointments(apts);
    setMedicines(StorageService.getMedicines());

    // Select the currently in-consultation or first booked patient
    const active = apts.find(a => a.status === 'in-consultation') || apts.find(a => a.status === 'checked-in') || apts[0];
    if (active && !selectedAppointment) {
      setSelectedAppointment(active);
    }
  };

  const handleCallToken = (apt: Appointment) => {
    StorageService.updateAppointmentStatus(apt.id, 'in-consultation');
    setSelectedAppointment(apt);
  };

  const handleAddMedicine = () => {
    setRxItems([
      ...rxItems,
      {
        medicineName: 'Pan 40',
        dosage: '40mg',
        frequency: '1-0-0 (Empty Stomach)',
        duration: '5 Days',
        instructions: 'Morning before breakfast',
      },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    setRxItems(rxItems.filter((_, i) => i !== index));
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    StorageService.savePrescription({
      appointmentId: selectedAppointment.id,
      tokenNumber: selectedAppointment.tokenNumber,
      patientName: selectedAppointment.patientName,
      patientAge: selectedAppointment.patientAge,
      patientGender: selectedAppointment.patientGender,
      doctorName: selectedAppointment.doctorName,
      doctorSpecialty: selectedAppointment.specialty,
      clinicName: selectedAppointment.clinicName,
      clinicAddress: 'Plot 42, Metro Hospital Road, Sector 5',
      date: new Date().toISOString().split('T')[0],
      diagnosis: diagnosis || `Clinical observation for: ${selectedAppointment.symptoms}`,
      vitals: { bp, pulse, temp, weight },
      items: rxItems,
      doctorAdvice: advice,
      pharmacyStatus: 'not-ordered',
    });

    setRxSaved(true);
    setTimeout(() => setRxSaved(false), 3000);
  };

  return (
    <AuthGate
      requiredRole="doctor"
      portalName="Doctor Consultation Desk"
      description="This clinical workspace is restricted to licensed physicians to review patient records, call waiting-room tokens, and issue digital prescriptions."
      icon={<Stethoscope className="w-7 h-7 text-sky-700" />}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Doctor <span className="font-vibes text-3xl sm:text-5xl text-sky-600 font-normal px-1">Consultation Desk</span> & Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your patient waiting queue, conduct consultations, and write digital prescriptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Doctor Queue & Calling Board */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Today's Patient Queue ({appointments.length})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {appointments.map((apt) => {
                const isSelected = selectedAppointment?.id === apt.id;
                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointment(apt)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all space-y-2 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-slate-900">
                        {apt.tokenNumber}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        apt.status === 'in-consultation'
                          ? 'bg-blue-600 text-white animate-pulse'
                          : apt.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div>
                      <strong className="text-slate-900 block">{apt.patientName}</strong>
                      <p className="text-[11px] text-slate-500">{apt.patientAge}y, {apt.patientGender} • {apt.timeSlot}</p>
                    </div>

                    <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 truncate">
                      Problem: {apt.symptoms}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      {apt.status !== 'in-consultation' && apt.status !== 'completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallToken(apt);
                          }}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Call Patient</span>
                        </button>
                      )}

                      {apt.status === 'in-consultation' && (
                        <span className="text-[11px] text-blue-700 font-bold">In Room Now</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Active Consultation & Digital Prescription Writer */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAppointment ? (
            <form onSubmit={handleSavePrescription} className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Active Consultation</span>
                  <h3 className="text-xl font-black text-slate-900">{selectedAppointment.patientName}</h3>
                  <p className="text-xs text-slate-500">
                    Age: {selectedAppointment.patientAge} • Gender: {selectedAppointment.patientGender} • Phone: {selectedAppointment.patientPhone}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Token Number</span>
                  <div className="text-2xl font-mono font-black text-blue-700">{selectedAppointment.tokenNumber}</div>
                </div>
              </div>

              {/* Patient Chief Complaint */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <strong className="text-amber-900 block mb-0.5">Patient Reported Chief Complaint:</strong>
                <p className="text-amber-800">{selectedAppointment.symptoms}</p>
              </div>

              {/* Patient Vitals Recording */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Patient Vitals:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Blood Pressure (BP)</label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Pulse Rate</label>
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Temperature</label>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Doctor Clinical Diagnosis */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Clinical Diagnosis:</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Pharyngitis with Viral Upper Respiratory Infection"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              {/* Medication Table (Prescription Pad) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span className="text-base font-serif font-black text-blue-700">℞</span>
                    <span>Prescribed Medications:</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1 border border-blue-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {rxItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs items-center">
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-slate-400 block mb-0.5">Medicine Name</label>
                        <input
                          type="text"
                          value={item.medicineName}
                          onChange={(e) => {
                            const updated = [...rxItems];
                            updated[index].medicineName = e.target.value;
                            setRxItems(updated);
                          }}
                          className="w-full p-1.5 rounded border border-slate-300 bg-white font-medium"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 block mb-0.5">Dosage</label>
                        <input
                          type="text"
                          value={item.dosage}
                          onChange={(e) => {
                            const updated = [...rxItems];
                            updated[index].dosage = e.target.value;
                            setRxItems(updated);
                          }}
                          className="w-full p-1.5 rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-slate-400 block mb-0.5">Frequency</label>
                        <input
                          type="text"
                          value={item.frequency}
                          onChange={(e) => {
                            const updated = [...rxItems];
                            updated[index].frequency = e.target.value;
                            setRxItems(updated);
                          }}
                          className="w-full p-1.5 rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 block mb-0.5">Duration</label>
                        <input
                          type="text"
                          value={item.duration}
                          onChange={(e) => {
                            const updated = [...rxItems];
                            updated[index].duration = e.target.value;
                            setRxItems(updated);
                          }}
                          className="w-full p-1.5 rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-1 text-center pt-3 sm:pt-0">
                        {rxItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Doctor Advice & Diet Instructions:</label>
                <textarea
                  rows={2}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Save Prescription CTA */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {rxSaved ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Prescription issued and stored in EHR!</span>
                    </span>
                  ) : (
                    <span>Saves to patient records & notifies Side Medicine counter.</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Issue Digital Prescription & Complete Visit</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400 text-xs">
              Select a patient from the queue on the left to start consultation.
            </div>
          )}
        </div>
      </div>
    </div>
  </AuthGate>
);
}

