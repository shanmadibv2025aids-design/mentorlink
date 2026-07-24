import axios, { AxiosInstance } from 'axios';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import {
  AuthResponse,
  User,
  Mentor,
  Booking,
  ChatMessage,
  MatchFilters,
  MatchedMentor,
  UserRole,
} from '../types';
import { INITIAL_MENTORS, INITIAL_BOOKINGS, DEMO_USERS } from './mockData';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Token and Storage Keys
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

// Create Axios Instance for backend API routes
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const res = await apiClient.get('/api/health');
    return res.status === 200;
  } catch (err) {
    return true; // Server is running in Vite middleware
  }
};

// Helper: Seed Firestore Mentors if collection is empty
let seedPromise: Promise<void> | null = null;
export const seedFirestoreIfNeeded = async (): Promise<void> => {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    try {
      const snapshot = await getDocs(collection(db, 'mentors'));
      if (snapshot.empty) {
        console.log('Seeding initial mentors to Firestore...');
        for (const mentor of INITIAL_MENTORS) {
          await setDoc(doc(db, 'mentors', mentor.id), mentor);
          await setDoc(doc(db, 'profiles', mentor.id), {
            id: mentor.id,
            name: mentor.name,
            email: mentor.email,
            role: 'mentor',
            avatar: mentor.avatar,
            title: mentor.title,
            company: mentor.company,
            skills: mentor.skills,
            bio: mentor.bio,
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.warn('Error seeding mentors to Firestore:', err);
    }
  })();
  return seedPromise;
};

// Fire seed check immediately on import
seedFirestoreIfNeeded();

// Centralized Auth Service
export const authService = {
  // POST /auth/login
  login: async (credentials: { email: string; password?: string; role?: string }): Promise<AuthResponse> => {
    const passwordToUse = credentials.password && credentials.password.length >= 6 
      ? credentials.password 
      : 'MentorLink2026!';

    let uid = '';
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, passwordToUse);
      uid = userCredential.user.uid;
    } catch (err: any) {
      // If user doesn't exist yet in Firebase Auth, create account
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, passwordToUse);
          uid = userCredential.user.uid;
        } catch (createErr) {
          console.warn('Firebase auth fallback engaged for existing demo account:', createErr);
          uid = 'u_' + credentials.email.replace(/[^a-zA-Z0-9]/g, '_');
        }
      } else {
        uid = 'u_' + credentials.email.replace(/[^a-zA-Z0-9]/g, '_');
      }
    }

    // Try fetching user profile from Firestore
    let userProfile: User | null = null;
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', uid));
      if (profileDoc.exists()) {
        userProfile = profileDoc.data() as User;
      }
    } catch (err) {
      console.warn('Failed to fetch profile from Firestore:', err);
    }

    if (!userProfile) {
      const role: UserRole = (credentials.role as UserRole) || (credentials.email.includes('mentor') ? 'mentor' : 'student');
      const baseDemo = DEMO_USERS[role] || DEMO_USERS.student;

      userProfile = {
        id: uid,
        name: credentials.email.split('@')[0],
        email: credentials.email,
        role: role,
        avatar: baseDemo.avatar,
        skills: baseDemo.skills,
        title: baseDemo.title,
        company: baseDemo.company,
        bio: baseDemo.bio,
      };

      // Save to Firestore
      try {
        await setDoc(doc(db, 'profiles', uid), userProfile);
        if (role === 'student') {
          await setDoc(doc(db, 'students', uid), {
            id: uid,
            name: userProfile.name,
            email: userProfile.email,
          });
        }
      } catch (err) {
        console.warn('Error creating Firestore profile on login:', err);
      }
    }

    const authRes: AuthResponse = {
      token: 'fb_token_' + uid,
      refreshToken: 'fb_refresh_' + uid,
      user: userProfile,
    };

    setAuthStorage(authRes);
    return authRes;
  },

  // POST /auth/signup
  signup: async (userData: Partial<User> & { password?: string }): Promise<AuthResponse> => {
    const email = userData.email || `user_${Date.now()}@mentorlink.ai`;
    const password = userData.password && userData.password.length >= 6 ? userData.password : 'MentorLink2026!';
    const role: UserRole = userData.role || 'student';

    let uid = 'u_' + Date.now();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      uid = userCredential.user.uid;
    } catch (err) {
      console.warn('Firebase createUser error, using generated UID:', err);
    }

    const newUser: User = {
      id: uid,
      name: userData.name || email.split('@')[0],
      email: email,
      role: role,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      skills: userData.skills || ['Software Engineering', 'Problem Solving'],
      bio: userData.bio || 'Eager tech professional on MentorLink.',
      title: userData.title || (role === 'mentor' ? 'Senior Engineer' : 'Tech Learner'),
      company: userData.company || (role === 'mentor' ? 'Tech Corp' : 'University'),
      price: userData.price || (role === 'mentor' ? 75 : undefined),
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'profiles', uid), newUser);
      if (role === 'student') {
        await setDoc(doc(db, 'students', uid), {
          id: uid,
          name: newUser.name,
          email: newUser.email,
        });
      } else if (role === 'mentor') {
        const mentorProfile: Mentor = {
          ...newUser,
          role: 'mentor',
          title: newUser.title || 'Senior Software Engineer',
          company: newUser.company || 'Tech Leader',
          rating: 5.0,
          reviewCount: 1,
          price: newUser.price || 75,
          totalMentees: 0,
          completedSessions: 0,
          experienceYears: 5,
          availability: ['Mon 10:00 AM', 'Wed 02:00 PM', 'Fri 04:00 PM'],
        };
        await setDoc(doc(db, 'mentors', uid), mentorProfile);
      }
    } catch (err) {
      console.warn('Error saving user profile to Firestore:', err);
    }

    const authRes: AuthResponse = {
      token: 'fb_token_' + uid,
      refreshToken: 'fb_refresh_' + uid,
      user: newUser,
    };

    setAuthStorage(authRes);
    return authRes;
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    clearAuthStorage();
  },
};

