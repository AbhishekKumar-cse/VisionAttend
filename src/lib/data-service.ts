import { VisionUser, AttendanceRecord, Department } from './types';

const USERS_KEY = 'academic_vision_users';
const ATTENDANCE_KEY = 'academic_vision_records';
const DEPARTMENTS_KEY = 'academic_vision_depts';

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Computer Science' },
  { id: 'd2', name: 'Mechanical Engineering' },
  { id: 'd3', name: 'Faculty of Arts' },
  { id: 'd4', name: 'Business Administration' },
];

export const DataService = {
  getUsers: (): VisionUser[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: VisionUser) => {
    const users = DataService.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getAttendance: (): AttendanceRecord[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ATTENDANCE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAttendance: (record: AttendanceRecord) => {
    const records = DataService.getAttendance();
    records.unshift(record);
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
  },

  getDepartments: (): Department[] => {
    if (typeof window === 'undefined') return DEFAULT_DEPARTMENTS;
    const data = localStorage.getItem(DEPARTMENTS_KEY);
    return data ? JSON.parse(data) : DEFAULT_DEPARTMENTS;
  },

  seedDemoData: () => {
    if (typeof window !== 'undefined' && DataService.getUsers().length === 0) {
      const demoUsers: VisionUser[] = [
        { 
          id: 'u1', 
          externalId: 'STU-2024-001',
          name: 'Alice Cooper', 
          email: 'alice@edu.com', 
          role: 'Student', 
          departmentId: 'd1', 
          academicYear: 'Sophomore',
          enrolledAt: new Date().toISOString() 
        },
        { 
          id: 'u2', 
          externalId: 'PROF-102',
          name: 'Dr. Robert Smith', 
          email: 'r.smith@edu.com', 
          role: 'Professor', 
          departmentId: 'd1', 
          enrolledAt: new Date().toISOString() 
        },
        { 
          id: 'u3', 
          externalId: 'STU-2024-089',
          name: 'Michael Chen', 
          email: 'm.chen@edu.com', 
          role: 'Student', 
          departmentId: 'd2', 
          academicYear: 'Senior',
          enrolledAt: new Date().toISOString() 
        },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
      localStorage.setItem(DEPARTMENTS_KEY, JSON.stringify(DEFAULT_DEPARTMENTS));
    }
  }
};
