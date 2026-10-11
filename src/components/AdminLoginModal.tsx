import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  Key, 
  Eye, 
  EyeOff, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { ADMIN_CONFIG } from '../utils/helpers';

interface AdminLoginModalProps {
  isOpen: boolean;
  onLoginSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  onClose,
}) => {
  const [username, setUsername] = useState('RPM');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      if (
        username.trim() === ADMIN_CONFIG.username &&
        password === ADMIN_CONFIG.password
      ) {
        setIsSubmitting(false);
        onLoginSuccess();
      } else {
        setIsSubmitting(false);
        setError('Invalid administrator credentials. Access denied.');
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Crest Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/60 shadow-xl shadow-amber-500/20 p-1 flex items-center justify-center">
            <img
              src="/rpm_logo.jpg"
              alt="RPM Logo"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/rpm_logo.jpg';
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Access</span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Administrator Portal Login
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Enter your executive credentials to access governance, registrations, and club settings.
            </p>
          </div>
        </div>

        {/* Notification Destination Alert Banner */}
        <div className="p-3 mb-5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs">
          <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-200 block">Linked Notification Channel:</span>
            <span className="font-mono text-emerald-400 font-medium break-all text-[11px]">
              {ADMIN_CONFIG.notificationEmail}
            </span>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Registration summaries are automatically dispatched to this inbox.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Administrator User ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="RPM"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/80 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono text-xs focus:outline-none transition-colors"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/80 rounded-xl pl-9 pr-10 py-2.5 text-white font-mono text-xs focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 active:scale-[0.98] text-slate-950 font-extrabold text-xs tracking-wide transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Unlock Administrator Portal'}</span>
          </button>
        </form>

        {/* Credentials reminder footnote */}
        <div className="mt-5 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
          User: <span className="font-mono text-slate-300 font-bold">RPM</span> · Password configured
        </div>
      </div>
    </div>
  );
};
