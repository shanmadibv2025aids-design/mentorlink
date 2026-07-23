import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { mentorService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorPage } from '../components/common/ErrorPage';
import {
  Star,
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  Award,
  CheckCircle,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

export const MentorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [topic, setTopic] = useState('System Design & Career Strategy');
  const [notes, setNotes] = useState('');

  const {
    data: mentor,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['mentor', id],
    queryFn: () => mentorService.getMentorById(id || 'm1'),
    enabled: !!id,
  });

  const bookingMutation = useMutation({
    mutationFn: (data: {
      studentId: string;
      mentorId: string;
      date: string;
      timeSlot: string;
      topic: string;
      notes?: string;
    }) => bookingService.createBooking(data),
    onSuccess: (newBooking) => {
      showToast('Booking Request Sent!', `Session scheduled for ${newBooking.date} at ${newBooking.timeSlot}`);
      navigate('/bookings');
    },
  });

  if (isLoading) return <LoadingSkeleton type="profile" />;
  if (isError || !mentor) return <ErrorPage endpoint={`GET /mentor/${id}`} onRetry={() => refetch()} />;

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      showToast('Select Time Slot', 'Please select an available time slot', 'error');
      return;
    }

    bookingMutation.mutate({
      studentId: user?.id || 's1',
      mentorId: mentor.id,
      date: '2026-08-01',
      timeSlot: selectedSlot,
      topic,
      notes,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Mentor Hero Banner */}
      <div className="p-8 rounded-2xl bg-[#151515] border border-white/5 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="w-28 h-28 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-lg shrink-0"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {mentor.name}
                </h1>
                <p className="text-sm font-semibold text-blue-400">
                  {mentor.title} @ {mentor.company}
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 font-bold text-sm border border-amber-500/20">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{mentor.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({mentor.reviewCount} reviews)</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1 max-w-2xl">
              {mentor.bio}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {mentor.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-[#1A1A1A] text-slate-200 border border-white/5"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Rate & Chat Bar */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <div>
              Rate: <strong className="text-sm font-bold text-white">${mentor.price}/hr</strong>
            </div>
            <div>
              Total Mentees: <strong className="text-sm font-bold text-white">{mentor.totalMentees}+</strong>
            </div>
          </div>

          <button
            onClick={() => navigate(`/chat?mentorId=${mentor.id}`)}
            className="px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            Chat with {mentor.name.split(' ')[0]}
          </button>
        </div>
      </div>

      {/* Main Grid: Experience & Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Background & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Work Experience */}
          <div className="p-6 rounded-2xl bg-[#151515] border border-white/5 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              Work Experience
            </h2>

            {mentor.experience && mentor.experience.length > 0 ? (
              <div className="space-y-4">
                {mentor.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500 pl-4 space-y-1">
                    <p className="text-sm font-bold text-white">{exp.role}</p>
                    <p className="text-xs text-blue-400 font-medium">
                      {exp.company} • {exp.duration}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">10+ years of leading high-scale software projects.</p>
            )}
          </div>

          {/* Student Reviews */}
          <div className="p-6 rounded-2xl bg-[#151515] border border-white/5 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              Student Testimonials ({mentor.reviews?.length || 0})
            </h2>

            <div className="space-y-4">
              {mentor.reviews?.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-[#1A1A1A] border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.studentAvatar}
                        alt={rev.studentName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-white">{rev.studentName}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{rev.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Booking Form */}
        <div className="space-y-6">
          <form
            onSubmit={handleBookSession}
            className="p-6 rounded-2xl bg-[#151515] border border-white/5 shadow-xl space-y-4 sticky top-20"
          >
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Book 1-on-1 Session
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Triggers <code className="text-blue-400">POST /booking</code>
              </p>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Select Available Slot:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {mentor.availability?.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-[#1A1A1A] text-slate-300 border border-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {slot}
                    </span>
                    {selectedSlot === slot && <CheckCircle className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Discussion Topic
              </label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. System Design Mock Interview"
                className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Notes for Mentor
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific areas to focus on during session..."
                className="w-full px-3 py-2 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Fee:</span>
              <span className="font-bold text-white text-sm">${mentor.price} USD</span>
            </div>

            <button
              type="submit"
              disabled={bookingMutation.isPending}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              {bookingMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Confirm & Reserve Session'
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
