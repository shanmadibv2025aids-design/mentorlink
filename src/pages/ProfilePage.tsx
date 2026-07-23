import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ProfileCard } from '../components/cards/ProfileCard';
import { User, Save, X, Edit3, Shield } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [company, setCompany] = useState(user?.company || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(user?.skills.join(', ') || '');
  const [price, setPrice] = useState(user?.price?.toString() || '80');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);

    updateUser({
      name,
      title,
      company,
      bio,
      skills: skillsArray,
      price: Number(price) || 80,
      github,
      linkedin,
    });

    showToast('Profile Updated!', 'Your settings and skills have been updated successfully.');
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            User Profile Settings
          </h1>
          <p className="text-xs text-slate-400">
            Manage your account credentials, technical skills, and public bio.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>

      {!isEditing ? (
        <ProfileCard user={user} onEditToggle={() => setIsEditing(true)} />
      ) : (
        <form
          onSubmit={handleSave}
          className="p-8 rounded-2xl bg-[#151515] border border-white/5 shadow-2xl space-y-6"
        >
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">
            Edit Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Job Title / Degree
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Hourly Rate ($ USD / hr)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                GitHub URL
              </label>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1A1A1A] text-white border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-slate-300 border border-white/5 font-medium text-xs hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
