import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService, mentorService } from '../services/api';
import { BookingCard } from '../components/cards/BookingCard';
import { MentorCard } from '../components/cards/MentorCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import {
  Sparkles,
  Calendar,
  Clock,
  Compass,
  Award,
  TrendingUp,
  Bot,
  Video,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const studentId = user?.id || 's1';

  // Fetch Student Bookings: GET /booking/student/:id
  const {
    data: bookings,
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
  } = useQuery({
    queryKey: ['studentBookings', studentId],
    queryFn: () => bookingService.getStudentBookings(studentId),
  });

  // Fetch Recommended Mentors
  const { data: mentors } = useQuery({
    queryKey: ['recommendedMentors'],
    queryFn: () => mentorService.getMentors(),
  });

  // Booking status update mutation: PATCH /booking/:id
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'cancelled' | 'completed' }) =>
      bookingService.updateBookingStatus(id, { status }),
    onSuccess: () => {
      showToast('Booking Updated', 'Session status was updated successfully');
      queryClient.invalidateQueries({ queryKey: ['studentBookings', studentId] });
    },
  });

  const chartData = [
    { month: 'Mar', hours: 2 },
    { month: 'Apr', hours: 4 },
    { month: 'May', hours: 6 },
    { month: 'Jun', hours: 10 },
    { month: 'Jul', hours: 14 },
  ];

  const pendingCount = bookings?.filter((b) => b.status === 'pending').length || 0;
  const confirmedCount = bookings?.filter((b) => b.status === 'confirmed').length || 0;
  const completedCount = bookings?.filter((b) => b.status === 'completed').length || 0;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/60 via-[#151515] to-[#151515] text-white border border-white/5 shadow-xl shadow-black/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-xs font-semibold border border-blue-500/20 text-blue-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Student Learning Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Alex'}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            You have <strong className="text-amber-300">{confirmedCount} upcoming session</strong> this week. Keep up your 12-day mentorship learning streak!
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/matching"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              Find New AI Match
            </Link>
            <Link
              to="/chat"
              className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-slate-200 font-semibold text-xs border border-white/10 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              Ask AI Career Advisor
            </Link>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Upcoming Sessions</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {confirmedCount}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +2 this month
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pending Requests</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {pendingCount}
          </p>
          <p className="text-[11px] text-slate-500">Awaiting mentor approval</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Completed Sessions</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {completedCount}
          </p>
          <p className="text-[11px] text-slate-500">14 total mentorship hours</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Learning Streak</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">
            12 Days
          </p>
          <p className="text-[11px] text-emerald-400 font-medium">Top 5% active mentees</p>
        </div>
      </div>

      {/* Main Grid: Bookings + Recharts Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Session Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                My Mentorship Bookings
              </h2>
              <p className="text-xs text-slate-400">
                Fetched via <code className="text-blue-400">GET /booking/student/:id</code>
              </p>
            </div>
            <Link
              to="/bookings"
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              View All Bookings
            </Link>
          </div>

          {isLoadingBookings ? (
            <LoadingSkeleton type="list" />
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  currentUserRole="student"
                  onStatusUpdate={(id, status) => statusMutation.mutate({ id, status })}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#151515] border border-white/5 space-y-3">
              <p className="text-sm text-slate-400">No active bookings yet.</p>
              <Link
                to="/matching"
                className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium"
              >
                Match with a Mentor
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Recharts Graph & AI Tip */}
        <div className="space-y-6">
          
          <div className="p-6 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-4">
            <h3 className="font-bold text-white text-sm">
              Mentorship Learning Hours
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151515',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#151515] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Bot className="w-4 h-4" />
              <span>AI Career Recommendation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your System Design goals, schedule a 1-on-1 mock interview session with Dr. Sarah Chen before August 1st.
            </p>
          </div>

        </div>
      </div>

      {/* Recommended Mentors Carousel / Grid */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-white">
          Top Mentors Recommended For You
        </h2>
        {mentors && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.slice(0, 3).map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
