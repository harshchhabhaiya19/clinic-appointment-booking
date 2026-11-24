'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storage';
import { Clinic, Doctor, Appointment, QueueStatus } from '@/types';
import AuthGate from '@/components/AuthGate';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  Search, 
  Building2, 
  PlayCircle,
  AlertCircle
} from 'lucide-react';

export default function StaffPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('cl-1');
  const [searchFilter, setSearchFilter] = useState('');

  // Walk-in Form State
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinAge, setWalkinAge] = useState(30);
  const [walkinGender, setWalkinGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [walkinDoctorId, setWalkinDoctorId] = useState('');
  const [walkinSymptoms, setWalkinSymptoms] = useState('Walk-in Emergency Consultation');
  const [issuedToken, setIssuedToken] = useState<string | null>(null);

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
    const cList = StorageService.getClinics();
    const dList = StorageService.getDoctors();
    setClinics(cList);
    setDoctors(dList);
    setAppointments(StorageService.getAppointments());
    if (dList.length > 0 && !walkinDoctorId) {
      setWalkinDoctorId(dList[0].id);
    }
  };

  const activeClinic = clinics.find(c => c.id === selectedClinicId);
  const clinicDoctors = doctors.filter(d => d.clinicId === selectedClinicId);

  // Filter appointments for this clinic
  const clinicAppointments = appointments.filter(a => {
    const matchClinic = a.clinicId === selectedClinicId;
    const matchSearch = !searchFilter.trim() || 
      a.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      a.tokenNumber.toLowerCase().includes(searchFilter.toLowerCase());
    return matchClinic && matchSearch;
  });

  const handleCheckIn = (aptId: string) => {
    StorageService.updateAppointmentStatus(aptId, 'checked-in');
  };

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === walkinDoctorId);
    if (!doc || !activeClinic) return;

    const newApt = StorageService.saveAppointment({
      patientName: walkinName,
      patientPhone: walkinPhone || '+91 98000 00000',
      patientAge: Number(walkinAge),
      patientGender: walkinGender,
      clinicId: activeClinic.id,
      clinicName: activeClinic.name,
      doctorId: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Walk-in Now',
      symptoms: walkinSymptoms,
      status: 'checked-in',
    });

    setIssuedToken(newApt.tokenNumber);
    setWalkinName('');
    setWalkinPhone('');
    setTimeout(() => setIssuedToken(null), 5000);
  };

  return (
    <AuthGate
      requiredRole="staff"
      portalName="Staff & Reception Counter"
      description="This portal is restricted to clinic front-desk staff to issue walk-in queue tokens, verify arriving patients, and manage clinic waiting room displays."
      icon={<Users className="w-7 h-7 text-amber-700" />}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Clinic <span className="font-vibes text-3xl sm:text-5xl text-amber-600 font-normal px-1">Reception Counter</span> & Tokens
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verify arriving patients, issue instantaneous tokens for walk-in arrivals, and monitor OPD flow.
          </p>
        </div>

        <div>
          <select
            value={selectedClinicId}
            onChange={(e) => setSelectedClinicId(e.target.value)}
            className="bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 font-semibold focus:ring-2 focus:ring-amber-500"
          >
            {clinics.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Quick Walk-In Registration */}
        <div className="space-y-6">
          <form onSubmit={handleWalkInSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <UserPlus className="w-4 h-4 text-amber-600" />
              <span>Issue Walk-in OPD Token</span>
            </h3>

            {issuedToken && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-600">Token Generated!</span>
                <div className="text-2xl font-mono font-black text-emerald-700">{issuedToken}</div>
                <p className="text-[11px]">Hand slip to patient. Added to doctor queue.</p>
              </div>
            )}

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={walkinName}
                onChange={(e) => setWalkinName(e.target.value)}
                placeholder="e.g. Ramesh Chandra"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Age</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={walkinAge}
                  onChange={(e) => setWalkinAge(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Gender</label>
                <select
                  value={walkinGender}
                  onChange={(e) => setWalkinGender(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Assign Doctor</label>
              <select
                value={walkinDoctorId}
                onChange={(e) => setWalkinDoctorId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
              >
                {clinicDoctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Chief Symptom</label>
              <input
                type="text"
                value={walkinSymptoms}
                onChange={(e) => setWalkinSymptoms(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
            >
              Print & Issue Token
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Arrived Appointments Management Desk */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Today's Clinic Appointments & Verification ({clinicAppointments.length})</span>
              </h3>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter name or token..."
                  className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Token</th>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Doctor</th>
                    <th className="p-3">Time Slot</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Desk Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clinicAppointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{apt.tokenNumber}</td>
                      <td className="p-3">
                        <strong className="text-slate-800 block">{apt.patientName}</strong>
                        <span className="text-[10px] text-slate-400">{apt.patientPhone}</span>
                      </td>
                      <td className="p-3 text-slate-700">{apt.doctorName}</td>
                      <td className="p-3 text-slate-600">{apt.timeSlot}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          apt.status === 'in-consultation'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : apt.status === 'checked-in'
                            ? 'bg-amber-100 text-amber-800'
                            : apt.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {apt.status === 'booked' && (
                          <button
                            onClick={() => handleCheckIn(apt.id)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                          >
                            Mark Arrived
                          </button>
                        )}
                        {apt.status === 'checked-in' && (
                          <span className="text-slate-400 text-[11px]">Waiting for Dr.</span>
                        )}
                        {apt.status === 'in-consultation' && (
                          <span className="text-blue-600 text-[11px] font-bold">In Room</span>
                        )}
                        {apt.status === 'completed' && (
                          <span className="text-emerald-600 text-[11px] font-bold">Done</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthGate>
);
}

