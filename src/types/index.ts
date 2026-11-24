export type UserRole = 'patient' | 'doctor' | 'staff' | 'pharmacy';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  title: string;
  avatarUrl: string;
  clinicId?: string;
  clinicName?: string;
}

export interface DiseaseSymptom {
  id: string;
  name: string;
  category: string;
  symptoms: string[];
  recommendedSpecialty: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experienceYears: number;
  rating: number;
  consultationFee: number;
  availableDays: string[];
  availableSlots: string[]; // e.g., ["09:00 AM", "09:30 AM", ...]
  status: 'available' | 'in-consultation' | 'on-break' | 'offline';
  clinicId: string;
  avatarUrl: string;
}

export interface Clinic {
  id: string;
  name: string;
  tagline: string;
  specialties: string[];
  address: string;
  city: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  phone: string;
  openHours: string;
  hasPharmacy: boolean; // "Side Medicine" attachment
  doctorIds: string[];
}

export interface Appointment {
  id: string;
  tokenNumber: string; // e.g., "A-102"
  patientName: string;
  patientPhone: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  clinicId: string;
  clinicName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:30 AM"
  symptoms: string;
  diseaseTag?: string;
  status: 'booked' | 'checked-in' | 'in-consultation' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
}

export interface QueueStatus {
  clinicId: string;
  doctorId: string;
  currentServingToken: string;
  currentServingAppointmentId?: string;
  estimatedWaitMinutesPerPatient: number;
  totalTokensToday: number;
  completedTokensToday: number;
  lastUpdated: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string; // Antibiotic, Analgesic, Antacid, etc.
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Ointment' | 'Injection';
  strength: string; // e.g. "500mg"
  manufacturer: string;
  price: number;
  stock: number;
  prescriptionRequired: boolean;
  sideEffects: string;
  instructions: string;
}

export interface PrescriptionItem {
  medicineId?: string;
  medicineName: string;
  dosage: string; // "500mg"
  frequency: string; // "1-0-1 (After Food)"
  duration: string; // "5 Days"
  instructions: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  tokenNumber: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorName: string;
  doctorSpecialty: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  diagnosis: string;
  vitals: {
    bp: string;
    pulse: string;
    temp: string;
    weight: string;
  };
  items: PrescriptionItem[];
  doctorAdvice: string;
  pharmacyStatus: 'not-ordered' | 'received' | 'packed' | 'dispensed';
  pharmacyNotes?: string;
}

export interface PharmacyOrder {
  id: string;
  prescriptionId?: string;
  patientName: string;
  patientPhone: string;
  items: {
    medicineName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  deliveryType: 'Clinic Pickup' | 'Home Delivery';
  status: 'Received' | 'Preparing' | 'Ready for Pickup' | 'Completed';
  createdAt: string;
}

