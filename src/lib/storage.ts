import {
  Clinic,
  Doctor,
  DiseaseSymptom,
  Appointment,
  QueueStatus,
  Medicine,
  Prescription,
  PharmacyOrder,
  UserRole,
  AuthUser,
} from '@/types';

// Storage Keys
const STORAGE_KEYS = {
  ROLE: 'cab_current_role',
  AUTH_USER: 'cab_auth_user',
  CLINICS: 'cab_clinics',
  DOCTORS: 'cab_doctors',
  DISEASES: 'cab_diseases',
  APPOINTMENTS: 'cab_appointments',
  QUEUES: 'cab_queues',
  MEDICINES: 'cab_medicines',
  PRESCRIPTIONS: 'cab_prescriptions',
  PHARMACY_ORDERS: 'cab_pharmacy_orders',
  INITIALIZED: 'cab_data_seeded_v1',
};

// Verified Pre-registered Clinical Accounts for Sign-In
export const REGISTERED_ACCOUNTS: AuthUser[] = [
  {
    id: 'usr-patient',
    email: 'patient@clinic.com',
    name: 'Rahul Verma',
    role: 'patient',
    title: 'Registered Patient',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-doctor',
    email: 'doctor@clinic.com',
    name: 'Dr. Rajesh Sharma',
    role: 'doctor',
    title: 'Senior Physician (MBBS, MD)',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
    clinicId: 'cl-1',
    clinicName: 'Apex Multi-Specialty Health Clinic',
  },
  {
    id: 'usr-staff',
    email: 'staff@clinic.com',
    name: 'Priya Sharma',
    role: 'staff',
    title: 'OPD Front-Desk Receptionist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    clinicId: 'cl-1',
    clinicName: 'Apex Multi-Specialty Health Clinic',
  },
  {
    id: 'usr-pharmacy',
    email: 'pharmacy@clinic.com',
    name: 'Vikram Seth',
    role: 'pharmacy',
    title: 'Dispensary In-Charge & Lead Pharmacist',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80',
    clinicId: 'cl-1',
    clinicName: 'Apex Multi-Specialty Health Clinic',
  },
];

export const DEMO_ACCOUNTS = REGISTERED_ACCOUNTS;

// Seed Data
export const INITIAL_DISEASES: DiseaseSymptom[] = [
  {
    id: 'dis-1',
    name: 'Chest Pain & Palpitations',
    category: 'Heart & Vascular',
    symptoms: ['Chest tightness', 'Shortness of breath', 'Rapid heartbeat', 'Dizziness'],
    recommendedSpecialty: 'Cardiology',
    severity: 'high',
    description: 'Acute or chronic sensations of chest pressure, fluttering heart rate, or pain radiating to arms.',
  },
  {
    id: 'dis-2',
    name: 'Severe Skin Rash & Acne',
    category: 'Skin & Dermatology',
    symptoms: ['Red itchy patches', 'Cystic pimples', 'Flaky skin', 'Eczema flare-up'],
    recommendedSpecialty: 'Dermatology',
    severity: 'medium',
    description: 'Inflammatory conditions affecting facial skin or body epidermis needing clinical evaluation.',
  },
  {
    id: 'dis-3',
    name: 'Joint Pain & Arthritis',
    category: 'Bone & Joints',
    symptoms: ['Knee stiffness', 'Swollen joints', 'Lower back ache', 'Difficulty walking'],
    recommendedSpecialty: 'Orthopedics',
    severity: 'medium',
    description: 'Degenerative or injury-related musculoskeletal discomfort impacting daily mobility.',
  },
  {
    id: 'dis-4',
    name: 'Toothache & Bleeding Gums',
    category: 'Oral & Dental',
    symptoms: ['Sharp tooth pain', 'Sensitivity to cold/hot', 'Swollen gums', 'Jaw soreness'],
    recommendedSpecialty: 'Dentistry',
    severity: 'medium',
    description: 'Cavities, root canal complications, gum inflammation, and enamel sensitivity.',
  },
  {
    id: 'dis-5',
    name: 'High Fever, Cough & Flu',
    category: 'General Infection',
    symptoms: ['Fever above 101F', 'Body chills', 'Persistent dry cough', 'Throat irritation'],
    recommendedSpecialty: 'General Medicine',
    severity: 'low',
    description: 'Seasonal viral infection, bacterial throat infections, and general malaise.',
  },
  {
    id: 'dis-6',
    name: 'Migraine & Chronic Headache',
    category: 'Brain & Nervous System',
    symptoms: ['Throbbing head pain', 'Light sensitivity', 'Nausea', 'Aura'],
    recommendedSpecialty: 'Neurology',
    severity: 'medium',
    description: 'Neurological episodes characterized by intense pulsating headaches and sensory sensitivity.',
  },
  {
    id: 'dis-7',
    name: 'Blurred Vision & Eye Redness',
    category: 'Vision & Eye Care',
    symptoms: ['Cloudy sight', 'Eye dryness', 'Itchy watery eyes', 'Straining to focus'],
    recommendedSpecialty: 'Ophthalmology',
    severity: 'low',
    description: 'Refractive issues, conjunctival irritation, or corneal strain requiring slit-lamp exam.',
  },
  {
    id: 'dis-8',
    name: 'Childhood Wheezing & Pediatric Fever',
    category: 'Pediatrics',
    symptoms: ['Rapid breathing in infant', 'Earache', 'Loss of appetite', 'Nighttime coughing'],
    recommendedSpecialty: 'Pediatrics',
    severity: 'high',
    description: 'Health conditions specific to infants, toddlers, and young adolescents.',
  },
];

