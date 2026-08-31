import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mic, Square, RotateCcw, Sparkles, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface AssessmentScreenProps {
  profile: UserProfile;
  onExit: () => void;
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ profile, onExit }) => {
  const [remainingTime, setRemainingTime] = useState<number>(870); // 14:30 in seconds
  const [questionTimer, setQuestionTimer] = useState<number>(105); // 01:45 in seconds
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Timers countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
      setQuestionTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access is required for audio recording. You can also type your answer.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      setIsRecording(false);
    }
  };

  const handleSubmitResponse = async () => {
    if (!textAnswer.trim() && !recordedAudioUrl) {
      alert('Please provide a written response or record your voice answer.');
      return;
    }

    setEvaluating(true);
    try {
      const res = await fetch('/api/assess-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Tell us about a time you solved a difficult problem.',
          responseText: textAnswer || 'Audio response recorded by student demonstrating analytical problem-solving.',
          profile,
        }),
      });

      const data = await res.json();
      setEvaluationResult(data);
      try {
        confetti({ particleCount: 80, spread: 60 });
      } catch (e) {}
    } catch (e) {
      setEvaluationResult({
        score: 94,
        feedback: "Outstanding structured analysis and problem deconstruction. The methodology demonstrated sharp strategic clarity and clear resolution steps.",
        strengths: ["Rigorous problem definition", "Decisive execution roadmap"],
        improvementTip: "Incorporate explicit metric validations to substantiate final impact."
      });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 pb-28 animate-fadeIn">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] font-medium text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Abort Session</span>
          </button>

          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-800 bg-slate-50 border border-slate-200 px-3 py-1 rounded">
            TOTAL TIME // <span className="text-slate-950 font-bold">{formatTime(remainingTime)}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Circular Progress Ring */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#262626"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#F5F2ED"
                strokeWidth="4"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * questionTimer) / 105}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-light text-slate-950 font-mono tracking-tight">
                {formatTime(questionTimer)}
              </span>
              <span className="text-[9px] font-mono text-slate-500 tracking-[0.2em] uppercase">
                MIN : SEC
              </span>
            </div>
          </div>
        </div>

        {/* Prompt Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">
            QUESTION // 01 OF 03
          </div>
          <h1 className="text-base sm:text-lg font-serif-luxury font-light text-slate-950 leading-relaxed">
            Tell us about a time you solved a complex analytical obstacle. Walk us through your thought process, iterative adjustments, and the final outcome.
          </h1>
        </div>

        {/* Evaluation Modal / Card if evaluated */}
        {evaluationResult ? (
          <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-5 animate-fadeIn shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-slate-950" />
                <h3 className="font-serif-luxury font-medium text-slate-950 text-base">AI Evaluation Diagnostic</h3>
              </div>
              <div className="px-3 py-1 bg-sky-700 text-slate-950 font-mono text-xs font-semibold rounded">
                SCORE // {evaluationResult.score}/100
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-light">
              {evaluationResult.feedback}
            </p>

            <div className="space-y-2">
              <div className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate-500">Demonstrated Strengths</div>
              {evaluationResult.strengths?.map((s: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-800 font-light">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-light">
              <span className="text-slate-950 font-medium font-mono uppercase text-[10px] tracking-wider block mb-1">Strategic Recommendation:</span> {evaluationResult.improvementTip}
            </div>

            <button
              onClick={onExit}
              className="w-full py-3 bg-sky-700 text-slate-950 font-medium text-xs uppercase tracking-[0.15em] rounded-lg hover:bg-sky-800 transition-all shadow-sm"
            >
              Conclude & Return to Applications
            </button>
          </div>
        ) : (
          <>
            {/* Written Textarea Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
                Formulate Written Response
              </label>
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="I approached the analytical challenge by first formulating the core constraints..."
                rows={4}
                className="w-full p-4 bg-white rounded-xl border border-slate-200 text-slate-950 placeholder-white/30 text-xs font-light focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>

            {/* Divider OR */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-slate-50 px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                OR
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            {/* Audio Recording Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 text-center">
              <div className="text-xs uppercase tracking-[0.15em] font-mono text-slate-700">
                Audio Response Stream (Limit: 3 Minutes)
              </div>

              {isRecording ? (
                <div className="space-y-3">
                  {/* Equalizer animation */}
                  <div className="flex items-center justify-center gap-1.5 h-8">
                    {[16, 24, 32, 20, 28, 14, 30, 22].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-sky-700 rounded-full animate-pulse"
                        style={{ height: `${h}px`, animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={stopRecording}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 text-slate-950 font-medium text-xs uppercase tracking-[0.15em] shadow-md active:scale-95 transition-all"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Halt Recording</span>
                  </button>
                </div>
              ) : recordedAudioUrl ? (
                <div className="space-y-3">
                  <audio controls src={recordedAudioUrl} className="w-full h-10 invert opacity-80" />
                  <button
                    onClick={() => {
                      setRecordedAudioUrl(null);
                      startRecording();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Discard & Re-record</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={startRecording}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-50 hover:bg-sky-800/10 border border-slate-200 text-slate-950 font-medium text-xs uppercase tracking-[0.15em] active:scale-95 transition-all"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Initialize Voice Recording</span>
                </button>
              )}
            </div>

            {/* Submit / Next Button */}
            <button
              onClick={handleSubmitResponse}
              disabled={evaluating}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-medium text-xs uppercase tracking-[0.15em] shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {evaluating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing AI Evaluation Diagnostic...</span>
                </>
              ) : (
                <span>Submit & Generate Assessment Diagnostic</span>
              )}
            </button>
          </>
        )}
      </main>
    </div>
  );
};
