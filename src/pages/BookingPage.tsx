import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { mentorService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Calendar, Clock, BookOpen, CheckCircle, Video, User } from 'lucide-react';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMentorId = searchParams.get('mentorId') || 'm1';

  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [mentorId, setMentorId] = useState(initialMentorId);
  const [date, setDate] = useState('2026-08-02');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [topic, setTopic] = useState('System Design & Microservices Architecture');
  const [notes, setNotes] = useState('');

  const { data: mentors, isLoading } = useQuery({
    queryKey: ['allMentorsBooking'],
    queryFn: () => mentorService.getMentors(),
  });

  const selectedMentor = mentors?.find((m) => m.id === mentorId) || mentors?.[0];

  const bookingMutation = useMutation({
    mutationFn: (data: {
      studentId: string;
      mentorId: string;
      date: string;
      timeSlot: string;
      topic: string;
      notes?: string;
    }) => bookingService.createBooking(data),
    onSuccess: (res) => {
      showToast('Booking Created!', `Session confirmed for ${res.date} at ${res.timeSlot}`);
      navigate('/bookings');
    },
  });

  if (isLoading) return <LoadingSkeleton type="card" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    bookingMutation.mutate({
      studentId: user?.id || 's1',
      mentorId: selectedMentor.id,
      date,
      timeSlot,
      topic,
      notes,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <Calendar className="w-3.5 h-3.5" />
          <span>API Endpoint: POST /booking</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Schedule Mentorship Session
        </h1>
        <p className="text-xs text-slate-400">
          Reserve 1-on-1 video mentorship time with an industry leader.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-2xl bg-[#151515] border border-white/5 shadow-2xl space-y-6"
      >
        {/* Mentor Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white uppercase tracking-wider">
            1. Select Mentor
          </label>
          <select
            value={mentorId}
            onChange={(e) => setMentorId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {mentors?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.title} @ {m.company} (${m.price}/hr)
              </option>
            ))}
          </select>
        </div>

        {/* Selected Mentor Summary Card */}
        {selectedMentor && (
          <div className="p-4 rounded-xl bg-[#1A1A1A] border border-white/5 flex items-center gap-4">
            <img
              src={selectedMentor.avatar}
              alt={selectedMentor.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/30 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white text-sm">{selectedMentor.name}</p>
              <p className="text-xs text-blue-400">{selectedMentor.title} @ {selectedMentor.company}</p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-white">${selectedMentor.price}</span>
              <span className="text-xs text-slate-400">/hr</span>
            </div>
          </div>
        )}

        {/* Date & Time Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              Session Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="09:00 AM">09:00 AM EST</option>
              <option value="10:00 AM">10:00 AM EST</option>
              <option value="01:00 PM">01:00 PM EST</option>
              <option value="03:00 PM">03:00 PM EST</option>
              <option value="05:00 PM">05:00 PM EST</option>
            </select>
          </div>
        </div>

        {/* Topic & Notes */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">
            Primary Learning Topic
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Distributed Caching & Load Balancers"
            className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300">
            Additional Questions / Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share code links, resume draft, or specific questions..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <button
          type="submit"
          disabled={bookingMutation.isPending}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
        >
          {bookingMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Confirm Booking & Generate Video Link'
          )}
        </button>
      </form>

    </div>
  );
};
