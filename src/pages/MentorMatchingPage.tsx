import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mentorService } from '../services/api';
import { MatchFilters, MatchedMentor } from '../types';
import { MentorCard } from '../components/cards/MentorCard';
import { useToast } from '../context/ToastContext';
import {
  Compass,
  Sparkles,
  BrainCircuit,
  Sliders,
  DollarSign,
  CheckCircle2,
  RefreshCcw,
} from 'lucide-react';

export const MentorMatchingPage: React.FC = () => {
  const { showToast } = useToast();

  const [goals, setGoals] = useState('Master System Design and land a Senior AI Engineer role at a top lab.');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Large Language Models', 'System Design']);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [budget, setBudget] = useState<number>(100);
  const [availability, setAvailability] = useState('Weekdays after 5 PM');

  const availableSkills = [
    'Python',
    'PyTorch',
    'Large Language Models',
    'System Design',
    'React',
    'TypeScript',
    'Kubernetes',
    'Product Strategy',
    'Web Performance',
  ];

  const matchMutation = useMutation({
    mutationFn: (filters: MatchFilters) => mentorService.matchMentors(filters),
    onSuccess: (data) => {
      showToast('AI Match Complete!', `Calculated matches across ${data.mentors.length} mentors`);
    },
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    matchMutation.mutate({
      goals,
      skillsNeeded: selectedSkills,
      experienceLevel,
      budget,
      availability,
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
          <BrainCircuit className="w-4 h-4 text-blue-400" />
          <span>API Endpoint: POST /match</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          AI-Powered Mentor Matching
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Input your career aspirations and technical requirements. Our neural engine matches you with mentors having proven track records in your target domain.
        </p>
      </div>

      {/* Input Form & Parameters */}
      <form
        onSubmit={handleMatchSubmit}
        className="p-6 sm:p-8 rounded-2xl bg-[#151515] border border-white/5 shadow-xl space-y-6"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            1. What are your primary mentorship goals?
          </label>
          <textarea
            rows={2}
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g. Preparing for Senior Frontend architecture interviews, code reviews, and resume polishing..."
            className="w-full px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Skill Selection */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-white">
            2. Select target skills you want to master:
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  type="button"
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-[#1A1A1A] text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {skill} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white">
              3. Current Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    experienceLevel === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[#1A1A1A] text-slate-400 border border-white/5'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-bold text-white">
              <label>4. Maximum Hourly Budget</label>
              <span className="text-blue-400">${budget} / hr</span>
            </div>
            <input
              type="range"
              min="40"
              max="200"
              step="5"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={matchMutation.isPending}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
        >
          {matchMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Running Neural Match Matrix...
            </>
          ) : (
            <>
              <BrainCircuit className="w-5 h-5" />
              Calculate Best Mentor Matches (POST /match)
            </>
          )}
        </button>
      </form>

      {/* Results Section */}
      {matchMutation.data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Rationale Banner */}
          <div className="p-6 rounded-2xl bg-[#151515] border border-blue-500/20 space-y-2">
            <h3 className="font-bold text-blue-400 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              AI Recommendation Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {matchMutation.data.aiRecommendationSummary}
            </p>
          </div>

          {/* Ranked Mentors */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">
              Ranked Mentor Matches ({matchMutation.data.mentors.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchMutation.data.mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  matchScore={mentor.matchScore}
                  matchReasons={mentor.matchReasons}
                />
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
