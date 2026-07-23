export type UserRole = 'student' | 'mentor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  title?: string;
  company?: string;
  skills: string[];
  rating?: number;
  reviewCount?: number;
  price?: number; // Hourly rate in USD
  location?: string;
  github?: string;
  linkedin?: string;
  availability?: string[];
  totalMentees?: number;
  completedSessions?: number;
  experienceYears?: number;
}

export interface Review {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Mentor extends User {
  role: 'mentor';
  title: string;
  company: string;
  rating: number;
  reviewCount: number;
  price: number;
  totalMentees: number;
  reviews?: Review[];
  education?: string[];
  experience?: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar?: string;
  mentorTitle?: string;
  mentorCompany?: string;
  date: string;
  timeSlot: string;
  topic: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  price?: number;
  meetingLink?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  isAi?: boolean;
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export interface MatchFilters {
  goals: string;
  skillsNeeded: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  budget?: number;
  availability?: string;
}

export interface MatchedMentor extends Mentor {
  matchScore: number; // e.g., 95 for 95%
  matchReasons: string[];
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
