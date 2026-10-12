import React from 'react';
import { 
  Shield, 
  Users, 
  UserPlus, 
  Video, 
  LayoutDashboard, 
  SlidersHorizontal,
  Search,
  Download,
  Upload,
  RefreshCw,
  Trophy,
  Lock,
  Unlock,
  CheckCircle2,
  Share2,
  Link2,
  GitBranch
} from 'lucide-react';
import { ClubSettings } from '../types';

interface HeaderProps {
  currentTab: 'dashboard' | 'players' | 'staff' | 'admins' | 'media';
  setCurrentTab: (tab: 'dashboard' | 'players' | 'staff' | 'admins' | 'media') => void;
  clubSettings: ClubSettings;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenPlayerRegister: () => void;
  onOpenStaffAdd: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  totalPlayers: number;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onOpenShareLink: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  clubSettings,
  searchQuery,
  setSearchQuery,
  onOpenPlayerRegister,
  onOpenStaffAdd,
  onExportData,
  onImportData,
  onResetData,
  totalPlayers,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onOpenShareLink,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          
          {/* Logo & Club Info */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-amber-500/40 shadow-lg shadow-amber-500/10 shrink-0 flex items-center justify-center p-0.5 group">
              <img
                src={clubSettings.crestUrl || '/rpm_logo.jpg'}
                alt="RAQ Player Management (RPM) Crest"
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/rpm_logo.jpg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  RPM <span className="text-amber-400 font-extrabold tracking-normal">App</span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Official
                  </span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 hidden sm:inline">
                  RAQ Player Management
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{clubSettings.clubName}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{clubSettings.homeStadium}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300 font-medium">{totalPlayers} Registered Players</span>
              </div>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search input */}
            <div className="relative hidden md:block w-48 lg:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search players, coaches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Share Player Registration Short Link button */}
            <button
              onClick={onOpenShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              title="Generate short registration link to send to players"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Share Link</span>
              <span className="sm:hidden">Share</span>
            </button>


            {/* Fast Register Player button */}
            <button
              onClick={onOpenPlayerRegister}
              className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-500/10 active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Register Player</span>
            </button>

            {/* Admin Security Login / Status badge */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => setCurrentTab('admins')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold cursor-pointer hover:bg-amber-500/25 transition-colors"
                title="Super Administrator session active (RPM)"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>RPM (Admin)</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 text-xs font-semibold transition-colors cursor-pointer"
                title="Log in with user 'RPM' and password"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>RPM Login</span>
              </button>
            )}

            {/* Quick Actions Dropdown / buttons */}
            <div className="hidden sm:flex items-center gap-1.5 border-l border-slate-800 pl-3">
              <button
                onClick={onExportData}
                title="Export Database (JSON Backup)"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>

              <label 
                title="Import Backup JSON"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>

              <button
                onClick={onResetData}
                title="Reset to Sample Club Data"
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-1 pb-2 overflow-x-auto">
          <nav className="flex items-center gap-1 min-w-max">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard & Overview</span>
            </button>

            <button
              onClick={() => setCurrentTab('players')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'players'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Players & CVs</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                {totalPlayers}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('staff')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'staff'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Coaches & Staff</span>
            </button>

            <button
              onClick={() => setCurrentTab('admins')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'admins'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {isAdminLoggedIn ? (
                <Shield className="w-4 h-4 text-amber-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>Administrators & Board</span>
            </button>

            <button
              onClick={() => setCurrentTab('media')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentTab === 'media'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Media & Video Vault</span>
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Championship Contenders 2024/25</span>
          </div>
        </div>

        {/* Mobile Search field */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search player, coach, position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
