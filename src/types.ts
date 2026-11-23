export type PageRoute =
  | 'home'
  | 'donors'
  | 'requests'
  | 'hospitals'
  | 'about'
  | 'register'
  | 'dashboard';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UrgencyLevel = 'Critical' | 'Urgent' | 'Normal';

export interface Donor {
  id: string;
  name: string;
  initials: string;
  bloodGroup: BloodGroup;
  city: string;
  area: string;
  available: boolean;
  lastDonationDate: string;
  phone: string;
  email: string;
  contactPreference: 'Phone' | 'Email' | 'Both';
  donationsCount: number;
  demoLabel: string;
  avatarGradient: string;
  coordinates: { x: number; y: number };
  bio: string;
}

export interface BloodRequest {
  id: string;
  patientReference: string;
  bloodGroup: BloodGroup;
  urgency: UrgencyLevel;
  hospital: string;
  city: string;
  area: string;
  unitsRequired: number;
  timeRemaining: string;
  createdAt: string;
  contactName: string;
  contactPhone: string;
  notes: string;
  status: 'Open' | 'Connected' | 'Fulfilled';
  pledgedCount: number;
  isUserSubmitted?: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  hasBloodBank: boolean;
  hasEmergencyFacility: boolean;
  hours: string;
  coordinates: { x: number; y: number };
  accentGradient: string;
  summary: string;
  featuredImage?: string;
}

export interface UserAccount {
  loggedIn: boolean;
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  city: string;
  area: string;
  available: boolean;
  donationsCount: number;
  impactScore: number;
  joinedDate: string;
  contactPreference: 'Phone' | 'Email' | 'Both';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  category: 'emergency' | 'match' | 'system';
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: 'connection' | 'request' | 'availability' | 'registration';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  quote: string;
  initials: string;
  gradient: string;
  tag: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'warning';
}
