'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError('Incorrect password.');
        return;
      }
      router.push('/admin');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <label className="block text-xs font-medium uppercase tracking-widest text-ink/60">
        Password
      </label>
      <input
        type="password"
        value={password}
        autoFocus
        onChange={(e) => setPassword(e.target.value)}
        className="mt-2 w-full rounded-sm border border-ink/20 bg-bone px-4 py-3 text-sm focus:border-ink focus:outline-none"
        required
      />
      {error && <p className="mt-3 text-xs text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading || !password}
        className="btn-primary mt-6 w-full disabled:opacity-50"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
