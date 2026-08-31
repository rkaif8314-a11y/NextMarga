import React, { FormEvent, useState } from 'react';
import { ArrowLeft, ArrowRight, Mail, Lock, User, CheckCircle2, Chrome } from 'lucide-react';
import { Logo } from './Logo';
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithOtp,
  signInWithGoogle,
} from '../lib/auth';

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
        const { data, error: authError } = await signUpWithEmail(
          email.trim(),
          password,
          fullName.trim()
        );

        if (authError) throw authError;

        if (data.session) {
          onAuthenticated();
        } else {
          setMessage(
            'Account created. Check your email to confirm your account, then return to NextMarga.'
          );
        }
      } else {
        const { error: authError } = await signInWithEmail(
          email.trim(),
          password
        );

        if (authError) throw authError;

        onAuthenticated();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Authentication failed. Please try again.'
      );
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
      setError(
        err instanceof Error
          ? err.message
          : 'Google sign-in failed. Please try again.'
      );
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-slate-500 hover:text-slate-950 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-8">
          <Logo size="md" />

          <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-slate-500">
            Your opportunity account
          </p>

          <h1 className="mt-2 text-3xl font-light font-serif-luxury">
            {mode === 'signup'
              ? 'Start your NextMarga journey.'
              : 'Welcome back.'}
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Keep your profile, roadmap, saved opportunities and applications
            connected across devices.
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-slate-950 text-xs uppercase tracking-[0.12em] font-semibold disabled:opacity-50"
        >
          <Chrome className="w-4 h-4" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            or email
          </span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        {/* Account mode */}
        <div className="flex p-1 rounded-xl bg-slate-50 border border-slate-200 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              clearMessages();
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-[0.15em] transition ${mode === 'signup'
                ? 'bg-sky-700 text-white'
                : 'text-slate-500 hover:text-slate-950'
              }`}
          >
            Create account
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('signin');
              clearMessages();
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-[0.15em] transition ${mode === 'signin'
                ? 'bg-sky-700 text-white'
                : 'text-slate-500 hover:text-slate-950'
              }`}
          >
            Sign in
          </button>
        </div>

        {/* Auth method */}
        <div className="flex p-1 rounded-xl bg-slate-50 border border-slate-200 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              clearMessages();
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs transition ${authMethod === 'password'
                ? 'bg-slate-100 text-slate-950'
                : 'text-slate-500'
              }`}
          >
            Password
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              clearMessages();
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs transition ${authMethod === 'otp'
                ? 'bg-slate-100 text-slate-950'
                : 'text-slate-500'
              }`}
          >
            Email OTP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === 'signup' && authMethod === 'password' && (
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Name
              </span>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
                <User className="w-4 h-4 text-slate-400" />

                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Email
            </span>

            <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
              <Mail className="w-4 h-4 text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </label>

          {authMethod === 'password' && (
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Password
              </span>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
                <Lock className="w-4 h-4 text-slate-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
              {error}
            </p>
          )}

          {message && (
            <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-sky-700 text-white text-xs uppercase tracking-[0.16em] font-semibold disabled:opacity-50"
          >
            {busy
              ? 'Please wait...'
              : authMethod === 'otp'
                ? 'Send OTP'
                : mode === 'signup'
                  ? 'Create account'
                  : 'Sign in'}

            {!busy && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="mt-6 text-[10px] leading-relaxed text-slate-400 text-center">
          Your account securely connects your student profile,
          personalized opportunities, roadmap and applications.
        </p>

      </div>
    </div>
  );
};