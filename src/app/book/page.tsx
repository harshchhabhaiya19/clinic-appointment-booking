'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StorageService } from '@/lib/storage';
import { Clinic, Doctor, DiseaseSymptom, Appointment, AuthUser } from '@/types';
import AuthGate from '@/components/AuthGate';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Building2,
  Stethoscope,
  Sparkles,
  Ticket,
  Star,
  MapPin
} from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [diseases, setDiseases] = useState<DiseaseSymptom[]>([]);

  // Form State
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientAge, setPatientAge] = useState<number>(28);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [symptoms, setSymptoms] = useState<string>('');
  const [selectedDiseaseTag, setSelectedDiseaseTag] = useState<string>('');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  useEffect(() => {
    StorageService.initialize();
    const user = StorageService.getAuthUser();
    setAuthUser(user);
    if (user && user.role === 'patient') {
      setPatientName(user.name);
      setPatientPhone('+91 99887 76655');
    }

    const loadedClinics = StorageService.getClinics();
    const loadedDoctors = StorageService.getDoctors();
    const loadedDiseases = StorageService.getDiseases();

    setClinics(loadedClinics);
    setDoctors(loadedDoctors);
    setDiseases(loadedDiseases);

    // Initial query params
    const qClinic = searchParams.get('clinicId');
    const qDoctor = searchParams.get('doctorId');

    if (qClinic && loadedClinics.some(c => c.id === qClinic)) {
      setSelectedClinicId(qClinic);
    } else if (loadedClinics.length > 0) {
      setSelectedClinicId(loadedClinics[0].id);
    }

    if (qDoctor && loadedDoctors.some(d => d.id === qDoctor)) {
      setSelectedDoctorId(qDoctor);
    }
  }, [searchParams]);

  // Update selected doctor when clinic changes
  useEffect(() => {
    if (selectedClinicId) {
      const availableDocs = doctors.filter(d => d.clinicId === selectedClinicId);
      if (availableDocs.length > 0 && (!selectedDoctorId || !availableDocs.some(d => d.id === selectedDoctorId))) {
        setSelectedDoctorId(availableDocs[0].id);
      }
    }
  }, [selectedClinicId, doctors]);

  const activeClinic = clinics.find(c => c.id === selectedClinicId);
  const activeDoctor = doctors.find(d => d.id === selectedDoctorId);
  const clinicDoctors = doctors.filter(d => d.clinicId === selectedClinicId);

  // Available slots for the selected doctor
  const availableSlots = activeDoctor?.availableSlots || [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM'
  ];

  // Set default slot if none selected
  useEffect(() => {
    if (availableSlots.length > 0 && !selectedSlot) {
      setSelectedSlot(availableSlots[0]);
    }
  }, [availableSlots, selectedSlot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClinic || !activeDoctor || !selectedSlot) {
      alert('Please fill in all booking fields');
      return;
    }

    const newAppointment = StorageService.saveAppointment({
      patientName,
      patientPhone,
      patientAge: Number(patientAge),
      patientGender,
      clinicId: activeClinic.id,
      clinicName: activeClinic.name,
      doctorId: activeDoctor.id,
      doctorName: activeDoctor.name,
      specialty: activeDoctor.specialty,
      date: selectedDate,
      timeSlot: selectedSlot,
      symptoms: symptoms || (selectedDiseaseTag ? `Symptoms related to ${selectedDiseaseTag}` : 'Routine Consultation'),
      diseaseTag: selectedDiseaseTag || undefined,
      status: 'booked',
    });

    setConfirmedBooking(newAppointment);
  };

  // Generate date options (Today, Tomorrow, Day After)
  const dateOptions = [
    { label: 'Today', date: new Date().toISOString().split('T')[0] },
    { 
      label: 'Tomorrow', 
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0] 
    },
    { 
      label: 'Day After', 
      date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Book Your <span className="font-vibes text-4xl sm:text-5xl text-emerald-600 font-normal px-1">Clinic Consultation</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Reserve your preferred time slot, receive an instant digital token, and monitor your turn live.
        </p>
      </div>

      {confirmedBooking ? (
        /* Booking Confirmation Card */
        <div className="bg-white rounded-3xl border border-emerald-300 shadow-xl p-8 space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-600">Booking Confirmed!</span>
            <h2 className="text-2xl font-black text-slate-900">Appointment & Token Generated</h2>
            <p className="text-xs text-slate-500">Your details have been saved to local storage.</p>
          </div>

          {/* Token Highlight Badge */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl max-w-sm mx-auto shadow-md space-y-1">
            <span className="text-xs uppercase tracking-widest text-emerald-100 font-semibold">Your Live Token Number</span>
            <div className="text-4xl font-extrabold tracking-wider">{confirmedBooking.tokenNumber}</div>
            <p className="text-xs text-emerald-100 pt-1">
              {confirmedBooking.date} • {confirmedBooking.timeSlot}
            </p>
          </div>

          {/* Summary Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-3 max-w-lg mx-auto">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Patient:</span>
              <strong className="text-slate-800">{confirmedBooking.patientName} ({confirmedBooking.patientAge}y, {confirmedBooking.patientGender})</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Clinic:</span>
              <strong className="text-slate-800">{confirmedBooking.clinicName}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Doctor:</span>
              <strong className="text-slate-800">{confirmedBooking.doctorName} ({confirmedBooking.specialty})</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Reason / Symptoms:</span>
              <strong className="text-slate-800">{confirmedBooking.symptoms}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Consultation Fee:</span>
              <strong className="text-emerald-700 font-bold">₹{activeDoctor?.consultationFee || 500} (Pay at clinic)</strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="/live-status"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs shadow-sm transition flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Track Live Queue Status</span>
            </a>
            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSymptoms('');
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium text-xs transition"
            >
              Book Another Appointment
            </button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          {/* Step 1: Clinic Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>1. Choose Clinic:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clinics.map((c) => {
                const isSelected = selectedClinicId === c.id;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedClinicId(c.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{c.name}</div>
                      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>{c.rating} ★</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{c.distanceKm} km</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ({c.reviewCount} Google reviews)
                      </span>
                      {c.hasPharmacy && (
                        <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded ml-auto">
                          Side Medicine
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Doctor Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>2. Select Specialist Doctor:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clinicDoctors.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <button
                    type="button"
                    key={doc.id}
                    onClick={() => setSelectedDoctorId(doc.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{doc.name}</div>
                        <span className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating} ★ Google</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700 font-medium">{doc.specialty}</p>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                        <span>{doc.experienceYears} yrs exp</span>
                        <strong className="text-slate-800">₹{doc.consultationFee}</strong>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Date & Slot Selection */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                <span>3. Appointment Date & Time Slot:</span>
              </label>
            </div>

            {/* Date Pills */}
            <div className="flex gap-2">
              {dateOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.date}
                  onClick={() => setSelectedDate(opt.date)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    selectedDate === opt.date
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label} ({opt.date.split('-').slice(1).join('/')})
                </button>
              ))}
            </div>

            {/* Time Slot Matrix */}
            <div>
              <p className="text-[11px] text-slate-500 mb-2">Available Consultation Slots:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 4: Patient Information & Symptoms */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600" />
                <span>4. Patient Details & Health Problem:</span>
              </label>

              {authUser ? (
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ✓ Booking as {authUser.name} ({authUser.email})
                </span>
              ) : (
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>Guest Booking</span>
                  <span>•</span>
                  <a href="/login?redirect=/book" className="text-emerald-700 font-bold hover:underline">
                    Sign In to auto-fill
                  </a>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Age</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-1">Related Issue Tag</label>
                <select
                  value={selectedDiseaseTag}
                  onChange={(e) => setSelectedDiseaseTag(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="">General / None</option>
                  {diseases.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">Describe Symptoms or Reason for Visit</label>
              <textarea
                rows={2}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g., severe migraine since 2 days with eye sensitivity..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Instant token assignment with Live Queue sync.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Confirm & Generate Token</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <AuthGate
      requiredRole="patient"
      portalName="Appointment Booking"
      description="Please sign in to select verified doctor consultation slots, lock in your appointment, and generate a real-time waiting room token."
      icon={<CalendarIcon className="w-7 h-7 text-emerald-700" />}
    >
      <Suspense fallback={<div className="p-10 text-center text-xs text-slate-500">Loading booking engine...</div>}>
        <BookingContent />
      </Suspense>
    </AuthGate>
  );
}

