
export interface Student {
  studentId: string;
  fullName: string;
  dob: string;
  gradeLevel: string;
  guardianContact: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  profilePictureUrl?: string;
  enrollmentDate?: string;
  email?: string;
  address?: string;
}

export interface Teacher {
  teacherId: string;
  name: string;
  department: string;
  coursesTaught: string[]; // array of courseIds
  email?: string;
  profilePictureUrl?: string;
}

export interface Course {
  courseId: string;
  title: string;
  creditHours: number;
  teacherId: string; // teacherId
  description?: string;
  department?: string;
}

export interface Enrollment {
  studentId: string;
  courseId: string;
  semester: string;
  status: 'Enrolled' | 'Withdrawn' | 'Completed';
}

export interface Grade {
  studentId: string;
  courseId: string;
  assignmentName: string;
  score: number;
  total: number;
  date?: string;
}

export interface AttendanceEntry {
  studentId: string;
  courseId: string;
  date: string; // YYYY-MM-DD
  present: boolean;
}

export const mockStudents: Student[] = [
  { studentId: 'S1001', fullName: 'Alice Johnson', dob: '2005-03-15', gradeLevel: '10th Grade', guardianContact: '555-1234', status: 'Active', profilePictureUrl: 'https://placehold.co/100x100.png?text=AJ', email: 'alice.j@example.com', enrollmentDate: '2023-09-01', address: '123 Oak St, Townsville' },
  { studentId: 'S1002', fullName: 'Bob Smith', dob: '2006-07-22', gradeLevel: '9th Grade', guardianContact: '555-5678', status: 'Active', profilePictureUrl: 'https://placehold.co/100x100.png?text=BS', email: 'bob.s@example.com', enrollmentDate: '2023-09-01', address: '456 Pine Ave, Cityburg' },
  { studentId: 'S1003', fullName: 'Charlie Brown', dob: '2005-01-10', gradeLevel: '10th Grade', guardianContact: '555-8765', status: 'Active', profilePictureUrl: 'https://placehold.co/100x100.png?text=CB', email: 'charlie.b@example.com', enrollmentDate: '2023-09-01', address: '789 Maple Dr, Villagetown' },
  { studentId: 'S1004', fullName: 'Diana Prince', dob: '2004-11-05', gradeLevel: '11th Grade', guardianContact: '555-4321', status: 'Active', profilePictureUrl: 'https://placehold.co/100x100.png?text=DP', email: 'diana.p@example.com', enrollmentDate: '2022-09-01', address: '101 Cherry Ln, Metropolis' },
];

export const mockTeachers: Teacher[] = [
  { teacherId: 'T201', name: 'Dr. Evelyn Reed', department: 'Science', coursesTaught: ['C301', 'C302'], email: 'e.reed@campus.ai', profilePictureUrl: 'https://placehold.co/100x100.png?text=ER' },
  { teacherId: 'T202', name: 'Mr. Alan Turing', department: 'Mathematics', coursesTaught: ['C303'], email: 'a.turing@campus.ai', profilePictureUrl: 'https://placehold.co/100x100.png?text=AT' },
];

export const mockCourses: Course[] = [
  { courseId: 'C301', title: 'Physics 101', creditHours: 3, teacherId: 'T201', department: 'Science', description: 'Introduction to classical mechanics and thermodynamics.' },
  { courseId: 'C302', title: 'Chemistry Lab', creditHours: 1, teacherId: 'T201', department: 'Science', description: 'Practical experiments in chemistry.' },
  { courseId: 'C303', title: 'Calculus I', creditHours: 4, teacherId: 'T202', department: 'Mathematics', description: 'Fundamental concepts of differential and integral calculus.' },
  { courseId: 'C304', title: 'English Literature', creditHours: 3, teacherId: 'T201', department: 'Humanities', description: 'Survey of major English literary works.' },
];

export const mockGrades: Grade[] = [
  { studentId: 'S1001', courseId: 'C301', assignmentName: 'Midterm Exam', score: 85, total: 100, date: '2024-03-10' },
  { studentId: 'S1001', courseId: 'C301', assignmentName: 'Homework 1', score: 9, total: 10, date: '2024-02-15' },
  { studentId: 'S1002', courseId: 'C303', assignmentName: 'Quiz 1', score: 70, total: 100, date: '2024-03-01' },
  { studentId: 'S1001', courseId: 'C303', assignmentName: 'Quiz 1', score: 92, total: 100, date: '2024-03-01' },
  { studentId: 'S1003', courseId: 'C301', assignmentName: 'Midterm Exam', score: 65, total: 100, date: '2024-03-10'},
];

export const mockAttendance: AttendanceEntry[] = [
  { studentId: 'S1001', courseId: 'C301', date: '2024-05-01', present: true },
  { studentId: 'S1001', courseId: 'C301', date: '2024-05-03', present: true },
  { studentId: 'S1002', courseId: 'C303', date: '2024-05-01', present: false },
  { studentId: 'S1002', courseId: 'C303', date: '2024-05-03', present: true },
];

export const mockEnrollments: Enrollment[] = [
    { studentId: 'S1001', courseId: 'C301', semester: 'Spring 2024', status: 'Enrolled' },
    { studentId: 'S1001', courseId: 'C303', semester: 'Spring 2024', status: 'Enrolled' },
    { studentId: 'S1002', courseId: 'C303', semester: 'Spring 2024', status: 'Enrolled' },
    { studentId: 'S1003', courseId: 'C301', semester: 'Spring 2024', status: 'Enrolled' },
    { studentId: 'S1004', courseId: 'C304', semester: 'Spring 2024', status: 'Enrolled' },
];
