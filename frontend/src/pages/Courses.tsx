import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Edit3,
  Eye,
  FileText,
  Trash2,
  X,
  Check,
} from 'lucide-react'
import { demoCourses, departments, semesters } from '../data/demo-data'
import type { Course } from '../data/demo-data'
import toast from 'react-hot-toast'

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>(demoCourses)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  const [form, setForm] = useState<Partial<Course>>({
    code: '',
    title: '',
    description: '',
    department: departments[0],
    creditUnits: 3,
    semester: semesters[0],
    academicYear: '2025-2026',
    prerequisites: '',
  })

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
    const matchDept = filterDept === 'All' || c.department === filterDept
    const matchStatus = filterStatus === 'All' || c.status === filterStatus
    return matchSearch && matchDept && matchStatus
  })

  const openAdd = () => {
    setEditingCourse(null)
    setForm({
      code: '',
      title: '',
      description: '',
      department: departments[0],
      creditUnits: 3,
      semester: semesters[0],
      academicYear: '2025-2026',
      prerequisites: '',
    })
    setShowModal(true)
  }

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setForm({ ...course })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.title) {
      toast.error('Course code and title are required')
      return
    }
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id
            ? { ...c, ...(form as Course), updatedAt: new Date().toISOString().split('T')[0] }
            : c
        )
      )
      toast.success('Course updated successfully')
    } else {
      const newCourse: Course = {
        ...(form as Course),
        id: `c${Date.now()}`,
        status: 'Draft',
        faculty: 'Mark Jovic A. Daday',
        facultyId: 'u1',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        totalWeeks: 16,
        closCount: 0,
        hasGradingSystem: false,
      }
      setCourses((prev) => [newCourse, ...prev])
      toast.success('Course created successfully')
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses((prev) => prev.filter((c) => c.id !== id))
      toast.success('Course deleted')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Courses</h1>
          <p className="page-subtitle">Manage courses, departments, and academic programs.</p>
        </div>
        <button onClick={openAdd} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-text-muted" />
          <input
            type="text"
            placeholder="Search by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-text-muted" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="input-field pl-9 pr-8 appearance-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-text-muted" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field pl-9 pr-8 appearance-none cursor-pointer"
            >
              <option value="All">All Status</option>
              {['Draft', 'Pending Review', 'Approved', 'Archived'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-academic-bg border-b border-academic-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">
                  Course
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">
                  Department
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">
                  Semester
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">
                  Units
                </th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">
                  Status
                </th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-border">
              {filtered.map((course) => (
                <tr key={course.id} className="hover:bg-academic-bg/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-academic-primary/5 flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4 text-academic-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-academic-text">
                          {course.code} — {course.title}
                        </p>
                        <p className="text-xs text-academic-text-muted">{course.faculty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-academic-text-muted">{course.department}</td>
                  <td className="px-5 py-4 text-academic-text-muted">
                    {course.semester} · {course.academicYear}
                  </td>
                  <td className="px-5 py-4 text-academic-text-muted">{course.creditUnits}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`badge text-[10px] ${
                        course.status === 'Approved'
                          ? 'badge-success'
                          : course.status === 'Pending Review'
                          ? 'badge-warning'
                          : course.status === 'Draft'
                          ? 'badge-info'
                          : 'badge-neutral'
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/syllabus-view/${course.id}`}
                        className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-primary transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/syllabus-planner/${course.id}`}
                        className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-primary transition-colors"
                        title="Syllabus"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openEdit(course)}
                        className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-accent transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-academic-text-muted hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-academic-text-muted mx-auto mb-3" />
            <p className="text-sm text-academic-text-muted">No courses found.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-academic-border">
              <h2 className="text-lg font-semibold text-academic-primary">
                {editingCourse ? 'Edit Course' : 'New Course'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-academic-bg">
                <X className="w-4 h-4 text-academic-text-muted" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Course Code</label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="input-field"
                    placeholder="e.g. IPT2"
                    required
                  />
                </div>
                <div>
                  <label className="label">Credit Units</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={form.creditUnits}
                    onChange={(e) => setForm({ ...form, creditUnits: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="label">Course Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Brief course description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="input-field appearance-none cursor-pointer"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Semester</label>
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    className="input-field appearance-none cursor-pointer"
                  >
                    {semesters.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Academic Year</label>
                  <input
                    type="text"
                    value={form.academicYear}
                    onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Prerequisites</label>
                  <input
                    type="text"
                    value={form.prerequisites}
                    onChange={(e) => setForm({ ...form, prerequisites: e.target.value })}
                    className="input-field"
                    placeholder="e.g. CS101"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check className="w-4 h-4" />
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