export const INITIAL_CLINICS: Clinic[] = [
  {
    id: 'cl-1',
    name: 'Apex Multi-Specialty Health Clinic',
    tagline: 'Comprehensive outpatient care with digital diagnostic facilities',
    specialties: ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics'],
    address: 'Plot 42, Metro Hospital Road, Sector 5',
    city: 'Central City',
    distanceKm: 1.4,
    rating: 4.8,
    reviewCount: 320,
    phone: '+91 98765 43210',
    openHours: '08:00 AM - 09:00 PM',
    hasPharmacy: true,
    doctorIds: ['doc-1', 'doc-2', 'doc-3'],
  },
  {
    id: 'cl-2',
    name: 'DermaGlow Skin & Laser Clinic',
    tagline: 'Advanced clinical dermatology & aesthetic skin wellness',
    specialties: ['Dermatology'],
    address: 'Shop 104, Crystal Galleria, Park Avenue',
    city: 'Central City',
    distanceKm: 2.1,
    rating: 4.9,
    reviewCount: 195,
    phone: '+91 98765 11223',
    openHours: '10:00 AM - 08:00 PM',
    hasPharmacy: true,
    doctorIds: ['doc-4'],
  },
  {
    id: 'cl-3',
    name: 'HeartPulse Cardio Care Center',
    tagline: 'State-of-the-art non-invasive cardiology and ECG monitoring',
    specialties: ['Cardiology'],
    address: 'Building 12, Health Boulevard, Ring Road',
    city: 'Central City',
    distanceKm: 3.5,
    rating: 4.7,
    reviewCount: 260,
    phone: '+91 98765 88990',
    openHours: '09:00 AM - 06:00 PM',
    hasPharmacy: true,
    doctorIds: ['doc-2'],
  },
  {
    id: 'cl-4',
    name: 'City Smile Dental & Orthodontic Care',
    tagline: 'Painless root canals, braces, cosmetic smile designing',
    specialties: ['Dentistry'],
    address: 'First Floor, Sunrise Complex, Near University Gate',
    city: 'Central City',
    distanceKm: 0.8,
    rating: 4.6,
    reviewCount: 140,
    phone: '+91 98765 77665',
    openHours: '09:30 AM - 07:30 PM',
    hasPharmacy: false,
    doctorIds: ['doc-5'],
  },
];

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma',
    specialty: 'General Medicine',
    qualification: 'MBBS, MD (Internal Medicine)',
    experienceYears: 14,
    rating: 4.8,
    consultationFee: 500,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableSlots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:00 PM', '04:30 PM'],
    status: 'in-consultation',
    clinicId: 'cl-1',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Roy',
    specialty: 'Cardiology',
    qualification: 'MBBS, DM (Cardiology), FACC',
    experienceYears: 11,
    rating: 4.9,
    consultationFee: 800,
    availableDays: ['Mon', 'Wed', 'Fri'],
    availableSlots: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
    status: 'available',
    clinicId: 'cl-1',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813633-89088dd196a6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'doc-3',
    name: 'Dr. Vikramaditya Patil',
    specialty: 'Orthopedics',
    qualification: 'MBBS, MS (Ortho), Fellowship in Joint Replacement',
    experienceYears: 16,
    rating: 4.7,
    consultationFee: 700,
    availableDays: ['Tue', 'Thu', 'Sat'],
    availableSlots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:30 AM', '05:00 PM'],
    status: 'available',
    clinicId: 'cl-1',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'doc-4',
    name: 'Dr. Priya Nambiar',
    specialty: 'Dermatology',
    qualification: 'MBBS, MD (DVL)',
    experienceYears: 8,
    rating: 4.9,
    consultationFee: 650,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
    availableSlots: ['10:30 AM', '11:00 AM', '11:30 AM', '12:30 PM', '04:00 PM', '04:30 PM'],
    status: 'in-consultation',
    clinicId: 'cl-2',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'doc-5',
    name: 'Dr. Sameer Kulkarni',
    specialty: 'Dentistry',
    qualification: 'BDS, MDS (Endodontics)',
    experienceYears: 9,
    rating: 4.6,
    consultationFee: 400,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    availableSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM'],
    status: 'available',
    clinicId: 'cl-4',
    avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=150&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    tokenNumber: 'A-101',
    patientName: 'Aarav Mehta',
    patientPhone: '+91 98201 12345',
    patientAge: 34,
    patientGender: 'Male',
    clinicId: 'cl-1',
    clinicName: 'Apex Multi-Specialty Health Clinic',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Sharma',
    specialty: 'General Medicine',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:00 AM',
    symptoms: 'Mild viral fever and body fatigue for 3 days',
    diseaseTag: 'High Fever, Cough & Flu',
    status: 'completed',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'apt-102',
    tokenNumber: 'A-102',
    patientName: 'Rahul Verma (You)',
    patientPhone: '+91 99887 76655',
    patientAge: 28,
    patientGender: 'Male',
    clinicId: 'cl-1',
    clinicName: 'Apex Multi-Specialty Health Clinic',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Sharma',
    specialty: 'General Medicine',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '09:30 AM',
    symptoms: 'Sore throat, dry cough, and running nose',
    diseaseTag: 'High Fever, Cough & Flu',
    status: 'in-consultation',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'apt-103',
    tokenNumber: 'A-103',
    patientName: 'Sunita Deshmukh',
    patientPhone: '+91 98111 22334',
    patientAge: 52,
    patientGender: 'Female',
    clinicId: 'cl-1',
    clinicName: 'Apex Multi-Specialty Health Clinic',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Sharma',
    specialty: 'General Medicine',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00 AM',
    symptoms: 'Routine diabetes check-up and blood pressure monitoring',
    status: 'checked-in',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-104',
    tokenNumber: 'A-104',
    patientName: 'Kabir Khan',
    patientPhone: '+91 98450 99881',
    patientAge: 45,
    patientGender: 'Male',
    clinicId: 'cl-1',
    clinicName: 'Apex Multi-Specialty Health Clinic',
    doctorId: 'doc-1',
    doctorName: 'Dr. Rajesh Sharma',
    specialty: 'General Medicine',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:30 AM',
    symptoms: 'Stomach acidity and indigestion since 2 days',
    status: 'booked',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_QUEUES: QueueStatus[] = [
  {
    clinicId: 'cl-1',
    doctorId: 'doc-1',
    currentServingToken: 'A-102',
    currentServingAppointmentId: 'apt-102',
    estimatedWaitMinutesPerPatient: 12,
    totalTokensToday: 8,
    completedTokensToday: 1,
    lastUpdated: new Date().toISOString(),
  },
  {
    clinicId: 'cl-2',
    doctorId: 'doc-4',
    currentServingToken: 'D-201',
    estimatedWaitMinutesPerPatient: 15,
    totalTokensToday: 5,
    completedTokensToday: 0,
    lastUpdated: new Date().toISOString(),
  },
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Dolo 650',
    genericName: 'Paracetamol 650mg',
    category: 'Analgesic & Antipyretic',
    dosageForm: 'Tablet',
    strength: '650mg',
    manufacturer: 'Micro Labs',
    price: 32,
    stock: 145,
    prescriptionRequired: false,
    sideEffects: 'Rare mild nausea if taken on empty stomach',
    instructions: 'Take 1 tablet after food every 6-8 hours if fever persists.',
  },
  {
    id: 'med-2',
    name: 'Augmentin 625 Duo',
    genericName: 'Amoxicillin + Clavulanic Acid',
    category: 'Antibiotic',
    dosageForm: 'Tablet',
    strength: '625mg',
    manufacturer: 'GSK Pharmaceuticals',
    price: 210,
    stock: 62,
    prescriptionRequired: true,
    sideEffects: 'Mild loose motions, abdominal cramps',
    instructions: 'Take twice daily after meals for a full 5-day course.',
  },
  {
    id: 'med-3',
    name: 'Pan 40',
    genericName: 'Pantoprazole 40mg',
    category: 'Antacid / PPI',
    dosageForm: 'Tablet',
    strength: '40mg',
    manufacturer: 'Alkem Laboratories',
    price: 95,
    stock: 98,
    prescriptionRequired: false,
    sideEffects: 'Headache or mild constipation',
    instructions: 'Take 1 tablet in the morning empty stomach with water.',
  },
  {
    id: 'med-4',
    name: 'Allegra 120',
    genericName: 'Fexofenadine Hydrochloride',
    category: 'Antihistamine / Anti-allergy',
    dosageForm: 'Tablet',
    strength: '120mg',
    manufacturer: 'Sanofi India',
    price: 180,
    stock: 54,
    prescriptionRequired: false,
    sideEffects: 'Mild drowsiness in rare individuals',
    instructions: 'Take 1 tablet at night before sleeping.',
  },
  {
    id: 'med-5',
    name: 'Ascoril D Plus',
    genericName: 'Dextromethorphan + Phenylephrine',
    category: 'Cough Syrup',
    dosageForm: 'Syrup',
    strength: '100ml',
    manufacturer: 'Glenmark Pharma',
    price: 135,
    stock: 38,
    prescriptionRequired: false,
    sideEffects: 'Mild dry mouth',
    instructions: '10ml thrice daily after food with warm water.',
  },
  {
    id: 'med-6',
    name: 'Glycomet GP 1',
    genericName: 'Metformin + Glimepiride',
    category: 'Anti-Diabetic',
    dosageForm: 'Tablet',
    strength: '500mg/1mg',
    manufacturer: 'USV Ltd',
    price: 115,
    stock: 80,
    prescriptionRequired: true,
    sideEffects: 'Risk of hypoglycemia if meal is skipped',
    instructions: 'Take 1 tablet before breakfast.',
  },
  {
    id: 'med-7',
    name: 'Ciplox Eye Drops',
    genericName: 'Ciprofloxacin 0.3%',
    category: 'Ophthalmic Antibiotic',
    dosageForm: 'Ointment',
    strength: '10ml',
    manufacturer: 'Cipla Ltd',
    price: 24,
    stock: 45,
    prescriptionRequired: true,
    sideEffects: 'Temporary mild stinging sensation',
    instructions: 'Instill 2 drops in the affected eye 3 times a day.',
  },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-201',
    appointmentId: 'apt-101',
    tokenNumber: 'A-101',
    patientName: 'Aarav Mehta',
    patientAge: 34,
    patientGender: 'Male',
    doctorName: 'Dr. Rajesh Sharma',
    doctorSpecialty: 'General Medicine',
    clinicName: 'Apex Multi-Specialty Health Clinic',
    clinicAddress: 'Plot 42, Metro Hospital Road, Sector 5',
    date: new Date().toISOString().split('T')[0],
    diagnosis: 'Acute Upper Respiratory Tract Viral Infection',
    vitals: {
      bp: '120/80 mmHg',
      pulse: '76 bpm',
      temp: '99.4 °F',
      weight: '72 kg',
    },
    items: [
      {
        medicineName: 'Dolo 650 (Paracetamol)',
        dosage: '650mg',
        frequency: '1-0-1 (After Food)',
        duration: '3 Days',
        instructions: 'Take if temperature exceeds 99F',
      },
      {
        medicineName: 'Pan 40 (Pantoprazole)',
        dosage: '40mg',
        frequency: '1-0-0 (Empty Stomach)',
        duration: '5 Days',
        instructions: 'In the morning before tea/breakfast',
      },
      {
        medicineName: 'Ascoril D Plus Syrup',
        dosage: '10ml',
        frequency: '1-1-1 (After Food)',
        duration: '4 Days',
        instructions: 'Warm water gargles 3 times a day',
      },
    ],
    doctorAdvice: 'Drink plenty of warm fluids, steam inhalation twice daily. Review if fever does not subside in 72 hours.',
    pharmacyStatus: 'received',
    pharmacyNotes: 'Order ready at Apex Clinic Side Pharmacy counter.',
  },
];

