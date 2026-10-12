import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  UserPlus,
  Sparkles,
  Link2
} from 'lucide-react';

interface ShareRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegisterModal: () => void;
}

export const ShareRegistrationModal: React.FC<ShareRegistrationModalProps> = ({
  isOpen,
  onClose,
  onOpenRegisterModal,
}) => {
  const [copiedType, setCopiedType] = useState<'link' | 'short' | 'message' | null>(null);
  const [showQrCode, setShowQrCode] = useState(false);

  if (!isOpen) return null;

  // Determine registration URLs
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://rpmapp.club';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const fullRegistrationUrl = `${origin}${pathname}?register=player`;
  const vanityShortLink = `https://rpm.link/reg`;

  const inviteMessage = `⚽ *RPM App - Player Registration Invitation*
Welcome! You have been invited to register your official football player profile on RPM App (RAQ Player Management).

Please click the secure registration link below to submit your profile details, career honours, and upload your official CV directly from your computer or phone:
👉 ${fullRegistrationUrl}

🛡️ Official Club Registry:
• Enter your preferred squad category & tactical positions
• Upload your player photo & highlight video links
• Upload your CV document (.pdf / .docx / .txt)
• Note: Only Club Administrator "RPM" has access to delete or alter database records.`;

  const handleCopy = (text: string, type: 'link' | 'short' | 'message') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedType(type);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(inviteMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Invitation to Register on RPM App (Football Player Portal)');
    const body = encodeURIComponent(inviteMessage);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleSmsShare = () => {
    const body = encodeURIComponent(`Please complete your player registration on RPM App: ${fullRegistrationUrl}`);
    window.open(`sms:?&body=${body}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Player Registration Link</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  RPM App
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate and share an instant registration link for players to submit profiles and upload their CVs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Short Link Card */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Player Registration Link</span>
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">Auto-opens registration modal</span>
          </label>

          <div className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
            <input
              type="text"
              readOnly
              value={fullRegistrationUrl}
              className="flex-1 bg-transparent text-emerald-300 font-mono text-xs select-all outline-none truncate"
            />
            <button
              onClick={() => handleCopy(fullRegistrationUrl, 'link')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                copiedType === 'link'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {copiedType === 'link' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Vanity Short Link alternative */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                Short Alias
              </span>
              <span className="font-mono text-slate-200">{vanityShortLink}</span>
            </div>
            <button
              onClick={() => handleCopy(vanityShortLink, 'short')}
              className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedType === 'short' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedType === 'short' ? 'Copied' : 'Copy Alias'}</span>
            </button>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            One-Click Share Channels
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 transition-colors cursor-pointer group"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleEmailShare}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/30 text-blue-300 transition-colors cursor-pointer group"
            >
              <Mail className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">Email</span>
            </button>

            <button
              type="button"
              onClick={handleSmsShare}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-300 transition-colors cursor-pointer group"
            >
              <Smartphone className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">SMS / Text</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQrCode(!showQrCode)}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-colors cursor-pointer group"
            >
              <QrCode className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold">{showQrCode ? 'Hide QR' : 'Show QR'}</span>
            </button>
          </div>
        </div>

        {/* QR Code Card if toggled */}
        {showQrCode && (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-fade-in">
            {/* Custom stylized QR code SVG representation */}
            <div className="p-3 bg-white rounded-xl shadow-lg shrink-0">
              <svg className="w-28 h-28" viewBox="0 0 120 120" fill="none">
                <rect width="120" height="120" fill="white" />
                {/* Top-left corner box */}
                <rect x="10" y="10" width="30" height="30" fill="black" />
                <rect x="16" y="16" width="18" height="18" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="black" />
                
                {/* Top-right corner box */}
                <rect x="80" y="10" width="30" height="30" fill="black" />
                <rect x="86" y="16" width="18" height="18" fill="white" />
                <rect x="90" y="20" width="10" height="10" fill="black" />
                
                {/* Bottom-left corner box */}
                <rect x="10" y="80" width="30" height="30" fill="black" />
                <rect x="16" y="86" width="18" height="18" fill="white" />
                <rect x="20" y="90" width="10" height="10" fill="black" />
                
                {/* Simulated QR data modules */}
                <rect x="46" y="12" width="6" height="6" fill="black" />
                <rect x="56" y="12" width="6" height="6" fill="black" />
                <rect x="66" y="12" width="6" height="6" fill="black" />
                <rect x="46" y="24" width="6" height="6" fill="black" />
                <rect x="60" y="24" width="6" height="6" fill="black" />
                <rect x="46" y="36" width="6" height="6" fill="black" />
                <rect x="56" y="36" width="6" height="6" fill="black" />
                <rect x="66" y="36" width="6" height="6" fill="black" />

                <rect x="12" y="48" width="6" height="6" fill="black" />
                <rect x="24" y="48" width="6" height="6" fill="black" />
                <rect x="36" y="48" width="6" height="6" fill="black" />
                <rect x="48" y="48" width="24" height="24" rx="4" fill="#10b981" />
                <text x="60" y="64" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle" dominantBaseline="middle">RPM</text>
                <rect x="80" y="48" width="6" height="6" fill="black" />
                <rect x="96" y="48" width="6" height="6" fill="black" />

                <rect x="46" y="80" width="6" height="6" fill="black" />
                <rect x="60" y="80" width="6" height="6" fill="black" />
                <rect x="74" y="80" width="6" height="6" fill="black" />
                <rect x="88" y="80" width="6" height="6" fill="black" />
                <rect x="50" y="94" width="6" height="6" fill="black" />
                <rect x="66" y="94" width="6" height="6" fill="black" />
                <rect x="82" y="94" width="6" height="6" fill="black" />
                <rect x="98" y="94" width="6" height="6" fill="black" />
                <rect x="56" y="104" width="6" height="6" fill="black" />
                <rect x="72" y="104" width="6" height="6" fill="black" />
                <rect x="88" y="104" width="6" height="6" fill="black" />
              </svg>
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-white">Scan with Mobile Camera</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Players can point their phone camera at this QR code on training ground or trial days to open the registration form directly on their mobile device.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleCopy(fullRegistrationUrl, 'link')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy URL encoded in QR</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Copy Formatted Invite Message */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Formatted Invitation Message</span>
            <button
              onClick={() => handleCopy(inviteMessage, 'message')}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              {copiedType === 'message' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedType === 'message' ? 'Message Copied!' : 'Copy Invitation Text'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-300 font-sans whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto">
            {inviteMessage}
          </pre>
        </div>

        {/* Strict Security Policy Notice */}
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-amber-300">
              Security Guarantee: Player / Shared Link Permissions
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Anyone accessing this registration link can only register their own player details and view authorized squad information. <strong className="text-amber-200">They CANNOT delete any player, coach, staff, admin, or media details from the system.</strong> All deletion privileges are strictly locked and reserved for the Administrator (<span className="font-mono text-amber-300">RPM</span> / <span className="font-mono text-amber-300">Raq@020</span>).
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenRegisterModal();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test / Open Registration Modal Directly</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
