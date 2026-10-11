// Helper utilities for RAQ PLAYER MANAGEMENT

export const formatCurrency = (amount: number, currency: string = '€'): string => {
  if (amount >= 1_000_000) {
    return `${currency}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${currency}${(amount / 1_000).toFixed(0)}K`;
  }
  return `${currency}${amount.toLocaleString()}`;
};

export const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const getEmbedVideoUrl = (url: string): { embedUrl: string | null; isEmbeddable: boolean; originalUrl: string } => {
  if (!url) return { embedUrl: null, isEmbeddable: false, originalUrl: '' };

  // YouTube match
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0`,
      isEmbeddable: true,
      originalUrl: url,
    };
  }

  // Vimeo match
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isEmbeddable: true,
      originalUrl: url,
    };
  }

  // Direct MP4 / WebM
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return {
      embedUrl: url,
      isEmbeddable: true,
      originalUrl: url,
    };
  }

  return {
    embedUrl: null,
    isEmbeddable: false,
    originalUrl: url,
  };
};

export const getPositionColor = (position: string): { bg: string; text: string; border: string } => {
  switch (position) {
    case 'GK':
      return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'CB':
    case 'LB':
    case 'RB':
    case 'LWB':
    case 'RWB':
      return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' };
    case 'CDM':
    case 'CM':
    case 'CAM':
    case 'LM':
    case 'RM':
      return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' };
    case 'LW':
    case 'RW':
    case 'CF':
    case 'ST':
      return { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' };
    default:
      return { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
  }
};

export const getStatusBadge = (status: string): { dot: string; text: string; label: string } => {
  switch (status) {
    case 'Active':
      return { dot: 'bg-emerald-400', text: 'text-emerald-300', label: 'Active' };
    case 'Injured':
      return { dot: 'bg-rose-400', text: 'text-rose-300', label: 'Injured' };
    case 'On Loan':
      return { dot: 'bg-indigo-400', text: 'text-indigo-300', label: 'On Loan' };
    case 'Suspended':
      return { dot: 'bg-amber-400', text: 'text-amber-300', label: 'Suspended' };
    case 'In Trial':
      return { dot: 'bg-sky-400', text: 'text-sky-300', label: 'Trialist' };
    default:
      return { dot: 'bg-slate-400', text: 'text-slate-300', label: status };
  }
};

export const ADMIN_CONFIG = {
  username: 'RPM',
  password: 'Raq@020',
  notificationEmail: 'raqplayamanagentagn@gmail.com',
};

export const generatePlayerRegistrationSummary = (player: any) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const subject = `[RAQ RPM NOTIFICATION] New Player Registered: ${player.displayName} (${player.primaryPosition})`;
  const body = `RAQ PLAYER MANAGEMENT (RPM) - OFFICIAL REGISTRATION SUMMARY
============================================================
Destination Notification Email: ${ADMIN_CONFIG.notificationEmail}
Registered Timestamp: ${timestamp}
Record Type: FOOTBALL PLAYER REGISTRATION

PLAYER PROFILE:
- Registration Number: ${player.registrationNumber}
- Full Name: ${player.firstName} ${player.lastName}
- Matchday Display Name: ${player.displayName}
- Primary Position: ${player.primaryPosition} ${player.secondaryPosition ? `(Alternative: ${player.secondaryPosition})` : ''}
- Squad Category: ${player.squadCategory}
- Status: ${player.status}
- Nationality: ${player.nationality}
- Date of Birth: ${player.dateOfBirth}
- Physical Build: ${player.heightCm} cm / ${player.weightKg} kg
- Preferred Foot: ${player.preferredFoot}

CONTRACT & FINANCIALS:
- Contract Period: ${player.contractStartDate} to ${player.contractEndDate}
- Estimated Market Valuation: €${Number(player.marketValue).toLocaleString()}
- Weekly Wage: €${Number(player.weeklyWage || 0).toLocaleString()} / wk
- Agent Representation: ${player.agentName || 'None listed'} ${player.agentContact ? `(${player.agentContact})` : ''}

CAREER & MEDIA ASSETS:
- Career Seasons Logged: ${player.careerHistory?.length || 0}
- Trophies & Honors: ${player.trophies?.length || 0}
- Photos Uploaded: ${player.photos?.length || 0}
- Video Highlight Links: ${player.videos?.length || 0}

CORE TECHNICAL RATINGS:
- Pace: ${player.attributes?.pace || 0}
- Shooting: ${player.attributes?.shooting || 0}
- Passing: ${player.attributes?.passing || 0}
- Dribbling: ${player.attributes?.dribbling || 0}
- Defending: ${player.attributes?.defending || 0}
- Physicality: ${player.attributes?.physical || 0}
- Tactical IQ: ${player.attributes?.tacticalIQ || 0}

SCOUTING & MEDICAL NOTES:
- Scouting: ${player.scoutingNotes || 'Standard baseline report.'}
- Medical: ${player.medicalNotes || 'Full clearance granted.'}

============================================================
Dispatched from: RAQ PLAYER MANAGEMENT (RPM) Official System
Executive Email: ${ADMIN_CONFIG.notificationEmail}`;

  return { subject, body };
};

export const generateStaffRegistrationSummary = (staff: any) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const subject = `[RAQ RPM NOTIFICATION] New Staff/Coach Registered: ${staff.fullName} (${staff.role})`;
  const body = `RAQ PLAYER MANAGEMENT (RPM) - OFFICIAL REGISTRATION SUMMARY
============================================================
Destination Notification Email: ${ADMIN_CONFIG.notificationEmail}
Registered Timestamp: ${timestamp}
Record Type: TECHNICAL STAFF / COACH REGISTRATION

STAFF DETAILS:
- Staff Identifier: ${staff.staffId}
- Full Name: ${staff.fullName}
- Designation / Role: ${staff.role}
- Operational Category: ${staff.category}
- Squad Assigned: ${staff.squadAssigned}
- Professional License / Credentials: ${staff.license}
- Nationality: ${staff.nationality}
- Contact Email: ${staff.email || 'None listed'}
- Contact Phone: ${staff.phone || 'None listed'}
- Contract Expiry: ${staff.contractEndDate}
- Date Joined: ${staff.joinedDate}
- Current Status: ${staff.status}

TECHNICAL & BACKGROUND NOTES:
- Notes: ${staff.bioNotes || 'Standard technical dossier on file.'}

============================================================
Dispatched from: RAQ PLAYER MANAGEMENT (RPM) Official System
Executive Email: ${ADMIN_CONFIG.notificationEmail}`;

  return { subject, body };
};

export const createMailtoLink = (to: string, subject: string, body: string): string => {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
