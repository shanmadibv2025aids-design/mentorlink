import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-white/5 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 fill-white/20" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Mentor<span className="text-blue-500">Link</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              API-Driven AI Peer Mentorship Platform connecting tech learners with top engineers and leaders worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/matching" className="hover:text-blue-400 transition-colors">AI Matchmaker</Link></li>
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Browse Mentors</Link></li>
              <li><Link to="/chat" className="hover:text-blue-400 transition-colors">AI Mentor Chat</Link></li>
              <li><Link to="/bookings" className="hover:text-blue-400 transition-colors">Session Booking</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              API Endpoints
            </h4>
            <ul className="space-y-1 text-[11px] font-mono text-slate-400">
              <li>POST /auth/login</li>
              <li>GET /mentors</li>
              <li>POST /match</li>
              <li>POST /booking</li>
              <li>POST /chat</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Architecture
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Frontend built with React 19, TypeScript, Tailwind CSS, Axios, React Query & Framer Motion.
            </p>
            <div className="inline-block px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[11px] font-medium border border-blue-500/20">
              VITE_API_URL=http://localhost:8000
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MentorLink Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for peer mentorship
          </p>
        </div>
      </div>
    </footer>
  );
};