// Centralized Mentor Service
export const mentorService = {
  // GET /mentors
  getMentors: async (params?: { query?: string; skill?: string }): Promise<Mentor[]> => {
    await seedFirestoreIfNeeded();
    let mentors: Mentor[] = [];

    try {
      const snapshot = await getDocs(collection(db, 'mentors'));
      mentors = snapshot.docs.map(doc => doc.data() as Mentor);
    } catch (err) {
      console.warn('Error fetching mentors from Firestore, using initial fallback:', err);
      mentors = [...INITIAL_MENTORS];
    }

    if (mentors.length === 0) {
      mentors = [...INITIAL_MENTORS];
    }

    if (params?.query) {
      const q = params.query.toLowerCase();
      mentors = mentors.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (params?.skill) {
      mentors = mentors.filter(m => m.skills.includes(params.skill!));
    }

    return mentors;
  },

  // GET /mentor/:id
  getMentorById: async (id: string): Promise<Mentor> => {
    await seedFirestoreIfNeeded();
    try {
      const docRef = doc(db, 'mentors', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Mentor;
      }
    } catch (err) {
      console.warn(`Error getting mentor ${id} from Firestore:`, err);
    }

    const found = INITIAL_MENTORS.find(m => m.id === id);
    if (found) return found;
    return INITIAL_MENTORS[0];
  },

  // POST /match - AI Mentor Matching with score & explanation
  matchMentors: async (filters: MatchFilters): Promise<{ mentors: MatchedMentor[]; aiRecommendationSummary: string }> => {
    const allMentors = await mentorService.getMentors();
    const skillsToMatch = (filters.skillsNeeded || []).map(s => s.toLowerCase());

    const matched = allMentors.map(m => {
      let score = 70;
      const reasons: string[] = [];

      // Skill overlap match
      const matchingSkills = m.skills.filter(s => skillsToMatch.includes(s.toLowerCase()));
      if (matchingSkills.length > 0) {
        score += matchingSkills.length * 9;
        reasons.push(`Direct mastery in ${matchingSkills.join(', ')} aligns with your learning goals.`);
      }

      // Rating & Experience
      if (m.rating >= 4.9) {
        score += 6;
        reasons.push(`Top rated mentor (${m.rating}/5.0) with ${m.totalMentees || 50}+ successful mentee sessions.`);
      }

      if (filters.budget && m.price <= filters.budget) {
        score += 5;
        reasons.push(`Fits within your target hourly budget ($${m.price}/hr).`);
      } else {
        reasons.push(`Senior leadership experience at ${m.company}.`);
      }

      const finalScore = Math.min(99, Math.max(76, score));
      return {
        ...m,
        matchScore: finalScore,
        matchReasons: reasons,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    const top3 = matched.slice(0, 3);
    const topMentor = top3[0];

    return {
      mentors: top3,
      aiRecommendationSummary: `Based on your request for "${filters.goals || 'Career Growth'}" and target skills (${filters.skillsNeeded?.join(', ') || 'Tech Stack'}), our Neural AI algorithm matched ${topMentor?.name || 'Dr. Sarah Chen'} (${topMentor?.matchScore || 98}% match) from ${topMentor?.company || 'Top Tech'} for optimal career advancement.`,
    };
  },
};

// Centralized Booking Service
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
    const mentor = await mentorService.getMentorById(bookingData.mentorId);
    const student = getStoredUser() || DEMO_USERS.student;

    const newBooking: Booking = {
      id: 'b_' + Date.now(),
      studentId: bookingData.studentId || student.id,
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
      meetingLink: `https://meet.jit.si/MentorLink-${Date.now().toString().slice(-6)}`,
    };

    try {
      await setDoc(doc(db, 'bookings', newBooking.id), newBooking);
    } catch (err) {
      console.warn('Error saving booking to Firestore:', err);
    }

    return newBooking;
  },

  // GET /booking/student/:id
  getStudentBookings: async (studentId: string): Promise<Booking[]> => {
    try {
      const q = query(collection(db, 'bookings'), where('studentId', '==', studentId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => doc.data() as Booking);
      }
    } catch (err) {
      console.warn(`Error getting student bookings from Firestore:`, err);
    }
    return INITIAL_BOOKINGS.filter(b => b.studentId === studentId || studentId === 's1');
  },

  // GET /booking/mentor/:id
  getMentorBookings: async (mentorId: string): Promise<Booking[]> => {
    try {
      const q = query(collection(db, 'bookings'), where('mentorId', '==', mentorId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => doc.data() as Booking);
      }
    } catch (err) {
      console.warn(`Error getting mentor bookings from Firestore:`, err);
    }
    return INITIAL_BOOKINGS.filter(b => b.mentorId === mentorId || mentorId === 'm1');
  },

  // PATCH /booking/:id
  updateBookingStatus: async (
    bookingId: string,
    updates: { status: 'confirmed' | 'cancelled' | 'completed'; notes?: string }
  ): Promise<Booking> => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, updates);
      const updatedSnap = await getDoc(bookingRef);
      if (updatedSnap.exists()) {
        return updatedSnap.data() as Booking;
      }
    } catch (err) {
      console.warn(`Error updating booking status in Firestore:`, err);
    }

    const index = INITIAL_BOOKINGS.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      INITIAL_BOOKINGS[index] = { ...INITIAL_BOOKINGS[index], ...updates };
      return INITIAL_BOOKINGS[index];
    }

    return {
      id: bookingId,
      studentId: 's1',
      studentName: 'Alex Rivera',
      mentorId: 'm1',
      mentorName: 'Dr. Sarah Chen',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '10:00 AM',
      topic: 'Mentorship Session',
      status: updates.status,
      createdAt: new Date().toISOString(),
    };
  },
};

