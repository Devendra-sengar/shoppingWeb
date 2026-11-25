import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAdminAuthStore } from '../../stores/useAdminAuthStore';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuthStore();
  const [email, setEmail] = useState('admin@elan.com');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Failed to authenticate');
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1C18] text-[#F8F7F3] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#242621] p-8 rounded-lg border border-white/10 shadow-2xl space-y-6">
        
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <img src="/logo.png" alt="ÉLAN" className="h-12 w-auto mx-auto filter invert brightness-200" />
          <p className="text-xs uppercase tracking-luxury text-amber-200/80 font-medium">Atelier Administration Console</p>
          <p className="text-xs text-white/50">Authorized personnel and store management access</p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/40 border border-red-500/40 text-red-200 text-xs rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-white/70 mb-1 font-medium">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded text-white focus:outline-none focus:border-[#5B6955]"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 mb-1 font-medium">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded text-white focus:outline-none focus:border-[#5B6955]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5B6955] hover:bg-[#4d5a47] text-white py-2.5 font-medium rounded uppercase tracking-luxury text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Operations'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-white/40">
            Default Demo Accounts: <br />
            <span className="text-white/70 font-mono">admin@elan.com</span> (Super Admin)<br />
            <span className="text-white/70 font-mono">fulfillment@elan.com</span> (Dispatch Staff)
          </p>
        </div>
      </div>
    </div>
  );
};
