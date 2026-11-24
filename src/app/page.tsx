'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/lib/storage';
import { Clinic, Doctor, DiseaseSymptom, QueueStatus, AuthUser } from '@/types';
import {
  Search,
  MapPin,
  Star,
  Stethoscope,
  Clock,
  Pill,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Activity,
  CheckCircle2,
  Users,
  FileText,
  Building2,
  Sparkles,
  Phone,
  Shield,
  Lock,
  Award,
  Smartphone,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  HelpCircle,
  TrendingUp,
  HeartHandshake,
  Check,
  Zap,
  Volume2,
  ArrowUpRight,
  Layers,
  HeartPulse,
  X,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react';

export default function HomePage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [diseases, setDiseases] = useState<DiseaseSymptom[]>([]);
  const [queues, setQueues] = useState<QueueStatus[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseSymptom | null>(null);

  // Hero Interactive Simulation States
  const [interactiveDocIndex, setInteractiveDocIndex] = useState(0);
  const [interactiveSlot, setInteractiveSlot] = useState('09:30 AM');
  const [simulatedServingToken, setSimulatedServingToken] = useState('A-102');
  const [simulatedWaitMinutes, setSimulatedWaitMinutes] = useState(15);
  const [advanceAnimation, setAdvanceAnimation] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Section States
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const [activeRoleTab, setActiveRoleTab] = useState<'patient' | 'doctor' | 'staff' | 'pharmacy'>('patient');
  const [multiRoomTokens, setMultiRoomTokens] = useState([
    { room: 'Room 101', dept: 'Cardiology & General Medicine', doctor: 'Dr. Rajesh Sharma', token: 'A-102', wait: 12, status: 'In Consultation' },
    { room: 'Room 102', dept: 'Dermatology & Skin Care', doctor: 'Dr. Ananya Iyer', token: 'B-205', wait: 8, status: 'Calling Next' },
    { room: 'Room 103', dept: 'Orthopedics & Joint Clinic', doctor: 'Dr. Vikram Malhotra', token: 'C-301', wait: 18, status: 'Vitals Recorded' },
  ]);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    setAuthUser(StorageService.getAuthUser());
    setClinics(StorageService.getClinics());
    setDoctors(StorageService.getDoctors());
    setDiseases(StorageService.getDiseases());
    setQueues(StorageService.getQueues());
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Advance simulation on hero
  const handleAdvanceSimulation = () => {
    setAdvanceAnimation(true);
    StorageService.advanceQueue('cl-1', 'doc-1');
    setTimeout(() => {
      const q = StorageService.getQueues().find(item => item.clinicId === 'cl-1');
      if (q) {
        setSimulatedServingToken(q.currentServingToken);
      } else {
        const nextNum = parseInt(simulatedServingToken.replace(/\D/g, ''), 10) + 1;
        setSimulatedServingToken(`A-${nextNum}`);
      }
      setSimulatedWaitMinutes(prev => Math.max(3, prev - 3));
      setAdvanceAnimation(false);
      showToast(`🔔 Token ${simulatedServingToken} called to Room 102!`);
    }, 380);
  };

  // Advance multi-room simulation
  const handleAdvanceRoomToken = (index: number) => {
    setMultiRoomTokens(prev => {
      const updated = [...prev];
      const current = updated[index];
      const prefix = current.token.split('-')[0];
      const num = parseInt(current.token.split('-')[1], 10) + 1;
      updated[index] = {
        ...current,
        token: `${prefix}-${num}`,
        wait: Math.max(4, current.wait - 2),
        status: 'Calling Next Patient'
      };
      return updated;
    });
    showToast(`🔔 ${multiRoomTokens[index].room} (${multiRoomTokens[index].doctor}) called next patient!`);
  };

  const handleSelectDisease = (disease: DiseaseSymptom) => {
    if (selectedDisease?.id === disease.id) {
      setSelectedDisease(null);
      setSearchQuery('');
      showToast('▶ Marquee row resumed • Filter cleared');
    } else {
      setSelectedDisease(disease);
      setSearchQuery(disease.name);
      showToast(`⏸ Row frozen: "${disease.name}" added to search`);
    }
  };

  const handleClearSelection = () => {
    setSelectedDisease(null);
    setSearchQuery('');
    showToast('▶ Selection cleared • Marquee row running');
  };

  // Filter clinics
  const filteredClinics = clinics.filter((clinic) => {
    if (selectedDisease) {
      return clinic.specialties.includes(selectedDisease.recommendedSpecialty);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = clinic.name.toLowerCase().includes(q);
      const matchAddress = clinic.address.toLowerCase().includes(q);
      const matchSpecialty = clinic.specialties.some(s => s.toLowerCase().includes(q));
      const matchDisease = diseases.some(d =>
        (d.name.toLowerCase().includes(q) || d.symptoms.some(s => s.toLowerCase().includes(q))) &&
        clinic.specialties.includes(d.recommendedSpecialty)
      );
      return matchName || matchAddress || matchSpecialty || matchDisease;
    }

    return true;
  });

  const featuredDoctorsList = doctors.length > 0 ? doctors : [
    {
      id: 'doc-1',
      name: 'Dr. Rajesh Sharma',
      specialty: 'General Medicine',
      qualification: 'MBBS, MD (Internal Medicine)',
      experienceYears: 14,
      consultationFee: 500,
      rating: 4.8,
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'doc-2',
      name: 'Dr. Ananya Iyer',
      specialty: 'Dermatology',
      qualification: 'MBBS, DVD, MD',
      experienceYears: 9,
      consultationFee: 650,
      rating: 4.9,
      avatarUrl: 'https://images.unsplash.com/photo-1594824813576-90513904948a?w=150&auto=format&fit=crop&q=80',
    }
  ];

  const currentHeroDoctor = featuredDoctorsList[interactiveDocIndex] || featuredDoctorsList[0];

  const faqs = [
    {
      q: 'How does the disease & symptom matching system work?',
      a: 'Patients can enter their symptoms (e.g., chest pain, skin rash, or joint swelling) or click quick medical tags. The engine maps symptoms to certified clinical specialties (Cardiology, Dermatology, Orthopedics) and presents the nearest available verified clinics and specialists.',
    },
    {
      q: 'How does the Live Queue and Token system prevent crowded waiting rooms?',
      a: 'When an appointment is confirmed, the patient receives a sequential token number (e.g. TK-105). The clinic waiting room screen and the patient’s phone update in real time. Patients can see the exact token currently in consultation and arrive precisely when their turn is approaching.',
    },
    {
      q: 'What is the "Side Medicine" module and how does it integrate?',
      a: 'Most outpatient clinics maintain an attached dispensary or pharmacy counter. Once a doctor completes a consultation and saves an electronic prescription, the patient or clinic can forward the prescription directly to the Side Medicine counter with one click for rapid pickup or home delivery.',
    },
    {
      q: 'Can front-desk staff handle walk-in patients without prior online booking?',
      a: 'Yes! The Staff & Reception portal provides an instant Walk-in OPD Token generator. Staff simply enter the patient’s name, age, and assigned doctor, and an official token slip is generated and slotted directly into the live doctor queue.',
    },
    {
      q: 'How do clinical teams, doctors, and staff access their portals?',
      a: 'Doctors, reception staff, and dispensary pharmacists sign into their dedicated workspaces via the secure Sign In portal. Each role is assigned strict healthcare permissions—doctors manage consultation queues and issue prescriptions, receptionists manage walk-ins and check-ins, and pharmacists fulfill dispensary orders.',
    },
  ];

  return (
    <div className="bg-[#fcfdfd] text-slate-900 selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">

      {/* Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-emerald-200 flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Authenticated User Quick Access Command Bar */}
      {authUser && (
        <section className="bg-gradient-to-r from-emerald-50 via-teal-50/70 to-slate-50 border-b border-emerald-200/80 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={authUser.avatarUrl}
                alt={authUser.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">
                    Welcome back, {authUser.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                    {authUser.role} portal
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {authUser.title || 'Authenticated clinical user'} • Apex Health Network
                </p>
              </div>
            </div>

            {/* Role specific quick action shortcuts */}
            <div className="flex flex-wrap items-center gap-2.5">
              {authUser.role === 'patient' && (
                <>
                  <a
                    href="/live-status"
                    className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>My Live Queue Token</span>
                  </a>
                  <a
                    href="/records"
                    className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Medical Records</span>
                  </a>
                  <a
                    href="/book"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book New Slot</span>
                  </a>
                </>
              )}

              {authUser.role === 'doctor' && (
                <a
                  href="/doctor"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Open Doctor Consultation Desk & Calling Queue →</span>
                </a>
              )}

              {authUser.role === 'staff' && (
                <a
                  href="/staff"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Users className="w-4 h-4" />
                  <span>Open Staff Reception & Walk-In Counter →</span>
                </a>
              )}

              {authUser.role === 'pharmacy' && (
                <a
                  href="/pharmacy"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Pill className="w-4 h-4" />
                  <span>Open Side Medicine Dispensary Hub →</span>
                </a>
              )}

              <a
                href="/login"
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 transition"
              >
                Switch Account
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 1. HERO SECTION - Modern Aesthetic SaaS with Interactive Waiting Widget */}
      <section className="relative pt-12 pb-20 lg:pt-16 lg:pb-24 overflow-hidden mesh-glow subtle-dot-grid border-b border-slate-200/80">

        {/* Soft Ambient Pastel Glow Orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-28 right-12 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 left-8 w-72 h-72 bg-sky-200/25 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '1s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: SaaS Value Proposition */}
            <div className="lg:col-span-7 space-y-6">

              {/* Modern Trust Headline (Explicitly 2 Lines & Responsive) */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-black text-slate-950 tracking-tight leading-[1.2]">
                <span className="block">Smart Online Booking</span>
                <span className="block mt-1 sm:whitespace-nowrap">
                  for <span className="font-vibes text-4xl sm:text-5xl lg:text-5xl xl:text-6xl text-emerald-600 font-normal px-1">Medical Clinics</span> & Doctors
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                An aesthetic, automated scheduling ecosystem for doctors, patients, reception desks, and dispensaries. Book 24/7 by disease or symptom, eliminate waiting room crowds with <strong>Live Token Queues</strong>, and forward digital prescriptions straight to your in-house <strong>Side Medicine</strong> counter.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href={authUser ? "/book" : "/login?redirect=/book"}
                  className="px-7 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{authUser ? 'Book Clinic Appointment' : 'Sign In to Book Appointment'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#clinics"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm border border-slate-300/90 shadow-xs transition-all flex items-center justify-center gap-2 text-center hover:border-emerald-300"
                >
                  <Search className="w-4 h-4 text-emerald-600" />
                  <span>Explore Clinics & Symptoms</span>
                </a>
              </div>

              {/* Provider portal access banner */}
              <div className="text-xs text-slate-500 pt-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Medical Provider, Receptionist, or Pharmacist?</span>
                <a href="/login" className="text-emerald-700 font-bold hover:underline">
                  Clinical Workspace Sign In →
                </a>
              </div>

              {/* Key Trust Checkmarks */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-4 border-t border-slate-200/80 text-[11px] sm:text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>24/7 Self-Service Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live Queue Token Board</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Side Medicine Dispensary</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Digital Prescription Pad</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Multi-Doctor Calendar Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Encrypted Health Records (HIPAA PHI)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Light & Bright Interactive Product Mockup Widget */}
            <div className="lg:col-span-5 relative">

              {/* Floating Decorative Pill Badges */}
              <div className="hidden xl:flex absolute -top-5 -left-8 z-20 items-center gap-2 glass-panel px-3.5 py-2 rounded-2xl shadow-lg border border-emerald-200 text-xs font-bold text-slate-800 animate-float">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Waiting Room: Room 102 Active</span>
              </div>

              <div className="hidden xl:flex absolute -bottom-5 -right-6 z-20 items-center gap-2 glass-panel px-3.5 py-2 rounded-2xl shadow-lg border border-purple-200 text-xs font-bold text-purple-900 animate-float-reverse">
                <Pill className="w-4 h-4 text-purple-600" />
                <span>Side Medicine: 2-min Dispensary Sync</span>
              </div>

              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-600/10 p-6 sm:p-7 space-y-5 transition-all">

                  {/* Widget Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-700 ml-2">Live Clinic Booking Widget</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>OPD Open</span>
                    </span>
                  </div>

                  {/* Doctor Card with Doctor Switcher */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-white border border-emerald-200/80 space-y-2">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={currentHeroDoctor.avatarUrl}
                        alt={currentHeroDoctor.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-emerald-200 shrink-0 shadow-xs"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-slate-900 text-sm">{currentHeroDoctor.name}</h4>
                          {/* Google Reviews Badge for Doctor */}
                          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
                            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span className="text-[11px] font-bold text-amber-600">{currentHeroDoctor.rating} ★</span>
                          </div>
                        </div>
                        <p className="text-xs text-emerald-800 font-bold">{currentHeroDoctor.specialty} • {currentHeroDoctor.qualification}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span>Apex Multi-Specialty Clinic</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">140+ Google Reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Doctor Toggle Button */}
                    <div className="pt-1 flex items-center justify-between text-[11px] border-t border-emerald-100/70">
                      <span className="text-slate-500 font-medium">Available specialist</span>
                      <button
                        onClick={() => setInteractiveDocIndex(prev => (prev === 0 ? 1 : 0))}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                      >
                        <span>Switch Specialist</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Date & Slot Selector Preview (Clickable) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Select Consultation Slot:</span>
                      <span className="text-emerald-700 font-bold">Today Available</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {['09:30 AM', '10:00 AM', '10:30 AM'].map((slot) => {
                        const isSelected = interactiveSlot === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => {
                              setInteractiveSlot(slot);
                              showToast(`Selected slot: ${slot} with ${currentHeroDoctor.name}`);
                            }}
                            className={`py-2 text-xs font-bold rounded-xl transition-all ${isSelected
                                ? 'border border-emerald-600 bg-emerald-600 text-white shadow-xs scale-102'
                                : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40'
                              }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Light Aesthetic Live Token Status Box */}
                  <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-sky-50/30 border border-emerald-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-emerald-100/70">
                      <span className="text-slate-800 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Virtual Waiting Room Token:</span>
                      </span>
                      <span className="text-[10px] text-emerald-800 font-extrabold font-mono bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>LIVE SYNC</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Now Serving:</span>
                        <div className={`text-4xl font-black font-mono text-emerald-700 transition-all duration-300 ${advanceAnimation ? 'scale-115 text-emerald-900' : ''}`}>
                          {simulatedServingToken}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Estimated Wait:</span>
                        <div className="text-lg font-black text-amber-600">~{simulatedWaitMinutes} mins</div>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                      <span className="text-xs text-slate-600 font-medium">Live Virtual Queue Simulation:</span>
                      <button
                        onClick={handleAdvanceSimulation}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Simulate Next Call</span>
                      </button>
                    </div>
                  </div>

                  <a
                    href={authUser ? `/book?clinicId=cl-1&doctorId=${currentHeroDoctor.id}&slot=${interactiveSlot}` : `/login?redirect=/book?clinicId=cl-1&doctorId=${currentHeroDoctor.id}`}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <span>Proceed with Online Booking ({interactiveSlot})</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE METRICS & COMPLIANCE TRUST BAR */}
      <section className="py-10 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-1 text-center">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">45,000+</span>
              <strong className="text-xs font-bold text-slate-800 block">Outpatient Bookings</strong>
              <p className="text-[11px] text-slate-500">Conducted seamlessly across clinical centers</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-1 text-center">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight block">&lt; 4 mins</span>
              <strong className="text-xs font-bold text-slate-800 block">Average Wait Time</strong>
              <p className="text-[11px] text-slate-500">Down from 45+ minutes in crowded waiting lobbies</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-1 text-center">
              <span className="text-3xl sm:text-4xl font-black text-sky-600 tracking-tight block">99.8%</span>
              <strong className="text-xs font-bold text-slate-800 block">On-Time Doctor Sync</strong>
              <p className="text-[11px] text-slate-500">Synchronized live queues between desk and OPD</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 space-y-1 text-center">
              <span className="text-3xl sm:text-4xl font-black text-purple-600 tracking-tight block">100%</span>
              <strong className="text-xs font-bold text-slate-800 block">HIPAA & PHI Security</strong>
              <p className="text-[11px] text-slate-500">Encrypted digital electronic health records</p>
            </div>
          </div>

          {/* Compliance & Security Micro Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
              <Lock className="w-3.5 h-3.5 text-sky-600" />
              <span>GDPR Ready PHI</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>ISO 27001 Info Security</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>99.9% Uptime Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              <span>Mobile Virtual Token Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CLINIC & DISEASE/SYMPTOM MATCHER */}
      <section id="clinics" className="py-20 bg-[#f8fafb] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="text-center max-w-5xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl font-black text-slate-950 tracking-tight sm:whitespace-nowrap">
              Find the Best Clinic for Your <span className="font-vibes text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-emerald-600 font-normal px-1">Health & Wellness</span>
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Select your symptom or condition below to instantly filter clinics with verified specialist doctors and attached medicine dispensaries.
            </p>
          </div>

          {/* Search Box with Active Condition Pill */}
          <div className="max-w-3xl mx-auto bg-white p-2 sm:p-2.5 rounded-2xl shadow-sm border border-slate-300/80 flex items-center gap-2 hover:border-emerald-400 transition-colors">
            <div className="pl-2 sm:pl-3 text-slate-400 shrink-0">
              <Search className="w-5 h-5 text-emerald-600" />
            </div>

            {/* Selected Condition Tag inside Search Bar */}
            {selectedDisease && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-bold shrink-0 animate-fade-in shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[220px]">{selectedDisease.name}</span>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-emerald-700 hover:text-rose-600 hover:bg-emerald-200/80 rounded-full p-0.5 transition ml-0.5"
                  title="Remove condition & resume running row"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (selectedDisease && val !== selectedDisease.name) {
                  setSelectedDisease(null);
                }
              }}
              placeholder={selectedDisease ? "Filter or refine search..." : "Search symptoms (e.g. chest pain, skin rash, joint ache, toothache)..."}
              className="flex-1 min-w-[120px] px-2 py-2 text-slate-800 text-xs sm:text-sm focus:outline-none placeholder:text-slate-400"
            />

            {(searchQuery || selectedDisease) && (
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-xs text-slate-400 hover:text-rose-600 px-2 py-1 font-semibold flex items-center gap-1 shrink-0 transition"
                title="Clear and resume running row"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs transition shadow-xs shrink-0"
            >
              Search
            </button>
          </div>

          {/* Disease / Symptom Running Marquee Row */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Click a Condition to Match Verified Outpatient Clinics:
                </span>
                {/* {selectedDisease ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full animate-pulse shadow-2xs">
                    <Pause className="w-3 h-3 text-amber-600" />
                    <span>Row Frozen (Condition Active)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Running Row</span>
                  </span>
                )} */}
              </div>

              {selectedDisease && (
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-xs text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full transition shadow-2xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear & Resume Row</span>
                </button>
              )}
            </div>

            {/* Seamless Infinite Running Marquee Track with Edge Fade Masks */}
            <div className="relative w-full overflow-hidden rounded-2xl py-2 bg-gradient-to-r from-emerald-50/40 via-white to-emerald-50/40 border border-slate-200/90 shadow-2xs group">
              {/* Left & Right gradient fade masks */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#f8fafb] via-[#f8fafb]/80 to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#f8fafb] via-[#f8fafb]/80 to-transparent z-10" />

              {/* Running Track: duplicates list for infinite seamless marquee */}
              <div
                className={`animate-marquee gap-3 py-1 px-4 ${selectedDisease ? 'marquee-frozen' : ''}`}
                style={{
                  animationPlayState: selectedDisease ? 'paused' : undefined,
                }}
              >
                {[...diseases, ...diseases].map((d, idx) => {
                  const isSelected = selectedDisease?.id === d.id;
                  return (
                    <button
                      key={`${d.id}-${idx}`}
                      type="button"
                      onClick={() => handleSelectDisease(d)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 border select-none ${isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400 scale-105'
                          : 'bg-white text-slate-800 border-slate-200/90 hover:border-emerald-400 hover:bg-emerald-50/60 hover:shadow-xs hover:scale-102'
                        }`}
                    >
                      <span className="whitespace-nowrap">{d.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${isSelected
                            ? 'bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                          }`}
                      >
                        {d.recommendedSpecialty}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Disease Info Banner */}
          {selectedDisease && (
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-400/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedDisease.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${selectedDisease.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {selectedDisease.severity} Priority
                  </span>
                </div>
                <p className="text-xs text-slate-600">{selectedDisease.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <strong>Diagnostic Symptoms:</strong> {selectedDisease.symptoms.join(', ')}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-200 text-center shrink-0 w-full sm:w-auto">
                  <span className="text-[11px] text-emerald-800 font-semibold block">Recommended Specialty:</span>
                  <strong className="text-base font-black text-emerald-900">{selectedDisease.recommendedSpecialty}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition flex items-center gap-1.5 w-full sm:w-auto justify-center"
                  title="Clear selection and resume running row"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear & Resume</span>
                </button>
              </div>
            </div>
          )}

          {/* Clinics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-2">
            {filteredClinics.map((clinic) => {
              const clinicDoctors = doctors.filter(d => clinic.doctorIds.includes(d.id));

              return (
                <div
                  key={clinic.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-slate-900 text-lg hover:text-emerald-700 transition">
                          {clinic.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{clinic.tagline}</p>
                      </div>

                      {/* Google Verified Review Badge */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 shadow-2xs px-3 py-1.5 rounded-xl shrink-0">
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-xs font-black text-slate-800">{clinic.rating}</span>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500 font-medium block">
                            {clinic.reviewCount}+ Google reviews
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Google Review Snippet */}
                    <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 text-slate-600 text-[11px] flex items-start gap-2">
                      <span className="text-amber-500 font-bold text-xs shrink-0">“</span>
                      <p className="flex-1 leading-snug">
                        {clinic.id === 'cl-1'
                          ? 'Extremely clean clinic with zero waiting room hassle. Token was called right on schedule! Dr. Rajesh is very attentive.'
                          : clinic.id === 'cl-2'
                            ? 'Dr. Priya took time to explain my skin routine. Best clinical dermatology & laser care in the city.'
                            : clinic.id === 'cl-3'
                              ? 'Advanced non-invasive ECG monitoring. Very polite reception staff and prompt consultation.'
                              : 'Painless root canal treatment and transparent consultation fees. Very clean facilities.'}
                        <span className="font-semibold text-slate-800 ml-1 inline text-[10px] text-slate-500">— Verified Google Patient • 5.0 ★</span>
                      </p>
                    </div>

                    {/* Location on Map in Realistic Mini Map Look */}
                    <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-200/90 bg-[#eef2f6] shadow-inner select-none group">
                      {/* Styled Cartographic Roads & Terrain */}
                      <svg className="w-full h-full object-cover" viewBox="0 0 400 150" preserveAspectRatio="none">
                        <rect width="400" height="150" fill="#f8fafc" />
                        {/* Green Park Area */}
                        <path d="M 0,20 Q 80,5 130,45 L 150,150 L 0,150 Z" fill="#d1fae5" opacity="0.65" />
                        <path d="M 280,0 Q 340,30 400,10 L 400,80 Q 320,60 280,0 Z" fill="#e0f2fe" opacity="0.55" />
                        {/* Main Boulevard */}
                        <path d="M -20,75 C 100,60 250,90 420,70" stroke="#cbd5e1" strokeWidth="14" fill="none" />
                        <path d="M -20,75 C 100,60 250,90 420,70" stroke="#ffffff" strokeWidth="10" fill="none" />
                        {/* Intersecting Avenues */}
                        <path d="M 180,-10 L 220,160" stroke="#cbd5e1" strokeWidth="10" fill="none" />
                        <path d="M 180,-10 L 220,160" stroke="#ffffff" strokeWidth="7" fill="none" />
                        <path d="M 90,0 L 70,150" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                        <path d="M 310,0 L 330,150" stroke="#e2e8f0" strokeWidth="6" fill="none" />
                        <path d="M 0,120 L 400,120" stroke="#e2e8f0" strokeWidth="5" fill="none" />
                      </svg>

                      {/* Pulsing Clinic Location Geo-Pin */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                        {/* Floating Clinic Name Pill */}
                        <div className="bg-white/95 backdrop-blur-xs text-slate-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md border border-emerald-300 flex items-center gap-1 mb-1 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>{clinic.name.split(' ')[0]} • {clinic.distanceKm} km</span>
                        </div>

                        {/* Ripple Ping Marker */}
                        <div className="relative flex items-center justify-center">
                          <span className="absolute w-7 h-7 rounded-full bg-emerald-500/35 animate-ping" />
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                            <MapPin className="w-4 h-4 fill-white" />
                          </div>
                        </div>
                      </div>

                      {/* Google Maps Mini Watermark */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-slate-200/80 shadow-2xs text-[10px] font-bold text-slate-700">
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Google Maps</span>
                      </div>

                      <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-lg border border-slate-200/80 shadow-2xs text-[10px] font-bold text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>~{Math.round(clinic.distanceKm * 2.5)} min drive</span>
                      </div>

                      {/* External Google Maps Link */}
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(clinic.name + ', ' + clinic.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-slate-900/85 hover:bg-slate-950 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md transition-all hover:scale-102"
                      >
                        <span>Directions</span>
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                      </a>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{clinic.address}</span>
                        <span className="text-emerald-700 font-bold ml-1">({clinic.distanceKm} km away)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Hours: {clinic.openHours}</span>
                      </div>
                    </div>

                    {/* Specialties & Side Medicine Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {clinic.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {spec}
                        </span>
                      ))}

                      {clinic.hasPharmacy && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Pill className="w-3 h-3 text-purple-600" />
                          <span>Side Medicine Counter Attached</span>
                        </span>
                      )}
                    </div>

                    {/* Available Specialists in this clinic */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Specialists Available for Booking:
                      </span>

                      <div className="space-y-2">
                        {clinicDoctors.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-emerald-50/40 transition"
                          >
                            <div className="flex items-center gap-2.5">
                              <img
                                src={doc.avatarUrl}
                                alt={doc.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <strong className="text-slate-900 block leading-tight">{doc.name}</strong>
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                    <span>{doc.rating}</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                  <span>{doc.specialty}</span>
                                  <span>•</span>
                                  <span className="text-[10px] text-slate-400">Google Verified</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-bold text-slate-900">₹{doc.consultationFee}</span>
                              <span className="text-[10px] text-slate-400 block">Fee</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Tokens Active Today</span>
                    </div>

                    <a
                      href={authUser ? `/book?clinicId=${clinic.id}` : `/login?redirect=/book?clinicId=${clinic.id}`}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs hover:scale-102"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{authUser ? 'Book Slot' : 'Sign In to Book'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FOUR-PILLAR FEATURE SHOWCASE WITH INTERACTIVE TABS */}
      <section id="features" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-5xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl font-black text-slate-950 tracking-tight sm:whitespace-nowrap">
              Everything Your Clinic Needs for <span className="font-vibes text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-emerald-600 font-normal px-1">Effortless Care</span>
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Replace outdated paper pads, chaotic waiting room queues, and phone tag with our integrated clinical management system.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4">
            {[
              { id: 0, label: '1. Online Slot Booking', icon: <Calendar className="w-4 h-4" /> },
              { id: 1, label: '2. Live Queue & Virtual Waiting', icon: <Clock className="w-4 h-4" /> },
              { id: 2, label: '3. Digital EHR & Rx Pad', icon: <FileText className="w-4 h-4" /> },
              { id: 3, label: '4. Side Medicine Dispensary', icon: <Pill className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all ${activeFeatureTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Feature Showcase Box */}
          <div className="bg-[#fbfcfc] rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
            {activeFeatureTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-fade-in">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                    01
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    24/7 Self-Service Online Appointment Scheduling
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Patients book appointments 24/7 from any device without calling the front desk. Clinic calendars update automatically with buffer times and doctor availability.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Custom consultation durations per medical specialty (15-45 mins)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Instant token slip generation and live confirmation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Zero double-booking conflicts across multiple doctor desks</span>
                    </li>
                  </ul>
                  <a href="/book" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-2">
                    <span>Test Appointment Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="font-bold text-slate-800">Booking Calendar Preview</span>
                    <span className="text-emerald-700 font-bold">Apex Health Desk</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-800 font-bold">09:00 AM</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">09:30 AM</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 text-slate-400 line-through bg-slate-100 font-medium">10:00 AM</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">10:30 AM</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">11:00 AM</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">11:30 AM</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">04:00 PM</div>
                    <div className="p-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">04:30 PM</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 flex items-center justify-between">
                    <span className="font-medium">Selected Slot: 09:00 AM</span>
                    <span className="font-bold">Token: TK-101 Generated</span>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-fade-in">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                    02
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Live Queue & Virtual Waiting Room Token Board
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Patients monitor their real-time turn on their phones while reception TV boards display currently active tokens. Doctors call tokens with a single click from their desk.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Dynamic wait time calculations based on actual consultation pace</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>74% reduction in patient waiting lobby overcrowding</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Audio chime alerts when a patient’s token is called</span>
                    </li>
                  </ul>
                  <a href="/live-status" className="inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-800 pt-2">
                    <span>Open Live Queue Tracker</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="font-bold text-slate-800">Waiting Room TV Display</span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      LIVE OPD
                    </span>
                  </div>
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-sky-50/30 border border-emerald-200 text-center space-y-2 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200 tracking-wider inline-block shadow-xs">
                      NOW SERVING IN ROOM 102
                    </span>
                    <div className="text-5xl font-black font-mono text-emerald-700 tracking-wider">A-102</div>
                    <p className="text-xs text-slate-600 font-semibold">Dr. Rajesh Sharma • General Medicine</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">NEXT UP</span>
                      <strong className="text-slate-800 font-mono text-lg">A-103</strong>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px]">WAIT TIME</span>
                      <strong className="text-amber-600 text-lg">~12 Mins</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-fade-in">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                    03
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Electronic Health Records & Digital Prescription Pad
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Doctors record vitals, clinical diagnosis notes, and prescribe medicines using a standardized digital pad. Print official Rx letterheads or send directly to patients.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Printable official digital prescription pad with clinic letterhead & Rx table</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>HIPAA & GDPR encrypted storage for patient privacy</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>1-click forwarding to attached dispensary counter</span>
                    </li>
                  </ul>
                  <a href="/records" className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-purple-800 pt-2">
                    <span>View Medical Records Desk</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200">
                    <span className="font-extrabold text-slate-900">Digital Prescription Pad</span>
                    <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">Rx Certified</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                    <p className="font-bold text-slate-800">Diagnosis: Acute Bronchitis</p>
                    <p className="text-slate-500 text-[11px]">Vitals: BP 120/80 • Pulse 74 bpm • SpO2 98%</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Amoxicillin 500mg</span>
                      <span>1-0-1 (5 Days)</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>Paracetamol 650mg</span>
                      <span>SOS (Fever)</span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center text-xs font-bold text-emerald-800">
                    ✓ Forwarded to Side Medicine for Counter Pickup
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center animate-fade-in">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                    04
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    Side Medicine Dispensary Counter Integration
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Outpatient clinics operate attached medicine counters. Electronic prescriptions immediately queue up in the dispensary for pharmacist packing and patient counter pickup.
                  </p>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Automatic inventory stock reduction upon prescription fulfillment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Zero handwriting errors between doctor and pharmacist</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Patients order refills and supplementary health supplies online</span>
                    </li>
                  </ul>
                  <a href="/medicine" className="inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800 pt-2">
                    <span>Visit Side Medicine Store</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center text-xs pb-3 border-b border-slate-100">
                    <span className="font-bold text-slate-800">Dispensary Fulfillment Queue</span>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full">3 Orders Active</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>Order #RX-409 (Rahul Verma)</span>
                      <span className="text-amber-600">Packing in Progress</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">2 prescribed medications • Attached Clinic Pickup</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-emerald-900">
                      <span>Order #RX-408 (Meera Joshi)</span>
                      <span className="text-emerald-700">Ready for Counter Pickup</span>
                    </div>
                    <p className="text-emerald-700 text-[11px]">Token Verified at Counter • Total: ₹230</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. MULTI-ROLE ECOSYSTEM MATRIX WITH INTERACTIVE WORKFLOW SWITCHER */}
      <section className="py-20 bg-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-5xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl font-black text-slate-950 tracking-tight sm:whitespace-nowrap">
              Designed for <span className="font-vibes text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-emerald-600 font-normal px-1">Every Stakeholder</span> in Your Clinic
            </h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Integrated portals and workflows tailored for doctors, front-desk staff, patients, and in-house pharmacy dispensaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Patient Role */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-base">1. Patient Experience</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Search clinics by symptoms, book verified slots, track live tokens on mobile, and view digital prescriptions anytime.
                </p>
              </div>
              <a href="/book" className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1.5 pt-2">
                <span>Open Patient Portal</span> <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Doctor Role */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-sky-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold border border-sky-200">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-base">2. Doctor Consultation Desk</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Call next patient token, review pre-consultation notes, record vitals, and issue standardized prescriptions in seconds.
                </p>
              </div>
              <a href="/doctor" className="text-xs text-sky-700 font-bold hover:underline flex items-center gap-1.5 pt-2">
                <span>Doctor Workspace</span> <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Staff Role */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-base">3. Front-Desk Reception</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Issue instant walk-in OPD tokens, check-in arriving online patients, and manage clinic waiting room displays effortlessly.
                </p>
              </div>
              <a href="/staff" className="text-xs text-amber-700 font-bold hover:underline flex items-center gap-1.5 pt-2">
                <span>Reception Desk</span> <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Side Medicine Role */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold border border-purple-200">
                  <Pill className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-base">4. Side Medicine Dispensary</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fulfill digital prescription orders, manage drug stock inventory, and notify patients when medications are ready for pickup.
                </p>
              </div>
              <a href="/pharmacy" className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1.5 pt-2">
                <span>Dispensary Hub</span> <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 6. COMPARISON MATRIX: TRADITIONAL CLINIC VS CLINICPULSE */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="text-center max-w-5xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl font-black text-slate-900 tracking-tight sm:whitespace-nowrap">
              Why Healthcare Practices <span className="font-vibes text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-emerald-600 font-normal px-1">Upgrade</span> to ClinicPulse
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
              See the measurable operational transformation between traditional clinic practices and ClinicPulse software.
            </p>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <div className="inline-block min-w-full align-middle">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden min-w-[540px] sm:min-w-full">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="p-4 sm:p-5">Clinical Capability</th>
                      <th className="p-4 sm:p-5 text-slate-500">Traditional Clinic Methods</th>
                      <th className="p-4 sm:p-5 text-emerald-700 bg-emerald-50/50">ClinicPulse System</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">Patient Appointment Booking</td>
                      <td className="p-4 text-slate-500">Phone calls during clinic hours only (busy lines)</td>
                      <td className="p-4 text-emerald-700 bg-emerald-50/30 font-bold">✓ 24/7 self-service online booking</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">Waiting Room Queue Management</td>
                      <td className="p-4 text-slate-500">Paper token slips & crowded, restless lobbies</td>
                      <td className="p-4 text-emerald-700 bg-emerald-50/30 font-bold">✓ Real-time virtual queue on mobile & TV</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">Clinic & Doctor Discovery</td>
                      <td className="p-4 text-slate-500">Word of mouth or unverified Google listings</td>
                      <td className="p-4 text-emerald-700 bg-emerald-50/30 font-bold">✓ Smart symptom-to-specialty AI matching</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">Medical Prescriptions (EHR)</td>
                      <td className="p-4 text-slate-500">Handwritten pads prone to legibility errors & loss</td>
                      <td className="p-4 text-emerald-700 bg-emerald-50/30 font-bold">✓ Certified digital Rx with vitals & dosage</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">Pharmacy & Medicine Dispensing</td>
                      <td className="p-4 text-slate-500">Patient waits in a second long line with paper slip</td>
                      <td className="p-4 text-emerald-700 bg-emerald-50/30 font-bold">✓ One-click side medicine routing & pickup</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE MULTI-ROOM LIVE WAITING BOARD SIMULATION */}
      <section className="py-20 bg-[#f8fafb] border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          <div className="text-center max-w-5xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl font-black text-slate-900 tracking-tight sm:whitespace-nowrap">
              Live Interactive <span className="font-vibes text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-emerald-600 font-normal px-1">Waiting Room</span> Board
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
              Try calling next patients in real-time across clinical departments to see how our queue engine coordinates doctors and patients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {multiRoomTokens.map((room, idx) => {
              const roomTheme = idx === 0
                ? { bg: 'from-emerald-50/80 via-teal-50/40 to-white', border: 'border-emerald-200/90', text: 'text-emerald-700', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', btn: 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/20' }
                : idx === 1
                  ? { bg: 'from-sky-50/80 via-cyan-50/40 to-white', border: 'border-sky-200/90', text: 'text-sky-700', badge: 'bg-sky-50 text-sky-800 border-sky-200', btn: 'from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 shadow-sky-600/20' }
                  : { bg: 'from-purple-50/80 via-indigo-50/40 to-white', border: 'border-purple-200/90', text: 'text-purple-700', badge: 'bg-purple-50 text-purple-800 border-purple-200', btn: 'from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-600/20' };

              return (
                <div
                  key={room.room}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-300 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 space-y-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 font-black text-xs shadow-xs">
                          {idx === 0 ? '101' : idx === 1 ? '102' : '103'}
                        </div>
                        <span className="font-extrabold text-slate-900 text-sm tracking-tight">{room.room}</span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border shadow-xs flex items-center gap-1.5 ${roomTheme.badge}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>{room.status}</span>
                      </span>
                    </div>

                    <div>
                      <strong className="text-slate-900 text-sm font-bold block">{room.doctor}</strong>
                      <span className="text-xs text-slate-500 font-medium">{room.dept}</span>
                    </div>

                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${roomTheme.bg} border ${roomTheme.border} text-center space-y-2 shadow-xs transition-all`}>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-white/90 px-3 py-0.5 rounded-full border border-slate-200 shadow-xs tracking-wider inline-block">
                        Now Serving Token
                      </span>
                      <div className={`text-4xl sm:text-5xl font-black font-mono tracking-wider ${roomTheme.text} my-1 drop-shadow-xs`}>
                        {room.token}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 pt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Est. Wait: <strong className="text-amber-600">~{room.wait} mins</strong></span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>Live Sync</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAdvanceRoomToken(idx)}
                    className={`w-full py-3 bg-gradient-to-r ${roomTheme.btn} active:scale-98 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm`}
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Call Next Patient</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. VERIFIED DOCTOR & CLINIC DIRECTOR TESTIMONIALS */}
      <section id="specialists" className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-5xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl font-black text-slate-900 tracking-tight sm:whitespace-nowrap">
              Trusted by Clinic Directors & <span className="font-vibes text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-emerald-600 font-normal px-1">Specialists</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="p-6 sm:p-7 rounded-3xl bg-[#f8fafc] border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Review</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "The live virtual queue token transformed our morning outpatient rush. Patients arrive when their token is actually approaching rather than waiting 45 minutes in our lobby."
              </p>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=100&auto=format&fit=crop&q=80"
                  alt="Dr. Rajesh Sharma"
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <strong className="text-xs font-bold text-slate-900 block">Dr. Rajesh Sharma, MD</strong>
                  <span className="text-[11px] text-slate-500">Medical Director, Apex Health Clinic</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#f8fafc] border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Review</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "Having the attached Side Medicine counter automatically receive electronic prescriptions has eliminated handwritten pharmacy errors and streamlined our outpatient dispensaries."
              </p>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1594824813576-90513904948a?w=100&auto=format&fit=crop&q=80"
                  alt="Dr. Ananya Iyer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <strong className="text-xs font-bold text-slate-900 block">Dr. Ananya Iyer, MD</strong>
                  <span className="text-[11px] text-slate-500">Chief Dermatologist, Metro Care Clinic</span>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#f8fafc] border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Review</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                "Our front desk staff used to juggle phones all morning while dealing with upset waiting room crowds. With self-booking and live queue displays, patient satisfaction jumped to 98%."
              </p>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&auto=format&fit=crop&q=80"
                  alt="Dr. Vikram Malhotra"
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <strong className="text-xs font-bold text-slate-900 block">Dr. Vikram Malhotra, MS</strong>
                  <span className="text-[11px] text-slate-500">Senior Orthopedic Surgeon</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section id="faq" className="py-20 bg-[#f8fafb] border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="text-center max-w-5xl mx-auto space-y-3">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl font-black text-slate-900 tracking-tight sm:whitespace-nowrap">
              Frequently Asked <span className="font-vibes text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-emerald-600 font-normal px-1">Questions</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
              Answers regarding patient intake, queue algorithms, data privacy, and clinical integrations.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. LUXURY LIGHT & BRIGHT AESTHETIC BOTTOM CTA BANNER */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white relative overflow-hidden">

        {/* Ambient background blur orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-5xl font-black text-white tracking-tight sm:whitespace-nowrap">
            Ready to Modernize Your <span className="font-vibes text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-emerald-200 font-normal px-1">Healthcare Visits</span>?
          </h2>

          <p className="text-emerald-50 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Join hundreds of medical clinics, general practitioners, and specialized practices utilizing ClinicPulse to eliminate waiting room crowds and streamline side medicine prescriptions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <a
              href={authUser ? "/book" : "/login?redirect=/book"}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-emerald-900 font-extrabold text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-102"
            >
              <Calendar className="w-4 h-4" />
              <span>{authUser ? 'Book Your Appointment Now' : 'Sign In to Book Appointment'}</span>
            </a>

            <a
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-800/80 hover:bg-emerald-900/90 text-white font-bold text-sm rounded-xl border border-emerald-400/30 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Clinic Staff & Doctor Sign In</span>
            </a>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-emerald-100 font-medium">
            <span>✓ No Long Waiting Lines</span>
            <span>•</span>
            <span>✓ Verified Specialist Doctors</span>
            <span>•</span>
            <span>✓ Instant Digital Prescriptions</span>
            <span>•</span>
            <span>✓ Attached Dispensary Counter</span>
          </div>
        </div>
      </section>

    </div>
  );
}
