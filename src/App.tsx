/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PlayerList } from './components/PlayerList';
import { PlayerRegistrationModal } from './components/PlayerRegistrationModal';
import { PlayerDossierModal } from './components/PlayerDossierModal';
import { StaffSection } from './components/StaffSection';
import { AdminSection } from './components/AdminSection';
import { MediaVault } from './components/MediaVault';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { RegistrationEmailModal } from './components/RegistrationEmailModal';
import { ConfirmDeleteModal, DeleteTarget } from './components/ConfirmDeleteModal';
import { ShareRegistrationModal } from './components/ShareRegistrationModal';
import { GitHubConnectModal } from './components/GitHubConnectModal';
import { 
  Player, 
  StaffMember, 
  Administrator, 
  AdminRole,
  ClubSettings, 
  ActivityLog, 
  PlayerMediaVideo,
  PlayerMediaPhoto,
  EmailNotification,
  PlayerCvDocument
} from './types';
import { 
  initialPlayers, 
  initialStaffMembers, 
  initialAdministrators, 
  initialClubSettings, 
  initialActivityLogs 
} from './data/initialData';
import { 
  ADMIN_CONFIG, 
  generatePlayerRegistrationSummary, 
  generateStaffRegistrationSummary 
} from './utils/helpers';

export default function App() {
  // Persistence state
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('raq_players');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialPlayers;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('raq_staff');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialStaffMembers;
  });

  const [administrators, setAdministrators] = useState<Administrator[]>(() => {
    const saved = localStorage.getItem('raq_admins');
    if (saved) {
      try { 
        const parsed: Administrator[] = JSON.parse(saved); 
        return parsed.map((a, idx) => {
          if (a.id === 'adm-1' && (!a.role || a.role === 'Club President')) {
            return { ...a, role: 'Chief Executive Officer (CEO)', orderIndex: a.orderIndex || 1 };
          }
          return { ...a, orderIndex: a.orderIndex || idx + 1 };
        });
      } catch (e) { /* fallback */ }
    }
    return initialAdministrators;
  });

  const [clubSettings, setClubSettings] = useState<ClubSettings>(() => {
    const saved = localStorage.getItem('raq_settings');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (!parsed.crestUrl || parsed.crestUrl.includes('unsplash.com')) {
          parsed.crestUrl = '/rpm_logo.jpg';
        }
        return parsed;
      } catch (e) { /* fallback */ }
    }
    return initialClubSettings;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('raq_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialActivityLogs;
  });

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('raq_admin_logged_in') === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Active Administrator Session & Staff Registrar Mandate
  const [activeAdminId, setActiveAdminId] = useState<string>(() => {
    return localStorage.getItem('raq_active_admin_id') || 'adm-1';
  });

  const activeAdmin = administrators.find(a => a.id === activeAdminId) || administrators[0];
  const staffRegistrarId = clubSettings.staffRegistrarAdminId || administrators.find(a => a.role.toLowerCase().includes('ceo'))?.id || administrators[0]?.id || 'adm-1';
  const staffRegistrar = administrators.find(a => a.id === staffRegistrarId) || administrators[0];

  const handleSwitchActiveAdmin = (newAdminId: string) => {
    setActiveAdminId(newAdminId);
    localStorage.setItem('raq_active_admin_id', newAdminId);
    const target = administrators.find(a => a.id === newAdminId);
    if (target) {
      showToast(`Switched active session to: ${target.fullName} (${target.role})`);
    }
  };

  // Email notifications outbox state
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem('raq_email_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    // Pre-seed an initial registration summary for Tariq Al-Mansoor
    const samplePlayer = initialPlayers[0];
    const initialSummary = generatePlayerRegistrationSummary(samplePlayer);
    return [
      {
        id: 'notif-init-1',
        recipientEmail: ADMIN_CONFIG.notificationEmail,
        subject: initialSummary.subject,
        type: 'Player Registration',
        registrarName: samplePlayer.displayName,
        timestamp: '2026-10-08 08:30:00',
        summaryBody: initialSummary.body,
        status: 'Dispatched',
        entityId: samplePlayer.id,
      }
    ];
  });

  // Active email modal to show dispatched summary
  const [activeEmailModalNotification, setActiveEmailModalNotification] = useState<EmailNotification | null>(null);

  // UI state
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'players' | 'staff' | 'admins' | 'media'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [selectedDossierPlayer, setSelectedDossierPlayer] = useState<Player | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isRegistrationViaSharedLink, setIsRegistrationViaSharedLink] = useState(false);

  // Auto-detect player registration URL param (e.g. ?register=player or #register)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const isRegisterAction = searchParams.get('register') === 'player' || 
                               searchParams.get('register') === 'true' || 
                               searchParams.get('action') === 'register' || 
                               window.location.hash === '#register';
      if (isRegisterAction) {
        setIsRegisterModalOpen(true);
        setIsRegistrationViaSharedLink(true);
      }
    }
  }, []);
  
  // Video player modal
  const [activeVideo, setActiveVideo] = useState<PlayerMediaVideo | null>(null);
  const [activeVideoPlayerName, setActiveVideoPlayerName] = useState<string>('');

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('raq_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('raq_staff', JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem('raq_admins', JSON.stringify(administrators));
  }, [administrators]);

  useEffect(() => {
    localStorage.setItem('raq_settings', JSON.stringify(clubSettings));
  }, [clubSettings]);

  useEffect(() => {
    localStorage.setItem('raq_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('raq_admin_logged_in', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  useEffect(() => {
    localStorage.setItem('raq_email_notifications', JSON.stringify(emailNotifications));
  }, [emailNotifications]);

  // Keep selected dossier player updated in real time if player state updates
  useEffect(() => {
    if (selectedDossierPlayer) {
      const refreshed = players.find(p => p.id === selectedDossierPlayer.id);
      if (refreshed) {
        setSelectedDossierPlayer(refreshed);
      }
    }
  }, [players]);

  const logActivity = (action: string, category: ActivityLog['category'], details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      performedBy: isAdminLoggedIn ? 'RPM (Super Admin)' : (administrators[0]?.fullName || 'Admin'),
      action,
      category,
      details,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Player handlers
  const handleSavePlayer = (player: Player) => {
    const existingIndex = players.findIndex(p => p.id === player.id);
    const isNewRegistration = existingIndex < 0;

    if (existingIndex >= 0) {
      setPlayers(prev => prev.map(p => p.id === player.id ? player : p));
      logActivity('Player Profile Updated', 'Player', `Updated registration & CV details for ${player.displayName} (${player.primaryPosition}).`);
      showToast(`Updated player: ${player.displayName}`);
    } else {
      setPlayers(prev => [player, ...prev]);
      logActivity('Player Registered', 'Player', `Registered new player ${player.displayName} (${player.primaryPosition}) to ${player.squadCategory}.`);
      showToast(`Registered player: ${player.displayName}`);
    }

    // Automatically generate and dispatch email summary to linked email raqplayamanagentagn@gmail.com
    const summary = generatePlayerRegistrationSummary(player);
    const emailNotif: EmailNotification = {
      id: `notif-${Date.now()}`,
      recipientEmail: ADMIN_CONFIG.notificationEmail,
      subject: summary.subject,
      type: 'Player Registration',
      registrarName: player.displayName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      summaryBody: summary.body,
      status: 'Dispatched',
      entityId: player.id,
    };

    setEmailNotifications(prev => [emailNotif, ...prev]);
    logActivity('Registration Email Dispatched', 'System', `Dispatched registration summary for ${player.displayName} to ${ADMIN_CONFIG.notificationEmail}.`);
    
    // Open summary dispatch modal so admin can review and verify
    setActiveEmailModalNotification(emailNotif);

    setIsRegisterModalOpen(false);
    setPlayerToEdit(null);
  };

  const handleUpdatePlayerCv = (playerId: string, cvDoc: PlayerCvDocument, newBio?: string) => {
    setPlayers(prev => {
      const updated = prev.map(p => {
        if (p.id === playerId) {
          const updatedPlayer = {
            ...p,
            cvDocument: cvDoc,
            bio: newBio ? newBio : p.bio,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          if (selectedDossierPlayer?.id === playerId) {
            setSelectedDossierPlayer(updatedPlayer);
          }
          return updatedPlayer;
        }
        return p;
      });
      localStorage.setItem('raq_players', JSON.stringify(updated));
      return updated;
    });
    logActivity('CV Document Uploaded', 'Player', `Uploaded official CV document (${cvDoc.fileName}) from PC for player.`);
    showToast(`Uploaded CV "${cvDoc.fileName}" from PC successfully!`);
  };

  const handleRequestDeletePlayer = (playerId: string) => {
    if (!isAdminLoggedIn) {
      showToast('Administrator Access Required: Only administrator "RPM" can delete player records.');
      setIsLoginModalOpen(true);
      return;
    }
    const target = players.find(p => p.id === playerId);
    if (!target) return;
    setDeleteTarget({
      type: 'player',
      id: target.id,
      name: target.displayName,
      subtitle: `${target.primaryPosition} · ${target.squadCategory}`,
      identifier: target.registrationNumber,
      avatarUrl: target.avatarUrl,
      extraInfo: `Market Valuation: €${Number(target.marketValue).toLocaleString()} · Contract: ${target.contractEndDate}`,
    });
    setIsDeleteModalOpen(true);
  };

  // Photo handlers for a player
  const handleAddPhotoToPlayer = (playerId: string, photo: PlayerMediaPhoto) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          photos: [photo, ...p.photos],
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
    logActivity('Media Photo Uploaded', 'Player', `Added photo for player ID ${playerId}.`);
    showToast('Photo uploaded successfully');
  };

  const handleDeletePhotoFromPlayer = (playerId: string, photoId: string) => {
    if (!isAdminLoggedIn) {
      showToast('Administrator Access Required: Only administrator "RPM" can delete player photos.');
      setIsLoginModalOpen(true);
      return;
    }
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          photos: p.photos.filter(ph => ph.id !== photoId),
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
    showToast('Photo deleted');
  };

  // Video handlers for a player
  const handleAddVideoToPlayer = (playerId: string, video: PlayerMediaVideo) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          videos: [video, ...p.videos],
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
    logActivity('Video Highlight Added', 'Player', `Added highlight video "${video.title}" for player.`);
    showToast('Video link added successfully');
  };

  const handleDeleteVideoFromPlayer = (playerId: string, videoId: string) => {
    if (!isAdminLoggedIn) {
      showToast('Administrator Access Required: Only administrator "RPM" can delete video highlights.');
      setIsLoginModalOpen(true);
      return;
    }
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          videos: p.videos.filter(v => v.id !== videoId),
          updatedAt: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
    showToast('Video link removed');
  };

  // Staff handlers
  const handleAddStaff = (staff: StaffMember) => {
    setStaffMembers(prev => [staff, ...prev]);
    logActivity('Staff Member Appointed', 'Staff', `Appointed ${staff.fullName} as ${staff.role}.`);
    showToast(`Added staff member: ${staff.fullName}`);

    // Automatically generate and dispatch email summary to linked email raqplayamanagentagn@gmail.com
    const summary = generateStaffRegistrationSummary(staff);
    const emailNotif: EmailNotification = {
      id: `notif-${Date.now()}`,
      recipientEmail: ADMIN_CONFIG.notificationEmail,
      subject: summary.subject,
      type: 'Staff Registration',
      registrarName: staff.fullName,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      summaryBody: summary.body,
      status: 'Dispatched',
      entityId: staff.id,
    };

    setEmailNotifications(prev => [emailNotif, ...prev]);
    logActivity('Staff Registration Email Dispatched', 'System', `Dispatched staff summary for ${staff.fullName} to ${ADMIN_CONFIG.notificationEmail}.`);
    
    // Open summary dispatch modal so admin can review and verify
    setActiveEmailModalNotification(emailNotif);
  };

  const handleEditStaff = (staff: StaffMember) => {
    setStaffMembers(prev => prev.map(s => s.id === staff.id ? staff : s));
    logActivity('Staff Record Updated', 'Staff', `Updated records for ${staff.fullName} (${staff.role}).`);
    showToast(`Updated staff: ${staff.fullName}`);
  };

  const handleRequestDeleteStaff = (staffId: string) => {
    if (!isAdminLoggedIn) {
      showToast('Administrator Access Required: Only administrator "RPM" can delete coaches or staff.');
      setIsLoginModalOpen(true);
      return;
    }
    const target = staffMembers.find(s => s.id === staffId);
    if (!target) return;
    const isCoach = target.category === 'Coaching' || target.role.toLowerCase().includes('coach');
    setDeleteTarget({
      type: 'staff',
      id: target.id,
      name: target.fullName,
      subtitle: `${target.role} · ${target.category}`,
      identifier: target.staffId,
      avatarUrl: target.avatarUrl,
      extraInfo: target.license
        ? `Squad: ${target.squadAssigned} · License: ${target.license}`
        : `Squad: ${target.squadAssigned} · Nationality: ${target.nationality}`,
    });
    setIsDeleteModalOpen(true);
  };

  const handleRequestDeleteMultipleStaff = (staffIds: string[]) => {
    if (staffIds.length === 0) return;
    if (!isAdminLoggedIn) {
      showToast('Administrator Access Required: Only administrator "RPM" can delete coaches or staff.');
      setIsLoginModalOpen(true);
      return;
    }
    if (staffIds.length === 1) {
      handleRequestDeleteStaff(staffIds[0]);
      return;
    }
    const selectedStaff = staffMembers.filter(s => staffIds.includes(s.id));
    const names = selectedStaff.map(s => s.fullName).slice(0, 3).join(', ');
    const moreText = selectedStaff.length > 3 ? ` and ${selectedStaff.length - 3} others` : '';

    setDeleteTarget({
      type: 'staff_batch',
      id: 'batch-staff',
      name: `${selectedStaff.length} Coaches & Staff Members`,
      subtitle: `${names}${moreText}`,
      identifier: `${selectedStaff.length} Records Selected`,
      batchIds: staffIds,
      count: selectedStaff.length,
      extraInfo: 'Selected coaches and operations staff will be permanently removed from club records.',
    });
    setIsDeleteModalOpen(true);
  };

  // Admin handlers
  const handleAddAdmin = (admin: Administrator) => {
    setAdministrators(prev => [admin, ...prev]);
    logActivity('Administrator Appointed', 'Admin', `Chief Executive Officer (CEO) appointed ${admin.fullName} (${admin.role}).`);
    showToast(`Assigned administrator: ${admin.fullName}`);
  };

  const handleEditAdmin = (admin: Administrator) => {
    setAdministrators(prev => prev.map(a => a.id === admin.id ? admin : a));
    logActivity('Administrator Profile Updated', 'Admin', `Updated administrative profile for ${admin.fullName}.`);
    showToast(`Updated administrator: ${admin.fullName}`);
  };

  const handleRequestDeleteAdmin = (adminId: string) => {
    if (!isAdminLoggedIn) {
      showToast('Administrator Access Required: Only administrator "RPM" can delete administrators.');
      setIsLoginModalOpen(true);
      return;
    }
    const target = administrators.find(a => a.id === adminId);
    if (!target) return;
    const isCEO = target.role.toLowerCase().includes('ceo') || target.role.toLowerCase().includes('chief executive');
    setDeleteTarget({
      type: 'admin',
      id: target.id,
      name: target.fullName,
      subtitle: isCEO 
        ? `${target.role} · Executive Leadership will transfer upon removal` 
        : `${target.role} · ${target.department}`,
      identifier: target.adminId,
      avatarUrl: target.avatarUrl,
      extraInfo: `Security Clearance: ${target.accessLevel}`,
    });
    setIsDeleteModalOpen(true);
  };

  const handleReorderAdmins = (newAdmins: Administrator[]) => {
    const updated = newAdmins.map((admin, index) => ({
      ...admin,
      orderIndex: index + 1,
    }));
    setAdministrators(updated);
    logActivity('Administrator Hierarchy Reordered', 'Admin', `Chief Executive Officer (CEO) updated administrative hierarchy ordering.`);
    showToast('Administrator hierarchy reordered by CEO.');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (!isAdminLoggedIn) {
      showToast('Access Denied: Only administrator "RPM" is authorized to delete club data.');
      setIsLoginModalOpen(true);
      return;
    }

    if (deleteTarget.type === 'player') {
      const targetId = deleteTarget.id;
      setPlayers(prev => {
        const updated = prev.filter(p => p.id !== targetId);
        localStorage.setItem('raq_players', JSON.stringify(updated));
        return updated;
      });
      if (selectedDossierPlayer?.id === targetId) {
        setSelectedDossierPlayer(null);
      }
      logActivity('Player Released / Deleted', 'Player', `Permanently deleted player ${deleteTarget.name} from club records.`);
      showToast(`Permanently deleted player: ${deleteTarget.name}`);
    } else if (deleteTarget.type === 'admin') {
      const targetId = deleteTarget.id;
      const targetAdmin = administrators.find(a => a.id === targetId);
      const isCEO = targetAdmin && (targetAdmin.role.toLowerCase().includes('ceo') || targetAdmin.role.toLowerCase().includes('chief executive'));

      const remainingAdmins = administrators.filter(a => a.id !== targetId);
      let updatedAdmins = remainingAdmins;

      if (remainingAdmins.length === 0) {
        // Fallback root administrator so app never crashes
        updatedAdmins = [{
          id: 'adm-root',
          adminId: 'RAQ-ADM-01',
          fullName: 'RPM Executive Administrator',
          role: 'Chief Executive Officer (CEO)' as AdminRole,
          email: ADMIN_CONFIG.notificationEmail,
          phone: '+44 161 792 4000',
          avatarUrl: '/rpm_logo.jpg',
          department: 'Executive Board',
          accessLevel: 'Super Administrator',
          lastActive: 'Active now',
          status: 'Active',
          orderIndex: 1,
        }];
        showToast('Administrator deleted. System maintained under root RPM Executive Administrator.');
      } else if (isCEO && remainingAdmins.length > 0) {
        // Automatically promote the first remaining administrator to Chief Executive Officer (CEO)
        updatedAdmins = remainingAdmins.map((adm, idx) => {
          if (idx === 0) {
            return {
              ...adm,
              role: 'Chief Executive Officer (CEO)' as AdminRole,
              orderIndex: 1,
            };
          }
          return {
            ...adm,
            orderIndex: idx + 1,
          };
        });
        showToast(`Administrator deleted. Leadership transferred to ${updatedAdmins[0].fullName} as Chief Executive Officer.`);
      } else {
        showToast(`Permanently deleted administrator: ${deleteTarget.name}`);
      }

      setAdministrators(updatedAdmins);
      localStorage.setItem('raq_admins', JSON.stringify(updatedAdmins));

      // Update active admin if the deleted admin was active
      if (activeAdminId === targetId) {
        const nextActiveId = updatedAdmins[0]?.id || '';
        setActiveAdminId(nextActiveId);
        localStorage.setItem('raq_active_admin_id', nextActiveId);
      }

      // Update staff registrar if the deleted admin was the staff registrar
      if (clubSettings.staffRegistrarAdminId === targetId) {
        const nextRegistrarId = updatedAdmins[0]?.id || '';
        const newSettings = {
          ...clubSettings,
          staffRegistrarAdminId: nextRegistrarId,
        };
        setClubSettings(newSettings);
        localStorage.setItem('raq_settings', JSON.stringify(newSettings));
      }

      logActivity('Administrator Removed', 'Admin', `Deleted administrator credentials for ${deleteTarget.name}.`);
    } else if (deleteTarget.type === 'staff') {
      const targetId = deleteTarget.id;
      const targetStaff = staffMembers.find(s => s.id === targetId);
      const isCoach = targetStaff?.category === 'Coaching' || targetStaff?.role.toLowerCase().includes('coach');
      setStaffMembers(prev => {
        const updated = prev.filter(s => s.id !== targetId);
        localStorage.setItem('raq_staff', JSON.stringify(updated));
        return updated;
      });
      logActivity(isCoach ? 'Coach Removed' : 'Staff Member Removed', 'Staff', `Permanently removed ${isCoach ? 'coach' : 'staff member'} ${deleteTarget.name} from club records.`);
      showToast(`Permanently deleted ${isCoach ? 'coach' : 'staff member'}: ${deleteTarget.name}`);
    } else if (deleteTarget.type === 'staff_batch') {
      const batchIds = deleteTarget.batchIds || [];
      setStaffMembers(prev => {
        const updated = prev.filter(s => !batchIds.includes(s.id));
        localStorage.setItem('raq_staff', JSON.stringify(updated));
        return updated;
      });
      logActivity('Multiple Staff Removed', 'Staff', `Permanently deleted ${batchIds.length} coaches & staff members from club records.`);
      showToast(`Permanently deleted ${batchIds.length} coaches & staff members.`);
    }

    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const handleUpdateClubSettings = (newSettings: ClubSettings) => {
    setClubSettings(newSettings);
    logActivity('Club Configuration Modified', 'System', `Updated club settings for ${newSettings.clubName}.`);
    showToast('Club settings saved');
  };

  // Backup & Restore
  const handleExportData = () => {
    const payload = {
      clubSettings,
      players,
      staffMembers,
      administrators,
      activityLogs,
      emailNotifications,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RAQ-RPM-BACKUP-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported club backup successfully');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.players && Array.isArray(data.players)) {
          setPlayers(data.players);
          if (data.staffMembers) setStaffMembers(data.staffMembers);
          if (data.administrators) setAdministrators(data.administrators);
          if (data.clubSettings) setClubSettings(data.clubSettings);
          if (data.activityLogs) setActivityLogs(data.activityLogs);
          if (data.emailNotifications) setEmailNotifications(data.emailNotifications);
          logActivity('Database Restored', 'System', 'Imported data backup from external file.');
          showToast('Imported club data successfully!');
        } else {
          showToast('Invalid backup file format');
        }
      } catch (err) {
        showToast('Failed to parse backup JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    setPlayers(initialPlayers);
    setStaffMembers(initialStaffMembers);
    setAdministrators(initialAdministrators);
    setClubSettings(initialClubSettings);
    setActivityLogs(initialActivityLogs);
    localStorage.clear();
    setIsAdminLoggedIn(false);
    showToast('Reset all club data to default sample roster & staff');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('Logged out of Administrator Portal');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation & Brand Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        clubSettings={clubSettings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenPlayerRegister={() => {
          setPlayerToEdit(null);
          setIsRegisterModalOpen(true);
          setIsRegistrationViaSharedLink(false);
        }}
        onOpenStaffAdd={() => {
          setCurrentTab('staff');
        }}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
        totalPlayers={players.length}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        onOpenShareLink={() => setIsShareModalOpen(true)}
        onOpenGitHub={() => setIsGitHubModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <Dashboard
            players={players}
            staffMembers={staffMembers}
            administrators={administrators}
            clubSettings={clubSettings}
            onNavigateTab={setCurrentTab}
            onOpenRegister={() => {
              setPlayerToEdit(null);
              setIsRegisterModalOpen(true);
              setIsRegistrationViaSharedLink(false);
            }}
            onViewPlayer={(p) => setSelectedDossierPlayer(p)}
            onOpenVideo={(video, playerName) => {
              setActiveVideo(video);
              setActiveVideoPlayerName(playerName);
            }}
            onOpenShareLink={() => setIsShareModalOpen(true)}
            onOpenGitHub={() => setIsGitHubModalOpen(true)}
          />
        )}

        {currentTab === 'players' && (
          <PlayerList
            players={players}
            searchQuery={searchQuery}
            onViewDossier={(p) => setSelectedDossierPlayer(p)}
            onEdit={(p) => {
              setPlayerToEdit(p);
              setIsRegisterModalOpen(true);
              setIsRegistrationViaSharedLink(false);
            }}
            onDelete={handleRequestDeletePlayer}
            onOpenVideo={(video, playerName) => {
              setActiveVideo(video);
              setActiveVideoPlayerName(playerName);
            }}
            onRegisterPlayer={() => {
              setPlayerToEdit(null);
              setIsRegisterModalOpen(true);
              setIsRegistrationViaSharedLink(false);
            }}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenShareLink={() => setIsShareModalOpen(true)}
          />
        )}

        {currentTab === 'staff' && (
          <StaffSection
            staffMembers={staffMembers}
            administrators={administrators}
            activeAdmin={activeAdmin}
            staffRegistrar={staffRegistrar}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminLogin={() => setIsLoginModalOpen(true)}
            onSwitchActiveAdmin={handleSwitchActiveAdmin}
            onAddStaff={handleAddStaff}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleRequestDeleteStaff}
            onDeleteMultipleStaff={handleRequestDeleteMultipleStaff}
          />
        )}

        {currentTab === 'admins' && (
          <AdminSection
            administrators={administrators}
            clubSettings={clubSettings}
            activityLogs={activityLogs}
            isAdminLoggedIn={isAdminLoggedIn}
            onAdminLoginRequest={() => setIsLoginModalOpen(true)}
            onAdminLogout={handleAdminLogout}
            emailNotifications={emailNotifications}
            onViewEmailNotification={(notif) => setActiveEmailModalNotification(notif)}
            onAddAdmin={handleAddAdmin}
            onEditAdmin={handleEditAdmin}
            onDeleteAdmin={handleRequestDeleteAdmin}
            onReorderAdmins={handleReorderAdmins}
            onUpdateClubSettings={handleUpdateClubSettings}
          />
        )}

        {currentTab === 'media' && (
          <MediaVault
            players={players}
            onOpenVideo={(video, playerName) => {
              setActiveVideo(video);
              setActiveVideoPlayerName(playerName);
            }}
            onViewPlayer={(p) => setSelectedDossierPlayer(p)}
            onOpenRegister={() => {
              setPlayerToEdit(null);
              setIsRegisterModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-4 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-400">RAQ PLAYER MANAGEMENT (RPM)</span> · {clubSettings.clubName}
          </div>
          <div className="flex items-center gap-2">
            <span>Admin Notifications:</span>
            <span className="text-emerald-400 font-mono font-medium">{ADMIN_CONFIG.notificationEmail}</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Player Registration & CV Builder */}
      {isRegisterModalOpen && (
        <PlayerRegistrationModal
          playerToEdit={playerToEdit}
          onSave={handleSavePlayer}
          onClose={() => {
            setIsRegisterModalOpen(false);
            setPlayerToEdit(null);
            setIsRegistrationViaSharedLink(false);
          }}
          isSharedLinkInvite={isRegistrationViaSharedLink}
        />
      )}

      {/* MODAL 2: Full Player Dossier & Official CV with Media Galleries */}
      {selectedDossierPlayer && (
        <PlayerDossierModal
          player={selectedDossierPlayer}
          onClose={() => setSelectedDossierPlayer(null)}
          onEdit={(p) => {
            setSelectedDossierPlayer(null);
            setPlayerToEdit(p);
            setIsRegisterModalOpen(true);
            setIsRegistrationViaSharedLink(false);
          }}
          onDeletePlayer={(playerId) => handleRequestDeletePlayer(playerId)}
          onOpenVideo={(video, playerName) => {
            setActiveVideo(video);
            setActiveVideoPlayerName(playerName);
          }}
          onAddPhoto={handleAddPhotoToPlayer}
          onAddVideo={handleAddVideoToPlayer}
          onDeletePhoto={handleDeletePhotoFromPlayer}
          onDeleteVideo={handleDeleteVideoFromPlayer}
          onUpdateCvDocument={handleUpdatePlayerCv}
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* MODAL 3: In-App Video Player */}
      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          playerName={activeVideoPlayerName}
          onClose={() => {
            setActiveVideo(null);
            setActiveVideoPlayerName('');
          }}
        />
      )}

      {/* MODAL 4: Administrator Password Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setIsLoginModalOpen(false);
          showToast(`Unlocked as ${ADMIN_CONFIG.username} (Super Administrator)`);
        }}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* MODAL 5: Registration Email Dispatch Summary Modal */}
      {activeEmailModalNotification && (
        <RegistrationEmailModal
          notification={activeEmailModalNotification}
          onClose={() => setActiveEmailModalNotification(null)}
        />
      )}

      {/* MODAL 6: In-App Confirmation Modal for Deleting Players, Admins, or Staff */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        target={deleteTarget}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
      />

      {/* MODAL 7: Share Player Registration Short Link Modal */}
      <ShareRegistrationModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenRegisterModal={() => {
          setPlayerToEdit(null);
          setIsRegisterModalOpen(true);
          setIsRegistrationViaSharedLink(true);
        }}
      />

      {/* MODAL 8: GitHub & Vercel Sync Modal */}
      <GitHubConnectModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Quick Action Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-xl font-medium text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
