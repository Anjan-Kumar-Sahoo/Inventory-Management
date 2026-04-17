import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

interface RegisterPageProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onRegistered: () => void;
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ darkMode, onToggleTheme, onRegistered, onGoToLogin }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ email, storeName, password });
      onRegistered();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Secure your inventory workspace with email verification and OTP."
      darkMode={darkMode}
      onToggleTheme={onToggleTheme}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Store Name</label>
          <input value={storeName} onChange={e => setStoreName(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-transparent" />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required minLength={8} className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-transparent" />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60">
          {loading ? 'Creating...' : 'Register'}
        </button>
        <button type="button" onClick={onGoToLogin} className="w-full py-2 rounded-lg border border-slate-300 font-medium">
          Already have an account? Login
        </button>
      </form>
    </AuthLayout>
  );
};
