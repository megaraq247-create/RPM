export type Position = 
  | 'GK' 
  | 'CB' | 'LB' | 'RB' | 'LWB' | 'RWB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'CF' | 'ST';

export type PositionCategory = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';

export type SquadCategory = 'First Team' | 'Reserves / U23' | 'Under-21' | 'Under-19' | 'Academy';

export type PlayerStatus = 'Active' | 'Injured' | 'On Loan' | 'Suspended' | 'In Trial';

export type PreferredFoot = 'Right' | 'Left' | 'Both';

export interface CareerRecord {
  id: string;
  season: string;
  club: string;
  league: string;
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets?: number;
  minutesPlayed?: number;
}

export interface PlayerTrophy {
  id: string;
  title: string;
  year: string;
  competition: string;
}

export interface PlayerMediaPhoto {
  id: string;
  url: string;
  caption?: string;
  tag?: 'Match' | 'Training' | 'Presentation' | 'Medical' | 'Portrait';
  uploadedAt: string;
}

export interface PlayerMediaVideo {
  id: string;
  title: string;
  url: string; // YouTube, Vimeo, or direct video link
  type: 'Highlights' | 'Scouting Reel' | 'Match Analysis' | 'Skills' | 'Interviews';
  duration?: string;
  notes?: string;
  addedAt: string;
}

export interface PlayerAttributes {
  pace: number;        // 1-99
  shooting: number;    // 1-99
  passing: number;     // 1-99
  dribbling: number;   // 1-99
  defending: number;   // 1-99
  physical: number;    // 1-99
  tacticalIQ: number;  // 1-99
  stamina: number;     // 1-99
  attackingWorkRate: 'High' | 'Medium' | 'Low';
  defensiveWorkRate: 'High' | 'Medium' | 'Low';
}

export interface Player {
  id: string;
  registrationNumber: string; // e.g. "RAQ-2024-001"
  firstName: string;
  lastName: string;
  displayName: string;
  jerseyNumber?: number;
  primaryPosition: Position;
  secondaryPosition?: Position;
  squadCategory: SquadCategory;
  status: PlayerStatus;
  dateOfBirth: string; // YYYY-MM-DD
  nationality: string;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  avatarUrl: string;
  
  // Contract & Financials
  contractStartDate: string;
  contractEndDate: string;
  marketValue: number; // in EUR
  weeklyWage?: number; // in EUR
  agentName?: string;
  agentContact?: string;

  // CV & Career Data
  bio: string;
  youthClub?: string;
  careerHistory: CareerRecord[];
  trophies: PlayerTrophy[];
  attributes: PlayerAttributes;
  scoutingNotes?: string;
  medicalNotes?: string;

  // Media
  photos: PlayerMediaPhoto[];
  videos: PlayerMediaVideo[];

  registeredAt: string;
  updatedAt: string;
}

export type StaffCategory = 'Coaching' | 'Medical & Fitness' | 'Scouting & Analysis' | 'Operations & Kit';

export interface StaffMember {
  id: string;
  staffId: string; // e.g. "STF-101"
  fullName: string;
  role: string; // e.g. "Head Coach", "Goalkeeper Coach", "Chief Physiotherapist"
  category: StaffCategory;
  squadAssigned: string; // e.g. "First Team", "All Squads"
  license: string; // e.g. "UEFA Pro License", "FIFA Diploma in Football Medicine"
  nationality: string;
  email: string;
  phone: string;
  avatarUrl: string;
  contractEndDate: string;
  joinedDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  bioNotes?: string;
}

export type AdminRole = 
  | 'Chief Executive Officer (CEO)'
  | 'Club President' 
  | 'Sporting Director' 
  | 'Secretary General' 
  | 'Head of Registrations' 
  | 'Chief Operations Officer' 
  | 'Legal Officer';

export interface Administrator {
  id: string;
  adminId: string; // e.g. "ADM-01"
  fullName: string;
  role: AdminRole;
  email: string;
  phone: string;
  avatarUrl: string;
  department: string;
  accessLevel: 'Super Administrator' | 'Full Access' | 'Registrations & Rosters' | 'View Only';
  lastActive: string;
  status: 'Active' | 'Away';
  orderIndex?: number;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string; // "raqplayamanagentagn@gmail.com"
  subject: string;
  type: 'Player Registration' | 'Staff Registration';
  registrarName: string;
  timestamp: string;
  summaryBody: string;
  status: 'Dispatched' | 'Delivered';
  entityId: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  performedBy: string;
  action: string;
  category: 'Player' | 'Staff' | 'Admin' | 'System';
  details: string;
}

export interface ClubSettings {
  clubName: string;
  shortName: string;
  foundedYear: number;
  homeStadium: string;
  stadiumCapacity: string;
  league: string;
  currentSeason: string;
  country: string;
  city: string;
  contactEmail: string;
  contactPhone: string;
  crestUrl: string;
}
