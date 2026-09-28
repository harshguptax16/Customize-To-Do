export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'hackathon' | 'work' | 'personal' | 'family' | 'study';
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  priority: PriorityLevel;
  isPrior: boolean; // Starred priority from sketch
  completed: boolean;
  pointsReward: number;
  createdAt: string;
  tags?: string[];
}

export interface DailyScheduleEvent {
  id: string;
  time: string; // e.g. "6:00 AM"
  title: string;
  description?: string;
  category: 'routine' | 'meal' | 'work' | 'health' | 'leisure';
  enabled: boolean;
  durationMinutes?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  time?: string;
  type: 'hackathon' | 'trip' | 'meeting' | 'festival' | 'milestone';
  location?: string;
  locationAddress?: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export type RankTier = 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export interface PeerRank {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  tier: RankTier;
  points: number;
  tasksDone: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface ChoreItem {
  id: string;
  title: string;
  category: string;
  rewardXP: number;
  completed: boolean;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  channelId: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  bio?: string;
}

export interface CommunityChannel {
  id: string;
  name: string;
  type: 'group' | 'direct';
  avatar: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  membersCount?: number;
  onlineCount?: number;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  verified?: boolean;
  badge?: string;
  percentage?: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  partyName?: string;
}

export interface ExpenseReportItem {
  id: string;
  partyName: string;
  amount: number; // positive for credit (+), negative for debit (-)
  date: string;
  category: string;
  avatar?: string;
}

export interface MilestoneProgress {
  id: string;
  title: string;
  targetDate: string;
  percentage: number;
  status: 'in-progress' | 'completed' | 'delayed';
  category: string;
}

export interface WeatherDay {
  day: number;
  month: string;
  condition: 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'clear';
  tempC: number;
  hasEvent?: boolean;
  eventTitle?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  avatar: string;
  isPublic: boolean;
  darkMode: boolean;
  notifications: boolean;
  language: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  totalPoints: number;
  currentStreak: number;
  completedTasksCount: number;
  bio: string;
}
