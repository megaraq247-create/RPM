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
  Image as ImageIcon
} from 'lucide-react';
import { StaffMember, StaffCategory } from '../types';

interface StaffSectionProps {
  staffMembers: StaffMember[];
  onAddStaff: (staff: StaffMember) => void;
  onEditStaff: (staff: StaffMember) => void;
  onDeleteStaff: (staffId: string) => void;
}

export const StaffSection: React.FC<StaffSectionProps> = ({
  staffMembers,
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

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
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size exceeds 10MB limit.');
      return;
    }
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
    if (file.size > 10 * 1024 * 1024) {
      alert('Photo size exceeds 10MB limit.');
      return;
    }
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
    setLicense('UEFA Pro License');
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
    setLicense(staff.license);
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
      license: license.trim() || 'Club Certified',
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
        s.license.toLowerCase().includes(q) ||
        s.nationality.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const coachingCount = staffMembers.filter(s => s.category === 'Coaching').length;
  const medicalCount = staffMembers.filter(s => s.category === 'Medical & Fitness').length;
  const scoutingCount = staffMembers.filter(s => s.category === 'Scouting & Analysis').length;
  const opsCount = staffMembers.filter(s => s.category === 'Operations & Kit').length;

  return (
    <div className="space-y-6">
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

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs overflow-x-auto w-full sm:w-auto">
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

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search coach, license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => (
          <div 
            key={staff.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between shadow-lg shadow-black/20 transition-all"
          >
            <div>
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
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      {staff.category}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {staff.staffId}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white truncate leading-snug">{staff.fullName}</h3>
                  <p className="text-xs font-semibold text-emerald-300/90 truncate">{staff.role}</p>
                </div>
              </div>

              {/* License & Credentials */}
              <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1.5 text-xs mb-3">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-medium truncate">{staff.license}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Squad: <strong className="text-slate-200">{staff.squadAssigned}</strong></span>
                  <span>Nationality: <strong className="text-slate-200">{staff.nationality}</strong></span>
                </div>
              </div>

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

              <div className="flex items-center gap-1">
                <label 
                  className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Upload staff photo"
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
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Edit staff details"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteStaff(staff.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Remove staff member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                  <label className="block text-slate-400 mb-1">License / Credentials</label>
                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder="e.g. UEFA Pro License, FIFA Medical Dip"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
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

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 cursor-pointer"
                >
                  {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
