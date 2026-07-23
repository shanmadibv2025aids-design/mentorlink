import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, UserCheck, Mail, Lock, Building2, DollarSign, UserPlus } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState<'student' | 'mentor'>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [price, setPrice] = useState('80');
  const [skills, setSkills] = useState('React, TypeScript, System Design');
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    setIsSubmitting(true);
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      const user = await signup({
        name,
        email,
        password,
        role,
        title: title || (role === 'mentor' ? 'Senior Engineer' : 'CS Student'),
        company: company || (role === 'mentor' ? 'Tech Inc' : 'University'),
        price: Number(price) || 80,
        skills: skillsArray,
        bio: bio || 'Passionate about technical growth and mentorship.',
      });

      showToast('Account Created!', `Welcome to MentorLink, ${user.name}`);
      if (user.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      showToast('Signup Failed', err.message || 'Error creating account', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-[#151515] border border-white/5 shadow-2xl shadow-black/80 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-1">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create Your MentorLink Account
          </h1>
          <p className="text-xs text-slate-400">
            Triggers <code className="text-blue-400">POST /auth/signup</code>
          </p>
        </div>

        {/* Role Toggle */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">
            I am joining as:
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#111111] border border-white/5">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 Student Mentee
            </button>
            <button
              type="button"
              onClick={() => setRole('mentor')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                role === 'mentor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💼 Industry Mentor
            </button>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Job Title / Degree
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={role === 'mentor' ? 'Staff Engineer' : 'M.S. CS Candidate'}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Company / University
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={role === 'mentor' ? 'Google / Stripe' : 'Stanford'}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {role === 'mentor' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Hourly Rate ($ USD / hour)
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Key Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Python, System Design"
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Short Bio / Goals
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Briefly describe your experience or learning goals..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Complete Registration & Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-400 hover:underline">
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};
