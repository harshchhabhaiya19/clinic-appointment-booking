import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'ClinicPulse - Medical Clinic Appointment Booking & Live Token System',
  description: 'Enterprise healthcare appointment booking platform featuring smart symptom-based clinic discovery, real-time live token queues, digital EHR prescriptions, and attached side-medicine pharmacy integration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fcfdfd] text-slate-900 antialiased selection:bg-emerald-500 selection:text-white flex flex-col min-h-screen">
        {/* Single, Clean & Authentic Header */}
        <Navbar />

        {/* Main Application Container */}
        <main className="flex-1">
          {children}
        </main>

        {/* Professional Healthcare Footer */}
        <footer className="bg-slate-50 text-slate-600 py-12 border-t border-slate-200 mt-16 text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-xs">
                    CP
                  </div>
                  <span className="font-extrabold text-slate-900 text-base">ClinicPulse</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Enterprise outpatient scheduling and virtual waiting room platform. Automating patient self-booking, live queue tokens, digital prescriptions, and clinic side-medicine dispensaries.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>HIPAA & GDPR Ready Infrastructure</span>
                </div>
              </div>

              <div>
                <h4 className="text-slate-900 font-bold mb-3 text-xs uppercase tracking-wider">Patient Services</h4>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li><a href="/" className="hover:text-emerald-700 transition">Find Clinics by Disease</a></li>
                  <li><a href="/book" className="hover:text-emerald-700 transition">Book Doctor Consultation</a></li>
                  <li><a href="/live-status" className="hover:text-emerald-700 transition">Track Live Queue Token</a></li>
                  <li><a href="/records" className="hover:text-emerald-700 transition">View My Medical Records</a></li>
                  <li><a href="/medicine" className="hover:text-emerald-700 transition">Side Medicine Store</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 font-bold mb-3 text-xs uppercase tracking-wider">Clinical Portals</h4>
                <ul className="space-y-2 text-xs text-slate-500">
                  <li><a href="/doctor" className="hover:text-emerald-700 transition">Doctor Consultation Desk</a></li>
                  <li><a href="/staff" className="hover:text-emerald-700 transition">Staff & Reception Counter</a></li>
                  <li><a href="/pharmacy" className="hover:text-emerald-700 transition">Side Medicine Dispensary</a></li>
                  <li><a href="/login" className="hover:text-emerald-700 transition">Staff & Doctor Sign In</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 font-bold mb-3 text-xs uppercase tracking-wider">Security & Compliance</h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  All Protected Health Information (PHI) is encrypted at rest and in transit. Compatible with HL7/FHIR and certified for 99.9% clinical scheduling availability.
                </p>
                <div className="text-[11px] text-slate-400 font-medium">
                  Central Support: support@clinicpulse.health
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
              <p>© 2026 ClinicPulse Health Systems Inc. All rights reserved.</p>
              <div className="flex gap-4 mt-2 sm:mt-0 font-medium text-slate-500">
                <a href="/" className="hover:text-emerald-700">Privacy Policy</a>
                <span>•</span>
                <a href="/" className="hover:text-emerald-700">Terms of Service</a>
                <span>•</span>
                <a href="/" className="hover:text-emerald-700">HIPAA Compliance</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
