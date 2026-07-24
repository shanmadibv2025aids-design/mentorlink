import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User, UserRole } from '../types';
import {
  authService,
  getStoredUser,
  getStoredToken,
  clearAuthStorage,
  setAuthStorage,
} from '../services/api';
import { DEMO_USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password?: string; role?: string }) => Promise<User>;
  signup: (userData: Partial<User> & { password?: string }) => Promise<User>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  updateUser: (fields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check initial auth state from storage or default to demo student for preview
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      setUser(storedUser);
      setIsLoading(false);
    } else {
      const defaultUser = DEMO_USERS.student;
      setUser(defaultUser);
      setAuthStorage({
        token: 'default_preview_token',
        refreshToken: 'default_refresh_token',
        user: defaultUser,
      });
      setIsLoading(false);
    }

    // Subscribe to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const docSnap = await getDoc(doc(db, 'profiles', fbUser.uid));
          if (docSnap.exists()) {
            const fetchedUser = docSnap.data() as User;
            setUser(fetchedUser);
            setAuthStorage({
              token: 'fb_token_' + fbUser.uid,
              refreshToken: 'fb_refresh_' + fbUser.uid,
              user: fetchedUser,
            });
          }
        } catch (err) {
          console.warn('Error syncing Firebase Auth user profile:', err);
        }
      }
    });

    const handleForceLogout = () => {
      setUser(null);
    };
    window.addEventListener('mentorlink_logout', handleForceLogout);

    return () => {
      unsubscribe();
      window.removeEventListener('mentorlink_logout', handleForceLogout);
    };
  }, []);

  const login = async (credentials: { email: string; password?: string; role?: string }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: Partial<User> & { password?: string }): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await authService.signup(userData);
      setUser(res.user);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchDemoRole = (role: UserRole) => {
    const targetUser = DEMO_USERS[role];
    setUser(targetUser);
    setAuthStorage({
      token: `demo_${role}_token`,
      refreshToken: `demo_${role}_refresh`,
      user: targetUser,
    });
  };

  const updateUser = (fields: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem('mentorlink_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        switchDemoRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

