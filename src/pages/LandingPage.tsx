import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mentorService } from '../services/api';
import { MentorCard } from '../components/cards/MentorCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorPage } from '../components/common/ErrorPage';
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
      <section className="relative pt-12 md:pt-20 text-center space-y-8 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none -z-10" />
        <div className="absolute top-40 left-1/3 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none -z-10" />

        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-blue-400 fill-blue-400/20" />
          <span>Next-Gen Peer Mentorship Engine</span>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto px-4 space-y-4"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Accelerate Your Tech Career with <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI-Matched 1-on-1 Mentorship
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect directly with Staff Engineers, Research Scientists, and Product Leaders from DeepMind, Stripe, Apple, and AWS.
          </p>
        </motion.div>

        {/* Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center px-4"
        >
          <Link
            to="/matching"
            className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
          >
            <BrainCircuit className="w-4 h-4" />
            Launch AI Matchmaker
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/chat"
            className="px-6 py-3.5 rounded-2xl bg-[#151515] hover:bg-[#1A1A1A] text-slate-200 font-semibold text-sm border border-white/10 shadow-sm transition-all hover:scale-105 flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            Ask AI Advisor
          </Link>
        </motion.div>

        {/* Live Stats */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto px-4">
          <div className="p-4 rounded-2xl bg-[#151515] border border-white/5">
            <p className="text-2xl font-bold text-white">500+</p>
            <p className="text-xs text-slate-500">Verified Mentors</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#151515] border border-white/5">
            <p className="text-2xl font-bold text-blue-400">98.8%</p>
            <p className="text-xs text-slate-500">Match Accuracy</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#151515] border border-white/5">
            <p className="text-2xl font-bold text-white">12k+</p>
            <p className="text-xs text-slate-500">Sessions Completed</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#151515] border border-white/5">
            <p className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.95
            </p>
            <p className="text-xs text-slate-500">Average Rating</p>
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
