import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Grid, 
  List, 
  Filter, 
  ArrowUpDown, 
  UserPlus, 
  Camera, 
  Video, 
  FileText, 
  Edit3, 
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Player, Position, SquadCategory, PlayerStatus } from '../types';
import { PlayerCard } from './PlayerCard';
import { formatCurrency, calculateAge, getPositionColor, getStatusBadge } from '../utils/helpers';

interface PlayerListProps {
  players: Player[];
  searchQuery: string;
  onViewDossier: (player: Player) => void;
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
  onOpenVideo: (video: Player['videos'][0], playerName: string) => void;
  onRegisterPlayer: () => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  searchQuery,
  onViewDossier,
  onEdit,
  onDelete,
  onOpenVideo,
  onRegisterPlayer,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedSquad, setSelectedSquad] = useState<string>('All');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'age' | 'position'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered & sorted players
  const filteredPlayers = useMemo(() => {
    return players
      .filter((p) => {
        // Search query match
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.displayName.toLowerCase().includes(q) || 
                              p.firstName.toLowerCase().includes(q) || 
                              p.lastName.toLowerCase().includes(q);
          const matchesPos = p.primaryPosition.toLowerCase().includes(q);
          const matchesNat = p.nationality.toLowerCase().includes(q);
          const matchesReg = p.registrationNumber.toLowerCase().includes(q);
          if (!matchesName && !matchesPos && !matchesNat && !matchesReg) {
            return false;
          }
        }

        // Squad filter
        if (selectedSquad !== 'All' && p.squadCategory !== selectedSquad) {
          return false;
        }

        // Position filter
        if (selectedPosition !== 'All') {
          if (selectedPosition === 'GK' && p.primaryPosition !== 'GK') return false;
          if (selectedPosition === 'DEF' && !['CB', 'LB', 'RB', 'LWB', 'RWB'].includes(p.primaryPosition)) return false;
          if (selectedPosition === 'MID' && !['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(p.primaryPosition)) return false;
          if (selectedPosition === 'FWD' && !['LW', 'RW', 'CF', 'ST'].includes(p.primaryPosition)) return false;
        }

        // Status filter
        if (selectedStatus !== 'All' && p.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'name') {
          diff = a.lastName.localeCompare(b.lastName);
        } else if (sortBy === 'value') {
          diff = a.marketValue - b.marketValue;
        } else if (sortBy === 'age') {
          diff = calculateAge(a.dateOfBirth) - calculateAge(b.dateOfBirth);
        } else if (sortBy === 'position') {
          diff = a.primaryPosition.localeCompare(b.primaryPosition);
        }
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [players, searchQuery, selectedSquad, selectedPosition, selectedStatus, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'value' | 'age' | 'position') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-5">
      {/* Filters & Control Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Squad Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs">
            {['All', 'First Team', 'Under-21', 'Reserves / U23', 'Academy'].map((sq) => (
              <button
                key={sq}
                onClick={() => setSelectedSquad(sq)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  selectedSquad === sq
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Position Selector */}
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Positions</option>
            <option value="GK">Goalkeepers (GK)</option>
            <option value="DEF">Defenders (CB, FB)</option>
            <option value="MID">Midfielders (CM, CAM, CDM)</option>
            <option value="FWD">Forwards / Attackers</option>
          </select>

          {/* Status Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active & Fit</option>
            <option value="Injured">Injured</option>
            <option value="On Loan">On Loan</option>
            <option value="In Trial">Trialist</option>
          </select>
        </div>

        {/* View mode & Sorting */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-500">Sort:</span>
            <button
              onClick={() => toggleSort('name')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${sortBy === 'name' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              Name
            </button>
            <button
              onClick={() => toggleSort('position')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${sortBy === 'position' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              Pos
            </button>
            <button
              onClick={() => toggleSort('value')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${sortBy === 'value' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              Value
            </button>
            <button
              onClick={() => toggleSort('age')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${sortBy === 'age' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
            >
              Age
            </button>
          </div>

          {/* Grid vs Table toggle */}
          <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid Card View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Squad Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Roster Listing */}
      {filteredPlayers.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onViewDossier={onViewDossier}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenVideo={onOpenVideo}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Player Name & Reg</th>
                    <th className="py-3 px-3">Position</th>
                    <th className="py-3 px-3">Squad</th>
                    <th className="py-3 px-3">Nation / Age</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Market Value</th>
                    <th className="py-3 px-3 text-center">Media</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredPlayers.map((player) => {
                    const posStyle = getPositionColor(player.primaryPosition);
                    const statusInfo = getStatusBadge(player.status);
                    const age = calculateAge(player.dateOfBirth);

                    return (
                      <tr key={player.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={player.avatarUrl}
                              alt={player.displayName}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-white text-xs hover:text-emerald-400 cursor-pointer" onClick={() => onViewDossier(player)}>
                                {player.displayName}
                              </div>
                              <div className="font-mono text-[10px] text-slate-500 flex items-center gap-1.5">
                                <span>{player.registrationNumber}</span>
                                {player.cvDocument && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30" title={`CV Attached: ${player.cvDocument.fileName}`}>
                                    CV Doc
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
                            {player.primaryPosition}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-medium">
                          {player.squadCategory}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          <div>{player.nationality}</div>
                          <div className="text-[10px] text-slate-500">{age} yrs ({player.preferredFoot})</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                            <span className={`text-[11px] ${statusInfo.text}`}>{statusInfo.label}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-400">
                          {formatCurrency(player.marketValue)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2 text-slate-400">
                            <span className="flex items-center gap-0.5 text-[11px]">
                              <Camera className="w-3 h-3" />
                              <span>{player.photos.length}</span>
                            </span>
                            <span className="flex items-center gap-0.5 text-[11px] text-emerald-400">
                              <Video className="w-3 h-3" />
                              <span>{player.videos.length}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewDossier(player)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              CV Dossier
                            </button>
                            <button
                              onClick={() => onEdit(player)}
                              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Edit Player"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(player.id)}
                              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                              title="Delete Player Details"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white mb-1">No players matched your search</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            Try adjusting your search criteria or register a new player directly into the squad database.
          </p>
          <button
            onClick={onRegisterPlayer}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Player</span>
          </button>
        </div>
      )}
    </div>
  );
};
