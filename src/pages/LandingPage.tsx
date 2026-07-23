import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mentorService } from '../services/api';
import { MentorCard } from '../components/cards/MentorCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorPage } from '../components/common/ErrorPage';
import { Logo } from '../components/common/Logo';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Search,
  CheckCircle2,
  Users,
  Video,
  Zap,
  Star,
  BrainCircuit,
  Bot,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  const { data: mentors, isLoading, isError, refetch } = useQuery({
    queryKey: ['mentors', searchQuery, selectedSkill],
    queryFn: () => mentorService.getMentors({
      query: searchQuery || undefined,
      skill: selectedSkill !== 'All' ? selectedSkill : undefined,
    }),
  });

  const skillsList = ['All', 'Python', 'React', 'Large Language Models', 'System Design', 'TypeScript', 'Kubernetes', 'Product Strategy'];

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-6 md:pt-10 text-center space-y-8 overflow-hidden">
        {/* Ambient Glowing Backdrops */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[32rem] h-[24rem] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-24 left-1/4 w-72 h-72 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

        {/* Brand Logo Banner & AI Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#151515] border border-blue-500/30 text-xs font-semibold text-blue-400 shadow-xl shadow-blue-500/10"
        >
          <Logo size="sm" showText={false} />
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
            MentorLink Neural AI Engine • Active
          </span>
        </motion.div>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-4 justify-center px-4 items-center"
        >
          <Link
            to="/matching"
            className="group relative px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2.5 shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <BrainCircuit className="w-4 h-4 text-blue-100 group-hover:rotate-12 transition-transform" />
            <span>Launch AI Matchmaker</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/chat"
            className="px-7 py-4 rounded-xl bg-[#151515] hover:bg-[#1C1C1C] text-slate-200 font-semibold text-sm border border-white/10 shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            Ask AI Advisor
          </Link>
        </motion.div>

        {/* Company Leader Badges Bar */}
        <div className="pt-2 max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 opacity-80">
            {['DeepMind', 'Stripe', 'Apple', 'AWS', 'Google AI', 'OpenAI', 'Meta'].map((company) => (
              <span
                key={company}
                className="px-3.5 py-1.5 rounded-lg bg-[#141414] border border-white/5 text-xs font-semibold text-slate-300"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        {/* Live Stats Row */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
          <div className="p-4 rounded-2xl bg-[#151515] border border-white/5 hover:border-blue-500/20 transition-all">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">500+</p>
            <p className="text-xs text-slate-400 mt-0.5">Verified Mentors</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#151515] border border-white/5 hover:border-blue-500/20 transition-all">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">98.8%</p>
            <p className="text-xs text-slate-400 mt-0.5">Match Accuracy</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#151515] border border-white/5 hover:border-blue-500/20 transition-all">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">12k+</p>
            <p className="text-xs text-slate-400 mt-0.5">Sessions Completed</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#151515] border border-white/5 hover:border-blue-500/20 transition-all">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> 4.95
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Average Rating</p>
          </div>
        </div>
      </section>

      {/* Mentor Directory & Live Search */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Featured Mentors & Industry Experts
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Fetched dynamically via <code className="text-blue-400">GET /mentors</code>
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#151515] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Skill Filter Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSkill === skill
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-[#151515] text-slate-400 border border-white/5 hover:bg-white/5 hover:text-white'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Mentors Grid */}
        {isLoading ? (
          <LoadingSkeleton type="grid" />
        ) : isError ? (
          <ErrorPage endpoint="GET /mentors" onRetry={() => refetch()} />
        ) : mentors && mentors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
            <p className="text-slate-600 dark:text-slate-400 text-sm">No mentors match your search query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSkill('All');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-slate-900/10 border border-indigo-500/20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            How MentorLink AI Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            API-driven intelligent matching connects you with the perfect mentor in under 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Define Career Goals</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Tell our algorithm your current skill level, target roles (e.g. Senior AI Scientist), and weekly budget.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Recommendation Engine</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our <code className="text-indigo-500">POST /match</code> endpoint scores mentors based on technical overlap, company background, and review quality.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Book & Chat 1-on-1</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Schedule interactive sessions (<code className="text-indigo-500">POST /booking</code>) and get instant preparation advice from AI or mentors.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
