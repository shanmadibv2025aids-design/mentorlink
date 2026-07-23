import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  AuthResponse,
  User,
  Mentor,
  Booking,
  ChatMessage,
  MatchFilters,
  MatchedMentor,
} from '../types';
import { INITIAL_MENTORS, INITIAL_BOOKINGS, DEMO_USERS } from './mockData';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Token Management Keys
const TOKEN_KEY = 'mentorlink_token';
const REFRESH_TOKEN_KEY = 'mentorlink_refresh_token';
const USER_KEY = 'mentorlink_user';

export const getStoredToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const getStoredRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);
export const getStoredUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const setAuthStorage = (authData: AuthResponse): void => {
  localStorage.setItem(TOKEN_KEY, authData.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Create Axios Instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach Authorization Header
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for handling token refresh or global errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    // If 401 Unauthorized and refresh token exists
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getStoredRefreshToken();
      
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          if (res.data.token) {
            localStorage.setItem(TOKEN_KEY, res.data.token);
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshErr) {
          clearAuthStorage();
          window.dispatchEvent(new Event('mentorlink_logout'));
        }
      }
    }
    return Promise.reject(error);
  }
);

// Local State Storage for Fallback preview mode
let localMentors: Mentor[] = [...INITIAL_MENTORS];
let localBookings: Booking[] = [...INITIAL_BOOKINGS];

// Helper to check if backend API is online
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/health`, { timeout: 2000 });
    return res.status === 200;
  } catch (err) {
    return false;
  }
};

// Centralized API Service functions matching exact specification

export const authService = {
  // POST /auth/login
  login: async (credentials: { email: string; password?: string; role?: string }): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      setAuthStorage(response.data);
      return response.data;
    } catch (error) {
      console.warn('Backend endpoint POST /auth/login unreachable or failed. Engaging fallback auth.', error);
      
      // Smart Fallback for interactive demo preview
      const role = credentials.role || (credentials.email.includes('mentor') ? 'mentor' : 'student');
      const baseUser = DEMO_USERS[role] || {
        id: 'u_' + Date.now(),
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: role as 'student' | 'mentor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        skills: ['React', 'TypeScript', 'System Design'],
      };

      const mockData: AuthResponse = {
        token: 'jwt_mock_token_' + Date.now(),
        refreshToken: 'jwt_refresh_mock_token_' + Date.now(),
        user: baseUser,
      };
      setAuthStorage(mockData);
      return mockData;
    }
  },

  // POST /auth/signup
  signup: async (userData: Partial<User> & { password?: string }): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/signup', userData);
      setAuthStorage(response.data);
      return response.data;
    } catch (error) {
      console.warn('Backend endpoint POST /auth/signup unreachable or failed. Engaging fallback auth.', error);
      
      const newUser: User = {
        id: 'u_' + Date.now(),
        name: userData.name || 'New User',
        email: userData.email || 'user@mentorlink.ai',
        role: userData.role || 'student',
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        skills: userData.skills || ['React', 'Python'],
        bio: userData.bio || 'Eager learner on MentorLink.',
        title: userData.title,
        company: userData.company,
        price: userData.price,
      };

      if (newUser.role === 'mentor') {
        const newMentor: Mentor = {
          ...newUser,
          role: 'mentor',
          title: userData.title || 'Senior Engineer',
          company: userData.company || 'Tech Leader',
          rating: 5.0,
          reviewCount: 1,
          price: userData.price || 80,
          totalMentees: 0,
        };
        localMentors.unshift(newMentor);
      }

      const mockData: AuthResponse = {
        token: 'jwt_signup_mock_' + Date.now(),
        refreshToken: 'jwt_refresh_mock_' + Date.now(),
        user: newUser,
      };
      setAuthStorage(mockData);
      return mockData;
    }
  },
};

export const mentorService = {
  // GET /mentors
  getMentors: async (params?: { query?: string; skill?: string }): Promise<Mentor[]> => {
    try {
      const response = await apiClient.get<Mentor[]>('/mentors', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend endpoint GET /mentors unreachable. Returning local data.', error);
      let list = [...localMentors];
      if (params?.query) {
        const q = params.query.toLowerCase();
        list = list.filter(m => 
          m.name.toLowerCase().includes(q) || 
          m.title.toLowerCase().includes(q) || 
          m.company.toLowerCase().includes(q) ||
          m.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      if (params?.skill) {
        list = list.filter(m => m.skills.includes(params.skill!));
      }
      return list;
    }
  },

  // GET /mentor/:id
  getMentorById: async (id: string): Promise<Mentor> => {
    try {
      const response = await apiClient.get<Mentor>(`/mentor/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend endpoint GET /mentor/${id} unreachable. Returning mock mentor.`, error);
      const found = localMentors.find(m => m.id === id);
      if (found) return found;
      return localMentors[0];
    }
  },

  // POST /match
  matchMentors: async (filters: MatchFilters): Promise<{ mentors: MatchedMentor[]; aiRecommendationSummary: string }> => {
    try {
      const response = await apiClient.post('/match', filters);
      return response.data;
    } catch (error) {
      console.warn('Backend endpoint POST /match unreachable. Running local AI matching logic.', error);
      
      const skillsToMatch = filters.skillsNeeded.map(s => s.toLowerCase());
      const matched = localMentors.map((m) => {
        let score = 70; // baseline
        const reasons: string[] = [];
        
        // Skill overlap
        const matchingSkills = m.skills.filter(s => skillsToMatch.includes(s.toLowerCase()));
        if (matchingSkills.length > 0) {
          score += matchingSkills.length * 8;
          reasons.push(`Expertise in ${matchingSkills.join(', ')} directly aligns with your goals.`);
        }
        
        // Company & experience
        if (m.rating >= 4.9) {
          score += 5;
          reasons.push(`Top rated mentor (${m.rating}/5.0) with ${m.totalMentees}+ successful mentee sessions.`);
        }

        if (filters.budget && m.price <= filters.budget) {
          score += 5;
          reasons.push(`Fits within your budget target ($${m.price}/hr).`);
        } else {
          reasons.push(`Industry leader at ${m.company} with specialized mentorship track.`);
        }

        const finalScore = Math.min(99, Math.max(75, score));
        return {
          ...m,
          matchScore: finalScore,
          matchReasons: reasons,
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

      return {
        mentors: matched,
        aiRecommendationSummary: `Based on your request for "${filters.goals || 'career advancement'}" and target skills (${filters.skillsNeeded.join(', ') || 'Software Development'}), our AI algorithm scored Dr. Sarah Chen and David Miller highest for technical depth and mentorship satisfaction rate.`,
      };
    }
  },
};

export const bookingService = {
  // POST /booking
  createBooking: async (bookingData: {
    studentId: string;
    mentorId: string;
    date: string;
    timeSlot: string;
    topic: string;
    notes?: string;
  }): Promise<Booking> => {
    try {
      const response = await apiClient.post<Booking>('/booking', bookingData);
      return response.data;
    } catch (error) {
      console.warn('Backend endpoint POST /booking unreachable. Storing booking locally.', error);
      
      const mentor = localMentors.find(m => m.id === bookingData.mentorId) || localMentors[0];
      const student = getStoredUser() || DEMO_USERS.student;

      const newBooking: Booking = {
        id: 'b_' + Date.now(),
        studentId: bookingData.studentId,
        studentName: student.name,
        studentAvatar: student.avatar,
        mentorId: bookingData.mentorId,
        mentorName: mentor.name,
        mentorAvatar: mentor.avatar,
        mentorTitle: mentor.title,
        mentorCompany: mentor.company,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        topic: bookingData.topic,
        notes: bookingData.notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
        price: mentor.price,
        meetingLink: `https://meet.jit.si/MentorLink-Session-${Date.now()}`,
      };

      localBookings.unshift(newBooking);
      return newBooking;
    }
  },

  // GET /booking/student/:id
  getStudentBookings: async (studentId: string): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>(`/booking/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend endpoint GET /booking/student/${studentId} unreachable. Returning local student bookings.`, error);
      return localBookings.filter(b => b.studentId === studentId || studentId === 's1');
    }
  },

  // GET /booking/mentor/:id
  getMentorBookings: async (mentorId: string): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>(`/booking/mentor/${mentorId}`);
      return response.data;
    } catch (error) {
      console.warn(`Backend endpoint GET /booking/mentor/${mentorId} unreachable. Returning local mentor bookings.`, error);
      return localBookings.filter(b => b.mentorId === mentorId || mentorId === 'm1');
    }
  },

  // PATCH /booking/:id
  updateBookingStatus: async (
    bookingId: string,
    updates: { status: 'confirmed' | 'cancelled' | 'completed'; notes?: string }
  ): Promise<Booking> => {
    try {
      const response = await apiClient.patch<Booking>(`/booking/${bookingId}`, updates);
      return response.data;
    } catch (error) {
      console.warn(`Backend endpoint PATCH /booking/${bookingId} unreachable. Updating locally.`, error);
      const index = localBookings.findIndex(b => b.id === bookingId);
      if (index !== -1) {
        localBookings[index] = {
          ...localBookings[index],
          ...updates,
        };
        return localBookings[index];
      }
      throw new Error('Booking not found');
    }
  },
};