export const INITIAL_ORDERS: PharmacyOrder[] = [
  {
    id: 'ord-301',
    prescriptionId: 'rx-201',
    patientName: 'Aarav Mehta',
    patientPhone: '+91 98201 12345',
    items: [
      { medicineName: 'Dolo 650', quantity: 1, price: 32 },
      { medicineName: 'Pan 40', quantity: 1, price: 95 },
      { medicineName: 'Ascoril D Plus', quantity: 1, price: 135 },
    ],
    totalAmount: 262,
    deliveryType: 'Clinic Pickup',
    status: 'Ready for Pickup',
    createdAt: new Date().toISOString(),
  },
];

// Helper to broadcast changes
export function emitStorageEvent() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('clinic_storage_change'));
  }
}

// Storage Manager
export class StorageService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  static initialize(): void {
    if (!this.isBrowser()) return;

    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      this.resetToDefaults();
    }
  }

  static resetToDefaults(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ROLE, 'patient');
    localStorage.setItem(STORAGE_KEYS.CLINICS, JSON.stringify(INITIAL_CLINICS));
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(STORAGE_KEYS.DISEASES, JSON.stringify(INITIAL_DISEASES));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(INITIAL_QUEUES));
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
    localStorage.setItem(STORAGE_KEYS.PHARMACY_ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    emitStorageEvent();
  }

  // Active Role
  static getRole(): UserRole {
    if (!this.isBrowser()) return 'patient';
    const auth = this.getAuthUser();
    if (auth) return auth.role;
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'patient';
  }

  static setRole(role: UserRole): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    
    // Keep auth user in sync with role if demo accounts exist
    const current = this.getAuthUser();
    if (current && current.role !== role) {
      const matched = DEMO_ACCOUNTS.find(u => u.role === role);
      if (matched) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(matched));
      }
    }

    emitStorageEvent();
  }

  // Auth User Session
  static getAuthUser(): AuthUser | null {
    if (!this.isBrowser()) return null;
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static login(emailOrRole: string): AuthUser {
    if (!this.isBrowser()) throw new Error('Browser only');
    const matched = DEMO_ACCOUNTS.find(
      u => u.email.toLowerCase() === emailOrRole.toLowerCase() || u.role === emailOrRole
    ) || {
      id: `usr-${Date.now()}`,
      email: emailOrRole.includes('@') ? emailOrRole : `${emailOrRole}@clinic.com`,
      name: emailOrRole.split('@')[0],
      role: 'patient' as UserRole,
      title: 'Registered Patient',
      avatarUrl: DEMO_ACCOUNTS[0].avatarUrl,
    };

    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(matched));
    localStorage.setItem(STORAGE_KEYS.ROLE, matched.role);
    emitStorageEvent();
    return matched;
  }

  static logout(): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    emitStorageEvent();
  }

  // Clinics
  static getClinics(): Clinic[] {
    if (!this.isBrowser()) return INITIAL_CLINICS;
    const data = localStorage.getItem(STORAGE_KEYS.CLINICS);
    return data ? JSON.parse(data) : INITIAL_CLINICS;
  }

  // Doctors
  static getDoctors(): Doctor[] {
    if (!this.isBrowser()) return INITIAL_DOCTORS;
    const data = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return data ? JSON.parse(data) : INITIAL_DOCTORS;
  }

  // Diseases & Symptoms
  static getDiseases(): DiseaseSymptom[] {
    if (!this.isBrowser()) return INITIAL_DISEASES;
    const data = localStorage.getItem(STORAGE_KEYS.DISEASES);
    return data ? JSON.parse(data) : INITIAL_DISEASES;
  }

  // Appointments
  static getAppointments(): Appointment[] {
    if (!this.isBrowser()) return INITIAL_APPOINTMENTS;
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : INITIAL_APPOINTMENTS;
  }

  static saveAppointment(appointment: Omit<Appointment, 'id' | 'tokenNumber' | 'createdAt'>): Appointment {
    if (!this.isBrowser()) throw new Error('Browser only');
    const appointments = this.getAppointments();
    
    // Generate token number (e.g. A-105)
    const count = appointments.length + 1;
    const tokenNumber = `TK-${100 + count}`;
    
    const newApt: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`,
      tokenNumber,
      createdAt: new Date().toISOString(),
    };

    appointments.unshift(newApt);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));

    // Update queue total
    const queues = this.getQueues();
    const qIndex = queues.findIndex(q => q.clinicId === appointment.clinicId && q.doctorId === appointment.doctorId);
    if (qIndex >= 0) {
      queues[qIndex].totalTokensToday += 1;
      localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
    }

    emitStorageEvent();
    return newApt;
  }

  static updateAppointmentStatus(id: string, status: Appointment['status']): void {
    if (!this.isBrowser()) return;
    const appointments = this.getAppointments();
    const index = appointments.findIndex(a => a.id === id);
    if (index >= 0) {
      appointments[index].status = status;
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
      emitStorageEvent();
    }
  }

  // Queue Status
  static getQueues(): QueueStatus[] {
    if (!this.isBrowser()) return INITIAL_QUEUES;
    const data = localStorage.getItem(STORAGE_KEYS.QUEUES);
    return data ? JSON.parse(data) : INITIAL_QUEUES;
  }

  static advanceQueue(clinicId: string, doctorId: string): void {
    if (!this.isBrowser()) return;
    const appointments = this.getAppointments().filter(
      a => a.clinicId === clinicId && a.doctorId === doctorId && a.status !== 'cancelled'
    );
    const queues = this.getQueues();
    const qIndex = queues.findIndex(q => q.clinicId === clinicId && q.doctorId === doctorId);

    if (qIndex >= 0 && appointments.length > 0) {
      const currentToken = queues[qIndex].currentServingToken;
      const currentIndex = appointments.findIndex(a => a.tokenNumber === currentToken);

      // Mark current as completed if found
      if (currentIndex >= 0) {
        appointments[currentIndex].status = 'completed';
      }

      // Find next patient
      const nextApt = appointments.find(
        (a, i) => i > currentIndex && (a.status === 'booked' || a.status === 'checked-in')
      );

      if (nextApt) {
        queues[qIndex].currentServingToken = nextApt.tokenNumber;
        queues[qIndex].currentServingAppointmentId = nextApt.id;
        nextApt.status = 'in-consultation';
      } else {
        queues[qIndex].currentServingToken = 'Queue Finished';
        delete queues[qIndex].currentServingAppointmentId;
      }

      queues[qIndex].completedTokensToday += 1;
      queues[qIndex].lastUpdated = new Date().toISOString();

      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(this.getAppointments().map(a => {
        const match = appointments.find(m => m.id === a.id);
        return match || a;
      })));
      localStorage.setItem(STORAGE_KEYS.QUEUES, JSON.stringify(queues));
      emitStorageEvent();
    }
  }

  // Medicines
  static getMedicines(): Medicine[] {
    if (!this.isBrowser()) return INITIAL_MEDICINES;
    const data = localStorage.getItem(STORAGE_KEYS.MEDICINES);
    return data ? JSON.parse(data) : INITIAL_MEDICINES;
  }

  static updateMedicineStock(id: string, delta: number): void {
    if (!this.isBrowser()) return;
    const medicines = this.getMedicines();
    const index = medicines.findIndex(m => m.id === id);
    if (index >= 0) {
      medicines[index].stock = Math.max(0, medicines[index].stock + delta);
      localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
      emitStorageEvent();
    }
  }

  // Prescriptions
  static getPrescriptions(): Prescription[] {
    if (!this.isBrowser()) return INITIAL_PRESCRIPTIONS;
    const data = localStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return data ? JSON.parse(data) : INITIAL_PRESCRIPTIONS;
  }

  static savePrescription(prescription: Omit<Prescription, 'id'>): Prescription {
    if (!this.isBrowser()) throw new Error('Browser only');
    const prescriptions = this.getPrescriptions();
    const newRx: Prescription = {
      ...prescription,
      id: `rx-${Date.now()}`,
    };
    prescriptions.unshift(newRx);
    localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));

    // Also mark appointment as completed
    if (prescription.appointmentId) {
      this.updateAppointmentStatus(prescription.appointmentId, 'completed');
    }

    emitStorageEvent();
    return newRx;
  }

  static updatePrescriptionPharmacyStatus(id: string, status: Prescription['pharmacyStatus']): void {
    if (!this.isBrowser()) return;
    const prescriptions = this.getPrescriptions();
    const index = prescriptions.findIndex(p => p.id === id);
    if (index >= 0) {
      prescriptions[index].pharmacyStatus = status;
      localStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(prescriptions));
      emitStorageEvent();
    }
  }

  // Pharmacy Orders
  static getPharmacyOrders(): PharmacyOrder[] {
    if (!this.isBrowser()) return INITIAL_ORDERS;
    const data = localStorage.getItem(STORAGE_KEYS.PHARMACY_ORDERS);
    return data ? JSON.parse(data) : INITIAL_ORDERS;
  }

  static createPharmacyOrder(order: Omit<PharmacyOrder, 'id' | 'createdAt'>): PharmacyOrder {
    if (!this.isBrowser()) throw new Error('Browser only');
    const orders = this.getPharmacyOrders();
    const newOrder: PharmacyOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.PHARMACY_ORDERS, JSON.stringify(orders));

    if (order.prescriptionId) {
      this.updatePrescriptionPharmacyStatus(order.prescriptionId, 'received');
    }

    emitStorageEvent();
    return newOrder;
  }

  static updatePharmacyOrderStatus(id: string, status: PharmacyOrder['status']): void {
    if (!this.isBrowser()) return;
    const orders = this.getPharmacyOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index >= 0) {
      orders[index].status = status;
      localStorage.setItem(STORAGE_KEYS.PHARMACY_ORDERS, JSON.stringify(orders));
      emitStorageEvent();
    }
  }
}

