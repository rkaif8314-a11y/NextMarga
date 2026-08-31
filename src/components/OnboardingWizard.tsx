import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, User, Phone, Search, Check, Sparkles, MapPin, School, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { sampleSchools, sampleBoards, sampleClasses, sampleInterestsList } from '../data/mockData';

interface OnboardingWizardProps {
  initialProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialProfile,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState<UserProfile>({ ...initialProfile });
  const [schoolQuery, setSchoolQuery] = useState<string>(initialProfile.schoolName || 'D');
  const [showSchoolDropdown, setShowSchoolDropdown] = useState<boolean>(false);

  const filteredSchools = sampleSchools.filter((school) =>
    school.toLowerCase().includes(schoolQuery.toLowerCase())
  );

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onCancel();
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const newInterests = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Personal Details';
      case 2:
        return 'School Details';
      case 3:
        return 'Guardian Information';
      case 4:
        return 'Location Details';
      case 5:
        return 'Interests & Passions';
      case 6:
        return 'Career Aspirations';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 pb-24 flex flex-col justify-between">
      {/* Header with Progress Bar */}
      <div className="bg-slate-50/90 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200 px-4 pt-4 pb-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            </button>

            <div className="text-[10px] font-mono tracking-[0.2em] text-slate-500 uppercase">
              PHASE {currentStep} OF {totalSteps}
            </div>

            <div className="text-xs uppercase tracking-wider font-mono text-slate-800">
              {getStepTitle()}
            </div>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <div
              className="bg-sky-700 h-full rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(255,255,255,0.6)]"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Step Content */}
      <main className="max-w-2xl mx-auto w-full px-5 py-8 flex-1">
        {/* STEP 1: Tell us about yourself */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 block mb-1">
                Candidate Profile
              </span>
              <h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-slate-950 tracking-tight">
                Tell us about yourself
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                We'll use this information to initialize your candidate record and customize strategic trajectories.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Date of Birth <span className="text-slate-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    placeholder="mm/dd/yyyy"
                    className="w-full pl-4 pr-11 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="mt-1.5 text-[10px] font-mono text-slate-500">
                  Verifies candidate eligibility constraints for high-tier academic programs.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                >
                  <option value="">Select an option</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Where do you study? */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 block mb-1">
                Institutional Alignment
              </span>
              <h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-slate-950 tracking-tight">
                Where do you study?
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                Calibrates your learning roadmap against national curriculum benchmarks.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  School / College Institution
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={schoolQuery}
                    onChange={(e) => {
                      setSchoolQuery(e.target.value);
                      setShowSchoolDropdown(true);
                      setFormData({ ...formData, schoolName: e.target.value });
                    }}
                    onFocus={() => setShowSchoolDropdown(true)}
                    placeholder="Search school name..."
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showSchoolDropdown && filteredSchools.length > 0 && (
                  <div className="mt-1 bg-white border border-slate-300 rounded-xl shadow-xl divide-y divide-slate-200 overflow-hidden max-h-48 overflow-y-auto">
                    {filteredSchools.map((school, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSchoolQuery(school);
                          setFormData({ ...formData, schoolName: school });
                          setShowSchoolDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-xs text-slate-800 transition-colors"
                      >
                        <School className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                        <span>{school}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Current Class Standing
                </label>
                <select
                  value={formData.currentClass}
                  onChange={(e) => setFormData({ ...formData, currentClass: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                >
                  {sampleClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Curricular Board
                </label>
                <select
                  value={formData.educationalBoard}
                  onChange={(e) => setFormData({ ...formData, educationalBoard: e.target.value })}
                  className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                >
                  {sampleBoards.map((board) => (
                    <option key={board} value={board}>
                      {board}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Guardian Information */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 block mb-1">
                Parental Records
              </span>
              <h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-slate-950 tracking-tight">
                Guardian Information
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                Recorded for scholarship verification and program communication.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Father's Legal Name
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="Enter father's full name"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Mother's Legal Name
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="Enter mother's full name"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  Guardian's Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Location Details */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 block mb-1">
                Regional Jurisdiction
              </span>
              <h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-slate-950 tracking-tight">
                Where are you located?
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                State scholarships and regional fellowships require accurate geographic records.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  State / Province
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Bihar, Maharashtra, Delhi"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-600 mb-1.5">
                  City / District
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Patna, Mumbai, Bangalore"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 focus:outline-none focus:border-white/40 text-sm font-light transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Interests & Passions */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 block mb-1">
                Disciplinary Focus
              </span>
              <h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-slate-950 tracking-tight">
                What are your interests?
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                Select the disciplines and strategic domains you wish to master.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {sampleInterestsList.map((interest) => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider border transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-sky-700 text-white border-[#F5F2ED] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-white/30 hover:text-slate-950'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Career Aspiration */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-slate-500 block mb-1">
                Strategic Horizon
              </span>
              <h1 className="text-2xl sm:text-3xl font-light font-serif-luxury text-slate-950 tracking-tight">
                Choose your target trajectory
              </h1>
              <p className="mt-2 text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                NextMarga will craft an interactive, timeline-based roadmap tailored to this objective.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'Engineering & Research', desc: 'IITs, Olympiads, R&D Labs, Fellowships, PhD', icon: '🔬' },
                { id: 'Computer Science & AI', desc: 'Software engineering, Hackathons, IOI, Deep Tech', icon: '💻' },
                { id: 'Medical & Biosciences', desc: 'NEET, Medical Research, Biology Olympiads (IBO)', icon: '🩺' },
                { id: 'Civil Services & Policy', desc: 'UPSC, Public Administration, Social Impact', icon: '🏛️' },
                { id: 'Design & Creative Tech', desc: 'UI/UX, Product Architecture, Creative Systems', icon: '🎨' },
              ].map((path) => {
                const isSelected = formData.targetPath === path.id;
                return (
                  <button
                    key={path.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, targetPath: path.id })}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-slate-100 border-white/40 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl p-2 bg-slate-50 rounded-lg border border-slate-200">{path.icon}</span>
                    <div className="flex-1">
                      <div className="font-serif-luxury font-medium text-slate-950 text-sm sm:text-base">{path.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-light">{path.desc}</div>
                    </div>
                    {isSelected && (
                      <div className="p-1 rounded-full bg-sky-700 text-white mt-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Actions */}
      <div className="bg-slate-50/90 backdrop-blur-xl border-t border-slate-200 p-4 sticky bottom-0 z-30">
        <div className="max-w-2xl mx-auto space-y-2.5">
          <button
            type="button"
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-sky-700 hover:bg-white text-black font-medium text-xs uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all"
          >
            <span>{currentStep === totalSteps ? 'Complete Profile & Build Roadmap' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleNext}
              className="w-full text-center py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-950 transition-colors"
            >
              Skip for now
            </button>
          )}

          {currentStep > 1 && currentStep !== 2 && (
            <button
              type="button"
              onClick={handleBack}
              className="w-full text-center py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 hover:text-slate-950 transition-colors"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
