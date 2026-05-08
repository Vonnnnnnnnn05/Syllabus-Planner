import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardCheck, CheckCircle2, Clock, Edit3, Eye } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { courseApi, syllabusApi } from '../lib/api'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

// Status filtering removed for personal syllabus planner

interface WorkCourse {
  id: string
  code: string
  title: string
  department: string
  faculty: string
  status: string
}

interface WorkSyllabus {
  id: string
  courseId: string
  status: string
  submittedAt?: string
  notes?: string
}

interface ApiCourse {
  id: number | string
  course_code: string
  course_title: string
  status: string
  department?: {
    department_name: string
  } | null
  user?: {
    name?: string | null
    full_name?: string | null
  } | null
}

interface ApiSyllabus {
  id: number | string
  course_id: number | string
  status: string
  submitted_at?: string | null
  notes?: string | null
}

export default function ApprovalWorkflow() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<WorkCourse[]>([])
  const [syllabi, setSyllabi] = useState<WorkSyllabus[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = user?.role === 'Admin'

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

  useEffect(() => {
    let isMounted = true

    const loadSessions = async () => {
      setIsLoading(true)
      try {
        const [coursesResponse, syllabiResponse] = await Promise.all([
          courseApi.list(),
          syllabusApi.list(),
        ])

        if (!isMounted) return

        setCourses(
          (coursesResponse.data as ApiCourse[]).map((course) => ({
            id: String(course.id),
            code: course.course_code,
            title: course.course_title,
            department: course.department?.department_name || 'No department',
            faculty: course.user?.full_name || course.user?.name || 'Teacher',
            status: course.status,
          }))
        )
        setSyllabi(
          (syllabiResponse.data as ApiSyllabus[]).map((syllabus) => ({
            id: String(syllabus.id),
            courseId: String(syllabus.course_id),
            status: syllabus.status,
            submittedAt: syllabus.submitted_at || undefined,
            notes: syllabus.notes || undefined,
          }))
        )
      } catch (error) {
        if (isMounted) {
          setCourses([])
          setSyllabi([])
          toast.error(getErrorMessage(error, 'Work sessions could not be loaded from the database.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSessions()

    return () => {
      isMounted = false
    }
  }, [])

  const workSessions = courses.map((course) => {
    const syllabus = syllabi.find((item) => item.courseId === course.id)

    return {
      course,
      submittedAt: syllabus?.submittedAt,
      notes: syllabus?.notes,
    }
  })

  const filtered = workSessions

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">My Work Sessions</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'View syllabus work sessions across the system.'
              : 'View and continue your own subject/course work.'}
          </p>
        </div>
        {/* Status filter removed for personal planner */}
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-academic-bg border-b border-academic-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Course</th>
                {isAdmin && (
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Teacher</th>
                )}
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Last Session</th>
                {/* Status column removed for personal planner */}
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Notes</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-border">
              {filtered.map(({ course, submittedAt, notes }) => (
                <tr key={course.id} className="hover:bg-academic-bg/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-academic-primary/5 flex items-center justify-center shrink-0">
                        <ClipboardCheck className="w-4 h-4 text-academic-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-academic-text">
                          {course.code} - {course.title}
                        </p>
                        <p className="text-xs text-academic-text-muted">{course.department}</p>
                      </div>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-4 text-academic-text-muted">{course.faculty}</td>
                  )}
                  <td className="px-5 py-4 text-academic-text-muted">
                    {submittedAt ? (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(submittedAt)}
                      </span>
                    ) : (
                      'Not started'
                    )}
                  </td>
                  {/* Status cell removed */}
                  <td className="px-5 py-4 text-academic-text-muted max-w-xs truncate">
                    {notes || 'No notes'}
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
                        className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-accent transition-colors"
                        title="Continue work"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm text-academic-text-muted">
              {isLoading ? 'Loading work sessions...' : 'No syllabus work found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
