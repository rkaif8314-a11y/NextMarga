import React, { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, Lock, User, CheckCircle2, Chrome, Sparkles } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithOtp, signInWithGoogle } from '../lib/auth';

interface AuthScreenProps {
  onBack: () => void;
  onAuthenticated: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBack, onAuthenticated }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearMessages = () => {
    setError('');
    setMessage('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    clearMessages();

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (authMethod === 'password' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setBusy(true);

    try {
      if (authMethod === 'otp') {
        const { error: authError } = await signInWithOtp(email.trim());
        if (authError) throw authError;
        setMessage('OTP / magic link sent. Check your email and open it on this device.');
        return;
      }

      if (mode === 'signup') {
        const { data, error: authError } = await signUpWithEmail(email.trim(), password, fullName.trim());
        if (authError) throw authError;

        if (data.session) onAuthenticated();
        else setMessage('Account created. Check your email to confirm your account, then return to NextMarga.');
      } else {
        const { error: authError } = await signInWithEmail(email.trim(), password);
        if (authError) throw authError;
        onAuthenticated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    clearMessages();
    setBusy(true);

    try {
      const { error: authError } = await signInWithGoogle();
      if (authError) throw authError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F3] text-slate-950 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-700 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-semibold text-slate-950">NextMarga</span>
            </div>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Your opportunity account</p>
            <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              {mode === 'signup' ? 'Start your NextMarga journey.' : 'Welcome back.'}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Keep your profile, roadmap, saved opportunities and applications connected across devices.
            </p>
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
              {[
                ['Discover', 'Verified opportunities'],
                ['Personalize', 'Your career roadmap'],
                ['Track', 'Applications & deadlines'],
              ].map(([title, description]) => (
                <div key={title} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-950">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="lg:hidden">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sky-700 text-white shadow-sm"><Sparkles className="h-5 w-5" /></span>
                <span className="font-display text-xl font-semibold text-slate-950">NextMarga</span>
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Your opportunity account</p>
              <h1 className="mt-2 font-display text-3xl font-semibold leading-tight text-slate-950">
                {mode === 'signup' ? 'Start your NextMarga journey.' : 'Welcome back.'}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">Keep your profile, roadmap, saved opportunities and applications connected across devices.</p>
            </div>

            <button type="button" onClick={handleGoogle} disabled={busy} className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:opacity-50">
              <Chrome className="h-4 w-4" />
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">or email</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mb-4 flex rounded-md border border-slate-200 bg-slate-50 p-1">
              {(['signup', 'signin'] as const).map((item) => (
                <button key={item} type="button" onClick={() => { setMode(item); clearMessages(); }} className={`flex-1 rounded px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${mode === item ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>
                  {item === 'signup' ? 'Create account' : 'Sign in'}
                </button>
              ))}
            </div>

            <div className="mb-5 flex rounded-md border border-slate-200 bg-slate-50 p-1">
              {(['password', 'otp'] as const).map((item) => (
                <button key={item} type="button" onClick={() => { setAuthMethod(item); clearMessages(); }} className={`flex-1 rounded px-3 py-2.5 text-xs font-medium transition ${authMethod === item ? 'bg-sky-50 text-sky-800 ring-1 ring-sky-100' : 'text-slate-500 hover:text-slate-900'}`}>
                  {item === 'password' ? 'Password' : 'Email OTP'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && authMethod === 'password' && (
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Name</span>
                  <div className="mt-2 flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                    <User className="h-4 w-4 text-slate-400" />
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your name" className="w-full bg-transparent py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400" />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="text-xs font-medium text-slate-700">Email</span>
                <div className="mt-2 flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className="w-full bg-transparent py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400" />
                </div>
              </label>

              {authMethod === 'password' && (
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Password</span>
                  <div className="mt-2 flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" className="w-full bg-transparent py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400" />
                  </div>
                </label>
              )}

              {error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>}
              {message && <div className="flex gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4 shrink-0" /><span>{message}</span></div>}

              <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-md bg-sky-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800 disabled:opacity-50">
                {busy ? 'Please wait...' : authMethod === 'otp' ? 'Send OTP' : mode === 'signup' ? 'Create account' : 'Sign in'}
                {!busy && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-5 text-slate-500">Your account securely connects your student profile, personalized opportunities, roadmap and applications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};