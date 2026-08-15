import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Plus, ArrowRight } from 'lucide-react';
import { UserProfile, ChatMessage, AppScreen } from '../types';
import { sampleInitialChatMessages } from '../data/mockData';

interface CareerAIChatScreenProps {
  profile: UserProfile;
  onSelectOpportunityById: (id: string) => void;
  onNavigate: (screen: AppScreen) => void;
}

export const CareerAIChatScreen: React.FC<CareerAIChatScreenProps> = ({
  profile,
  onSelectOpportunityById,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleInitialChatMessages);
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputVal;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          profile,
        }),
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I am analyzing your academic trajectory to recommend premier opportunities.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cards:
          textToSend.toLowerCase().includes('coding') || textToSend.toLowerCase().includes('class 9')
            ? [
                {
                  id: 'zonal-informatics-olympiad',
                  title: 'Zonal Informatics Olympiad',
                  eligibility: 'Class 8-12',
                  scope: 'National',
                  opportunityId: 'zonal-informatics-olympiad',
                },
                {
                  id: 'google-code-in-fellow',
                  title: 'Google Code-in Fellowship',
                  eligibility: 'Ages 13-17',
                  scope: 'Global',
                  opportunityId: 'google-code-in-fellow',
                },
              ]
            : undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Based on your ${profile.currentClass} profile in ${profile.state || 'India'}, focusing on ${profile.interests.slice(0, 2).join(' and ')} will yield exceptional academic growth.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-130px)] flex flex-col justify-between px-4 pb-20 relative bg-[#0A0A0A] bg-dot-pattern">
      {/* Top AI Header Badge */}
      <div className="pt-2 pb-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121212] border border-white/15 text-[10px] uppercase tracking-[0.25em] font-mono text-white/80">
          <Sparkles className="w-3.5 h-3.5 text-white/70" />
          <span>NextMarga CareerAI // Intelligence Core</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#F5F2ED] text-black font-normal'
                  : 'bg-[#121212] text-[#F5F2ED] border border-white/10 font-light'
              }`}
            >
              {/* Message text formatted with linebreaks */}
              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>

              {/* Embedded Opportunity Cards */}
              {msg.cards && msg.cards.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {msg.cards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => card.opportunityId && onSelectOpportunityById(card.opportunityId)}
                      className="min-w-[170px] bg-[#0A0A0A] border border-white/15 rounded-lg p-3 cursor-pointer hover:border-white/40 transition-all text-[#F5F2ED]"
                    >
                      <div className="font-serif-luxury font-medium text-xs truncate">{card.title}</div>
                      <div className="text-[10px] text-white/50 mt-1 font-mono">{card.eligibility}</div>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/80">
                        <span>{card.scope}</span>
                        <ArrowRight className="w-3 h-3 text-white/60" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                className={`text-[9px] font-mono mt-2 text-right ${
                  msg.sender === 'user' ? 'text-black/50' : 'text-white/40'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#121212] border border-white/15 rounded-xl px-4 py-3 text-xs text-white/60 flex items-center gap-2 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-white/70 animate-spin" />
              <span>CareerAI synthesizing curriculum parameters...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips & Input */}
      <div className="pt-2 space-y-2 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent">
        {/* Suggestion Prompt Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            "🧭 What trajectory should I prioritize next?",
            "🏆 Top Olympiads for Class 8",
            "💰 Regional & National Scholarships",
            "🐍 Python & Machine Learning milestones",
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="flex-shrink-0 px-3 py-1.5 rounded bg-[#121212] border border-white/10 text-[10px] font-mono text-white/70 hover:border-white/30 hover:text-white transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 bg-[#121212] border border-white/15 rounded-xl p-1.5 focus-within:ring-1 focus-within:ring-white/40 focus-within:border-white/40">
          <button
            type="button"
            className="p-2 text-white/40 hover:text-white rounded-lg transition-colors"
            title="Attach file"
          >
            <Plus className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Consult CareerAI on admissions, Olympiads, and roadmaps..."
            className="flex-1 text-xs bg-transparent border-none text-[#F5F2ED] placeholder-white/30 focus:outline-none px-1 tracking-wide"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isLoading}
            className="p-2 rounded-lg bg-[#F5F2ED] text-black disabled:opacity-30 hover:bg-white transition-all shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
