import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export interface DeleteTarget {
  type: 'player' | 'admin' | 'staff';
  id: string;
  name: string;
  subtitle?: string;
  avatarUrl?: string;
  identifier?: string;
  extraInfo?: string;
}

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  target: DeleteTarget | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  target,
  onConfirm,
  onClose,
}) => {
  if (!isOpen || !target) return null;

  const getTitle = () => {
    switch (target.type) {
      case 'player':
        return 'Delete Player Details';
      case 'admin':
        return 'Remove Administrator';
      case 'staff':
        return 'Remove Staff Member';
    }
  };

  const getDescription = () => {
    switch (target.type) {
      case 'player':
        return 'Are you sure you want to permanently delete this player? All dossier details, match photos, highlight videos, attributes, and career records will be completely removed from the club roster.';
      case 'admin':
        return 'Are you sure you want to revoke administrative access and delete this administrator? This action is authorized under Executive CEO authority.';
      case 'staff':
        return 'Are you sure you want to remove this staff member and revoke their coaching or operational credentials?';
    }
  };

  const getConfirmText = () => {
    switch (target.type) {
      case 'player':
        return 'Yes, Delete Player';
      case 'admin':
        return 'Yes, Delete Administrator';
      case 'staff':
        return 'Yes, Remove Staff';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{getTitle()}</h3>
              <p className="text-xs text-rose-400/90 font-medium">Irreversible Registry Action</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Entity Card Preview */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-3.5">
          {target.avatarUrl && (
            <img
              src={target.avatarUrl}
              alt={target.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
              }}
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white truncate">{target.name}</h4>
              {target.identifier && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {target.identifier}
                </span>
              )}
            </div>
            {target.subtitle && (
              <p className="text-xs text-emerald-400 font-medium truncate">{target.subtitle}</p>
            )}
            {target.extraInfo && (
              <p className="text-[11px] text-slate-400 truncate">{target.extraInfo}</p>
            )}
          </div>
        </div>

        {/* Warning text */}
        <p className="text-xs text-slate-300 leading-relaxed bg-rose-950/20 border border-rose-500/20 p-3 rounded-xl">
          {getDescription()}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/20 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{getConfirmText()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
