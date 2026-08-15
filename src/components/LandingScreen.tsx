import React from 'react';
import { Menu, ArrowRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { AppScreen } from '../types';

interface LandingScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onStartOnboarding: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate, onStartOnboarding }) => {
  const pathMilestones = [
    {
      id: 'step-1',
      badge: '01 / Foundation',
      title: 'Class 6 - 8',
      description: 'Olympiads & Early Competitions',
    },
    {
      id: 'step-2',
      badge: '02 / Discovery',
      title: 'Class 9 - 10',
      description: 'Scholarships & Board Prep',
    },
    {
      id: 'step-3',
      badge: '03 / Junction',
      title: 'Class 11 - 12',
      description: 'Entrance Exams & College Apps',
    },
    {
      id: 'step-4',
      badge: '04 / Professional',
      title: 'Undergraduate',
      description: 'Internships & Hackathons',
    },
    {
      id: 'step-5',
      badge: '05 / Destination',
      title: 'Career & Fellowships',
      description: 'Research, Grants & Top Positions',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Logo size="md" />
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-lg border border-white/10 text-white/80 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-white/40"
            title="Menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-xl mx-auto px-5 pt-10">
        {/* Hero Headline */}
        <div className="text-center">
          <span className="text-[11px] uppercase tracking-[0.35em] text-white/40 block mb-4 font-medium">
            Personalized Academic & Career Trajectory
          </span>
          <h1 className="text-4xl sm:text-5xl font-light font-serif-luxury tracking-tight text-[#F5F2ED] leading-[1.05] uppercase">
            Don't Miss <br />
            Your Next <br />
            <span className="italic font-normal">Opportunity.</span>
          </h1>

          <p className="mt-5 text-white/60 text-sm sm:text-base leading-relaxed font-light px-4 max-w-md mx-auto">
            One unified, intelligence-driven repository for global competitions, premier fellowships, admissions exams, and bespoke career milestones.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStartOnboarding}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-[#F5F2ED] hover:bg-white text-black font-medium text-xs uppercase tracking-[0.15em] transition-all transform active:scale-[0.99] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <span>Create Opportunity Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-white/5 hover:bg-white/10 text-[#F5F2ED] font-medium text-xs uppercase tracking-[0.15em] border border-white/15 transition-all transform active:scale-[0.99]"
          >
            <span>Explore Catalog</span>
          </button>
        </div>

        {/* Section: Your Path to Success */}
        <div className="mt-14 mb-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-medium">Curated Milestones</span>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium text-[#F5F2ED]">
              Structured Pathway
            </h2>
          </div>

          {/* Vertical Stepper / Timeline */}
          <div className="relative pl-6 space-y-6">
            {/* Connecting Vertical Line */}
            <div className="absolute left-[33px] top-6 bottom-8 w-[1px] bg-gradient-to-b from-white/40 via-white/20 to-transparent" />

            {pathMilestones.map((milestone) => (
              <div key={milestone.id} className="relative flex items-start gap-4 group">
                {/* Node Ring Indicator */}
                <div className="relative z-10 flex-shrink-0 mt-3">
                  <div className="w-5 h-5 rounded-full border border-white/40 bg-[#0A0A0A] flex items-center justify-center ring-4 ring-[#0A0A0A] group-hover:border-white transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F5F2ED]" />
                  </div>
                </div>

                {/* Milestone Content Card */}
                <div
                  onClick={() => onNavigate('roadmap')}
                  className="flex-1 bg-[#121212] border border-white/10 rounded-xl p-4 hover:border-white/30 hover:bg-[#161616] transition-all cursor-pointer transform active:scale-[0.99]"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-1 font-mono">
                    {milestone.badge}
                  </span>

                  <h3 className="text-base font-serif-luxury font-medium text-[#F5F2ED]">
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-white/60 mt-1 font-light leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Banner */}
        <div className="mt-8 bg-[#121212] border border-white/15 rounded-2xl p-5 text-[#F5F2ED] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="p-2.5 rounded-lg bg-white/10 border border-white/15">
              <Sparkles className="w-5 h-5 text-[#F5F2ED]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block">AI Advisory</span>
              <h4 className="font-serif-luxury font-medium text-sm mt-0.5">NextMarga CareerAI Assistant</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed font-light">
                Receive instant bespoke recommendations tailored to your background, regional eligibility, and academic objectives.
              </p>
              <button
                onClick={() => onNavigate('explore')}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#F5F2ED] text-black text-[10px] uppercase tracking-[0.15em] font-semibold hover:bg-white transition-colors"
              >
                <span>Consult CareerAI</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
