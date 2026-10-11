import React from 'react';
import { 
  Camera, 
  Video, 
  FileText, 
  Edit3, 
  Trash2, 
  ChevronRight,
  Shield,
  Activity,
  Calendar
} from 'lucide-react';
import { Player } from '../types';
import { formatCurrency, calculateAge, getPositionColor, getStatusBadge } from '../utils/helpers';

interface PlayerCardProps {
  player: Player;
  onViewDossier: (player: Player) => void;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
  onOpenVideo: (video: Player['videos'][0], playerName: string) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  onViewDossier,
  onEdit,
  onDelete,
  onOpenVideo,
}) => {
  const posStyle = getPositionColor(player.primaryPosition);
  const statusInfo = getStatusBadge(player.status);
  const age = calculateAge(player.dateOfBirth);

  return (
    <div className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl overflow-hidden transition-all duration-200 flex flex-col justify-between shadow-lg shadow-black/30">
      <div>
        {/* Top Header Banner with Photo & Number */}
        <div className="relative h-44 bg-gradient-to-b from-slate-800/80 to-slate-950/90 overflow-hidden flex items-end p-4">
          {/* Background subtle jersey pattern or photo overlay */}
          <img
            src={player.avatarUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80'}
            alt={player.displayName}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-55 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Position & Registration Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border shadow-md ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
              {player.primaryPosition}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950/80 border border-slate-700/60 text-slate-300">
              {player.registrationNumber}
            </span>
          </div>

          {/* Squad & Status indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px]">
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
              <span className={statusInfo.text}>{statusInfo.label}</span>
            </div>
          </div>

          {/* Player Name and basic title */}
          <div className="relative z-10 w-full">
            <div className="text-[11px] uppercase tracking-wider text-emerald-400/90 font-medium font-mono">
              {player.squadCategory}
            </div>
            <h3 className="text-lg font-extrabold text-white leading-tight tracking-tight drop-shadow-sm flex items-center justify-between">
              <span>{player.displayName}</span>
              <span className="text-xs font-semibold text-slate-300 font-mono">
                {formatCurrency(player.marketValue)}
              </span>
            </h3>
          </div>
        </div>

        {/* Player Profile Quick Metrics */}
        <div className="p-4 space-y-3">
          {/* Vital stats row */}
          <div className="grid grid-cols-4 gap-2 text-center py-2 bg-slate-950/50 rounded-lg border border-slate-800/60 text-xs">
            <div>
              <span className="block text-[10px] uppercase text-slate-400">Age</span>
              <span className="font-semibold text-slate-200">{age} yrs</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-400">Nation</span>
              <span className="font-semibold text-slate-200 truncate px-1 block">{player.nationality}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-400">Foot</span>
              <span className="font-semibold text-slate-200">{player.preferredFoot}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-slate-400">Height</span>
              <span className="font-semibold text-slate-200">{player.heightCm} cm</span>
            </div>
          </div>

          {/* Attribute Mini-Bars */}
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Pace / Speed</span>
              <span className="font-mono text-emerald-400 font-semibold">{player.attributes.pace}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${Math.min(player.attributes.pace, 100)}%` }} 
              />
            </div>

            <div className="flex items-center justify-between text-slate-400 pt-0.5">
              <span>Technical & Shooting</span>
              <span className="font-mono text-teal-400 font-semibold">{player.attributes.shooting}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 rounded-full" 
                style={{ width: `${Math.min(player.attributes.shooting, 100)}%` }} 
              />
            </div>
          </div>

          {/* Media Badges & Career Highlights */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 hover:text-slate-200 transition-colors" title={`${player.photos.length} Photos`}>
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">{player.photos.length}</span>
              </span>
              <span className="flex items-center gap-1 hover:text-slate-200 transition-colors" title={`${player.videos.length} Videos`}>
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">{player.videos.length}</span>
              </span>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Contract: {new Date(player.contractEndDate).getFullYear()}
            </div>
          </div>

          {/* Quick Play Highlight Reel if exists */}
          {player.videos.length > 0 && (
            <button
              onClick={() => onOpenVideo(player.videos[0], player.displayName)}
              className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5 text-xs font-medium transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="truncate">Watch: {player.videos[0].title}</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDossier(player)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700/80 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Profile & CV</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(player)}
            title="Edit player registration & details"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(player.id)}
            title="Delete player details from club roster"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
