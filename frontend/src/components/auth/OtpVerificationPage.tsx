import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthLayout } from './AuthLayout';

interface OtpVerificationPageProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onVerified: () => void;
  onBackToRegister: () => void;
}

export const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({ darkMode, onToggleTheme, onVerified, onBackToRegister }) => {
  const { verifyOtp, pendingEmail } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(otp);
      onVerified();
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle={`Enter the 6-digit code sent to ${pendingEmail || 'your email address'}.`}
      darkMode={darkMode}
      onToggleTheme={onToggleTheme}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">One-Time Password</label>
          <input
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            maxLength={6}
            pattern="\d{6}"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-transparent tracking-[0.5em] text-center"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-60">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        <button type="button" onClick={onBackToRegister} className="w-full py-2 rounded-lg border border-slate-300 font-medium">
          Use different email
        </button>
      </form>
    </AuthLayout>
  );
};
