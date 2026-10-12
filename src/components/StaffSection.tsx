import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Award, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  ShieldCheck,
  Activity,
  Search,
  Briefcase,
  Camera,
  Upload,
  Image as ImageIcon,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Grid,
  List,
  CheckSquare,
  Square
} from 'lucide-react';
import { StaffMember, StaffCategory, Administrator } from '../types';
import { ADMIN_CONFIG } from '../utils/helpers';

interface StaffSectionProps {
  staffMembers: StaffMember[];
  administrators?: Administrator[];
  activeAdmin?: Administrator;
  staffRegistrar?: Administrator;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin?: () => void;
  onSwitchActiveAdmin?: (adminId: string) => void;
  onAddStaff: (staff: StaffMember) => void;
  onEditStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
  onDeleteMultipleStaff?: (staffIds: string[]) => void;
}

export const StaffSection: React.FC<StaffSectionProps> = ({
  staffMembers,
  administrators = [],
  activeAdmin,
  staffRegistrar,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onSwitchActiveAdmin,
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
  onDeleteMultipleStaff,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showRegistrarNotice, setShowRegistrarNotice] = useState(false);

  // Designated registrar check: only the authenticated administrator (RPM) can register staff
  const isAuthorizedRegistrar = Boolean(isAdminLoggedIn);

  // Form state
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Assistant Coach');
  const [category, setCategory] = useState<StaffCategory>('Coaching');
  const [squadAssigned, setSquadAssigned] = useState('First Team');
  const [license, setLicense] = useState('UEFA A License');
  const [nationality, setNationality] = useState('England');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80');
  const [contractEndDate, setContractEndDate] = useState('2026-06-30');
  const [joinedDate, setJoinedDate] = useState('2023-01-01');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Inactive'>('Active');
  const [bioNotes, setBioNotes] = useState('');

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) setAvatarUrl(res);
    };
    reader.readAsDataURL(file);
  };

  const handleDirectStaffPhotoUpload = (staff: StaffMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        onEditStaff({
          ...staff,
          avatarUrl: res,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const openAddModal = () => {
    setEditingStaff(null);
    setFullName('');
    setRole('Coach');
    setCategory('Coaching');
    setSquadAssigned('First Team');
    setLicense('');
    setNationality('');
    setEmail('');
    setPhone('');
    setAvatarUrl('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80');
    setContractEndDate('2026-06-30');
    setJoinedDate(new Date().toISOString().split('T')[0]);
    setStatus('Active');
    setBioNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (staff: StaffMember) => {
    setEditingStaff(staff);
    setFullName(staff.fullName);
    setRole(staff.role);
    setCategory(staff.category);
    setSquadAssigned(staff.squadAssigned);
    setLicense(staff.license || '');
    setNationality(staff.nationality);
    setEmail(staff.email);
    setPhone(staff.phone);
    setAvatarUrl(staff.avatarUrl);
    setContractEndDate(staff.contractEndDate);
    setJoinedDate(staff.joinedDate);
    setStatus(staff.status);
    setBioNotes(staff.bioNotes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !role.trim()) return;

    const staffPayload: StaffMember = {
      id: editingStaff?.id || `stf-${Date.now()}`,
      staffId: editingStaff?.staffId || `STF-${Math.floor(Math.random() * 900) + 100}`,
      fullName: fullName.trim(),
      role: role.trim(),
      category,
      squadAssigned,
      license: editingStaff?.license || '',
      nationality: nationality.trim() || 'International',
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      contractEndDate,
      joinedDate,
      status,
      bioNotes: bioNotes.trim() || undefined,
    };

    if (editingStaff) {
      onEditStaff(staffPayload);
    } else {
      onAddStaff(staffPayload);
    }

    setIsModalOpen(false);
  };

  const filteredStaff = staffMembers.filter((s) => {
    if (selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.squadAssigned.toLowerCase().includes(q) ||
        (s.license && s.license.toLowerCase().includes(q)) ||
        s.nationality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isCoach = (staff: StaffMember) => staff.category === 'Coaching' || staff.role.toLowerCase().includes('coach');

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAllFiltered = () => {
    setSelectedIds(filteredStaff.map(s => s.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (!isAuthorizedRegistrar) {
      if (onOpenAdminLogin) onOpenAdminLogin();
      return;
    }
    if (onDeleteMultipleStaff) {
      onDeleteMultipleStaff(selectedIds);
    } else {
      onDeleteStaff(selectedIds[0]);
    }
    setSelectedIds([]);
  };

  const coachingCount = staffMembers.filter(s => s.category === 'Coaching').length;
  const medicalCount = staffMembers.filter(s => s.category === 'Medical & Fitness').length;
  const scoutingCount = staffMembers.filter(s => s.category === 'Scouting & Analysis').length;
  const opsCount = staffMembers.filter(s => s.category === 'Operations & Kit').length;

  return (
    <div className="space-y-6">
      {/* Staff Registration Governance Mandate Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        isAuthorizedRegistrar
          ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
          : 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-950/20'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src="/rpm_logo.jpg"
              alt="RPM Logo"
              className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/50 shadow-md"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/rpm_logo.jpg';
              }}
            />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow text-slate-950 ${
              isAuthorizedRegistrar ? 'bg-emerald-500' : 'bg-amber-500'
            }`}>
              {isAuthorizedRegistrar ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Single Staff Registrar Governance:</span>
                <span className={isAuthorizedRegistrar ? "text-emerald-300 font-extrabold" : "text-amber-400 font-extrabold"}>
                  {isAuthorizedRegistrar ? 'RPM (Authorized Super Admin)' : 'Login Required (User: RPM)'}
                </span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                isAuthorizedRegistrar 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}>
                {isAuthorizedRegistrar ? 'Exclusive Mandate Active' : 'Restricted to RPM'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Under club constitutional regulations, <strong className="text-slate-200">only one designated administrator (RPM)</strong> has executive authority to register coaches, physios, and technical staff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-800">
          {isAuthorizedRegistrar ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authorized to Register Coaches & Staff</span>
            </span>
          ) : (
            <button
              onClick={() => onOpenAdminLogin && onOpenAdminLogin()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-105 text-slate-950 text-xs font-extrabold transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Log In as RPM to Unlock</span>
            </button>
          )}
        </div>
      </div>

      {/* Header & Quick stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Technical Coaching Staff & Operations Team</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage head coaches, tactical staff, physios, medical team, performance scouts, and kit coordinators.
          </p>
        </div>

        <div>
          {isAuthorizedRegistrar ? (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Coach / Staff Member</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAdminLogin ? onOpenAdminLogin() : setShowRegistrarNotice(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Registration requires RPM login credentials"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Register Coach (Requires RPM Login)</span>
            </button>
          )}
        </div>
      </div>

      {/* Batch Selection Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-500/50 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs border border-rose-500/30">
              {selectedIds.length}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {selectedIds.length} {selectedIds.length === 1 ? 'member' : 'members'} selected
              </p>
              <p className="text-[11px] text-slate-400">
                You can delete all selected coaches & staff members in one action.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              onClick={handleBatchDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-rose-600/30 cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Search & View Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-x-auto w-full lg:w-auto">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'All' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Staff ({staffMembers.length})
          </button>
          <button
            onClick={() => setSelectedCategory('Coaching')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'Coaching' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Coaches ({coachingCount})
          </button>
          <button
            onClick={() => setSelectedCategory('Medical & Fitness')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'Medical & Fitness' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Medical & Fitness ({medicalCount})
          </button>
          <button
            onClick={() => setSelectedCategory('Scouting & Analysis')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'Scouting & Analysis' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scouting ({scoutingCount})
          </button>
          <button
            onClick={() => setSelectedCategory('Operations & Kit')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'Operations & Kit' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Operations & Kit ({opsCount})
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Select All Toggle Button */}
          {filteredStaff.length > 0 && (
            <button
              onClick={selectedIds.length === filteredStaff.length ? clearSelection : selectAllFiltered}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                selectedIds.length > 0
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title={selectedIds.length === filteredStaff.length ? 'Deselect all' : 'Select all visible members for batch deletion'}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{selectedIds.length === filteredStaff.length ? 'Deselect All' : 'Select All'}</span>
            </button>
          )}

          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Table List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search coach, role, staff name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Staff Content Display */}
      {filteredStaff.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No Coaches or Staff Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No members match "${searchQuery}". Clear your search or filter.`
              : 'There are currently no staff members in this category.'}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            )}
            {isAuthorizedRegistrar && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-md"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register Coach / Staff</span>
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Staff Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => {
            const isSelected = selectedIds.includes(staff.id);
            const coachRole = isCoach(staff);

            return (
              <div 
                key={staff.id}
                className={`bg-slate-900/90 border rounded-xl p-5 flex flex-col justify-between shadow-lg shadow-black/20 transition-all ${
                  isSelected 
                    ? 'border-rose-500/70 ring-1 ring-rose-500/30 bg-rose-950/10' 
                    : 'border-slate-800 hover:border-slate-700/80'
                }`}
              >
                <div>
                  {/* Top Bar with Selection Checkbox, Staff ID & Quick Trash Icon */}
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800/80">
                    <label 
                      className="inline-flex items-center gap-2 cursor-pointer select-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(staff.id)}
                        className="rounded border-slate-700 text-rose-500 focus:ring-rose-500/20 bg-slate-950 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                        {staff.category}
                      </span>
                    </label>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {staff.staffId}
                      </span>
                      {isAuthorizedRegistrar ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteStaff(staff.id);
                          }}
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                          title={coachRole ? `Delete coach ${staff.fullName}` : `Delete staff member ${staff.fullName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenAdminLogin) onOpenAdminLogin();
                          }}
                          className="p-1 rounded-md text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                          title="Administrator Only: Only administrator 'RPM' can delete coaches and staff"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Avatar & Role Header */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div className="relative group/avatar w-14 h-14 shrink-0">
                      <img
                        src={staff.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                        alt={staff.fullName}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0 shadow-md"
                      />
                      <label 
                        className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center cursor-pointer text-emerald-400 gap-0.5"
                        title="Click to upload staff photo"
                      >
                        <Camera className="w-4 h-4" />
                        <span className="text-[9px] font-semibold text-white">Upload</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleDirectStaffPhotoUpload(staff, e)} 
                        />
                      </label>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white truncate leading-snug">{staff.fullName}</h3>
                      <p className="text-xs font-semibold text-emerald-300/90 truncate">{staff.role}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                        <span className="truncate">{staff.squadAssigned}</span>
                        <span>·</span>
                        <span className="truncate">{staff.nationality}</span>
                      </div>
                    </div>
                  </div>

                  {/* Squad & Details */}
                  {staff.license ? (
                    <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1.5 text-xs mb-3">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-medium truncate">{staff.license}</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Bio notes */}
                  {staff.bioNotes && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                      {staff.bioNotes}
                    </p>
                  )}

                  {/* Contact information */}
                  <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    {staff.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                    )}
                    {staff.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{staff.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">
                    Contract: {new Date(staff.contractEndDate).getFullYear()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <label 
                      className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Upload photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleDirectStaffPhotoUpload(staff, e)} 
                      />
                    </label>
                    <button
                      onClick={() => openEditModal(staff)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                      title="Edit details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    {isAuthorizedRegistrar ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStaff(staff.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-rose-300 bg-rose-500/20 hover:bg-rose-600 hover:text-white border border-rose-500/40 rounded-lg transition-colors cursor-pointer text-xs font-bold shadow-sm active:scale-95"
                        title={coachRole ? `Delete coach ${staff.fullName} from club records` : `Delete staff member from club records`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
                        <span>{coachRole ? 'Delete Coach' : 'Delete Staff'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenAdminLogin) onOpenAdminLogin();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-500 bg-slate-900 border border-slate-800 rounded-lg hover:text-amber-400 transition-colors cursor-pointer text-xs font-medium"
                        title="Administrator Only: Only administrator 'RPM' can delete coaches and staff"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Admin Only</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Staff Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredStaff.length && filteredStaff.length > 0}
                      onChange={selectedIds.length === filteredStaff.length ? clearSelection : selectAllFiltered}
                      className="rounded border-slate-700 text-rose-500 focus:ring-rose-500/20 bg-slate-950 w-3.5 h-3.5 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Staff / Coach Member</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Squad</th>
                  <th className="py-3 px-3">Nationality</th>
                  <th className="py-3 px-3">Contract</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStaff.map((staff) => {
                  const isSelected = selectedIds.includes(staff.id);
                  const coachRole = isCoach(staff);

                  return (
                    <tr 
                      key={staff.id} 
                      className={`hover:bg-slate-800/40 transition-colors ${isSelected ? 'bg-rose-950/20' : ''}`}
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(staff.id)}
                          className="rounded border-slate-700 text-rose-500 focus:ring-rose-500/20 bg-slate-950 w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                            alt={staff.fullName}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block">{staff.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{staff.staffId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                          coachRole 
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {staff.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {staff.role}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {staff.squadAssigned}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {staff.nationality}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400">
                        {new Date(staff.contractEndDate).getFullYear()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <label 
                            className="p-1 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Upload photo"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleDirectStaffPhotoUpload(staff, e)} 
                            />
                          </label>
                          <button
                            onClick={() => openEditModal(staff)}
                            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Edit details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {isAuthorizedRegistrar ? (
                            <button
                              onClick={() => onDeleteStaff(staff.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded text-xs font-bold transition-colors cursor-pointer active:scale-95"
                              title={coachRole ? `Delete coach ${staff.fullName}` : `Delete staff member ${staff.fullName}`}
                            >
                              <Trash2 className="w-3 h-3 text-rose-400 group-hover:text-white" />
                              <span>{coachRole ? 'Delete Coach' : 'Delete'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (onOpenAdminLogin) onOpenAdminLogin();
                              }}
                              className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                              title="Administrator Only: Only administrator 'RPM' can delete coaches and staff"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div 
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingStaff ? `Edit Staff: ${editingStaff.fullName}` : 'Add Staff Member or Coach'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Role / Designation *</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Head Coach, Goalkeeper Coach, Chief Physio"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StaffCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Coaching">Coaching</option>
                    <option value="Medical & Fitness">Medical & Fitness</option>
                    <option value="Scouting & Analysis">Scouting & Analysis</option>
                    <option value="Operations & Kit">Operations & Kit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Squad</label>
                  <input
                    type="text"
                    value={squadAssigned}
                    onChange={(e) => setSquadAssigned(e.target.value)}
                    placeholder="e.g. First Team, All Squads, U21"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. Ghana, Spain, France"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contract End Date</label>
                  <input
                    type="date"
                    value={contractEndDate}
                    onChange={(e) => setContractEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* Staff Photo Upload Section */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <label className="block text-slate-300 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Staff Member Photo</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Upload file or enter image link</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80'}
                      alt="Staff Preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-500/50 shadow-md bg-slate-900"
                    />
                    <label 
                      className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer text-emerald-400"
                      title="Upload new file"
                    >
                      <Camera className="w-5 h-5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarFile} 
                      />
                    </label>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo from Device</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAvatarFile} 
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80')}
                        className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                        title="Use default placeholder"
                      >
                        Default
                      </button>
                    </div>

                    <div>
                      <input
                        type="url"
                        placeholder="Or paste image URL (e.g. https://...)"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Background / Tactical Notes</label>
                <textarea
                  rows={2}
                  value={bioNotes}
                  onChange={(e) => setBioNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  placeholder="Specialization, tactical philosophy, certifications..."
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                {editingStaff ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onDeleteStaff(editingStaff.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/20 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-500/40 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
                    <span>{isCoach(editingStaff) ? 'Delete Coach' : 'Delete Staff Member'}</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 cursor-pointer shadow-md"
                  >
                    {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registrar Mandate Authorization Notice Modal */}
      {showRegistrarNotice && staffRegistrar && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowRegistrarNotice(false)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Staff Registration Mandate</h3>
                  <p className="text-xs text-amber-400/90 font-medium">Single Administrator Governance</p>
                </div>
              </div>

              <button 
                onClick={() => setShowRegistrarNotice(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl">
              Under club constitutional regulations, <strong className="text-emerald-400">only one designated administrator</strong> has authority to register and appoint coaches, physios, and technical staff.
            </p>

            <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-xl flex items-center gap-3">
              <img
                src={staffRegistrar.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={staffRegistrar.fullName}
                className="w-11 h-11 rounded-xl object-cover border border-emerald-500/50 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white truncate">{staffRegistrar.fullName}</h4>
                  <span className="text-[10px] px-1 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
                    Registrar
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold">{staffRegistrar.role}</p>
                <p className="text-[10px] text-slate-400 font-mono">{staffRegistrar.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowRegistrarNotice(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Dismiss
              </button>
              {onOpenAdminLogin && (
                <button
                  type="button"
                  onClick={() => {
                    setShowRegistrarNotice(false);
                    onOpenAdminLogin();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-105 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Log In as RPM ({ADMIN_CONFIG.password})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
