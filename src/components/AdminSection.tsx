import React, { useState } from 'react';
import { 
  Shield, 
  UserCheck, 
  UserPlus, 
  Building2, 
  History, 
  Key, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  CheckCircle2, 
  Lock,
  Unlock,
  LogOut,
  Mail,
  Send,
  Eye,
  FileText,
  Phone,
  AlertCircle,
  Camera,
  Upload,
  Crown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Administrator, AdminRole, ClubSettings, ActivityLog, EmailNotification } from '../types';
import { ADMIN_CONFIG, createMailtoLink } from '../utils/helpers';

interface AdminSectionProps {
  administrators: Administrator[];
  clubSettings: ClubSettings;
  activityLogs: ActivityLog[];
  isAdminLoggedIn: boolean;
  onAdminLoginRequest: () => void;
  onAdminLogout: () => void;
  emailNotifications: EmailNotification[];
  onViewEmailNotification: (notification: EmailNotification) => void;
  onAddAdmin: (admin: Administrator) => void;
  onEditAdmin: (admin: Administrator) => void;
  onDeleteAdmin: (adminId: string) => void;
  onReorderAdmins?: (newAdmins: Administrator[]) => void;
  onUpdateClubSettings: (settings: ClubSettings) => void;
}

export const AdminSection: React.FC<AdminSectionProps> = ({
  administrators,
  clubSettings,
  activityLogs,
  isAdminLoggedIn,
  onAdminLoginRequest,
  onAdminLogout,
  emailNotifications,
  onViewEmailNotification,
  onAddAdmin,
  onEditAdmin,
  onDeleteAdmin,
  onReorderAdmins,
  onUpdateClubSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'admins' | 'settings' | 'emails' | 'audit'>('admins');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);

  // Helper to determine if an admin role is CEO
  const isRoleCEO = (roleName: string) => {
    return roleName.toLowerCase().includes('ceo') || roleName.toLowerCase().includes('chief executive');
  };

  // Find designated CEO
  const ceoAdmin = administrators.find(a => isRoleCEO(a.role)) || administrators[0];

  // Active admin session identity (defaults to CEO, e.g. Abdul Rakeeb)
  const [activeAdminId, setActiveAdminId] = useState<string>(() => {
    const ceo = administrators.find(a => isRoleCEO(a.role));
    return ceo ? ceo.id : (administrators[0]?.id || '');
  });

  const activeAdmin = administrators.find(a => a.id === activeAdminId) || ceoAdmin || administrators[0];
  const isCurrentActiveCEO = activeAdmin ? isRoleCEO(activeAdmin.role) : false;

  // Single authorized staff registrar
  const currentStaffRegistrar = administrators.find(a => a.id === clubSettings.staffRegistrarAdminId) || ceoAdmin || administrators[0];

  const handleStaffRegistrarChange = (newAdminId: string) => {
    onUpdateClubSettings({
      ...clubSettings,
      staffRegistrarAdminId: newAdminId,
    });
  };

  // Move administrator up or down in hierarchy order (only CEO can perform)
  const handleMoveAdmin = (index: number, direction: 'up' | 'down') => {
    if (!isCurrentActiveCEO) {
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= administrators.length) return;

    const reordered = [...administrators];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const withOrder = reordered.map((a, i) => ({
      ...a,
      orderIndex: i + 1,
    }));

    if (onReorderAdmins) {
      onReorderAdmins(withOrder);
    }
  };

  // Form states
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AdminRole>('Sporting Director');
  const [department, setDepartment] = useState('Executive Board');
  const [accessLevel, setAccessLevel] = useState<Administrator['accessLevel']>('Full Access');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  // Club Settings state
  const [settingsForm, setSettingsForm] = useState<ClubSettings>(clubSettings);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Photo upload handlers
  const handleAdminAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDirectAdminPhotoUpload = (admin: Administrator, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        onEditAdmin({
          ...admin,
          avatarUrl: res,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCrestFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Logo size exceeds 10MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = event.target?.result as string;
      if (res) {
        setSettingsForm(prev => ({ ...prev, crestUrl: res }));
      }
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingAdmin(null);
    setFullName('');
    setRole('Head of Registrations');
    setDepartment('Player Registration & Compliance');
    setAccessLevel('Registrations & Rosters');
    setEmail('');
    setPhone('');
    setAvatarUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (admin: Administrator) => {
    setEditingAdmin(admin);
    setFullName(admin.fullName);
    setRole(admin.role);
    setDepartment(admin.department);
    setAccessLevel(admin.accessLevel);
    setEmail(admin.email);
    setPhone(admin.phone);
    setAvatarUrl(admin.avatarUrl);
    setIsModalOpen(true);
  };

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const adminPayload: Administrator = {
      id: editingAdmin?.id || `adm-${Date.now()}`,
      adminId: editingAdmin?.adminId || `RAQ-ADM-0${administrators.length + 1}`,
      fullName: fullName.trim(),
      role,
      department,
      accessLevel,
      email: email.trim(),
      phone: phone.trim(),
      avatarUrl: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      lastActive: 'Active now',
      status: 'Active',
    };

    if (editingAdmin) {
      onEditAdmin(adminPayload);
    } else {
      onAddAdmin(adminPayload);
    }

    setIsModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClubSettings(settingsForm);
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // If not logged in, show lock screen
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto my-8 p-8 bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/50 p-1 flex items-center justify-center shadow-lg shadow-amber-500/10">
          <img
            src="/rpm_logo.jpg"
            alt="RPM Logo"
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/rpm_logo.jpg';
            }}
          />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Administrator Security Gate</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Administrator Access Protected</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            This section is restricted to authorized club executives. Please log in with user <strong className="text-amber-400 font-mono">RPM</strong> and your admin password.
          </p>
        </div>

        {/* Linked email notification notice */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left text-xs max-w-md mx-auto flex items-start gap-3">
          <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-200 block">Linked Notification Channel:</span>
            <span className="font-mono text-emerald-400 font-medium block">
              {ADMIN_CONFIG.notificationEmail}
            </span>
            <p className="text-[11px] text-slate-400">
              Player and staff registration summaries are automatically delivered to this executive address.
            </p>
          </div>
        </div>

        <div>
          <button
            onClick={onAdminLoginRequest}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>Enter Admin Password to Unlock</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Administrators Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Club Administrators & Governance</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Logged in: {ADMIN_CONFIG.username}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Super Administrator session active · Notifications linked to <strong className="text-emerald-400 font-mono">{ADMIN_CONFIG.notificationEmail}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === 'admins' && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-105 active:scale-95 text-slate-950 font-extrabold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              title="Register a new Administrator or Board Member"
            >
              <UserPlus className="w-4 h-4 text-slate-950" />
              <span>Register Administrator & Board</span>
            </button>
          )}

          <button
            onClick={onAdminLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Lock administrator portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock / Log Out</span>
          </button>
        </div>
      </div>

      {/* Linked Email alert ribbon */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-200 font-semibold">Active Registrar Notification Channel: </span>
            <span className="font-mono text-emerald-400 font-bold">{ADMIN_CONFIG.notificationEmail}</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          {emailNotifications.length} registration summaries logged in outbox
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('admins')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'admins'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Active Administrators ({administrators.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Club Configuration & Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('emails')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'emails'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-400" />
          <span>Email Dispatches ({emailNotifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Activity Audit Trail ({activityLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: ADMINISTRATORS LIST */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          {/* Executive Governance & Session Banner */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs ${
            isCurrentActiveCEO 
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-start sm:items-center gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${isCurrentActiveCEO ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}`}>
                {isCurrentActiveCEO ? <Crown className="w-5 h-5 text-amber-400" /> : <Shield className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white">Active Executive Session:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                    isCurrentActiveCEO 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {activeAdmin ? `${activeAdmin.fullName} (${activeAdmin.role})` : 'Administrator'}
                  </span>
                  {isCurrentActiveCEO && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>Supreme Executive Prerogative</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {isCurrentActiveCEO
                    ? '👑 Sole CEO Authority: Under club governance, only the Chief Executive Officer (CEO) has authority to assign new administrators, order administrative hierarchy, and remove administrators.'
                    : '🔒 Non-CEO Session: Administrator appointment, hierarchy ordering, and deletion are restricted to the Chief Executive Officer (CEO).'}
                </p>
              </div>
            </div>

            {/* Session Switcher (so user can act as CEO or preview non-CEO mode) */}
            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <label className="text-[11px] text-slate-400 whitespace-nowrap">Acting As:</label>
              <select
                value={activeAdmin?.id || ''}
                onChange={(e) => setActiveAdminId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer font-medium"
              >
                {administrators.map((adm) => (
                  <option key={adm.id} value={adm.id}>
                    {adm.fullName} {isRoleCEO(adm.role) ? '👑 (CEO)' : `(${adm.role})`}
                  </option>
                ))}
              </select>
              {!isCurrentActiveCEO && ceoAdmin && (
                <button
                  onClick={() => setActiveAdminId(ceoAdmin.id)}
                  className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  Switch to CEO
                </button>
              )}
            </div>
          </div>

          {/* Exclusive Staff Registrar Mandate Panel */}
          <div className="p-4 bg-slate-900/90 rounded-xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/20">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Staff Registration Mandate Policy
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                    1 Administrator Rule
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Only one administrator has mandate to register coaches & technical staff. Currently appointed:{' '}
                  <strong className="text-emerald-300 font-semibold">{currentStaffRegistrar?.fullName} ({currentStaffRegistrar?.role})</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
              <label className="text-[11px] text-slate-400 whitespace-nowrap font-medium">Designate Registrar:</label>
              <select
                value={clubSettings.staffRegistrarAdminId || ceoAdmin?.id || ''}
                onChange={(e) => handleStaffRegistrarChange(e.target.value)}
                disabled={!isCurrentActiveCEO}
                className={`bg-slate-950 border text-xs rounded-lg px-2.5 py-1.5 font-medium transition-colors ${
                  isCurrentActiveCEO
                    ? 'border-emerald-500/40 text-emerald-300 focus:outline-none focus:border-emerald-400 cursor-pointer'
                    : 'border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title={isCurrentActiveCEO ? 'Select administrator authorized to register staff' : 'Only the CEO can reassign staff registrar authority'}
              >
                {administrators.map((adm) => (
                  <option key={adm.id} value={adm.id}>
                    {adm.fullName} ({adm.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Administrators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {administrators.map((admin, index) => (
              <div 
                key={admin.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-lg shadow-black/20"
              >
                <div>
                  {/* Hierarchy Rank Indicator & CEO Ordering Bar */}
                  <div className="flex items-center justify-between py-1.5 px-3 mb-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {isRoleCEO(admin.role) ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold font-mono text-[10px]">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>Rank #{index + 1} · Executive Lead (CEO)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] font-semibold">
                          <span>Hierarchy Rank #{index + 1}</span>
                        </span>
                      )}
                    </div>

                    {/* Hierarchy Ordering: Only the CEO can order administrators */}
                    {isCurrentActiveCEO ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">CEO Order:</span>
                        <button
                          onClick={() => handleMoveAdmin(index, 'up')}
                          disabled={index === 0}
                          className={`p-1 rounded transition-colors ${
                            index === 0
                              ? 'text-slate-700 cursor-not-allowed'
                              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800 cursor-pointer'
                          }`}
                          title="Move up in administrative hierarchy order (CEO Prerogative)"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveAdmin(index, 'down')}
                          disabled={index === administrators.length - 1}
                          className={`p-1 rounded transition-colors ${
                            index === administrators.length - 1
                              ? 'text-slate-700 cursor-not-allowed'
                              : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800 cursor-pointer'
                          }`}
                          title="Move down in administrative hierarchy order (CEO Prerogative)"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono" title="Ordering is reserved exclusively for the CEO">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>Order locked by CEO</span>
                      </span>
                    )}
                  </div>

                  {/* Admin Details Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative group/avatar w-12 h-12 shrink-0">
                        <img
                          src={admin.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                          alt={admin.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                        />
                        <label 
                          className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center cursor-pointer text-amber-400 gap-0.5"
                          title="Click to upload admin photo"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span className="text-[8px] font-semibold text-white">Upload</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleDirectAdminPhotoUpload(admin, e)} 
                          />
                        </label>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                            <span>{admin.fullName}</span>
                            {isRoleCEO(admin.role) && (
                              <span title="Chief Executive Officer">
                                <Crown className="w-3.5 h-3.5 text-amber-400 inline" />
                              </span>
                            )}
                          </h3>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                            {admin.adminId}
                          </span>
                        </div>
                        <p className={`text-xs font-semibold ${isRoleCEO(admin.role) ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {admin.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <label 
                        className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Upload admin photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleDirectAdminPhotoUpload(admin, e)} 
                        />
                      </label>
                      <button
                        onClick={() => openEditModal(admin)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer text-xs font-semibold"
                        title="Edit admin profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAdmin(admin.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-rose-300 bg-rose-500/20 hover:bg-rose-600 hover:text-white border border-rose-500/40 rounded-lg transition-colors cursor-pointer text-xs font-bold shadow-sm active:scale-95"
                        title={`Delete administrator: ${admin.fullName}`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400 group-hover:text-white" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span className="text-slate-200 font-medium">{admin.department}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Security Clearance:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono text-[10px] font-semibold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        {admin.accessLevel}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{admin.email}</span>
                    </div>
                    {admin.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{admin.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Status: <strong className="text-emerald-400">Online</strong></span>
                  <span>Active: {admin.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CLUB SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 max-w-3xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Club Operational Parameters</h3>
              <p className="text-xs text-slate-400">Global defaults for player registrations and contracts.</p>
            </div>
            {saveSettingsSuccess && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Settings Saved
              </span>
            )}
          </div>

          {/* Crest Logo Preview & Config */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="relative group w-18 h-18 rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-500/50 shadow-md p-0.5 shrink-0">
              <img
                src={settingsForm.crestUrl || '/rpm_logo.jpg'}
                alt="RPM Club Crest"
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/rpm_logo.jpg';
                }}
              />
              <label 
                className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center cursor-pointer text-amber-400 gap-0.5"
                title="Click to upload new crest image"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[9px] font-semibold text-white">Upload</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleCrestFile} 
                />
              </label>
            </div>
            <div className="flex-1 w-full text-xs space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-slate-300 font-semibold">Official Club Crest Logo</label>
                <span className="text-[11px] text-slate-400">Upload image file or set path</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Crest Image File</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleCrestFile} 
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, crestUrl: '/rpm_logo.jpg' })}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Reset to RPM Logo
                </button>
              </div>
              <input
                type="text"
                value={settingsForm.crestUrl}
                onChange={(e) => setSettingsForm({ ...settingsForm, crestUrl: e.target.value })}
                placeholder="/rpm_logo.jpg"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Official Club Name</label>
              <input
                type="text"
                value={settingsForm.clubName}
                onChange={(e) => setSettingsForm({ ...settingsForm, clubName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Short Name / Code</label>
              <input
                type="text"
                value={settingsForm.shortName}
                onChange={(e) => setSettingsForm({ ...settingsForm, shortName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Home Stadium</label>
              <input
                type="text"
                value={settingsForm.homeStadium}
                onChange={(e) => setSettingsForm({ ...settingsForm, homeStadium: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Stadium Capacity</label>
              <input
                type="text"
                value={settingsForm.stadiumCapacity}
                onChange={(e) => setSettingsForm({ ...settingsForm, stadiumCapacity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">League / Division</label>
              <input
                type="text"
                value={settingsForm.league}
                onChange={(e) => setSettingsForm({ ...settingsForm, league: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Current Competitive Season</label>
              <input
                type="text"
                value={settingsForm.currentSeason}
                onChange={(e) => setSettingsForm({ ...settingsForm, currentSeason: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Club City & Country</label>
              <input
                type="text"
                value={`${settingsForm.city}, ${settingsForm.country}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setSettingsForm({ 
                    ...settingsForm, 
                    city: parts[0]?.trim() || '', 
                    country: parts[1]?.trim() || '' 
                  });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Headquarters Contact Email</label>
              <input
                type="email"
                value={settingsForm.contactEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Club Configuration</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: REGISTRATION EMAIL DISPATCHES */}
      {activeTab === 'emails' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Automatic Registration Summary Dispatches</span>
              </h3>
              <p className="text-slate-400 mt-0.5">
                All player and staff registrations trigger a detailed email summary sent to{' '}
                <strong className="text-emerald-400 font-mono">{ADMIN_CONFIG.notificationEmail}</strong>
              </p>
            </div>
            <a
              href={`mailto:${ADMIN_CONFIG.notificationEmail}?subject=${encodeURIComponent('[RAQ RPM NOTIFICATION] Admin Channel Test')}&body=${encodeURIComponent('Hello Administrator, this is a test notification from RAQ Player Management (RPM).')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-semibold cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Test Email</span>
            </a>
          </div>

          {emailNotifications.length > 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
              {emailNotifications.map((notif) => {
                const mailto = createMailtoLink(notif.recipientEmail, notif.subject, notif.summaryBody);

                return (
                  <div key={notif.id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                          {notif.type}
                        </span>
                        <span className="text-white font-bold truncate">{notif.registrarName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">· {notif.timestamp}</span>
                      </div>
                      <p className="text-slate-400 font-mono text-[11px] truncate max-w-xl">
                        {notif.subject}
                      </p>
                      <div className="text-[11px] text-slate-500">
                        Recipient: <span className="font-mono text-emerald-400">{notif.recipientEmail}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onViewEmailNotification(notif)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Summary</span>
                      </button>

                      <a
                        href={mailto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer"
                        title="Open in Gmail / Email Client"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Open in Email</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
              <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p>No registration summaries dispatched yet.</p>
              <p className="text-[11px] text-slate-500 mt-1">
                When a new player or staff member is registered, a summary will be automatically recorded and dispatched here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              System & Governance Audit Trail
            </h3>
            <span className="text-xs text-slate-400 font-mono">Immutable Log</span>
          </div>

          <div className="divide-y divide-slate-800">
            {activityLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{log.action}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-400">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-300 font-medium block">{log.performedBy}</span>
                  <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingAdmin ? `Edit: ${editingAdmin.fullName}` : 'Register New Administrator or Board Member'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdmin} className="space-y-4 text-xs">
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
                  <label className="block text-slate-400 mb-1">Executive / Board Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-medium"
                  >
                    <optgroup label="Board of Directors">
                      <option value="Board Chairman">Board Chairman</option>
                      <option value="Executive Board Director">Executive Board Director</option>
                      <option value="Board Member">Board Member</option>
                      <option value="Club President">Club President</option>
                      <option value="Vice President">Vice President</option>
                    </optgroup>
                    <optgroup label="Club Administration & Executive">
                      <option value="Chief Executive Officer (CEO)">Chief Executive Officer (CEO)</option>
                      <option value="Sporting Director">Sporting Director</option>
                      <option value="Head of Registrations">Head of Registrations</option>
                      <option value="Secretary General">Secretary General</option>
                      <option value="Chief Operations Officer">Chief Operations Officer</option>
                      <option value="Legal Officer">Legal Officer</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">System Access Level</label>
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Super Administrator">Super Administrator</option>
                    <option value="Full Access">Full Access</option>
                    <option value="Registrations & Rosters">Registrations & Rosters</option>
                    <option value="View Only">View Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Official Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    required
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

              {/* Administrator Photo Upload Section */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <label className="block text-slate-300 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Administrator Photo</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Upload picture or paste URL</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                      alt="Admin Preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500/50 shadow-md bg-slate-900"
                    />
                    <label 
                      className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer text-amber-400"
                      title="Upload new file"
                    >
                      <Camera className="w-5 h-5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAdminAvatarFile} 
                      />
                    </label>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo from Device</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleAdminAvatarFile} 
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80')}
                        className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                        title="Use default placeholder"
                      >
                        Default
                      </button>
                    </div>

                    <div>
                      <input
                        type="url"
                        placeholder="Or enter image URL (e.g. https://...)"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                {editingAdmin ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onDeleteAdmin(editingAdmin.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Administrator / Board</span>
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
                    {editingAdmin ? 'Update Administrator / Board Member' : 'Register Administrator / Board Member'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