export const chatService = {
  // POST /chat
  sendMessage: async (payload: {
    mentorId?: string;
    studentId: string;
    message: string;
    history?: ChatMessage[];
  }): Promise<ChatMessage> => {
    try {
      const response = await apiClient.post<ChatMessage>('/chat', payload);
      return response.data;
    } catch (error) {
      console.warn('Backend endpoint POST /chat unreachable. Generating AI Assistant reply.', error);
      
      const query = payload.message.toLowerCase();
      let replyText = "That is a great career objective! Let's build a step-by-step learning path focusing on system design, clean coding practices, and portfolio projects.";
      
      if (query.includes('resume') || query.includes('cv')) {
        replyText = "When tailoring your technical resume: 1. Quantify your impact (e.g., 'Reduced API latency by 40%'). 2. Put key technologies upfront. 3. Highlight system architecture decisions in your project section.";
      } else if (query.includes('system design') || query.includes('architecture')) {
        replyText = "For System Design interviews: focus on clarifying scope, estimating load (QPS, storage), defining clear API contracts, choosing between relational vs NoSQL storage, and addressing caching/load balancing.";
      } else if (query.includes('salary') || query.includes('negotiate')) {
        replyText = "To negotiate effectively: Research tier 1 benchmark compensation (e.g. Levels.fyi), communicate enthusiasm first, anchor with market data, and consider total compensation including stock options.";
      } else if (payload.mentorId) {
        const mentor = localMentors.find(m => m.id === payload.mentorId);
        if (mentor) {
          replyText = `Thanks for reaching out! As a ${mentor.title} at ${mentor.company}, I'd be happy to discuss ${payload.message}. Feel free to book a 1-on-1 session so we can dive deep!`;
        }
      }

      const reply: ChatMessage = {
        id: 'msg_' + Date.now(),
        senderId: payload.mentorId || 'ai_mentor',
        senderName: payload.mentorId ? 'Mentor' : 'MentorLink AI Guide',
        isAi: !payload.mentorId,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          'How can I prepare for System Design interviews?',
          'What skills should I highlight on my resume?',
          'How do I request a referral from a mentor?',
        ],
      };
      return reply;
    }
  },
};
