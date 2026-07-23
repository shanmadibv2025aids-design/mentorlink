import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/api';
import { BookingCard } from '../components/cards/BookingCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Calendar, Plus, Search, Filter } from 'lucide-react';

export const BookingManagementPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const userId = user?.id || 's1';
  const isMentor = user?.role === 'mentor';

  // Fetch bookings dynamically according to role
  const {
    data: bookings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['allBookings', userId, isMentor],
    queryFn: () =>
      isMentor
        ? bookingService.getMentorBookings(userId)
        : bookingService.getStudentBookings(userId),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'cancelled' | 'completed' }) =>
      bookingService.updateBookingStatus(id, { status }),
    onSuccess: () => {
      showToast('Booking Updated', 'Session status changed successfully.');
      queryClient.invalidateQueries({ queryKey: ['allBookings', userId, isMentor] });
    },
  });

  const filteredBookings = bookings?.filter((b) => {
    const matchesStatus = activeStatus === 'all' || b.status === activeStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.mentorName.toLowerCase().includes(q) ||
      b.studentName.toLowerCase().includes(q) ||
      b.topic.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Booking Management Hub
          </h1>
          <p className="text-xs text-slate-400">
            Endpoint: <code className="text-blue-400">{isMentor ? `GET /booking/mentor/${userId}` : `GET /booking/student/${userId}`}</code>
          </p>
        </div>

        {!isMentor && (
          <Link
            to="/booking/new"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Book New Session
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        
        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeStatus === status
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-[#151515] text-slate-400 border border-white/5 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topic or name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#151515] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Booking List */}
      {isLoading ? (
        <LoadingSkeleton type="list" />
      ) : filteredBookings && filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              currentUserRole={user?.role}
              onStatusUpdate={(id, status) => updateMutation.mutate({ id, status })}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#151515] border border-white/5 space-y-3">
          <p className="text-slate-400 text-sm font-semibold">
            No bookings found for "{activeStatus}".
          </p>
          {!isMentor && (
            <Link
              to="/booking/new"
              className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium"
            >
              Schedule First Session
            </Link>
          )}
        </div>
      )}

    </div>
  );
};
