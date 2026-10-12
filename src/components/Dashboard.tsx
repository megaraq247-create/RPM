import React from 'react';
import { 
  Users, 
  DollarSign, 
  ShieldCheck, 
  SlidersHorizontal, 
  TrendingUp, 
  UserPlus, 
  Award, 
  Activity, 
  Calendar, 
  Video, 
  Play, 
  ChevronRight,
  Shield,
  FileText,
  Share2,
  Link2
} from 'lucide-react';
import { Player, StaffMember, Administrator, ClubSettings } from '../types';
import { formatCurrency, calculateAge, getPositionColor, getStatusBadge } from '../utils/helpers';

interface DashboardProps {
  players: Player[];
  staffMembers: StaffMember[];
  administrators: Administrator[];
  clubSettings: ClubSettings;
  onNavigateTab: (tab: 'players' | 'staff' | 'admins' | 'media') => void;
  onOpenRegister: () => void;
  onViewPlayer: (player: Player) => void;
  onOpenVideo: (video: Player['videos'][0], playerName: string) => void;
  onOpenShareLink?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  players,
  staffMembers,
  administrators,
  clubSettings,
  onNavigateTab,
  onOpenRegister,
  onViewPlayer,
  onOpenVideo,
  onOpenShareLink,
}) => {
  // Calculations
  const totalMarketValue = players.reduce((sum, p) => sum + p.marketValue, 0);
  const totalGoals = players.reduce((sum, p) => 
    sum + p.careerHistory.reduce((s, c) => s + c.goals, 0), 0
  );
  const injuredPlayers = players.filter(p => p.status === 'Injured');
  const coachesCount = staffMembers.filter(s => s.category === 'Coaching').length;
  const staffCount = staffMembers.filter(s => s.category !== 'Coaching').length;

  const gks = players.filter(p => p.primaryPosition === 'GK');
  const defs = players.filter(p => ['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.primaryPosition));
  const mids = players.filter(p => ['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(p.primaryPosition));
  const fwds = players.filter(p => ['LW', 'RW', 'CF', 'ST'].includes(p.primaryPosition));

  // Top valued players
  const topValued = [...players].sort((a, b) => b.marketValue - a.marketValue).slice(0, 4);

  // Latest videos
  const recentVideos = players
    .flatMap(p => p.videos.map(v => ({ ...v, player: p })))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/70 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 shrink-0 p-1 flex items-center justify-center">
              <img
                src={clubSettings.crestUrl || '/rpm_logo.jpg'}
                alt="RPM Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/rpm_logo.jpg';
                }}
              />
            </div>
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                  RPM Official Crest
                </span>
                <span className="text-xs text-slate-400 font-medium">· Season {clubSettings.currentSeason}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {clubSettings.clubName} <span className="text-amber-400">Squad Operations</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Centralized elite football operations portal for player profiles, verified career CVs, video highlight reels, coaching staff, and administration.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenShareLink && (
              <button
                onClick={onOpenShareLink}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                title="Generate short link to invite players for self-registration"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>Share Registration Link</span>
              </button>
            )}


            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Player</span>
            </button>
            <button
              onClick={() => onNavigateTab('players')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Browse Squad</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Players */}
        <div 
          onClick={() => onNavigateTab('players')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Squad</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{players.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>First Team + Academy</span>
            <span className="text-emerald-400 font-semibold flex items-center">
              View <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Squad Valuation */}
        <div 
          onClick={() => onNavigateTab('players')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Market Value</span>
            <DollarSign className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-teal-400 font-mono">{formatCurrency(totalMarketValue)}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Asset Valuation</span>
            <span className="text-teal-400 font-semibold flex items-center">
              Roster <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Coaches & Staff */}
        <div 
          onClick={() => onNavigateTab('staff')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Staff & Coaches</span>
            <SlidersHorizontal className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{staffMembers.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{coachesCount} Coaches · {staffCount} Support</span>
            <span className="text-sky-400 font-semibold flex items-center">
              Team <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Administration */}
        <div 
          onClick={() => onNavigateTab('admins')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:translate-y-[-2px] shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Administrators</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{administrators.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Executive Board & Officers</span>
            <span className="text-indigo-400 font-semibold flex items-center">
              Board <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Positional Breakdown + Top Assets & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Squad Breakdown & Key Players */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tactical Pitch Positional Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Positional Depth & Squad Distribution</span>
                </h3>
                <p className="text-xs text-slate-400">Current balance across pitch lines</p>
              </div>
              <button
                onClick={() => onNavigateTab('players')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                View Full Roster →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                <span className="text-[11px] text-amber-400 font-bold uppercase block">Goalkeepers</span>
                <span className="text-xl font-black text-white font-mono mt-1 block">{gks.length}</span>
                <span className="text-[10px] text-slate-500">1st choice: {gks[0]?.lastName || 'None'}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                <span className="text-[11px] text-blue-400 font-bold uppercase block">Defenders</span>
                <span className="text-xl font-black text-white font-mono mt-1 block">{defs.length}</span>
                <span className="text-[10px] text-slate-500">Center & Full-Backs</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                <span className="text-[11px] text-emerald-400 font-bold uppercase block">Midfielders</span>
                <span className="text-xl font-black text-white font-mono mt-1 block">{mids.length}</span>
                <span className="text-[10px] text-slate-500">Holding & Playmakers</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                <span className="text-[11px] text-rose-400 font-bold uppercase block">Forwards</span>
                <span className="text-xl font-black text-white font-mono mt-1 block">{fwds.length}</span>
                <span className="text-[10px] text-slate-500">Strikers & Wingers</span>
              </div>
            </div>
          </div>

          {/* Top Valued Assets showcase */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Key Players & Highest Market Valuations</span>
                </h3>
                <p className="text-xs text-slate-400">Core assets and transfer market values</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topValued.map((player) => {
                const posStyle = getPositionColor(player.primaryPosition);
                const age = calculateAge(player.dateOfBirth);
                return (
                  <div
                    key={player.id}
                    onClick={() => onViewPlayer(player)}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={player.avatarUrl}
                        alt={player.displayName}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-700 group-hover:border-emerald-500 transition-colors"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {player.displayName}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
                            {player.primaryPosition}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {age} yrs · {player.nationality} · {player.squadCategory}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {formatCurrency(player.marketValue)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Contract {new Date(player.contractEndDate).getFullYear()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Medical Status & Video Highlights */}
        <div className="space-y-6">
          
          {/* Medical / Fitness Status Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400" />
                <span>Medical & Fitness Status</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {injuredPlayers.length} on injured list
              </span>
            </div>

            {injuredPlayers.length > 0 ? (
              <div className="space-y-2">
                {injuredPlayers.map(p => (
                  <div key={p.id} className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-rose-300">{p.displayName} ({p.primaryPosition})</span>
                      <span className="text-[10px] uppercase font-mono text-rose-400 font-bold">Injured</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.medicalNotes || 'In physical rehabilitation'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                All players fit and available for selection!
              </div>
            )}
          </div>

          {/* Quick Highlight Reels */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>Recent Video Highlights</span>
              </h3>
              <button 
                onClick={() => onNavigateTab('media')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                Vault →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentVideos.map((vid) => (
                <div 
                  key={vid.id}
                  onClick={() => onOpenVideo(vid, vid.player.displayName)}
                  className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-slate-950 transition-colors flex items-center justify-center shrink-0">
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {vid.player.displayName} · <span className="font-mono text-emerald-400">{vid.type}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Club Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={clubSettings.crestUrl || '/rpm_logo.jpg'}
                alt="RPM Badge"
                className="w-10 h-10 rounded-lg object-cover border border-amber-500/40"
              />
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span>{clubSettings.clubName}</span>
                </h3>
                <span className="text-[10px] text-amber-400 font-mono font-bold">RPM Club Headquarters</span>
              </div>
            </div>
            <div className="space-y-1.5 text-slate-400 pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Stadium:</span>
                <span className="text-slate-200">{clubSettings.homeStadium} ({clubSettings.stadiumCapacity})</span>
              </div>
              <div className="flex justify-between">
                <span>League:</span>
                <span className="text-slate-200">{clubSettings.league}</span>
              </div>
              <div className="flex justify-between">
                <span>Founded:</span>
                <span className="text-slate-200 font-mono">{clubSettings.foundedYear}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
