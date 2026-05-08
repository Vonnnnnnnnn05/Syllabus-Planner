import { useEffect, useMemo, useState } from 'react'
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
  Share2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { courseApi, departmentApi, userApi } from '../lib/api'
import toast from 'react-hot-toast'

const semesters = ['1st Semester', '2nd Semester', 'Summer']

interface Course {
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

interface ApiDepartment {
  id: number
  department_name: string
}

interface ApiCourse {
  id: number | string
  course_code: string
  course_title: string
  course_description?: string | null
  prerequisite?: string | null
  credit_units: number
  semester: string
  academic_year: string
  status: Course['status']
  user_id?: number | string
  department?: ApiDepartment | null
  user?: {
    id: number | string
    name?: string | null
    full_name?: string | null
  } | null
  created_at?: string
  updated_at?: string
}

interface TeacherOption {
  id: string
  fullName: string
}

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [departmentOptions, setDepartmentOptions] = useState<ApiDepartment[]>(
    []
  )
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [sharingCourse, setSharingCourse] = useState<Course | null>(null)
  const [shareTeacherId, setShareTeacherId] = useState('')
  const [teacherOptions, setTeacherOptions] = useState<TeacherOption[]>(
    []
  )
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [form, setForm] = useState<Partial<Course>>({
    code: '',
    title: '',
    description: '',
    department: '',
    creditUnits: 3,
    semester: semesters[0],
    academicYear: '2025-2026',
    prerequisites: '',
  })

