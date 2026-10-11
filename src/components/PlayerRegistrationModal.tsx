import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Camera, 
  Video, 
  FileText, 
  Plus, 
  Trash2, 
  Upload, 
  Sparkles, 
  Check, 
  Sliders,
  Trophy,
  Shield,
  HelpCircle
} from 'lucide-react';
import { 
  Player, 
  Position, 
  SquadCategory, 
  PlayerStatus, 
  PreferredFoot, 
  CareerRecord, 
  PlayerTrophy, 
  PlayerMediaPhoto, 
  PlayerMediaVideo 
} from '../types';

interface PlayerRegistrationModalProps {
  playerToEdit?: Player | null;
  onSave: (player: Player) => void;
  onClose: () => void;
}

const POSITIONS: Position[] = [
  'GK', 'CB', 'LB', 'RB', 'LWB', 'RWB',
  'CDM', 'CM', 'CAM', 'LM', 'RM',
  'LW', 'RW', 'CF', 'ST'
];

const SQUADS: SquadCategory[] = [
  'First Team', 'Reserves / U23', 'Under-21', 'Under-19', 'Academy'
];

const STATUSES: PlayerStatus[] = [
  'Active', 'Injured', 'On Loan', 'Suspended', 'In Trial'
];

export const PlayerRegistrationModal: React.FC<PlayerRegistrationModalProps> = ({
  playerToEdit,
  onSave,
  onClose,
}) => {
  const [step, setStep] = useState<'profile' | 'contract' | 'cv' | 'attributes' | 'media'>('profile');

  // Form State
  const [firstName, setFirstName] = useState(playerToEdit?.firstName || '');
  const [lastName, setLastName] = useState(playerToEdit?.lastName || '');
  const [displayName, setDisplayName] = useState(playerToEdit?.displayName || '');
  const [primaryPosition, setPrimaryPosition] = useState<Position>(playerToEdit?.primaryPosition || 'ST');
  const [secondaryPosition, setSecondaryPosition] = useState<Position | ''>(playerToEdit?.secondaryPosition || '');
  const [squadCategory, setSquadCategory] = useState<SquadCategory>(playerToEdit?.squadCategory || 'First Team');
  const [status, setStatus] = useState<PlayerStatus>(playerToEdit?.status || 'Active');
  const [dateOfBirth, setDateOfBirth] = useState(playerToEdit?.dateOfBirth || '2002-05-15');
  const [nationality, setNationality] = useState(playerToEdit?.nationality || 'England');
  const [heightCm, setHeightCm] = useState(playerToEdit?.heightCm || 182);
  const [weightKg, setWeightKg] = useState(playerToEdit?.weightKg || 76);
  const [preferredFoot, setPreferredFoot] = useState<PreferredFoot>(playerToEdit?.preferredFoot || 'Right');
  const [avatarUrl, setAvatarUrl] = useState(playerToEdit?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  // Contract
  const [contractStartDate, setContractStartDate] = useState(playerToEdit?.contractStartDate || '2024-07-01');
  const [contractEndDate, setContractEndDate] = useState(playerToEdit?.contractEndDate || '2027-06-30');
  const [marketValue, setMarketValue] = useState(playerToEdit?.marketValue || 15000000);
  const [weeklyWage, setWeeklyWage] = useState(playerToEdit?.weeklyWage || 35000);
  const [agentName, setAgentName] = useState(playerToEdit?.agentName || '');
  const [agentContact, setAgentContact] = useState(playerToEdit?.agentContact || '');

  // CV & Career Data
  const [bio, setBio] = useState(playerToEdit?.bio || 'Talented modern footballer with high work rate, dynamic athleticism, and high technical ceiling.');
  const [youthClub, setYouthClub] = useState(playerToEdit?.youthClub || '');
  const [scoutingNotes, setScoutingNotes] = useState(playerToEdit?.scoutingNotes || '');
  const [medicalNotes, setMedicalNotes] = useState(playerToEdit?.medicalNotes || 'Full medical clearance granted.');

  const [careerHistory, setCareerHistory] = useState<CareerRecord[]>(
    playerToEdit?.careerHistory || [
      {
        id: 'cv-init-1',
        season: '2023/24',
        club: 'RAQ Football Club',
        league: 'Championship',
        appearances: 24,
        goals: 8,
        assists: 5,
        minutesPlayed: 1820,
      }
    ]
  );

  const [trophies, setTrophies] = useState<PlayerTrophy[]>(
    playerToEdit?.trophies || []
  );

  // Attributes
  const [pace, setPace] = useState(playerToEdit?.attributes.pace || 82);
  const [shooting, setShooting] = useState(playerToEdit?.attributes.shooting || 78);
  const [passing, setPassing] = useState(playerToEdit?.attributes.passing || 80);
  const [dribbling, setDribbling] = useState(playerToEdit?.attributes.dribbling || 81);
  const [defending, setDefending] = useState(playerToEdit?.attributes.defending || 55);
  const [physical, setPhysical] = useState(playerToEdit?.attributes.physical || 75);
  const [tacticalIQ, setTacticalIQ] = useState(playerToEdit?.attributes.tacticalIQ || 79);
  const [stamina, setStamina] = useState(playerToEdit?.attributes.stamina || 82);
  const [attackingWorkRate, setAttackingWorkRate] = useState<'High' | 'Medium' | 'Low'>(playerToEdit?.attributes.attackingWorkRate || 'High');
  const [defensiveWorkRate, setDefensiveWorkRate] = useState<'High' | 'Medium' | 'Low'>(playerToEdit?.attributes.defensiveWorkRate || 'Medium');

  // Media
  const [photos, setPhotos] = useState<PlayerMediaPhoto[]>(playerToEdit?.photos || []);
  const [videos, setVideos] = useState<PlayerMediaVideo[]>(playerToEdit?.videos || []);

  // Quick inputs for new career item
  const [newSeason, setNewSeason] = useState('');
  const [newClub, setNewClub] = useState('');
  const [newLeague, setNewLeague] = useState('');
  const [newApps, setNewApps] = useState<number>(0);
  const [newGoals, setNewGoals] = useState<number>(0);
  const [newAssists, setNewAssists] = useState<number>(0);

  // Quick inputs for trophy
  const [newTrophyTitle, setNewTrophyTitle] = useState('');
  const [newTrophyYear, setNewTrophyYear] = useState('');
  const [newTrophyComp, setNewTrophyComp] = useState('');

  // Quick inputs for photo
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Quick inputs for video
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoType, setNewVideoType] = useState<PlayerMediaVideo['type']>('Highlights');
  const [newVideoDuration, setNewVideoDuration] = useState('');

  // Handle avatar upload
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setAvatarUrl(res);
    };
    reader.readAsDataURL(file);
  };

  // Handle media photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setPhotos(prev => [
          ...prev,
          {
            id: `ph-${Date.now()}`,
            url: res,
            caption: file.name.replace(/\.[^/.]+$/, ""),
            tag: 'Match',
            uploadedAt: new Date().toISOString().split('T')[0],
          }
        ]);
      }
    };
    reader.readAsDataURL(file);
  };

  const addPhotoByUrl = () => {
    if (!newPhotoUrl.trim()) return;
    setPhotos(prev => [
      ...prev,
      {
        id: `ph-${Date.now()}`,
        url: newPhotoUrl.trim(),
        caption: newPhotoCaption.trim() || 'Player Photo',
        tag: 'Match',
        uploadedAt: new Date().toISOString().split('T')[0],
      }
    ]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const addVideoRecord = () => {
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return;
    setVideos(prev => [
      ...prev,
      {
        id: `vid-${Date.now()}`,
        title: newVideoTitle.trim(),
        url: newVideoUrl.trim(),
        type: newVideoType,
        duration: newVideoDuration.trim() || undefined,
        addedAt: new Date().toISOString().split('T')[0],
      }
    ]);
    setNewVideoTitle('');
    setNewVideoUrl('');
    setNewVideoDuration('');
  };

  const addCareerRecord = () => {
    if (!newClub.trim() || !newSeason.trim()) return;
    setCareerHistory(prev => [
      ...prev,
      {
        id: `cv-${Date.now()}`,
        season: newSeason.trim(),
        club: newClub.trim(),
        league: newLeague.trim() || 'Division 1',
        appearances: Number(newApps) || 0,
        goals: Number(newGoals) || 0,
        assists: Number(newAssists) || 0,
      }
    ]);
    setNewSeason('');
    setNewClub('');
    setNewLeague('');
    setNewApps(0);
    setNewGoals(0);
    setNewAssists(0);
  };

  const addTrophyRecord = () => {
    if (!newTrophyTitle.trim() || !newTrophyYear.trim()) return;
    setTrophies(prev => [
      ...prev,
      {
        id: `tr-${Date.now()}`,
        title: newTrophyTitle.trim(),
        year: newTrophyYear.trim(),
        competition: newTrophyComp.trim() || 'Championship',
      }
    ]);
    setNewTrophyTitle('');
    setNewTrophyYear('');
    setNewTrophyComp('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setStep('profile');
      return;
    }

    const regNumber = playerToEdit?.registrationNumber || `RAQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const fullDisplayName = displayName.trim() || `${firstName.trim()} ${lastName.trim()}`;

    const newPlayer: Player = {
      id: playerToEdit?.id || `plr-${Date.now()}`,
      registrationNumber: regNumber,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      displayName: fullDisplayName,
      primaryPosition,
      secondaryPosition: secondaryPosition ? (secondaryPosition as Position) : undefined,
      squadCategory,
      status,
      dateOfBirth,
      nationality: nationality.trim() || 'International',
      heightCm: Number(heightCm) || 180,
      weightKg: Number(weightKg) || 75,
      preferredFoot,
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80',
      contractStartDate,
      contractEndDate,
      marketValue: Number(marketValue) || 1000000,
      weeklyWage: Number(weeklyWage) || 5000,
      agentName: agentName.trim() || undefined,
      agentContact: agentContact.trim() || undefined,
      bio: bio.trim(),
      youthClub: youthClub.trim() || undefined,
      careerHistory,
      trophies,
      attributes: {
        pace: Number(pace),
        shooting: Number(shooting),
        passing: Number(passing),
        dribbling: Number(dribbling),
        defending: Number(defending),
        physical: Number(physical),
        tacticalIQ: Number(tacticalIQ),
        stamina: Number(stamina),
        attackingWorkRate,
        defensiveWorkRate,
      },
      scoutingNotes: scoutingNotes.trim() || undefined,
      medicalNotes: medicalNotes.trim() || undefined,
      photos,
      videos,
      registeredAt: playerToEdit?.registeredAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(newPlayer);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/rpm_logo.jpg"
              alt="RPM Crest"
              className="w-10 h-10 rounded-lg object-cover border border-amber-500/40"
            />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {playerToEdit ? `Edit Player: ${playerToEdit.displayName}` : 'Register New Player & Build CV'}
              </h3>
              <p className="text-xs text-slate-400">
                Official RAQ Player Management (RPM) Registration & Media Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Bar */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setStep('profile')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              step === 'profile'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Player Profile & Identity
          </button>
          <button
            type="button"
            onClick={() => setStep('contract')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              step === 'contract'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Contract & Financials
          </button>
          <button
            type="button"
            onClick={() => setStep('cv')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              step === 'cv'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Career CV & Honours
          </button>
          <button
            type="button"
            onClick={() => setStep('attributes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              step === 'attributes'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Tactical Attributes
          </button>
          <button
            type="button"
            onClick={() => setStep('media')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              step === 'media'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            5. Pictures & Video Links ({photos.length + videos.length})
          </button>
        </div>

        {/* Wizard Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: PLAYER PROFILE */}
          {step === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Avatar Preview & Upload */}
                <div className="sm:col-span-1 flex flex-col items-center justify-center p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-center space-y-3">
                  <div className="relative">
                    <img
                      src={avatarUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=80'}
                      alt="Player Avatar"
                      className="w-28 h-32 rounded-xl object-cover border-2 border-emerald-500/50 shadow-md"
                    />
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black font-mono text-xs">
                      {primaryPosition}
                    </span>
                  </div>
                  <div className="w-full space-y-2">
                    <label className="block w-full text-center py-1.5 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5 inline mr-1" />
                      Upload Avatar File
                      <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                    </label>
                    <input
                      type="url"
                      placeholder="Or enter Image URL"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300"
                    />
                  </div>
                </div>

                {/* Identity Form */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1">Display / Matchday Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Al-Mansoor"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Primary Position *</label>
                    <select
                      value={primaryPosition}
                      onChange={(e) => setPrimaryPosition(e.target.value as Position)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      {POSITIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Secondary Position (Optional)</label>
                    <select
                      value={secondaryPosition}
                      onChange={(e) => setSecondaryPosition(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">None</option>
                      {POSITIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Physical & Bio details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Squad Category</label>
                  <select
                    value={squadCategory}
                    onChange={(e) => setSquadCategory(e.target.value as SquadCategory)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    {SQUADS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Player Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PlayerStatus)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    {STATUSES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Preferred Foot</label>
                  <select
                    value={preferredFoot}
                    onChange={(e) => setPreferredFoot(e.target.value as PreferredFoot)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both Feet (Ambidextrous)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CONTRACT & FINANCIALS */}
          {step === 'contract' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Contract Start Date</label>
                  <input
                    type="date"
                    value={contractStartDate}
                    onChange={(e) => setContractStartDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contract End Date</label>
                  <input
                    type="date"
                    value={contractEndDate}
                    onChange={(e) => setContractEndDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Market Valuation (€)</label>
                  <input
                    type="number"
                    step="50000"
                    value={marketValue}
                    onChange={(e) => setMarketValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Weekly Wage (€)</label>
                  <input
                    type="number"
                    step="1000"
                    value={weeklyWage}
                    onChange={(e) => setWeeklyWage(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Player Agent / Agency Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Sports Management"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Agent Contact (Email or Phone)</label>
                  <input
                    type="text"
                    placeholder="rep@agency.com"
                    value={agentContact}
                    onChange={(e) => setAgentContact(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CAREER CV & HONOURS */}
          {step === 'cv' && (
            <div className="space-y-5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Player Profile Summary / CV Executive Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white"
                  placeholder="Summary of player's playing style, mentality, strengths and trajectory..."
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Youth Academy / Early Development</label>
                <input
                  type="text"
                  placeholder="e.g. Sporting CP Academy, Ajax Youth System"
                  value={youthClub}
                  onChange={(e) => setYouthClub(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              {/* Career Records Table */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Career Season History ({careerHistory.length})
                  </h4>
                </div>

                {careerHistory.length > 0 && (
                  <div className="space-y-2">
                    {careerHistory.map((rec) => (
                      <div key={rec.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400 font-bold">{rec.season}</span>
                          <span className="text-white font-semibold">{rec.club}</span>
                          <span className="text-slate-400">({rec.league})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-300 font-mono">
                            {rec.appearances} apps · {rec.goals} goals · {rec.assists} ast
                          </span>
                          <button
                            type="button"
                            onClick={() => setCareerHistory(careerHistory.filter(c => c.id !== rec.id))}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Career Record Form */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Season (23/24)"
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Club"
                    value={newClub}
                    onChange={(e) => setNewClub(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="League"
                    value={newLeague}
                    onChange={(e) => setNewLeague(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Apps"
                    value={newApps || ''}
                    onChange={(e) => setNewApps(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Goals"
                    value={newGoals || ''}
                    onChange={(e) => setNewGoals(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={addCareerRecord}
                    className="px-2 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    + Add Season
                  </button>
                </div>
              </div>

              {/* Trophies Section */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Trophies & Personal Accolades ({trophies.length})</span>
                </h4>

                {trophies.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trophies.map((tr) => (
                      <div key={tr.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div>
                          <div className="font-semibold text-white">{tr.title}</div>
                          <div className="text-[11px] text-slate-400">{tr.competition} ({tr.year})</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setTrophies(trophies.filter(t => t.id !== tr.id))}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Trophy / Award title"
                    value={newTrophyTitle}
                    onChange={(e) => setNewTrophyTitle(e.target.value)}
                    className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Year (e.g. 2024)"
                    value={newTrophyYear}
                    onChange={(e) => setNewTrophyYear(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={addTrophyRecord}
                    className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    + Add Award
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TACTICAL ATTRIBUTES */}
          {step === 'attributes' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Physical */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                    Physical & Athleticism
                  </h4>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Pace / Sprint Speed</span>
                      <span className="font-mono font-bold text-emerald-400">{pace}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={pace}
                      onChange={(e) => setPace(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Physical Strength & Duels</span>
                      <span className="font-mono font-bold text-emerald-400">{physical}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={physical}
                      onChange={(e) => setPhysical(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Stamina & Fitness</span>
                      <span className="font-mono font-bold text-emerald-400">{stamina}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={stamina}
                      onChange={(e) => setStamina(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Technical */}
                <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">
                    Technical & Tactical
                  </h4>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Shooting & Finishing</span>
                      <span className="font-mono font-bold text-teal-400">{shooting}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={shooting}
                      onChange={(e) => setShooting(Number(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Passing & Vision</span>
                      <span className="font-mono font-bold text-teal-400">{passing}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={passing}
                      onChange={(e) => setPassing(Number(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Dribbling & Ball Retention</span>
                      <span className="font-mono font-bold text-teal-400">{dribbling}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={dribbling}
                      onChange={(e) => setDribbling(Number(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Defending & Interceptions</span>
                      <span className="font-mono font-bold text-teal-400">{defending}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={defending}
                      onChange={(e) => setDefending(Number(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-300">Tactical Awareness / IQ</span>
                      <span className="font-mono font-bold text-teal-400">{tacticalIQ}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="99"
                      value={tacticalIQ}
                      onChange={(e) => setTacticalIQ(Number(e.target.value))}
                      className="w-full accent-teal-500"
                    />
                  </div>
                </div>

              </div>

              {/* Work Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Attacking Work Rate</label>
                  <select
                    value={attackingWorkRate}
                    onChange={(e) => setAttackingWorkRate(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Defensive Work Rate</label>
                  <select
                    value={defensiveWorkRate}
                    onChange={(e) => setDefensiveWorkRate(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PICTURES & VIDEO LINKS */}
          {step === 'media' && (
            <div className="space-y-6 text-xs">
              
              {/* Photo Upload Section */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Upload Pictures ({photos.length})</span>
                  </h4>
                  <label className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs cursor-pointer transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Upload Image File</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {photos.map((ph) => (
                      <div key={ph.id} className="relative aspect-square rounded-lg overflow-hidden border border-slate-800 group">
                        <img src={ph.url} alt="pic" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter(p => p.id !== ph.id))}
                          className="absolute top-1 right-1 p-1 bg-rose-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="url"
                    placeholder="Or paste direct image URL (https://...)"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Caption"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    className="w-36 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={addPhotoByUrl}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Video Links Section */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>Video Links & Highlight Clips ({videos.length})</span>
                </h4>

                {videos.length > 0 && (
                  <div className="space-y-2">
                    {videos.map((vid) => (
                      <div key={vid.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div>
                          <div className="font-semibold text-white">{vid.title}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-sm">
                            {vid.type} · {vid.url}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVideos(videos.filter(v => v.id !== vid.id))}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Video Title (e.g. 2024 Skills Reel)"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                  />
                  <input
                    type="url"
                    placeholder="Video URL (YouTube/Vimeo/Direct)"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-white"
                  />
                  <select
                    value={newVideoType}
                    onChange={(e) => setNewVideoType(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="Highlights">Highlights</option>
                    <option value="Scouting Reel">Scouting Reel</option>
                    <option value="Match Analysis">Match Analysis</option>
                    <option value="Skills">Skills & Dribbles</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Duration (e.g. 3:45)"
                    value={newVideoDuration}
                    onChange={(e) => setNewVideoDuration(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={addVideoRecord}
                    className="sm:col-span-2 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    + Add Video Link
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {step !== 'profile' && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 'media') setStep('attributes');
                    else if (step === 'attributes') setStep('cv');
                    else if (step === 'cv') setStep('contract');
                    else if (step === 'contract') setStep('profile');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Previous Step
                </button>
              )}
              {step !== 'media' && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 'profile') setStep('contract');
                    else if (step === 'contract') setStep('cv');
                    else if (step === 'cv') setStep('attributes');
                    else if (step === 'attributes') setStep('media');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Next Step →
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{playerToEdit ? 'Save Player Updates' : 'Complete Player Registration'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
