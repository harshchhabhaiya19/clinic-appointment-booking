'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storage';
import { Clinic, Doctor, Appointment, QueueStatus } from '@/types';
import AuthGate from '@/components/AuthGate';
import { 
  Clock, 
  Users, 
  Activity, 
  CheckCircle2, 
  PlayCircle, 
  AlertCircle,
  Building2,
  Stethoscope,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function LiveStatusPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queues, setQueues] = useState<QueueStatus[]>([]);

  // Selection
  const [selectedClinicId, setSelectedClinicId] = useState<string>('cl-1');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-1');
  const [userToken, setUserToken] = useState<string>('A-102'); // Defaults to sample user token

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
    setClinics(StorageService.getClinics());
    setDoctors(StorageService.getDoctors());
    setAppointments(StorageService.getAppointments());
    setQueues(StorageService.getQueues());
  };

  const activeClinic = clinics.find(c => c.id === selectedClinicId);
  const activeDoctor = doctors.find(d => d.id === selectedDoctorId);
  const activeQueue = queues.find(q => q.clinicId === selectedClinicId && q.doctorId === selectedDoctorId);

  // Filter today's appointments for this clinic and doctor
  const doctorAppointments = appointments.filter(
    a => a.clinicId === selectedClinicId && a.doctorId === selectedDoctorId
  );

  // Calculate position in queue
  const currentServing = activeQueue?.currentServingToken || 'A-102';
  
  // Find index of current serving and user token
  const currentIndex = doctorAppointments.findIndex(a => a.tokenNumber === currentServing);
  const userIndex = doctorAppointments.findIndex(a => a.tokenNumber === userToken);

  let peopleAhead = 0;
  let estimatedWait = 0;

  if (userIndex >= 0 && currentIndex >= 0) {
    peopleAhead = Math.max(0, userIndex - currentIndex);
    estimatedWait = peopleAhead * (activeQueue?.estimatedWaitMinutesPerPatient || 12);
  } else if (userIndex > 0) {
    peopleAhead = userIndex;
    estimatedWait = peopleAhead * 12;
  }

  // Handle Advance Queue (Simulate Doctor calling next token)
  const handleAdvanceQueue = () => {
    StorageService.advanceQueue(selectedClinicId, selectedDoctorId);
  };

  return (
    <AuthGate
      portalName="Live Queue & Token Status"
      description="Please sign in to track your personal queue token, check waiting room status in real-time, and view estimated consultation wait times."
      icon={<Clock className="w-7 h-7 text-emerald-700" />}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Clinic <span className="font-vibes text-4xl sm:text-5xl text-emerald-600 font-normal px-1">Live Queue</span> & Token Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time waiting room dashboard for patients, doctors, and reception screens.
          </p>
        </div>

        {/* Doctor & Clinic Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedClinicId}
            onChange={(e) => {
              setSelectedClinicId(e.target.value);
              const docs = doctors.filter(d => d.clinicId === e.target.value);
              if (docs.length > 0) setSelectedDoctorId(docs[0].id);
            }}
            className="bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500"
          >
            {clinics.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="bg-white border border-slate-300 text-xs rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-emerald-500"
          >
            {doctors.filter(d => d.clinicId === selectedClinicId).map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Live Queue Display Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Token Visualizer with Light Aesthetic Styling */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 text-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-200/90 relative overflow-hidden">
            {/* Background decorative soft blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-xs">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{activeDoctor?.name}</h3>
                  <p className="text-xs text-slate-500">{activeDoctor?.specialty} • {activeClinic?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs bg-emerald-100/80 text-emerald-900 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>OPD Active</span>
                </span>
              </div>
            </div>

            {/* Giant Token Counter Display */}
            <div className="py-8 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              {/* Currently Serving Token */}
              <div className="bg-white rounded-2xl p-6 border border-emerald-300 shadow-xs space-y-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 block">
                  Now Serving Inside:
                </span>
                <div className="text-5xl sm:text-6xl font-black text-emerald-700 tracking-wider font-mono">
                  {currentServing}
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>In Consultation with Doctor</span>
                </div>
              </div>

              {/* Your Personal Token Tracker */}
              <div className="bg-white rounded-2xl p-6 border border-amber-300 shadow-xs space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs uppercase font-bold tracking-widest text-slate-600">
                  <span>Your Token:</span>
                  <select
                    value={userToken}
                    onChange={(e) => setUserToken(e.target.value)}
                    className="bg-amber-50 border border-amber-300 text-xs rounded px-2 py-0.5 text-amber-900 font-mono font-bold"
                  >
                    {doctorAppointments.map(a => (
                      <option key={a.id} value={a.tokenNumber}>
                        {a.tokenNumber} ({a.patientName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-5xl sm:text-6xl font-black text-amber-600 tracking-wider font-mono">
                  {userToken}
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  {userToken === currentServing ? (
                    <span className="font-bold text-emerald-700">🎉 It is your turn! Please enter consultation room.</span>
                  ) : peopleAhead > 0 ? (
                    <span><strong>{peopleAhead}</strong> patient(s) ahead of you • <strong>~{estimatedWait} mins</strong> wait</span>
                  ) : (
                    <span className="text-slate-400">Consultation completed or upcoming</span>
                  )}
                </div>
              </div>
            </div>

            {/* Live Queue Controller */}
            <div className="pt-4 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Queue Controller (Simulate calling next patient):</span>
              </div>

              <button
                onClick={handleAdvanceQueue}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Call Next Token</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-xs text-slate-500">Total Tokens Today</span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                {activeQueue?.totalTokensToday || doctorAppointments.length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-xs text-slate-500">Completed Visits</span>
              <div className="text-xl font-bold text-emerald-600 mt-1">
                {doctorAppointments.filter(a => a.status === 'completed').length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-xs">
              <span className="text-xs text-slate-500">Avg. Wait / Patient</span>
              <div className="text-xl font-bold text-blue-600 mt-1">
                {activeQueue?.estimatedWaitMinutesPerPatient || 12} mins
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Today's Queue Schedule List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Today's Patient Queue</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {doctorAppointments.length} Booked
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {doctorAppointments.map((apt) => {
              const isServing = apt.tokenNumber === currentServing;
              const isUser = apt.tokenNumber === userToken;

              return (
                <div
                  key={apt.id}
                  className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 ${
                    isServing
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                      : isUser
                      ? 'border-amber-400 bg-amber-50/60'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm font-mono text-slate-900">
                      {apt.tokenNumber}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      apt.status === 'in-consultation'
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : apt.status === 'completed'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="font-semibold text-slate-800">{apt.patientName}</span>
                    <span className="text-[11px] text-slate-500">{apt.timeSlot}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate">{apt.symptoms}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <a
              href="/book"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              <span>Need an appointment? Book now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </AuthGate>
);
}

