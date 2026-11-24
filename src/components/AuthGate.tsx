'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StorageService, REGISTERED_ACCOUNTS } from '@/lib/storage';
import { UserRole, AuthUser } from '@/types';
import { Shield, Lock, ArrowRight, ArrowLeft, CheckCircle2, LogIn } from 'lucide-react';

interface AuthGateProps {
  requiredRole?: UserRole;
  portalName: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthGate({
  requiredRole,
  portalName,
  description,
  icon,
  children,
}: AuthGateProps) {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    StorageService.initialize();
    setAuthUser(StorageService.getAuthUser());
    setIsReady(true);

    const handleStorageChange = () => {
      setAuthUser(StorageService.getAuthUser());
    };

    window.addEventListener('clinic_storage_change', handleStorageChange);
    return () => window.removeEventListener('clinic_storage_change', handleStorageChange);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is authenticated and matches required role (or no specific role required)
  if (authUser && (!requiredRole || authUser.role === requiredRole)) {
    return <>{children}</>;
  }

  // Find pre-configured profile for this role or patient
  const targetRole = requiredRole || 'patient';
  const recommendedAccount = REGISTERED_ACCOUNTS.find(a => a.role === targetRole) || REGISTERED_ACCOUNTS[0];

  const handleQuickUnlock = () => {
    StorageService.login(recommendedAccount.email);
    setAuthUser(recommendedAccount);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50/60">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-lg p-7 sm:p-8 space-y-6 text-center animate-fade-in">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shadow-xs">
          {icon}
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>{requiredRole ? `${requiredRole.toUpperCase()} Workspace Restricted` : 'Authentication Required'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sign In to Access {portalName}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        </div>

        {authUser ? (
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-left text-xs space-y-1">
            <p className="font-bold text-amber-900">Current Session: {authUser.name}</p>
            <p className="text-amber-700 text-[11px]">
              You are signed in as a <span className="font-bold capitalize">{authUser.role}</span>. This portal requires <span className="font-bold uppercase text-amber-900">{requiredRole}</span> permissions.
            </p>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-1">
            <p className="font-bold text-slate-800">You are currently signed out.</p>
            <p className="text-slate-500 text-[11px]">
              New visitors can explore our platform on the landing page. Sign in to access your appointment, queue token, and clinical records.
            </p>
          </div>
        )}

        <div className="space-y-3 pt-2">
          {/* Quick Verified Sign-In Button */}
          <button
            onClick={handleQuickUnlock}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Sign In as {recommendedAccount.name} ({recommendedAccount.role})</span>
          </button>

          {/* Standard Sign-In Portal Link */}
          <a
            href={`/login?role=${targetRole}`}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Enter Your Credentials</span>
          </a>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <a href="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-700 font-semibold transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Explore Landing Page</span>
          </a>
          <span className="flex items-center gap-1 text-[11px]">
            <Shield className="w-3 h-3 text-emerald-600" />
            <span>HIPAA Compliant</span>
          </span>
        </div>
      </div>
    </div>
  );
}
