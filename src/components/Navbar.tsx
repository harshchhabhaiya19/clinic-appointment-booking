'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { StorageService } from '@/lib/storage';
import { UserRole, AuthUser } from '@/types';
import { 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  Pill, 
  Stethoscope, 
  Users, 
  HeartPulse,
  Menu,
  X,
  LogOut,
  LogIn,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('patient');
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    StorageService.initialize();
    setRole(StorageService.getRole());
    setAuthUser(StorageService.getAuthUser());

    const handleStorageChange = () => {
      setRole(StorageService.getRole());
      setAuthUser(StorageService.getAuthUser());
    };
    window.addEventListener('clinic_storage_change', handleStorageChange);
    return () => window.removeEventListener('clinic_storage_change', handleStorageChange);
  }, []);

  const handleLogout = () => {
    StorageService.logout();
    setUserDropdownOpen(false);
    router.push('/login');
  };

  // Public Links: Shown ONLY to guests / unauthenticated new users
  const publicNavLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#clinics', label: 'Find Clinics' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#specialists', label: 'Specialists' },
    { href: '/#faq', label: 'FAQs' },
  ];

  // App Links: Shown ONLY after logging in, tailored by role
  const getAuthenticatedNavLinks = () => {
    if (!authUser) return [];

    switch (authUser.role) {
      case 'doctor':
        return [
          { href: '/doctor', label: 'Doctor Desk', icon: <Stethoscope className="w-4 h-4 text-sky-600" /> },
          { href: '/live-status', label: 'Live Queue Board', icon: <Clock className="w-4 h-4 text-emerald-600" /> },
          { href: '/medicine', label: 'Medicines', icon: <Pill className="w-4 h-4 text-purple-600" /> },
        ];
      case 'staff':
        return [
          { href: '/staff', label: 'Reception Desk', icon: <Users className="w-4 h-4 text-amber-600" /> },
          { href: '/live-status', label: 'Waiting Room TV', icon: <Clock className="w-4 h-4 text-emerald-600" /> },
          { href: '/pharmacy', label: 'Dispensary Counter', icon: <Pill className="w-4 h-4 text-purple-600" /> },
        ];
      case 'pharmacy':
        return [
          { href: '/pharmacy', label: 'Dispensary Hub', icon: <Pill className="w-4 h-4 text-purple-600" /> },
          { href: '/medicine', label: 'Medicine Stock', icon: <Pill className="w-4 h-4 text-teal-600" /> },
          { href: '/records', label: 'Prescriptions', icon: <FileText className="w-4 h-4 text-emerald-600" /> },
        ];
      case 'patient':
      default:
        return [
          { href: '/book', label: 'Book Appointment', icon: <Calendar className="w-4 h-4 text-emerald-600" /> },
          { href: '/live-status', label: 'Live Queue Status', icon: <Clock className="w-4 h-4 text-teal-600" /> },
          { href: '/records', label: 'My Health Records', icon: <FileText className="w-4 h-4 text-blue-600" /> },
          { href: '/medicine', label: 'Side Medicine Store', icon: <Pill className="w-4 h-4 text-purple-600" /> },
        ];
    }
  };

  const authenticatedLinks = getAuthenticatedNavLinks();

  // Specific workspace link based on active role
  const getRoleWorkspaceLink = () => {
    if (!authUser) return null;
    switch (authUser.role) {
      case 'doctor':
        return { href: '/doctor', label: 'Doctor Desk', icon: <Stethoscope className="w-3.5 h-3.5 text-sky-600" /> };
      case 'staff':
        return { href: '/staff', label: 'Reception Desk', icon: <Users className="w-3.5 h-3.5 text-amber-600" /> };
      case 'pharmacy':
        return { href: '/pharmacy', label: 'Dispensary Hub', icon: <Pill className="w-3.5 h-3.5 text-purple-600" /> };
      default:
        return null;
    }
  };

  const activeWorkspace = getRoleWorkspaceLink();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <a href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">Clinic<span className="text-emerald-600">Pulse</span></span>
                <span className="font-vibes text-emerald-600 text-base sm:text-lg font-normal">care</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">Clinical Appointments & Live Queue</p>
            </div>
          </a>

          {/* Center Navigation: DIFFERENT for Logged Out vs Logged In */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {authUser ? (
              /* LOGGED IN USER: Show working application tabs */
              authenticatedLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/70 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                );
              })
            ) : (
              /* NEW / UNLOGGED VISITOR: Show ONLY public landing page sections */
              publicNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition"
                >
                  {link.label}
                </a>
              ))
            )}
          </nav>

          {/* Right Side: Logged In User Pill vs Logged Out Sign In */}
          <div className="hidden md:flex items-center gap-3">
            {authUser ? (
              <>
                {/* Dedicated Workspace Button for Doctor / Staff / Pharmacy */}
                {activeWorkspace && (
                  <a
                    href={activeWorkspace.href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition"
                  >
                    {activeWorkspace.icon}
                    <span>{activeWorkspace.label}</span>
                  </a>
                )}

                {/* Logged In User Profile Pill with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition shadow-xs"
                  >
                    <img
                      src={authUser.avatarUrl}
                      alt={authUser.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-left text-xs leading-none">
                      <strong className="text-slate-900 font-bold block max-w-[110px] truncate">
                        {authUser.name}
                      </strong>
                      <span className="text-[10px] text-emerald-700 font-semibold capitalize">
                        {authUser.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs animate-fade-in space-y-1">
                      <div className="p-2.5 border-b border-slate-100">
                        <p className="font-bold text-slate-900">{authUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{authUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 capitalize">
                          {authUser.title || `${authUser.role} portal`}
                        </span>
                      </div>

                      {authUser.role === 'patient' && (
                        <>
                          <a
                            href="/records"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>My Health Records</span>
                          </a>

                          <a
                            href="/book"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Book New Slot</span>
                          </a>

                          <a
                            href="/live-status"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                          >
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Live Queue Token</span>
                          </a>
                        </>
                      )}

                      <a
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Switch Clinical Account</span>
                      </a>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-left transition"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* NEW / UNLOGGED VISITOR: Clean Sign In button ONLY */
              <div className="flex items-center gap-2">
                <a
                  href="/login"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            {authUser ? (
              <div className="flex items-center gap-2">
                <img
                  src={authUser.avatarUrl}
                  alt={authUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
                />
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {authUser.role}
                </span>
              </div>
            ) : (
              <a
                href="/login"
                className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Sign In
              </a>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {authUser ? (
            /* Logged In User Mobile View */
            <>
              <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between mb-2 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <img src={authUser.avatarUrl} alt={authUser.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">{authUser.name}</strong>
                    <span className="text-[10px] text-emerald-700 font-bold capitalize">{authUser.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-rose-600 font-bold px-2 py-1 rounded bg-white border border-rose-200"
                >
                  Sign Out
                </button>
              </div>

              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Workspace Navigation</p>
              {authenticatedLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </a>
              ))}
            </>
          ) : (
            /* New / Unlogged Visitor Mobile View: Public landing sections ONLY */
            <>
              <div className="p-3 bg-emerald-50 rounded-2xl flex items-center justify-between mb-2 border border-emerald-200">
                <div>
                  <strong className="text-xs font-bold text-emerald-950 block">Welcome to ClinicPulse</strong>
                  <span className="text-[11px] text-emerald-700">Sign in to access clinical appointments</span>
                </div>
                <a href="/login" className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
                  Sign In
                </a>
              </div>

              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Landing Overview</p>
              {publicNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </a>
              ))}
            </>
          )}
        </div>
      )}
    </header>
  );
}
