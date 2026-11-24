# ClinicPulse - Medical Clinic Appointment Booking & Live Token System

A modern, enterprise-ready healthcare appointment scheduling, electronic health records (EHR), real-time virtual queue, and side-medicine pharmacy fulfillment platform built with **Next.js 14 (App Router)** and **Tailwind CSS**.

---

## 🌟 Key Platform Capabilities

1. **Intelligent Clinic & Doctor Discovery**:
   - Patients search clinics by health issues and symptoms (e.g., Chest Pain, Acne, Knee Arthritis, Toothache, High Fever, Migraine).
   - Dynamic clinical triage maps symptoms to verified specialties (*Cardiology, Dermatology, Orthopedics, General Medicine, Dentistry, Neurology, Pediatrics*).
   - Real-time clinic profiles displaying distance (km), doctor ratings, consultation fees, and attached side-medicine counters.

2. **24/7 Concurrency-Safe Appointment Booking**:
   - Multi-doctor schedule calendars with slot locking.
   - Immediate generation of unique patient sequence tokens (e.g. `TK-105`).

3. **Live Virtual Waiting Room & Queue Tracker**:
   - Eliminates crowded outpatient waiting rooms.
   - Live waiting room counter: `Now Serving Token`, `Your Token`, `Patients Ahead`, and dynamic estimated wait time.

4. **Electronic Health Records (EHR) & Printable Digital Prescriptions**:
   - Certified clinical notes, vitals recording (BP, Pulse, Temp, Weight), and clinical diagnosis.
   - Official printable prescription format with clinic letterhead, Rx medication schedule (`1-0-1`), and doctor's signature.
   - One-click prescription forward to the clinic's attached **Side Medicine** dispensary.

5. **Integrated Side Medicine & Dispensary Counter**:
   - In-clinic pharmacy management.
   - Drug catalog with composition, stock levels, dosage instructions, and ordering.
   - Dispensary order pipeline: `Received` $\rightarrow$ `Preparing` $\rightarrow$ `Ready at Counter` $\rightarrow$ `Dispensed`.

---

## 🔐 Clinical Portals & User Roles

Access each role through the secure Sign In Portal at:
👉 **[http://localhost:3000/login](http://localhost:3000/login)**

### Pre-Configured Clinical Accounts:

| Role | Sign-In Email | Password | Staff / User | Workspace Portal |
| :--- | :--- | :--- | :--- | :--- |
| **Patient** | `patient@clinic.com` | `password123` | Rahul Verma | `/` (Discovery, Booking & Records) |
| **Doctor** | `doctor@clinic.com` | `password123` | Dr. Rajesh Sharma, MD | `/doctor` (OPD Queue & Rx Pad) |
| **Staff Reception** | `staff@clinic.com` | `password123` | Priya Sharma | `/staff` (Walk-in Tokens & Check-ins) |
| **Side Medicine** | `pharmacy@clinic.com` | `password123` | Vikram Seth | `/pharmacy` (Dispensary Fulfillment) |

---

## 🛠️ Architecture & Tech Stack

- **Frontend & App Framework**: Next.js 14 (App Router, React Server Components)
- **Styling**: Tailwind CSS (Clean, light aesthetic healthcare UI)
- **Icons**: Lucide React
- **Client-Side Persistence**: Browser `localStorage` engine with event synchronization across tabs (`clinic_storage_change`).
- **Security Compliance**: Designed for HIPAA-standard session state, Protected Health Information (PHI) encryption, and role-based permissions.

---

## 🚀 Running the Platform Locally

### Prerequisites
- Node.js (v18.x, v20.x, or v22.x)
- npm or pnpm

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
