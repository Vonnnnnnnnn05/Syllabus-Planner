import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { courseApi, syllabusApi, userApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'

interface CourseSummary {
  id: string
  code: string
  title: string
  department: string
  semester: string
  academicYear: string
  status: string
}

interface ApiCourse {
  id: number | string
  course_code: string
  course_title: string
  semester: string
  academic_year: string
  status: string
  department?: { department_name: string } | null
}

interface ApiSyllabus {
  status: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.fullName?.split(' ')[0] || 'there'
  const [courses, setCourses] = useState<CourseSummary[]>([])
  const [syllabi, setSyllabi] = useState<ApiSyllabus[]>([])
  const [usersCount, setUsersCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      setIsLoading(true)
      try {
        const [coursesResponse, syllabiResponse, usersResponse] = await Promise.all([
          courseApi.list(),
          syllabusApi.list(),
          userApi.list(),
        ])

        if (!isMounted) return

        setCourses(
          (coursesResponse.data as ApiCourse[]).map((course) => ({
            id: String(course.id),
            code: course.course_code,
            title: course.course_title,
            department: course.department?.department_name || 'No department',
            semester: course.semester,
            academicYear: course.academic_year,
            status: course.status,
          }))
        )
        setSyllabi(syllabiResponse.data as ApiSyllabus[])
        setUsersCount(Array.isArray(usersResponse.data) ? usersResponse.data.length : 0)
      } catch {
        if (isMounted) {
          setCourses([])
          setSyllabi([])
          setUsersCount(0)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const stats = [
    {
      label: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Active Syllabi',
      value: syllabi.filter((s) => s.status === 'Published').length,
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-700',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'In Progress',
      value: syllabi.filter((s) => s.status === 'Under Review').length,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700',
      iconColor: 'text-amber-500',
    },
    {
      label: 'Visible Users',
      value: usersCount,
      icon: Users,
      color: 'bg-violet-50 text-violet-700',
      iconColor: 'text-violet-500',
    },
  ]

  const recentCourses = courses.slice(0, 4)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, {firstName}. {isLoading ? 'Loading your academic workspace...' : "Here's what's happening in your academic workspace."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="card group cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-academic-primary">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Courses</h2>
            <Link to="/courses" className="text-sm font-medium text-academic-accent hover:text-academic-accent-dark flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-8 h-8 text-academic-text-muted mx-auto mb-2" />
                <p className="text-sm text-academic-text-muted">{isLoading ? 'Loading courses...' : 'No courses found.'}</p>
              </div>
            ) : (
              recentCourses.map((course) => (
                <Link key={course.id} to={`/syllabus-view/${course.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-academic-bg hover:bg-academic-surface-alt transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-academic-primary/5 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-academic-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-academic-text group-hover:text-academic-primary transition-colors truncate">
                        {course.code} - {course.title}
                      </h3>
                      <span className="badge text-[10px] badge-info">{course.status}</span>
                    </div>
                    <p className="text-xs text-academic-text-muted mt-0.5 truncate">
                      {course.department} - {course.semester} - {course.academicYear}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-academic-text-muted group-hover:text-academic-accent transition-colors shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Work Sessions</h2>
            <Link to="/approvals" className="text-sm font-medium text-academic-accent hover:text-academic-accent-dark flex items-center gap-1 transition-colors">
              Open <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="text-center py-8">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-academic-text-muted">Continue your database-backed syllabus work.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { title: 'Create New Course', desc: 'Set up a new subject course', icon: BookOpen, link: '/courses', color: 'bg-academic-primary text-white' },
          { title: 'Plan Weekly Lessons', desc: 'Build your weekly syllabus plan', icon: Calendar, link: '/syllabus-planner', color: 'bg-academic-accent text-white' },
          { title: 'AI Assistant', desc: 'Get AI-powered content suggestions', icon: TrendingUp, link: '/ai-companion', color: 'bg-emerald-600 text-white' },
        ].map((action) => (
          <Link key={action.title} to={action.link} className="card group hover:shadow-elevated transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-academic-text group-hover:text-academic-primary transition-colors">{action.title}</h3>
                <p className="text-xs text-academic-text-muted mt-1">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-academic-text-muted group-hover:text-academic-accent transition-colors shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
