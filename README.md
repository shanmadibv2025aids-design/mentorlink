# MentorLink — AI-Powered Mentorship Platform

MentorLink connects students and tech professionals with staff engineers, research scientists, and product leaders for 1-on-1 mentorship, career guidance, and resume reviews.

## Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion
- **Backend & Database**: Firebase Authentication, Cloud Firestore, Express Server (Vite Node Server)
- **AI Integration**: Gemini 2.5 Flash / Groq Llama 3.3 for AI Chat Assistant and Neural Mentor Matching

---

## Firebase Setup

This project uses **Firebase** for persistence and user authentication:

1. **Firebase Authentication**: Email & Password auth for students and mentors.
2. **Cloud Firestore**: Persistent collections for profiles, students, mentors, bookings, and messages.

### Firestore Collections

- `profiles/{userId}`: Unified profile document for authenticated users.
- `students/{studentId}`: Student-specific preferences, learning goals, and department.
- `mentors/{mentorId}`: Mentor profiles, pricing, rating, skills, and availability slots.
- `bookings/{bookingId}`: 1-on-1 mentorship session bookings with status (`pending`, `confirmed`, `cancelled`, `completed`).
- `messages/{messageId}`: Chat history between students, mentors, and the AI Assistant.

---

## Environment Variables

Copy `.env.example` to `.env` or configure variables in your hosting environment:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=optional_groq_api_key_here
VITE_API_URL=http://localhost:3000
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
npm start
```

---

## Security & Rules

Firestore Security Rules are configured in `firestore.rules`:
- Users can read public mentor listings.
- Students and mentors can create and read their own session bookings.
- Only assigned mentors can accept or reject bookings assigned to them.
- Profile data can only be modified by the profile owner.
