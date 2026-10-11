import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  FileText, 
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { EmailNotification } from '../types';
import { createMailtoLink, ADMIN_CONFIG } from '../utils/helpers';

interface RegistrationEmailModalProps {
  notification: EmailNotification | null;
  onClose: () => void;
}

export const RegistrationEmailModal: React.FC<RegistrationEmailModalProps> = ({
  notification,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!notification) return null;

  const mailtoLink = createMailtoLink(
    notification.recipientEmail,
    notification.subject,
    notification.summaryBody
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(notification.summaryBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                  {notification.type} Summary
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {notification.timestamp}
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Registration Summary Dispatched
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination alert banner */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Destination Notification Email:</div>
            <div className="font-mono text-emerald-400 font-bold text-sm">
              {notification.recipientEmail}
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 font-medium text-[11px] border border-emerald-500/25">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dispatched to Admin</span>
          </div>
        </div>

        {/* Subject */}
        <div className="mb-3 text-xs">
          <span className="text-slate-400 block mb-0.5 font-medium">Email Subject:</span>
          <div className="font-mono text-slate-200 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 select-all">
            {notification.subject}
          </div>
        </div>

        {/* Formatted body view */}
        <div className="flex-1 overflow-y-auto mb-4 bg-slate-950/90 rounded-xl border border-slate-800 p-4 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {notification.summaryBody}
        </div>

        {/* Modal actions */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[11px] text-slate-400">
            Recorded in Administrator Email Notification Outbox.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Summary' : 'Copy Summary'}</span>
            </button>

            <a
              href={mailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Open in Email Client / Gmail</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
