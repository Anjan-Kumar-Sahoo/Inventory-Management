import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

interface LoginPageProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ darkMode, onToggleTheme, onGoToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue managing inventory securely."
      darkMode={darkMode}
      onToggleTheme={onToggleTheme}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-transparent" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <button type="button" onClick={onGoToRegister} className="w-full py-2 rounded-lg border border-slate-300 font-medium">
          New here? Create account
        </button>
      </form>
    </AuthLayout>
  );
};
