import { VisionUser, AttendanceRecord, Group } from './types';

const USERS_KEY = 'vision_attend_users';
const ATTENDANCE_KEY = 'vision_attend_records';
const GROUPS_KEY = 'vision_attend_groups';

const DEFAULT_GROUPS: Group[] = [
  { id: 'g1', name: 'Science Department' },
  { id: 'g2', name: 'Morning Shift' },
  { id: 'g3', name: 'Executive Team' },
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

  getGroups: (): Group[] => {
    if (typeof window === 'undefined') return DEFAULT_GROUPS;
    const data = localStorage.getItem(GROUPS_KEY);
    return data ? JSON.parse(data) : DEFAULT_GROUPS;
  },

  seedDemoData: () => {
    if (DataService.getUsers().length === 0) {
      const demoUsers: VisionUser[] = [
        { id: 'u1', name: 'Alex Johnson', email: 'alex@example.com', role: 'User', groupId: 'g1', enrolledAt: new Date().toISOString() },
        { id: 'u2', name: 'Sarah Miller', email: 'sarah@example.com', role: 'Admin', groupId: 'g3', enrolledAt: new Date().toISOString() },
        { id: 'u3', name: 'Michael Chen', email: 'michael@example.com', role: 'User', groupId: 'g2', enrolledAt: new Date().toISOString() },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
    }
  }
};