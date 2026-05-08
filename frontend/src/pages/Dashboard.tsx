import { Link } from 'react-router-dom'
import {
  BookOpen,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
} from 'lucide-react'
import { demoCourses, demoSyllabi, demoUsers } from '../data/demo-data'
import { formatDate } from '../lib/utils'

export default function Dashboard() {
  const stats = [
    {
      label: 'Total Courses',
      value: demoCourses.length,
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Active Syllabi',
      value: demoSyllabi.filter((s) => s.status === 'Published').length,
      icon: FileText,
      color: 'bg-emerald-50 text-emerald-700',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Pending Review',
      value: demoSyllabi.filter((s) => s.status === 'Under Review').length,
      icon: Clock,
      color: 'bg-amber-50 text-amber-700',
      iconColor: 'text-amber-500',
    },
    {
      label: 'Total Users',
      value: demoUsers.length,
      icon: Users,
      color: 'bg-violet-50 text-violet-700',
      iconColor: 'text-violet-500',
    },
  ]

  const recentCourses = demoCourses.slice(0, 4)
  const pendingApprovals = demoSyllabi.filter((s) => s.status === 'Under Review')

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, Mark Jovic. Here's what's happening in your academic workspace.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="card group cursor-default">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-academic-primary">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Courses</h2>
            <Link
              to="/courses"
              className="text-sm font-medium text-academic-accent hover:text-academic-accent-dark flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentCourses.map((course) => (
              <Link
                key={course.id}
                to={`/syllabus-view/${course.id}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-academic-bg hover:bg-academic-surface-alt transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-academic-primary/5 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-academic-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-academic-text group-hover:text-academic-primary transition-colors truncate">
                      {course.code} — {course.title}
                    </h3>
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
                  </div>
                  <p className="text-xs text-academic-text-muted mt-0.5 truncate">
                    {course.department} · {course.semester} · {course.academicYear}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-academic-text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {course.totalWeeks} weeks
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {course.closCount} CLOs
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-academic-text-muted group-hover:text-academic-accent transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Pending Approvals</h2>
            <Link
              to="/approvals"
              className="text-sm font-medium text-academic-accent hover:text-academic-accent-dark flex items-center gap-1 transition-colors"
            >
              Review <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-academic-text-muted">All caught up!</p>
                <p className="text-xs text-academic-text-muted">No pending approvals.</p>
              </div>
            ) : (
              pendingApprovals.map((syllabus) => {
                const course = demoCourses.find((c) => c.id === syllabus.courseId)
                return (
                  <div
                    key={syllabus.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-academic-text truncate">
                        {course?.code} — {course?.title}
                      </p>
                      <p className="text-xs text-academic-text-muted mt-0.5">
                        Submitted {syllabus.submittedAt ? formatDate(syllabus.submittedAt) : 'N/A'}
                      </p>
                      {syllabus.notes && (
                        <p className="text-xs text-amber-700 mt-1">{syllabus.notes}</p>
                      )}
                    </div>
                    <span className="badge badge-warning text-[10px] shrink-0">
                      {syllabus.status}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          {/* Quick Activity */}
          <div className="mt-6 pt-6 border-t border-academic-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-3">
              Activity
            </h3>
            <div className="space-y-3">
              {[
                { action: 'Syllabus published', target: 'IPT2', time: '2 hours ago', color: 'bg-emerald-100 text-emerald-600' },
                { action: 'Course updated', target: 'CS202', time: '5 hours ago', color: 'bg-blue-100 text-blue-600' },
                { action: 'New user added', target: 'Ana Reyes', time: '1 day ago', color: 'bg-violet-100 text-violet-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color.split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-academic-text truncate">
                      {item.action} — <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-academic-text-muted">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          {
            title: 'Create New Course',
            desc: 'Set up a new course and syllabus',
            icon: BookOpen,
            link: '/courses',
            color: 'bg-academic-primary text-white',
          },
          {
            title: 'Plan Weekly Lessons',
            desc: 'Build your 16-week syllabus plan',
            icon: Calendar,
            link: '/syllabus-planner',
            color: 'bg-academic-accent text-white',
          },
          {
            title: 'AI Assistant',
            desc: 'Get AI-powered content suggestions',
            icon: TrendingUp,
            link: '/ai-companion',
            color: 'bg-emerald-600 text-white',
          },
        ].map((action) => (
          <Link
            key={action.title}
            to={action.link}
            className="card group hover:shadow-elevated transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-academic-text group-hover:text-academic-primary transition-colors">
                  {action.title}
                </h3>
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
