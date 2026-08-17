import React, { useMemo, useState } from 'react';
import {
    Search,
    Bookmark,
    CalendarDays,
    MapPin,
    ExternalLink,
    Filter,
} from 'lucide-react';

type Opportunity = {
    id: number;
    title: string;
    organization: string;
    category: 'Scholarship' | 'Internship' | 'Hackathon' | 'Competition';
    location: string;
    deadline: string;
    description: string;
    featured?: boolean;
};

const opportunities: Opportunity[] = [
    {
        id: 1,
        title: 'Student Innovation Challenge',
        organization: 'NextMarga',
        category: 'Competition',
        location: 'Online',
        deadline: '30 Aug 2026',
        description: 'Build an innovative solution to a real student problem.',
        featured: true,
    },
    {
        id: 2,
        title: 'Future Tech Internship',
        organization: 'Technology Partners',
        category: 'Internship',
        location: 'Remote',
        deadline: '05 Sep 2026',
        description: 'Explore software, AI and technology through a student internship.',
    },
    {
        id: 3,
        title: 'National Student Scholarship',
        organization: 'Education Foundation',
        category: 'Scholarship',
        location: 'India',
        deadline: '12 Sep 2026',
        description: 'Financial support opportunity for eligible students.',
    },
    {
        id: 4,
        title: 'Build for Tomorrow Hackathon',
        organization: 'Innovation Network',
        category: 'Hackathon',
        location: 'Online',
        deadline: '20 Sep 2026',
        description: 'Create and present a technology solution with a student team.',
    },
];

export const OpportunityHub: React.FC = () => {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [saved, setSaved] = useState<number[]>([]);

    const filtered = useMemo(() => {
        return opportunities.filter((item) => {
            const matchesCategory =
                category === 'All' || item.category === category;

            const text =
                `${item.title} ${item.organization} ${item.category}`.toLowerCase();

            return matchesCategory && text.includes(query.toLowerCase());
        });
    }, [query, category]);

    const toggleSaved = (id: number) => {
        setSaved((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    };

    return (
        <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-6 animate-fadeIn">
            <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Discover your next move
                </span>

                <h1 className="text-3xl sm:text-4xl font-light font-serif-luxury text-[#F5F2ED] mt-1">
                    Opportunity Hub
                </h1>

                <p className="text-sm text-white/45 mt-2">
                    Scholarships, internships, hackathons and competitions in one place.
                </p>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/35" />

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search opportunities..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-white/30"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                    <Filter className="w-4 h-4 text-white/40 flex-shrink-0" />

                    {['All', 'Scholarship', 'Internship', 'Hackathon', 'Competition'].map(
                        (item) => (
                            <button
                                key={item}
                                onClick={() => setCategory(item)}
                                className={`whitespace-nowrap px-3 py-2 rounded-lg text-[11px] uppercase tracking-wider transition-all ${category === item
                                        ? 'bg-[#F5F2ED] text-black'
                                        : 'bg-white/5 text-white/50 hover:text-white'
                                    }`}
                            >
                                {item}
                            </button>
                        )
                    )}
                </div>
            </div>

            {category === 'All' && !query && (
                <div className="rounded-2xl border border-white/10 bg-[#181818] p-5">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                        Recommended for you
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
                        <div>
                            <h2 className="text-xl font-serif-luxury text-[#F5F2ED]">
                                Student Innovation Challenge
                            </h2>
                            <p className="text-sm text-white/45 mt-1">
                                A featured opportunity selected for your student journey.
                            </p>
                        </div>

                        <span className="text-[10px] uppercase tracking-wider px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                            Featured
                        </span>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">
                    {filtered.length} opportunities found
                </span>

                <span className="text-xs text-white/40">
                    {saved.length} saved
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {filtered.map((item) => (
                    <div
                        key={item.id}
                        className="bg-[#121212] border border-white/10 rounded-2xl p-5 hover:border-white/25 transition-all"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <span className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                                    {item.category}
                                </span>

                                <h3 className="text-lg font-serif-luxury text-[#F5F2ED] mt-1">
                                    {item.title}
                                </h3>

                                <p className="text-xs text-white/45 mt-1">
                                    {item.organization}
                                </p>
                            </div>

                            <button
                                onClick={() => toggleSaved(item.id)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                                aria-label="Save opportunity"
                            >
                                <Bookmark
                                    className={`w-4 h-4 ${saved.includes(item.id)
                                            ? 'fill-current text-[#F5F2ED]'
                                            : 'text-white/45'
                                        }`}
                                />
                            </button>
                        </div>

                        <p className="text-sm text-white/55 leading-relaxed mt-4">
                            {item.description}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-white/45">
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {item.location}
                            </span>

                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="w-3.5 h-3.5" />
                                {item.deadline}
                            </span>
                        </div>

                        <button
                            onClick={() => alert(`Opening ${item.title}`)}
                            className="w-full mt-5 py-2.5 rounded-lg bg-[#F5F2ED] text-black text-xs uppercase tracking-[0.15em] font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
                        >
                            View Opportunity
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-[#121212] p-10 text-center">
                    <Search className="w-7 h-7 mx-auto text-white/25" />
                    <p className="text-sm text-white/45 mt-3">
                        No matching opportunities found.
                    </p>
                </div>
            )}
        </div>
    );
};