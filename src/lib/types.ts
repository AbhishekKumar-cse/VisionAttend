export type UserRole = 'Admin' | 'User';

export interface VisionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  groupId?: string;
  avatarUrl?: string;
  enrolledAt: string;
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  status: AttendanceStatus;
  groupName?: string;
  confidence: number;
}

export interface Group {
  id: string;
  name: string;
}