  const isAdmin = user?.role === 'Admin'
  const currentTeacherIds = [String(user?.id || ''), user?.email || '', user?.fullName || '']
  const departmentByName = useMemo(
    () =>
      departmentOptions.reduce<Record<string, ApiDepartment>>((lookup, department) => {
        lookup[department.department_name] = department
        return lookup
      }, {}),
    [departmentOptions]
  )

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'data' in error.response
    ) {
      const data = error.response.data as { message?: string; errors?: Record<string, string[]> }
      const firstValidationError = data.errors ? Object.values(data.errors)[0]?.[0] : undefined
      return firstValidationError || data.message || fallback
    }

    return fallback
  }

  const mapApiCourse = (course: ApiCourse): Course => {
    const faculty = course.user?.full_name || course.user?.name || user?.fullName || 'Teacher'

    return {
      id: String(course.id),
      code: course.course_code,
      title: course.course_title,
      description: course.course_description || '',
      department: course.department?.department_name || '',
      creditUnits: course.credit_units,
      semester: course.semester,
      academicYear: course.academic_year,
      prerequisites: course.prerequisite || '',
      status: course.status,
      faculty,
      facultyId: String(course.user_id || course.user?.id || ''),
      createdAt: course.created_at?.split('T')[0] || '',
      updatedAt: course.updated_at?.split('T')[0] || '',
      totalWeeks: 0,
      closCount: 0,
      hasGradingSystem: false,
    }
  }

  const buildPayload = (courseForm: Partial<Course>) => {
    const department = courseForm.department ? departmentByName[courseForm.department] : undefined

    return {
      course_code: courseForm.code?.trim(),
      course_title: courseForm.title?.trim(),
      course_description: courseForm.description || '',
      prerequisite: courseForm.prerequisites || '',
      credit_units: courseForm.creditUnits || 3,
      semester: courseForm.semester || semesters[0],
      academic_year: courseForm.academicYear || '2025-2026',
      department_id: department?.id ?? null,
      status: courseForm.status || 'Draft',
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadCourses = async () => {
      setIsLoading(true)
      try {
        const [coursesResponse, departmentsResponse, teachersResponse] = await Promise.all([
          courseApi.list(),
          departmentApi.list(),
          userApi.teachers(),
        ])

        if (!isMounted) return

        const loadedDepartments = departmentsResponse.data as ApiDepartment[]
        if (loadedDepartments.length > 0) {
          setDepartmentOptions(loadedDepartments)
        }

        setCourses((coursesResponse.data as ApiCourse[]).map(mapApiCourse))
        setTeacherOptions(
          (teachersResponse.data as Array<{ id: number | string; full_name?: string | null; name?: string | null }>)
            .map((teacher) => ({
              id: String(teacher.id),
              fullName: teacher.full_name || teacher.name || `Teacher ${teacher.id}`,
            }))
        )
      } catch (error) {
        if (isMounted) {
          setCourses([])
          toast.error(getErrorMessage(error, 'Courses could not be loaded from the database.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadCourses()

    return () => {
      isMounted = false
    }
  }, [])

  const canOwnCourse = (course: Course) =>
    isAdmin ||
    currentTeacherIds.includes(course.facultyId) ||
    currentTeacherIds.includes(course.faculty) ||
    (user?.email === 'teacher@gmail.com' && course.facultyId === 'u1') ||
    (user?.email === 'teacher2@gmail.com' && course.facultyId === 'u5') ||
    (user?.email === 'inactive.teacher@gmail.com' && course.facultyId === 'u8')

  const canViewCourse = () => true

  const canEditCourse = (course: Course) => canOwnCourse(course)

  const visibleCourses = courses.filter(canViewCourse)
  const filtered = visibleCourses.filter((c) => {
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
      department: departmentOptions[0]?.department_name || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code || !form.title) {
      toast.error('Course code and title are required')
      return
    }

    try {
      setIsSaving(true)
      if (editingCourse) {
        const { data } = await courseApi.update(editingCourse.id, buildPayload(form))
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? mapApiCourse(data as ApiCourse) : c)))
        toast.success('Course updated successfully')
      } else {
        const { data } = await courseApi.create(buildPayload({ ...form, status: 'Draft' }))
        setCourses((prev) => [mapApiCourse(data as ApiCourse), ...prev])
        toast.success('Course created successfully')
      }
      setShowModal(false)
    } catch (error) {
      toast.error(getErrorMessage(error, editingCourse ? 'Unable to update course' : 'Unable to create course'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return
    }

    try {
      await courseApi.delete(id)
      setCourses((prev) => prev.filter((c) => c.id !== id))
      toast.success('Course deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to delete course'))
    }
  }

  const openShare = (course: Course) => {
    setSharingCourse(course)
    setShareTeacherId('')
  }

  const handleShare = async () => {
    if (!sharingCourse || !shareTeacherId) {
      toast.error('Select a teacher to share with')
      return
    }

    try {
      await courseApi.share(sharingCourse.id, shareTeacherId)
      setSharingCourse(null)
      toast.success('Course shared with teacher')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to share course'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Courses</h1>
          <p className="page-subtitle">
            {isAdmin ? 'Manage all courses in the system.' : 'Create and manage your own subject courses.'}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary shrink-0">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

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
              {departmentOptions.map((d) => (
                <option key={d.id} value={d.department_name}>
                  {d.department_name}
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

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-academic-bg border-b border-academic-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Course</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Department</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Semester</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Units</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Actions</th>
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
                          {course.code} - {course.title}
                        </p>
                        <p className="text-xs text-academic-text-muted">{course.faculty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-academic-text-muted">{course.department}</td>
                  <td className="px-5 py-4 text-academic-text-muted">
                    {course.semester} - {course.academicYear}
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
                      <Link to={`/syllabus-view/${course.id}`} className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-primary transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link to={`/syllabus-planner/${course.id}`} className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-primary transition-colors" title="Syllabus">
                        <FileText className="w-4 h-4" />
                      </Link>
                      {canEditCourse(course) && (
                        <>
                          <button onClick={() => openEdit(course)} className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-accent transition-colors" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {teacherOptions.length > 1 && (
                            <button onClick={() => openShare(course)} className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-primary transition-colors" title="Share with teacher">
                              <Share2 className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleDelete(course.id)} className="p-1.5 rounded-md hover:bg-red-50 text-academic-text-muted hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
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
            <p className="text-sm text-academic-text-muted">
              {isLoading ? 'Loading courses...' : 'No courses found.'}
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-academic-border">
              <h2 className="text-lg font-semibold text-academic-primary">{editingCourse ? 'Edit Course' : 'New Course'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-academic-bg">
                <X className="w-4 h-4 text-academic-text-muted" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Course Code</label>
                  <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field" placeholder="e.g. IPT2" required />
                </div>
                <div>
                  <label className="label">Credit Units</label>
                  <input type="number" min={1} max={6} value={form.creditUnits} onChange={(e) => setForm({ ...form, creditUnits: Number(e.target.value) })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Course Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Enter course title" required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="Brief course description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Department</label>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="input-field appearance-none cursor-pointer">
                    {departmentOptions.map((d) => (
                      <option key={d.id} value={d.department_name}>
                        {d.department_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Semester</label>
                  <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="input-field appearance-none cursor-pointer">
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
                  <input type="text" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="label">Prerequisites</label>
                  <input type="text" value={form.prerequisites} onChange={(e) => setForm({ ...form, prerequisites: e.target.value })} className="input-field" placeholder="e.g. CS101" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  <Check className="w-4 h-4" />
                  {isSaving ? 'Saving...' : editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {sharingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSharingCourse(null)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-academic-border">
              <h2 className="text-lg font-semibold text-academic-primary">Share Course</h2>
              <button onClick={() => setSharingCourse(null)} className="p-1.5 rounded-lg hover:bg-academic-bg">
                <X className="w-4 h-4 text-academic-text-muted" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-academic-text">{sharingCourse.code} - {sharingCourse.title}</p>
                <p className="text-xs text-academic-text-muted">Share this course with another teacher.</p>
              </div>
              <div>
                <label className="label">Teacher</label>
                <select value={shareTeacherId} onChange={(e) => setShareTeacherId(e.target.value)} className="input-field appearance-none cursor-pointer">
                  <option value="">Select teacher</option>
                  {teacherOptions
                    .filter((teacher) => teacher.fullName !== sharingCourse.faculty)
                    .map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.fullName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setSharingCourse(null)} className="btn-ghost">Cancel</button>
                <button type="button" onClick={handleShare} className="btn-primary">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
