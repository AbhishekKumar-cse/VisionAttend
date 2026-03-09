# EduAttend AI - Smart Campus Biometric Attendance

EduAttend AI is a state-of-the-art, web-based facial recognition system specifically designed for modern academic institutions. It replaces manual roll calls and expensive biometric hardware with a seamless, AI-driven experience for students, faculty, and administrators.

---

## 🏫 The Problem
Traditional attendance tracking in schools and colleges is:
- **Time-Consuming:** Manual roll calls take up 10-15% of lecture time.
- **Inaccurate:** Susceptible to "proxy" attendance and human error.
- **Hardware Heavy:** Dedicated biometric machines are expensive to install and maintain across multiple buildings.
- **Data Silos:** Attendance logs rarely translate into actionable student success insights.

## 💡 The Solution
EduAttend AI leverages high-performance AI models and standard web hardware (laptops/tablets) to provide:
1. **Instant Verification:** Face recognition in under 2 seconds.
2. **Quality Assurance:** AI guidance during enrollment to ensure "clean" biometric data.
3. **Behavioral Analysis:** Generative AI that identifies patterns in absenteeism and punctuality.
4. **Zero-Trust Security:** Secure identification for students, professors, and staff.

---

## ✨ Key Features

### 1. AI-Assisted Biometric Enrollment
Administrators can enroll users with real-time feedback. The AI analyzes lighting, angles, and clarity to ensure the facial profile is optimal for future recognition.

### 2. Smart ID Verification
A "one-tap" scanning interface for lecture halls and campus gates. It uses Gemini-powered vision analysis to match faces against the academic directory.

### 3. Academic Dashboard & Insights
A high-level overview for Deans and Registrars. It features:
- **Scan Volume:** Real-time departmental attendance charts.
- **AI Reports:** Automated summaries of student behavior and "Dean's Attention" alerts for unusual absenteeism.

### 4. Campus Directory
A centralized management hub for Student and Professor profiles, including academic year tracking and biometric status.

---

## 🏗️ Architecture & System Design

EduAttend AI is built on a modern serverless architecture utilizing Next.js for the frontend and Genkit for the AI orchestration.

### System Diagram (Conceptual)
```text
[ CLIENT LAYER ]
      |
      |-- Camera Component (Browser API)
      |-- Next.js App Router (React Server Components)
      v
[ APPLICATION LAYER ]
      |
      |-- Server Actions (Entry points for AI requests)
      |-- Data Service (LocalStorage persistence layer)
      v
[ AI ORCHESTRATION LAYER (Genkit) ]
      |
      |-- Enrollment Flow (Analysis & Feedback)
      |-- Recognition Flow (Matching & Verification)
      |-- Insight Flow (Data Summarization)
      v
[ MODEL LAYER ]
      |
      |-- Google Gemini 2.5 Flash (Vision & Reasoning)
```

---

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router, Turbopack)
- **AI Framework:** Genkit (Google AI Plugin)
- **Model:** Gemini 2.5 Flash
- **Styling:** Tailwind CSS + ShadCN UI
- **Icons:** Lucide React
- **Charts:** Recharts
- **Language:** TypeScript

---

## 📂 Detailed File Structure

```text
src/
├── ai/                      # AI Core Logic
│   ├── flows/               # Genkit Business Logic (Server-side)
│   │   ├── facial-profile.ts   # Enrollment quality analysis
│   │   ├── recognition.ts      # Facial matching logic
│   │   └── insights.ts         # Data analysis for Deans
│   └── genkit.ts            # Genkit initialization & configuration
├── app/                     # Next.js App Router
│   ├── dashboard/           # Authenticated experience
│   │   ├── enroll/          # User registration page
│   │   ├── mark/            # Live scanning interface
│   │   ├── reports/         # Historical logs
│   │   └── users/           # Academic directory
│   ├── globals.css          # Theme variables & Tailwind base
│   └── layout.tsx           # Root configuration & fonts
├── components/              # UI Component Library
│   ├── attendance/          # Business-specific components (CameraView)
│   ├── dashboard/           # Navigation & Layout components
│   └── ui/                  # Reusable ShadCN components
├── lib/                     # Utilities & Services
│   ├── data-service.ts      # Data persistence logic
│   ├── types.ts             # Global TypeScript interfaces
│   └── utils.ts             # Tailwind class merging
└── hooks/                   # Custom React Hooks (toasts, mobile detection)
```

---

## 🚀 Getting Started

1. **Environment Setup:** Ensure your `.env` file contains your `GEMINI_API_KEY`.
2. **Installation:** Run `npm install`.
3. **Development:** Execute `npm run dev`.
4. **Biometric Capture:** Navigate to `/dashboard/enroll` to begin your first AI-assisted registration.

## 🛡️ Security & Privacy
Biometric data is processed as data URIs and matched using secure AI flows. In production, this system is designed to integrate with Firebase Auth and Firestore for encrypted, enterprise-grade data storage.