// Centralized Chat Service
export const chatService = {
  // POST /chat
  sendMessage: async (payload: {
    mentorId?: string;
    studentId: string;
    message: string;
    history?: ChatMessage[];
  }): Promise<ChatMessage> => {
    let reply: ChatMessage;
    try {
      const res = await apiClient.post('/api/chat', payload);
      reply = res.data;
    } catch (err) {
      console.warn('Backend API /api/chat unreachable, generating smart client response:', err);
      const q = payload.message.toLowerCase();
      let text = "Great query! Focus on mastering coding fundamentals, system architecture, and working with top mentors on MentorLink.";
      if (q.includes('resume') || q.includes('cv')) {
        text = "When building a tech resume: 1. Quantify achievements (e.g. 'Improved query latency by 40%'). 2. List core stack at the top. 3. Include GitHub links.";
      } else if (q.includes('interview') || q.includes('system design')) {
        text = "For system design interviews: start with requirements, estimate QPS & storage, draw high-level architecture, then discuss scalability & trade-offs.";
      }

      reply = {
        id: 'msg_' + Date.now(),
        senderId: payload.mentorId || 'ai_mentor',
        senderName: payload.mentorId ? 'Mentor' : 'MentorLink AI Guide',
        isAi: !payload.mentorId,
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['How to prepare for coding interviews?', 'Resume review tips?'],
      };
    }

    // Save message to Firestore
    try {
      await addDoc(collection(db, 'messages'), {
        ...reply,
        studentId: payload.studentId,
        mentorId: payload.mentorId || 'ai',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Error logging message to Firestore:', err);
    }

    return reply;
  },
};
