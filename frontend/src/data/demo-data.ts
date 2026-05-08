import { ipt2Syllabus } from './ipt2-syllabus'

export interface User {
  id: string
  fullName: string
  email: string
  role: 'Admin' | 'Teacher' | 'Department Head' | 'Program Chair' | 'Dean' | 'Coordinator'
  department: string
  avatar: string
  status: 'Active' | 'Inactive'
}

export interface Course {
  id: string
  code: string
  title: string
  description: string
  department: string
  creditUnits: number
  semester: string
  academicYear: string
  prerequisites: string
  status: 'Draft' | 'Pending Review' | 'Approved' | 'Archived'
  faculty: string
  facultyId: string
  createdAt: string
  updatedAt: string
  totalWeeks: number
  closCount: number
  hasGradingSystem: boolean
}

export interface Syllabus {
  id: string
  courseId: string
  status: 'Draft' | 'Under Review' | 'Revision Required' | 'Approved' | 'Published'
  version: number
  submittedAt?: string
  reviewedBy?: string
  approvedBy?: string
  notes?: string
}

export const demoUsers: User[] = [
  { id: 'u1', fullName: 'Mark Jovic A. Daday', email: 'mjdaday@sku.edu.ph', role: 'Teacher', department: 'Information Technology', avatar: 'MD', status: 'Active' },
  { id: 'u2', fullName: 'Rubin B. Cerilo', email: 'rbc@sku.edu.ph', role: 'Program Chair', department: 'Information Technology', avatar: 'RC', status: 'Active' },
  { id: 'u3', fullName: 'Elbren O. Antonio', email: 'eoa@sku.edu.ph', role: 'Dean', department: 'Information Technology', avatar: 'EA', status: 'Active' },
  { id: 'u4', fullName: 'Von Esson Vergara', email: 'vev@sku.edu.ph', role: 'Admin', department: 'Information Technology', avatar: 'VV', status: 'Active' },
  { id: 'u5', fullName: 'Maria Santos', email: 'ms@sku.edu.ph', role: 'Teacher', department: 'Computer Science', avatar: 'MS', status: 'Active' },
  { id: 'u6', fullName: 'Juan Cruz', email: 'jc@sku.edu.ph', role: 'Department Head', department: 'Information Technology', avatar: 'JC', status: 'Active' },
  { id: 'u7', fullName: 'Ana Reyes', email: 'ar@sku.edu.ph', role: 'Coordinator', department: 'Information Technology', avatar: 'AR', status: 'Active' },
  { id: 'u8', fullName: 'Pedro Garcia', email: 'pg@sku.edu.ph', role: 'Teacher', department: 'Computer Science', avatar: 'PG', status: 'Inactive' },
]

export const demoCourses: Course[] = [
  {
    id: 'c1',
    code: 'IPT2',
    title: 'Web Development Framework (Laravel)',
    description: ipt2Syllabus.description,
    department: 'Information Technology',
    creditUnits: 3,
    semester: '2nd Semester',
    academicYear: '2025-2026',
    prerequisites: 'IPT1 - Fundamentals of Web Development',
    status: 'Approved',
    faculty: 'Mark Jovic A. Daday',
    facultyId: 'u1',
    createdAt: '2025-01-15',
    updatedAt: '2025-03-20',
    totalWeeks: 17,
    closCount: 5,
    hasGradingSystem: true,
  },
  {
    id: 'c2',
    code: 'CS101',
    title: 'Introduction to Programming',
    description: 'Fundamentals of programming using Python. Covers variables, control structures, functions, and basic OOP concepts.',
    department: 'Computer Science',
    creditUnits: 3,
    semester: '1st Semester',
    academicYear: '2025-2026',
    prerequisites: 'None',
    status: 'Approved',
    faculty: 'Maria Santos',
    facultyId: 'u5',
    createdAt: '2025-01-10',
    updatedAt: '2025-02-15',
    totalWeeks: 16,
    closCount: 4,
    hasGradingSystem: true,
  },
  {
    id: 'c3',
    code: 'IPT1',
    title: 'Fundamentals of Web Development',
    description: 'HTML, CSS, JavaScript basics. Introduction to client-side web development and responsive design principles.',
    department: 'Information Technology',
    creditUnits: 3,
    semester: '1st Semester',
    academicYear: '2025-2026',
    prerequisites: 'CS101',
    status: 'Archived',
    faculty: 'Mark Jovic A. Daday',
    facultyId: 'u1',
    createdAt: '2024-08-01',
    updatedAt: '2024-12-15',
    totalWeeks: 16,
    closCount: 4,
    hasGradingSystem: true,
  },
  {
    id: 'c4',
    code: 'CS202',
    title: 'Database Management Systems',
    description: 'Relational database design, normalization, SQL, and database administration using MySQL and PostgreSQL.',
    department: 'Computer Science',
    creditUnits: 3,
    semester: '2nd Semester',
    academicYear: '2025-2026',
    prerequisites: 'CS101',
    status: 'Pending Review',
    faculty: 'Pedro Garcia',
    facultyId: 'u8',
    createdAt: '2025-02-01',
    updatedAt: '2025-03-18',
    totalWeeks: 16,
    closCount: 5,
    hasGradingSystem: false,
  },
  {
    id: 'c5',
    code: 'IPT3',
    title: 'Advanced Web Technologies',
    description: 'React, Vue.js, Node.js, and modern full-stack development practices. API design and microservices introduction.',
    department: 'Information Technology',
    creditUnits: 3,
    semester: '1st Semester',
    academicYear: '2026-2027',
    prerequisites: 'IPT2',
    status: 'Draft',
    faculty: 'Mark Jovic A. Daday',
    facultyId: 'u1',
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
    totalWeeks: 16,
    closCount: 0,
    hasGradingSystem: false,
  },
]

export const demoSyllabi: Syllabus[] = [
  { id: 's1', courseId: 'c1', status: 'Published', version: 3, submittedAt: '2025-03-15', reviewedBy: 'Rubin B. Cerilo', approvedBy: 'Elbren O. Antonio', notes: 'Approved with minor formatting changes.' },
  { id: 's2', courseId: 'c2', status: 'Published', version: 2, submittedAt: '2025-02-10', reviewedBy: 'Rubin B. Cerilo', approvedBy: 'Elbren O. Antonio' },
  { id: 's3', courseId: 'c3', status: 'Published', version: 1, submittedAt: '2024-08-15', reviewedBy: 'Rubin B. Cerilo', approvedBy: 'Elbren O. Antonio' },
  { id: 's4', courseId: 'c4', status: 'Under Review', version: 1, submittedAt: '2025-03-18', reviewedBy: 'Rubin B. Cerilo', notes: 'Awaiting department head review.' },
  { id: 's5', courseId: 'c5', status: 'Draft', version: 1 },
]

export const departments = [
  'Information Technology',
  'Computer Science',
  'Software Engineering',
  'Data Science',
  'Information Systems',
]

export const roles = [
  'Admin',
  'Teacher',
  'Department Head',
  'Program Chair',
  'Dean',
  'Coordinator',
]

export const semesters = ['1st Semester', '2nd Semester', 'Summer']
