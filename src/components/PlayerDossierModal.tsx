import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Camera, 
  Video, 
  Trophy, 
  Shield, 
  Activity, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Play, 
  Award,
  Zap,
  TrendingUp,
  Sliders,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { Player, PlayerMediaPhoto, PlayerMediaVideo } from '../types';
import { formatCurrency, calculateAge, getPositionColor, getStatusBadge } from '../utils/helpers';

interface PlayerDossierModalProps {
  player: Player | null;
  onClose: () => void;
  onEdit: (player: Player) => void;
  onDeletePlayer?: (playerId: string) => void;
  onOpenVideo: (video: PlayerMediaVideo, playerName: string) => void;
  onAddPhoto: (playerId: string, photo: PlayerMediaPhoto) => void;
  onAddVideo: (playerId: string, video: PlayerMediaVideo) => void;
  onDeletePhoto: (playerId: string, photoId: string) => void;
  onDeleteVideo: (playerId: string, videoId: string) => void;
}

export const PlayerDossierModal: React.FC<PlayerDossierModalProps> = ({
  player,
  onClose,
  onEdit,
  onDeletePlayer,
  onOpenVideo,
  onAddPhoto,
  onAddVideo,
  onDeletePhoto,
  onDeleteVideo,
}) => {
  const [activeTab, setActiveTab] = useState<'cv' | 'media' | 'attributes' | 'medical'>('cv');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoTag, setNewPhotoTag] = useState<'Match' | 'Training' | 'Presentation' | 'Medical' | 'Portrait'>('Match');
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoType, setNewVideoType] = useState<PlayerMediaVideo['type']>('Highlights');
  const [newVideoDuration, setNewVideoDuration] = useState('');
  const [newVideoNotes, setNewVideoNotes] = useState('');
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null);

  if (!player) return null;

  const posStyle = getPositionColor(player.primaryPosition);
  const statusInfo = getStatusBadge(player.status);
  const age = calculateAge(player.dateOfBirth);

  const totalAppearances = player.careerHistory.reduce((sum, c) => sum + c.appearances, 0);
  const totalGoals = player.careerHistory.reduce((sum, c) => sum + c.goals, 0);
  const totalAssists = player.careerHistory.reduce((sum, c) => sum + c.assists, 0);

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onAddPhoto(player.id, {
          id: `ph-${Date.now()}`,
          url: result,
          caption: file.name.replace(/\.[^/.]+$/, ""),
          tag: 'Match',
          uploadedAt: new Date().toISOString().split('T')[0],
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;
    onAddPhoto(player.id, {
      id: `ph-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || 'Player Photo',
      tag: newPhotoTag,
      uploadedAt: new Date().toISOString().split('T')[0],
    });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setIsAddingPhoto(false);
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return;
    onAddVideo(player.id, {
      id: `vid-${Date.now()}`,
      title: newVideoTitle.trim(),
      url: newVideoUrl.trim(),
      type: newVideoType,
      duration: newVideoDuration.trim() || undefined,
      notes: newVideoNotes.trim() || undefined,
      addedAt: new Date().toISOString().split('T')[0],
    });
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDuration('');
    setNewVideoNotes('');
    setIsAddingVideo(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <img
              src="/rpm_logo.jpg"
              alt="RPM Logo"
              className="w-8 h-8 rounded-lg object-cover border border-amber-500/40"
            />
            <span className="font-mono text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 font-bold">
              {player.registrationNumber}
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
                {player.primaryPosition}
              </span>
              <span className="text-sm font-semibold text-white">
                Player Dossier & Official CV
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              title="Print or Export as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Print / PDF CV</span>
            </button>
            <button
              onClick={() => onEdit(player)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>Edit Details</span>
            </button>
            {onDeletePlayer && (
              <button
                onClick={() => onDeletePlayer(player.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
                title="Permanently delete player record"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Delete Player</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Printable Official CV Header (Styled for print & screen) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Photo & Identity */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src={player.avatarUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80'}
                    alt={player.displayName}
                    className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl object-cover border-2 border-emerald-500/50 shadow-xl"
                  />
                  <span className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md font-black font-mono text-xs shadow-md border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}>
                    {player.primaryPosition}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-emerald-400">
                      {player.squadCategory}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                      <span className={statusInfo.text}>{statusInfo.label}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {player.firstName} <span className="text-emerald-400">{player.lastName}</span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span>Nationality: <strong className="text-slate-200">{player.nationality}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Age: <strong className="text-slate-200">{age} ({player.dateOfBirth})</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Foot: <strong className="text-slate-200">{player.preferredFoot}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Height/Weight: <strong className="text-slate-200">{player.heightCm} cm / {player.weightKg} kg</strong></span>
                  </div>
                </div>
              </div>

              {/* Financial & Contract Snapshot + Official Club Crest */}
              <div className="flex flex-col sm:flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-amber-500/30">
                  <img
                    src="/rpm_logo.jpg"
                    alt="RPM Crest"
                    className="w-9 h-9 rounded-md object-cover border border-amber-500/40"
                  />
                  <div className="text-left">
                    <div className="text-[10px] font-mono font-black text-amber-400 leading-tight">RAQ PLAYER MANAGEMENT</div>
                    <div className="text-[9px] text-slate-400">Official Club Dossier · RPM</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 w-full md:w-auto min-w-[240px] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Market Valuation:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(player.marketValue)}
                    </span>
                  </div>
                  {player.weeklyWage && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Weekly Wage:</span>
                      <span className="font-mono text-slate-200">
                        {formatCurrency(player.weeklyWage)} / wk
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Contract End:</span>
                    <span className="font-mono text-slate-200">{player.contractEndDate}</span>
                  </div>
                  {player.agentName && (
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">Agency / Rep:</span>
                      <span className="text-slate-300 truncate max-w-[140px]">{player.agentName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs for Dossier (No-print) */}
          <div className="flex items-center gap-1 border-b border-slate-800 pb-2 no-print">
            <button
              onClick={() => setActiveTab('cv')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'cv'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Career History & Honours CV
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'media'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Pictures & Videos ({player.photos.length + player.videos.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('attributes')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'attributes'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Technical & Tactical Attributes</span>
            </button>
            <button
              onClick={() => setActiveTab('medical')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'medical'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Scouting & Medical Notes</span>
            </button>
          </div>

          {/* TAB 1: CV, Career History & Honours */}
          {(activeTab === 'cv' || window.matchMedia?.('print').matches) && (
            <div className="space-y-6">
              {/* Executive Bio */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs leading-relaxed text-slate-300">
                <span className="font-semibold text-emerald-400 block mb-1 uppercase tracking-wider text-[11px]">
                  Player Profile Summary:
                </span>
                {player.bio}
                {player.youthClub && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-slate-400 text-[11px]">
                    Youth Academy / Roots: <strong className="text-slate-200">{player.youthClub}</strong>
                  </div>
                )}
              </div>

              {/* Career Totals Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">Total Appearances</div>
                  <div className="text-xl font-black text-white font-mono mt-0.5">{totalAppearances}</div>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">Career Goals</div>
                  <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">{totalGoals}</div>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">Career Assists</div>
                  <div className="text-xl font-black text-teal-400 font-mono mt-0.5">{totalAssists}</div>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <div className="text-[10px] uppercase text-slate-400">Trophies & Honours</div>
                  <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{player.trophies.length}</div>
                </div>
              </div>

              {/* Career History Records Table */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Season-By-Season Career Record</span>
                </h4>
                
                {player.careerHistory.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Season</th>
                          <th className="py-2.5 px-3">Club</th>
                          <th className="py-2.5 px-3">League</th>
                          <th className="py-2.5 px-3 text-center">Apps</th>
                          <th className="py-2.5 px-3 text-center">Goals</th>
                          <th className="py-2.5 px-3 text-center">Assists</th>
                          <th className="py-2.5 px-3 text-right">Minutes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {player.careerHistory.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-emerald-400 font-medium">{item.season}</td>
                            <td className="py-2.5 px-3 font-semibold text-white">{item.club}</td>
                            <td className="py-2.5 px-3 text-slate-400">{item.league}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-medium text-slate-200">{item.appearances}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">{item.goals}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-medium text-teal-400">{item.assists}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                              {item.minutesPlayed ? `${item.minutesPlayed}'` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800">
                    No career season records logged yet.
                  </div>
                )}
              </div>

              {/* Honours & Awards */}
              {player.trophies.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Trophies & Personal Accolades</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {player.trophies.map((tr) => (
                      <div key={tr.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-200">{tr.title}</div>
                          <div className="text-[11px] text-slate-400">
                            {tr.competition} · <span className="font-mono text-amber-400">{tr.year}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PICTURES & VIDEO MEDIA SECTION */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              
              {/* Photo Gallery Header & Add options */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span>Player Pictures & Photo Gallery ({player.photos.length})</span>
                    </h4>
                    <p className="text-xs text-slate-400">High-resolution match photos, training pictures, and official club portraits.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* File upload input */}
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-colors cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Picture</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoFileUpload} 
                        className="hidden" 
                      />
                    </label>

                    <button
                      onClick={() => setIsAddingPhoto(!isAddingPhoto)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {isAddingPhoto ? 'Cancel' : 'Add via Image URL'}
                    </button>
                  </div>
                </div>

                {/* Add Photo by URL Form */}
                {isAddingPhoto && (
                  <form onSubmit={handleCreatePhotoByUrl} className="p-4 mb-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                    <h5 className="text-xs font-semibold text-emerald-400">Add Picture by URL</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="url"
                        placeholder="Image URL (https://...)"
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        required
                      />
                      <select
                        value={newPhotoTag}
                        onChange={(e) => setNewPhotoTag(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Match">Match Action</option>
                        <option value="Training">Training</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Medical">Medical / Fitness</option>
                        <option value="Portrait">Portrait</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Caption / Description (optional)"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
                      >
                        Save Photo
                      </button>
                    </div>
                  </form>
                )}

                {/* Photo Grid */}
                {player.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {player.photos.map((photo) => (
                      <div 
                        key={photo.id} 
                        className="group relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Player photo'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onClick={() => setSelectedPhotoPreview(photo.url)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                          <div className="flex justify-end">
                            <button
                              onClick={() => onDeletePhoto(player.id, photo.id)}
                              className="p-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase">{photo.tag}</span>
                            <p className="text-[11px] text-white font-medium truncate">{photo.caption}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/80">
                    <Camera className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No photos uploaded for this player yet.</p>
                  </div>
                )}
              </div>

              {/* Video Highlights Section */}
              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Video className="w-4 h-4 text-emerald-400" />
                      <span>Video Highlights & Scout Reels ({player.videos.length})</span>
                    </h4>
                    <p className="text-xs text-slate-400">YouTube, Vimeo, match clips, and scouting analysis videos with built-in player.</p>
                  </div>

                  <button
                    onClick={() => setIsAddingVideo(!isAddingVideo)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingVideo ? 'Cancel' : 'Add Video Link'}</span>
                  </button>
                </div>

                {/* Add Video Form */}
                {isAddingVideo && (
                  <form onSubmit={handleCreateVideo} className="p-4 mb-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                    <h5 className="text-xs font-semibold text-emerald-400">Add Video Highlight Link</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Video Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. 2024 Season Goals & Skills"
                          value={newVideoTitle}
                          onChange={(e) => setNewVideoTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Video URL (YouTube / Vimeo / MP4) *</label>
                        <input
                          type="url"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={newVideoUrl}
                          onChange={(e) => setNewVideoUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Video Category</label>
                        <select
                          value={newVideoType}
                          onChange={(e) => setNewVideoType(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="Highlights">Highlights</option>
                          <option value="Scouting Reel">Scouting Reel</option>
                          <option value="Match Analysis">Match Analysis</option>
                          <option value="Skills">Skills & Dribbles</option>
                          <option value="Interviews">Interviews</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Duration (e.g. 4:30)</label>
                        <input
                          type="text"
                          placeholder="4:30"
                          value={newVideoDuration}
                          onChange={(e) => setNewVideoDuration(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Notes / Description</label>
                        <input
                          type="text"
                          placeholder="Key timestamps or remarks"
                          value={newVideoNotes}
                          onChange={(e) => setNewVideoNotes(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
                      >
                        Save Video Reel
                      </button>
                    </div>
                  </form>
                )}

                {/* Video List */}
                {player.videos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {player.videos.map((vid) => (
                      <div 
                        key={vid.id}
                        className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => onOpenVideo(vid, player.displayName)}
                              className="w-10 h-10 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                            >
                              <Play className="w-5 h-5 ml-0.5" />
                            </button>
                            <div>
                              <h5 className="text-xs font-bold text-white leading-tight">{vid.title}</h5>
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                <span className="font-mono text-emerald-400">{vid.type}</span>
                                {vid.duration && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>{vid.duration}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => onDeleteVideo(player.id, vid.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete video link"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {vid.notes && (
                          <p className="text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80 line-clamp-2">
                            {vid.notes}
                          </p>
                        )}

                        <div className="mt-3 pt-2 flex items-center justify-between text-xs">
                          <button
                            onClick={() => onOpenVideo(vid, player.displayName)}
                            className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <span>Watch Highlight Reel</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] text-slate-500 font-mono">Added: {vid.addedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-950/40 rounded-xl border border-slate-800/80">
                    <Video className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No video links uploaded yet for this player.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: ATTRIBUTES & METRICS */}
          {activeTab === 'attributes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Physical & Athletic Metrics */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Athletic & Physical Attributes</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Pace & Acceleration</span>
                        <span className="font-mono font-bold text-emerald-400">{player.attributes.pace} / 99</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${player.attributes.pace}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Physical Strength & Duels</span>
                        <span className="font-mono font-bold text-emerald-400">{player.attributes.physical} / 99</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${player.attributes.physical}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Stamina & Aerobic Capacity</span>
                        <span className="font-mono font-bold text-emerald-400">{player.attributes.stamina} / 99</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${player.attributes.stamina}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical & Tactical Metrics */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-400" />
                    <span>Technical & Tactical Attributes</span>
                  </h4>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Shooting & Finishing</span>
                        <span className="font-mono font-bold text-teal-400">{player.attributes.shooting} / 99</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${player.attributes.shooting}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Passing & Vision</span>
                        <span className="font-mono font-bold text-teal-400">{player.attributes.passing} / 99</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${player.attributes.passing}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Dribbling & Ball Control</span>
                        <span className="font-mono font-bold text-teal-400">{player.attributes.dribbling} / 99</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${player.attributes.dribbling}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Defending & Positioning</span>
                        <span className="font-mono font-bold text-teal-400">{player.attributes.defending} / 99</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${player.attributes.defending}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Tactical IQ & Awareness</span>
                        <span className="font-mono font-bold text-teal-400">{player.attributes.tacticalIQ} / 99</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: `${player.attributes.tacticalIQ}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Rates */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Attacking Work Rate:</span>
                  <span className="ml-2 font-bold text-white font-mono">{player.attributes.attackingWorkRate}</span>
                </div>
                <div>
                  <span className="text-slate-400">Defensive Work Rate:</span>
                  <span className="ml-2 font-bold text-white font-mono">{player.attributes.defensiveWorkRate}</span>
                </div>
                <div>
                  <span className="text-slate-400">Preferred Position:</span>
                  <span className="ml-2 font-bold text-emerald-400 font-mono">{player.primaryPosition}</span>
                  {player.secondaryPosition && (
                    <span className="ml-1 text-slate-400">(Alt: {player.secondaryPosition})</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCOUTING & MEDICAL */}
          {activeTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  <span>Head Scout Assessment & Technical Report</span>
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {player.scoutingNotes || 'No specific scouting report filed.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span>Medical & Fitness Clearance Status</span>
                </h4>
                <p className="text-xs leading-relaxed text-slate-300">
                  {player.medicalNotes || 'Player currently active with full clearance from medical team.'}
                </p>
              </div>
            </div>
          )}

          {/* Lightbox / Zoomed image preview */}
          {selectedPhotoPreview && (
            <div 
              className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedPhotoPreview(null)}
            >
              <div className="relative max-w-4xl max-h-[90vh]">
                <img 
                  src={selectedPhotoPreview} 
                  alt="Enlarged preview" 
                  className="max-h-[85vh] max-w-full rounded-xl object-contain border border-slate-700" 
                />
                <button
                  onClick={() => setSelectedPhotoPreview(null)}
                  className="absolute top-3 right-3 p-2 bg-slate-900/80 rounded-full text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
