import React from 'react';
import { User } from '../../types';
import { Mail, MapPin, Building2, Github, Linkedin, Award, Star } from 'lucide-react';

interface ProfileCardProps {
  user: User;
  onEditToggle?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEditToggle }) => {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#151515] border border-white/5 shadow-lg shadow-black/40 space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-lg shrink-0"
        />

        <div className="space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {user.name}
              </h2>
              <p className="text-sm font-medium text-blue-400">
                {user.title || (user.role === 'mentor' ? 'Senior Tech Mentor' : 'Software Engineering Student')}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {user.role} Account
            </span>
          </div>

          <p className="text-xs text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              {user.email}
            </span>
            {user.company && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                {user.company}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {user.location}
              </span>
            )}
          </p>

          {user.bio && (
            <p className="text-xs text-slate-300 leading-relaxed pt-2 max-w-xl">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#111111] border border-white/5 text-center">
        <div>
          <p className="text-xs text-slate-500">Completed Sessions</p>
          <p className="text-lg font-bold text-white">
            {user.completedSessions || (user.role === 'mentor' ? 124 : 8)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            {user.role === 'mentor' ? 'Mentee Count' : 'Learning Streak'}
          </p>
          <p className="text-lg font-bold text-blue-400">
            {user.role === 'mentor' ? `${user.totalMentees || 88} Students` : '12 Days'}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">
            {user.role === 'mentor' ? 'Rating' : 'Skills Mastered'}
          </p>
          <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
            {user.role === 'mentor' ? (
              <>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {user.rating || 4.9}
              </>
            ) : (
              `${user.skills.length} Techs`
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Rate / Session</p>
          <p className="text-lg font-bold text-white">
            ${user.price || 80}/hr
          </p>
        </div>
      </div>

      {/* Skills Pill List */}
      <div>
        <p className="text-xs font-semibold text-slate-300 mb-2">
          Technical Expertise & Skills:
        </p>
        <div className="flex flex-wrap gap-2">
          {user.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-xl text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Links & Actions */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {user.github && (
            <a
              href={user.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#1A1A1A] hover:text-blue-400 transition-colors text-slate-300"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#1A1A1A] hover:text-blue-400 transition-colors text-slate-300"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>

        {onEditToggle && (
          <button
            onClick={onEditToggle}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-all shadow-md shadow-blue-500/20"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};
