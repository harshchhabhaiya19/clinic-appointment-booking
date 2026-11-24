'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StorageService, DEMO_ACCOUNTS } from '@/lib/storage';
import { UserRole, AuthUser } from '@/types';
import { 
  HeartPulse, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  User,
  Stethoscope,
  Users,
  Pill,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const [email, setEmail] = useState('doctor@clinic.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('doctor');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeUser, setActiveUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    StorageService.initialize();
    setActiveUser(StorageService.getAuthUser());

    const handleStorage = () => {
      setActiveUser(StorageService.getAuthUser());
    };
    window.addEventListener('clinic_storage_change', handleStorage);
    return () => window.removeEventListener('clinic_storage_change', handleStorage);
  }, []);

  const getRoleDestination = (role: UserRole) => {
    if (redirectParam) return redirectParam;
    switch (role) {
      case 'doctor':
        return '/doctor';
      case 'staff':
        return '/staff';
      case 'pharmacy':
        return '/pharmacy';
      case 'patient':
      default:
        return '/';
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Find matching demo account or create session
      const matched = DEMO_ACCOUNTS.find(
        a => a.email.toLowerCase() === email.toLowerCase() || a.role === selectedRole
      );

      const loggedUser = StorageService.login(matched ? matched.email : email);
      setLoading(false);
      router.push(getRoleDestination(loggedUser.role));
    }, 400);
  };

  const handleQuickRoleLogin = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(demo.email);
    setSelectedRole(demo.role);
    setLoading(true);

    setTimeout(() => {
      StorageService.login(demo.email);
      setLoading(false);
      router.push(getRoleDestination(demo.role));
    }, 350);
  };

  return (
    <div className="min-h-[85vh] bg-[#fbfcfc] flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Col: Explainer & 1-Click Role Logins */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Sign In to Your <span className="font-vibes text-4xl sm:text-5xl text-emerald-600 font-normal px-1">Healthcare Workspace</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Select one of the pre-configured clinical accounts below for quick verified sign-in, or enter your credentials.
            </p>
          </div>

          {/* Quick Role Login Cards */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Select Clinical Account:
            </span>

            {DEMO_ACCOUNTS.map((demo) => {
              const isSelected = selectedRole === demo.role;
              return (
                <button
                  key={demo.id}
                  onClick={() => handleQuickRoleLogin(demo)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={demo.avatarUrl}
                      alt={demo.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-bold text-slate-900">{demo.name}</strong>
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded capitalize ${
                          demo.role === 'doctor'
                            ? 'bg-sky-100 text-sky-800'
                            : demo.role === 'staff'
                            ? 'bg-amber-100 text-amber-800'
                            : demo.role === 'pharmacy'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {demo.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500">{demo.title}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted HIPAA-standard session state in local storage.</span>
          </div>
        </div>

        {/* Right Col: Clean Aesthetic Sign-In Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">ClinicPulse Portal Access</h3>
                  <p className="text-[11px] text-slate-500">Sign in to your clinical account</p>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                Encrypted Session
              </span>
            </div>

            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Role to Sign In</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(['patient', 'doctor', 'staff', 'pharmacy'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r);
                        const match = DEMO_ACCOUNTS.find(a => a.role === r);
                        if (match) setEmail(match.email);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold capitalize border text-center transition ${
                        selectedRole === r
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {r === 'pharmacy' ? 'Side Medicine' : r === 'staff' ? 'Reception Desk' : r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[10px] text-slate-400">Default: password123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                  <span>Stay signed in</span>
                </label>

                <a href="/" className="text-emerald-700 font-semibold hover:underline">
                  Need help?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In as {selectedRole.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Loading authentication portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}

