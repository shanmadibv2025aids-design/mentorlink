import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { bookingService } from '../services/api';
import { BookingCard } from '../components/cards/BookingCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { UserCheck, Filter, Search } from 'lucide-react';

export const StudentRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const mentorId = user?.id || 'm1';

  // GET /booking/mentor/:id
  const {
    data: bookings,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['mentorRequestsList', mentorId],
    queryFn: () => bookingService.getMentorBookings(mentorId),
  });

  // PATCH /booking/:id
  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'confirmed' | 'cancelled' | 'completed' }) =>
      bookingService.updateBookingStatus(id, { status }),
    onSuccess: (_, variables) => {
      showToast('Booking Updated', `Session status changed to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['mentorRequestsList', mentorId] });
    },
  });

  const filteredBookings = bookings?.filter((b) => {
    const matchesTab = activeTab === 'all' || b.status === activeTab;
    const matchesSearch =
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-400" />
            Student Booking Requests
          </h1>
          <p className="text-xs text-slate-400">
            Review and respond to incoming 1-on-1 mentorship requests from students.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or topic..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#151515] border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        {(['pending', 'confirmed', 'completed', 'cancelled', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-[#151515] text-slate-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            {tab} Sessions
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <LoadingSkeleton type="list" />
      ) : filteredBookings && filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              currentUserRole="mentor"
              onStatusUpdate={(id, status) => updateMutation.mutate({ id, status })}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#151515] border border-white/5 space-y-2">
          <p className="text-slate-300 text-sm font-semibold">
            No {activeTab} booking requests found.
          </p>
          <p className="text-xs text-slate-500">
            When students book a session, their requests will appear here.
          </p>
        </div>
      )}

    </div>
  );
};
