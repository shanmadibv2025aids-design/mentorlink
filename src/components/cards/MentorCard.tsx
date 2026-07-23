import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mentor } from '../../types';
import { Star, MessageSquare, Calendar, Building2, Award } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  matchScore?: number;
  matchReasons?: string[];
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  matchScore,
  matchReasons,
}) => {
  const navigate = useNavigate();

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-[#151515] border border-white/5 hover:border-white/10 shadow-lg shadow-black/40 hover:shadow-blue-500/5 transition-all duration-300">
      
      {/* Top Banner & Match Score Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20 group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#151515]" />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {matchScore !== undefined && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm flex items-center gap-1">
                <Award className="w-3 h-3" />
                {matchScore}% AI Match
              </span>
            )}
            
            <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{mentor.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-normal">({mentor.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
            {mentor.name}
          </h3>
          <p className="text-xs font-medium text-slate-300 mt-0.5">
            {mentor.title}
          </p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>{mentor.company}</span>
            {mentor.experienceYears && <span>• {mentor.experienceYears} yrs exp</span>}
          </p>
        </div>

        {/* Match Rationale Callout if available */}
        {matchReasons && matchReasons.length > 0 && (
          <div className="mb-3 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-[11px] text-blue-300 leading-snug">
              ✨ <strong>Why it matched:</strong> {matchReasons[0]}
            </p>
          </div>
        )}

        {/* Bio snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {mentor.bio}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {mentor.skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#1A1A1A] text-slate-300 border border-white/5"
            >
              {skill}
            </span>
          ))}
          {mentor.skills.length > 4 && (
            <span className="px-2 py-1 rounded-lg text-[11px] font-medium bg-[#1A1A1A] text-slate-500">
              +{mentor.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Pricing & CTA Actions */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">Hourly Rate</p>
          <p className="text-lg font-bold text-white">
            ${mentor.price} <span className="text-xs font-normal text-slate-500">/ hr</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/chat?mentorId=${mentor.id}`)}
            title="Start Chat with Mentor"
            className="p-2.5 rounded-xl bg-[#1A1A1A] hover:bg-white/10 hover:text-blue-400 text-slate-300 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <Link
            to={`/mentor/${mentor.id}`}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Session
          </Link>
        </div>
      </div>

    </div>
  );
};
