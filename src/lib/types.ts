export type UserRole = 'Admin' | 'Professor' | 'Student' | 'Staff';

export interface VisionUser {
  id: string;
  externalId: string; // Student ID or Employee ID
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  avatarUrl?: string;
  enrolledAt: string;
  academicYear?: string; // For students
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  timestamp: string;
  status: AttendanceStatus;
  departmentName?: string;
  confidence: number;
  location?: string; // e.g., "Main Gates", "Lecture Hall A"
}

export interface Department {
  id: string;
  name: string;
}
