import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { MentorMatchingPage } from './pages/MentorMatchingPage';
import { MentorProfilePage } from './pages/MentorProfilePage';
import { BookingPage } from './pages/BookingPage';
import { AiChatPage } from './pages/AiChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { MentorDashboardPage } from './pages/MentorDashboardPage';
import { StudentRequestsPage } from './pages/StudentRequestsPage';
import { BookingManagementPage } from './pages/BookingManagementPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const showSidebar =
    location.pathname.includes('dashboard') ||
    location.pathname.includes('requests') ||
    location.pathname === '/profile' ||
    location.pathname === '/bookings';

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-slate-100 font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {showSidebar && <Sidebar />}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 ${!showSidebar ? 'max-w-7xl w-full mx-auto' : ''}`}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/mentor/:id" element={<MentorProfilePage />} />

                  {/* Protected Student Routes */}
                  <Route
                    path="/student/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['student', 'mentor']}>
                        <StudentDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Matching & Chat */}
                  <Route
                    path="/matching"
                    element={
                      <ProtectedRoute>
                        <MentorMatchingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/booking/new"
                    element={
                      <ProtectedRoute>
                        <BookingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <AiChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <ProtectedRoute>
                        <BookingManagementPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Protected Mentor Routes */}
                  <Route
                    path="/mentor/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['mentor']}>
                        <MentorDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mentor/requests"
                    element={
                      <ProtectedRoute allowedRoles={['mentor']}>
                        <StudentRequestsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
