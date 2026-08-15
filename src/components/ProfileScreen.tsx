import React, { useState } from 'react';
import { ArrowLeft, Camera, Check, Plus, X, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { sampleBoards, sampleClasses } from '../data/mockData';

interface ProfileScreenProps {
  profile: UserProfile;
  onBack: () => void;
  onSave: (updatedProfile: UserProfile) => void;
  onStartOnboarding: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onBack,
  onSave,
  onStartOnboarding,
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...profile });
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const removeInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const addInterest = () => {
    if (newTag.trim() && !formData.interests.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newTag.trim()],
      }));
      setNewTag('');
      setShowAddTag(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 pb-32 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block font-medium">Candidate Profile</span>
            <h1 className="text-xl sm:text-2xl font-light font-serif-luxury text-[#F5F2ED] tracking-tight uppercase">
              Profile Dossier & Settings
            </h1>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="text-xs uppercase tracking-[0.15em] font-medium bg-[#F5F2ED] text-black hover:bg-white px-4 py-2 rounded-lg transition-all shadow-sm"
        >
          Save
        </button>
      </div>

      {/* Saved Toast Banner */}
      {savedToast && (
        <div className="p-3 bg-white/10 border border-white/20 text-[#F5F2ED] rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>Profile configuration saved successfully</span>
        </div>
      )}

      {/* Avatar & Subtitle */}
      <div className="flex flex-col items-center justify-center space-y-3 py-3">
        <div className="relative">
          <img
            src={formData.avatarUrl}
            alt={formData.fullName}
            className="w-24 h-24 rounded-full object-cover border-2 border-white/20 shadow-lg"
          />
          <button
            type="button"
            onClick={() => {
              const newUrl = prompt('Enter image URL for avatar:', formData.avatarUrl);
              if (newUrl) setFormData({ ...formData, avatarUrl: newUrl });
            }}
            className="absolute bottom-0 right-0 p-2 bg-[#F5F2ED] text-black rounded-full shadow-md hover:bg-white transition-transform active:scale-95"
            title="Change photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center space-y-1">
          <h2 className="font-serif-luxury font-medium text-[#F5F2ED] text-lg">{formData.fullName}</h2>
          <p className="text-xs font-mono text-white/50">{formData.currentClass} Scholar</p>
          <button
            onClick={onStartOnboarding}
            className="text-[10px] uppercase tracking-[0.15em] font-mono text-white/70 hover:text-white mt-1 inline-flex items-center gap-1.5 border border-white/10 px-3 py-1 rounded bg-white/5"
          >
            <Sparkles className="w-3 h-3 text-white/70" />
            <span>Re-run Guided Wizard</span>
          </button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/40 border-b border-white/10 pb-2">
          Personal Identity
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">Date of Birth</label>
              <input
                type="text"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/40 border-b border-white/10 pb-2">
          Jurisdiction & Location
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">State / Province</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">City / District</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Academic Progress */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/40 border-b border-white/10 pb-2">
          Academic Standing
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">Current Class Standing</label>
            <select
              value={formData.currentClass}
              onChange={(e) => setFormData({ ...formData, currentClass: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
            >
              {sampleClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">Educational Institution</label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-1">Curricular Board</label>
            <select
              value={formData.educationalBoard}
              onChange={(e) => setFormData({ ...formData, educationalBoard: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-white/15 rounded-lg text-xs text-[#F5F2ED] focus:border-white/40 focus:outline-none transition-colors"
            >
              {sampleBoards.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interests & Tags */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-white/40">
            Aspirations & Focus Disciplines
          </div>
          <button
            onClick={() => setShowAddTag(!showAddTag)}
            className="text-[10px] uppercase tracking-wider font-mono text-white/70 hover:text-white flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Discipline</span>
          </button>
        </div>

        {showAddTag && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addInterest()}
              placeholder="e.g. Astrophysics"
              className="flex-1 px-3 py-2 bg-[#0A0A0A] border border-white/20 rounded-lg text-xs text-[#F5F2ED] focus:outline-none focus:border-white/40"
            />
            <button
              onClick={addInterest}
              className="px-3 py-2 bg-[#F5F2ED] text-black rounded-lg text-xs font-medium uppercase tracking-wider"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {formData.interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 text-white/80 border border-white/15 text-[10px] font-mono uppercase tracking-wider"
            >
              <span>{interest}</span>
              <button
                onClick={() => removeInterest(interest)}
                className="hover:text-white"
                title="Remove tag"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
