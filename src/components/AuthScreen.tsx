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
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">

        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/50 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-8">
          <Logo size="md" />

          <p className="mt-7 text-[10px] uppercase tracking-[0.3em] text-white/40">
            Your opportunity account
          </p>

          <h1 className="mt-2 text-3xl font-light font-serif-luxury">
            {mode === 'signup'
              ? 'Start your NextMarga journey.'
              : 'Welcome back.'}
          </h1>

          <p className="mt-3 text-sm text-white/55 leading-relaxed">
            Keep your profile, roadmap, saved opportunities and applications
            connected across devices.
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-black text-xs uppercase tracking-[0.12em] font-semibold disabled:opacity-50"
        >
          <Chrome className="w-4 h-4" />
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            or email
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Account mode */}
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              clearMessages();
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-[0.15em] transition ${mode === 'signup'
                ? 'bg-[#F5F2ED] text-black'
                : 'text-white/50 hover:text-white'
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
                ? 'bg-[#F5F2ED] text-black'
                : 'text-white/50 hover:text-white'
              }`}
          >
            Sign in
          </button>
        </div>

        {/* Auth method */}
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              clearMessages();
            }}
            className={`flex-1 py-2.5 rounded-lg text-xs transition ${authMethod === 'password'
                ? 'bg-white/10 text-white'
                : 'text-white/40'
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
                ? 'bg-white/10 text-white'
                : 'text-white/40'
              }`}
          >
            Email OTP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {mode === 'signup' && authMethod === 'password' && (
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Name
              </span>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4">
                <User className="w-4 h-4 text-white/35" />

                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-white/25"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
              Email
            </span>

            <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4">
              <Mail className="w-4 h-4 text-white/35" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-white/25"
              />
            </div>
          </label>

          {authMethod === 'password' && (
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                Password
              </span>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4">
                <Lock className="w-4 h-4 text-white/35" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-white/25"
                />
              </div>
            </label>
          )}

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-xs text-red-200">
              {error}
            </p>
          )}

          {message && (
            <div className="flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#F5F2ED] text-black text-xs uppercase tracking-[0.16em] font-semibold disabled:opacity-50"
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

        <p className="mt-6 text-[10px] leading-relaxed text-white/30 text-center">
          Your account securely connects your student profile,
          personalized opportunities, roadmap and applications.
        </p>

      </div>
    </div>
  );
};