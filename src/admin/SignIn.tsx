import { useState } from 'react';
import { createAccount, errorMessage, resetPassword, signInEmail, signInGoogle } from './store';

type Mode = 'signin' | 'create' | 'reset';

const COPY: Record<Mode, { title: string; action: string }> = {
  signin: { title: 'Staff sign-in', action: 'Sign in' },
  create: { title: 'Create a staff account', action: 'Create account' },
  reset: { title: 'Reset your password', action: 'Send reset link' },
};

export function SignIn() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const run = async (action: () => Promise<unknown>, done?: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      if (done) setMessage({ text: done, error: false });
    } catch (error) {
      setMessage({ text: errorMessage(error), error: true });
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const address = email.trim();
    if (!address) return setMessage({ text: 'Enter your email address.', error: true });
    if (mode !== 'reset' && password.length < 8) return setMessage({ text: 'Enter a password of at least 8 characters.', error: true });
    if (mode === 'signin') void run(() => signInEmail(address, password));
    else if (mode === 'create') void run(() => createAccount(address, password));
    else void run(() => resetPassword(address), 'If that address has an account, a reset link is on its way.');
  };

  const switchTo = (next: Mode) => { setMode(next); setMessage(null); };

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-black tracking-tight">{COPY[mode].title}</h1>
      <p className="mt-2 text-muted">
        {mode === 'create'
          ? 'Use the email address the owner added for you. You will be asked to confirm it.'
          : mode === 'reset' ? 'We will email you a link to choose a new password.'
          : 'For 057 Cafè staff only.'}
      </p>

      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="signin-email" className="field-label">Email address</label>
          <input id="signin-email" type="email" autoComplete="username" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {mode !== 'reset' && (
          <div>
            <label htmlFor="signin-password" className="field-label">Password</label>
            <input id="signin-password" type="password" autoComplete={mode === 'create' ? 'new-password' : 'current-password'} required minLength={8} className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        )}
        {message && <p role={message.error ? 'alert' : 'status'} className={message.error ? 'field-error' : 'text-sm text-muted'}>{message.text}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={busy}>{busy ? 'Please wait…' : COPY[mode].action}</button>
      </form>

      {mode === 'signin' && (
        <button type="button" className="btn btn-secondary mt-3 w-full" disabled={busy} onClick={() => void run(signInGoogle)}>
          Continue with Google
        </button>
      )}

      <ul className="mt-6 space-y-1">
        {mode !== 'signin' && <li><button type="button" className="link link-tap" onClick={() => switchTo('signin')}>Back to sign-in</button></li>}
        {mode === 'signin' && <li><button type="button" className="link link-tap" onClick={() => switchTo('reset')}>Forgot your password?</button></li>}
        {mode === 'signin' && <li><button type="button" className="link link-tap" onClick={() => switchTo('create')}>First time here? Create your account</button></li>}
      </ul>
    </div>
  );
}
