import React from 'react';
import { Booking } from '../../types';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  Clock3,
  User,
  BookOpen,
} from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  currentUserRole?: 'student' | 'mentor';
  onStatusUpdate?: (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  currentUserRole = 'student',
  onStatusUpdate,
}) => {
  const getStatusBadge = () => {
    switch (booking.status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock3 className="w-3.5 h-3.5" />
            Pending Approval
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
    }
  };

  const isMentorView = currentUserRole === 'mentor';
  const personName = isMentorView ? booking.studentName : booking.mentorName;
  const personAvatar = isMentorView ? booking.studentAvatar : booking.mentorAvatar;
  const personSubtitle = isMentorView
    ? 'Student Mentee'
    : `${booking.mentorTitle || 'Mentor'} ${booking.mentorCompany ? '@ ' + booking.mentorCompany : ''}`;

  return (
    <div className="p-6 rounded-2xl bg-[#151515] border border-white/5 shadow-lg shadow-black/40 space-y-4">
      
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={
              personAvatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }
            alt={personName}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
          />
          <div>
            <h4 className="text-base font-bold text-white leading-tight">
              {personName}
            </h4>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <User className="w-3 h-3 text-blue-400" />
              {personSubtitle}
            </p>
          </div>
        </div>

        {getStatusBadge()}
      </div>

      {/* Booking Details Grid */}
      <div className="p-4 rounded-xl bg-[#111111] border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{booking.date}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Clock className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{booking.timeSlot} (60 min)</span>
        </div>

        <div className="sm:col-span-2 flex items-start gap-2 text-slate-300">
          <BookOpen className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Topic: </span>
            <span>{booking.topic}</span>
          </div>
        </div>

        {booking.notes && (
          <div className="sm:col-span-2 text-slate-400 italic bg-[#18181B] p-2.5 rounded-xl border border-white/5">
            "{booking.notes}"
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500">
          Fee: <span className="font-bold text-slate-900 dark:text-white">${booking.price || 80} USD</span>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === 'confirmed' && booking.meetingLink && (
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <Video className="w-3.5 h-3.5" />
              Join Video Session
            </a>
          )}

          {isMentorView && booking.status === 'pending' && onStatusUpdate && (
            <>
              <button
                onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors shadow-sm"
              >
                Accept Session
              </button>
              <button
                onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-medium text-xs transition-colors"
              >
                Decline
              </button>
            </>
          )}

          {booking.status !== 'cancelled' && booking.status !== 'completed' && onStatusUpdate && (
            <button
              onClick={() => onStatusUpdate(booking.id, 'cancelled')}
              className="px-3 py-1.5 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition-colors"
            >
              Cancel Session
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
