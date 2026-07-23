import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/api';
import { BookingCard } from '../components/cards/BookingCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import {
  DollarSign,
  Users,
  Star,
  Clock,
  TrendingUp,
  UserCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const MentorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const mentorId = user?.id || 'm1';

  // Fetch Mentor Bookings: GET /booking/mentor/:id
  const {
    data: bookings,
    isLoading,
  } = useQuery({
    queryKey: ['mentorBookings', mentorId],
    queryFn: () => bookingService.getMentorBookings(mentorId),
  });

  // Booking status update mutation: PATCH /booking/:id
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'cancelled' | 'completed' }) =>
      bookingService.updateBookingStatus(id, { status }),
    onSuccess: (_, variables) => {
      showToast('Booking Updated', `Session marked as ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['mentorBookings', mentorId] });
    },
  });

  const earningsChartData = [
    { month: 'Mar', earnings: 450 },
    { month: 'Apr', earnings: 780 },
    { month: 'May', earnings: 1100 },
    { month: 'Jun', earnings: 1650 },
    { month: 'Jul', earnings: 2480 },
  ];

  const pendingBookings = bookings?.filter((b) => b.status === 'pending') || [];
  const confirmedBookings = bookings?.filter((b) => b.status === 'confirmed') || [];

  return (
    <div className="space-y-8">
      
      {/* Mentor Welcome Banner */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/60 via-[#151515] to-[#151515] text-white border border-white/5 shadow-2xl space-y-3 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Mentor Studio • Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Mentor Studio — {user?.name || 'Dr. Sarah Chen'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            You have <strong className="text-blue-400 font-bold">{pendingBookings.length} pending mentee session requests</strong> requiring review.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white">$2,480</p>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% vs last month
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Mentees</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">18</p>
          <p className="text-[11px] text-slate-500">Students guided this quarter</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Rating Score</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-bold text-white">4.95 / 5.0</p>
          <p className="text-[11px] text-slate-500">From 48 student reviews</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Mentorship Hours</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">32 hrs</p>
          <p className="text-[11px] text-slate-500">Completed 1-on-1 calls</p>
        </div>
      </div>

      {/* Main Grid: Pending Requests + Recharts Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Pending Requests Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Pending Mentee Session Requests ({pendingBookings.length})
              </h2>
              <p className="text-xs text-slate-400">
                Manage incoming requests via <code className="text-blue-400">PATCH /booking/:id</code>
              </p>
            </div>
            <Link
              to="/mentor/requests"
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              View Requests Manager
            </Link>
          </div>

          {isLoading ? (
            <LoadingSkeleton type="list" />
          ) : pendingBookings.length > 0 ? (
            <div className="space-y-4">
              {pendingBookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  currentUserRole="mentor"
                  onStatusUpdate={(id, status) => updateStatusMutation.mutate({ id, status })}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-[#151515] border border-white/5">
              <p className="text-sm text-slate-400">All student requests have been processed!</p>
            </div>
          )}

          {/* Confirmed Sessions List */}
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-bold text-white">
              Upcoming Confirmed Sessions ({confirmedBookings.length})
            </h3>
            {confirmedBookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                currentUserRole="mentor"
                onStatusUpdate={(id, status) => updateStatusMutation.mutate({ id, status })}
              />
            ))}
          </div>
        </div>

        {/* Right: Recharts Revenue Chart */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#151515] border border-white/5 shadow-md space-y-4">
            <h3 className="font-bold text-white text-sm">
              Mentorship Earnings Trend ($ USD)
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsChartData}>
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
                  <Bar dataKey="earnings" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
