import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Printer,
  Download,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react'
import { courseApi } from '../lib/api'
import toast from 'react-hot-toast'
import html2pdf from 'html2pdf.js'

interface ApiCourse {
  id: number | string
  course_code: string
  course_title: string
  course_description?: string | null
  prerequisite?: string | null
  credit_units: number
  semester: string
  academic_year: string
  total_hours?: number | null
  lecture_hours?: number | null
  lab_hours?: number | null
  department?: { department_name: string } | null
  user?: { full_name?: string | null; name?: string | null } | null
  clos?: Array<{ id: number | string; code: string; description: string; program_outcomes?: string[] }>
  weekly_plans?: Array<{
    id: number | string
    week_number: number
    title: string
    learning_outcomes?: string[]
    topics?: string[]
    teaching_learning_activities?: string[]
    assessment_methods?: string[]
  }>
  grading_systems?: Array<{ id: number | string; term: string; component_name: string; percentage: number }>
  requirement_policies?: Array<{ id: number | string; requirements?: string | null; policies?: string | null }>
  references?: Array<{ id: number | string; reference_type: string; reference_title: string; reference_author?: string | null; reference_year?: string | null; reference_link?: string | null }>
  rubrics?: Array<{ id: number | string; name: string; excellent: string; good: string; fair: string; poor: string }>
}

const lines = (value?: string | null) => (value || '').split('\n').filter(Boolean)

export default function SyllabusView() {
  const { courseId } = useParams()
  const [course, setCourse] = useState<ApiCourse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const syllabusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const loadCourse = async () => {
      if (!courseId) return
      setIsLoading(true)
      try {
        const { data } = await courseApi.get(courseId)
        if (isMounted) setCourse(data as ApiCourse)
      } catch {
        if (isMounted) {
          setCourse(null)
          toast.error('Syllabus could not be loaded from the database.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadCourse()

    return () => {
      isMounted = false
    }
  }, [courseId])

  const handlePrint = () => {
    toast.success('Preparing print view...')
    setTimeout(() => window.print(), 500)
  }

  const handleExportPDF = () => {
    if (!syllabusRef.current || !course) return

    toast.loading('Generating PDF...', { id: 'pdf-export' })

    const element = syllabusRef.current
    const opt = {
      margin: [15, 15, 15, 15] as [number, number, number, number],
      filename: `${course.course_code}_${course.course_title.replace(/\s+/g, '_')}_syllabus.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        letterRendering: true,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    html2pdf().set(opt).from(element).save().then(() => {
      toast.success('PDF exported successfully', { id: 'pdf-export' })
    }).catch(() => {
      toast.error('Failed to export PDF', { id: 'pdf-export' })
    })
  }

  const midterm = course?.grading_systems?.filter((g) => g.term === 'midterm') || []
  const final = course?.grading_systems?.filter((g) => g.term === 'final') || []
  const policy = course?.requirement_policies?.[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link to="/courses" className="p-2 rounded-lg border border-academic-border hover:bg-academic-bg transition-colors">
            <ArrowLeft className="w-4 h-4 text-academic-text-muted" />
          </Link>
          <div>
            <h1 className="page-header mb-0">Syllabus View</h1>
            <p className="page-subtitle">
              {isLoading ? 'Loading from database...' : course ? `${course.course_code} - ${course.course_title}` : 'No syllabus found'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn-ghost border border-academic-border" disabled={!course}>
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleExportPDF} className="btn-primary" disabled={!course}>
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {!course ? (
        <div className="card text-center py-12">
          <p className="text-sm text-academic-text-muted">{isLoading ? 'Loading syllabus...' : 'No database syllabus found.'}</p>
        </div>
      ) : (
        <div ref={syllabusRef} className="bg-white rounded-2xl border border-academic-border shadow-soft p-8 lg:p-12 max-w-5xl mx-auto print:shadow-none print:border-none">
          <div className="text-center pb-8 border-b-2 border-academic-primary/10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-academic-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-academic-primary tracking-tight">Sultan Kudarat State University</h2>
            <p className="text-sm text-academic-text-muted mt-1">College of Computing and Information Technology</p>
            <p className="text-sm text-academic-text-muted">{course.department?.department_name || 'No department'}</p>
          </div>

          <div className="py-8 border-b border-academic-border">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge badge-info text-xs">{course.semester}</span>
              <span className="badge badge-neutral text-xs">{course.academic_year}</span>
              <span className="badge badge-neutral text-xs">{course.credit_units} Units</span>
            </div>
            <h1 className="text-3xl font-bold text-academic-primary tracking-tight">
              {course.course_code}: {course.course_title}
            </h1>
            <p className="text-sm text-academic-text-muted mt-2 max-w-2xl">{course.course_description || 'No description saved.'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-academic-border">
            <div>
              <p className="text-xs font-semibold uppercase text-academic-text-muted">Teacher</p>
              <p className="text-sm font-medium text-academic-text">{course.user?.full_name || course.user?.name || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-academic-text-muted">Prerequisite</p>
              <p className="text-sm font-medium text-academic-text">{course.prerequisite || 'None'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-academic-text-muted">Hours</p>
              <p className="text-sm font-medium text-academic-text">
                {course.total_hours || 0} hours ({course.lecture_hours || 0} lec + {course.lab_hours || 0} lab)
              </p>
            </div>
          </div>

          <section className="py-8 border-b border-academic-border">
            <h3 className="section-title mb-4">Course Learning Outcomes</h3>
            <div className="space-y-3">
              {(course.clos || []).length === 0 ? (
                <p className="text-sm text-academic-text-muted">No CLOs saved.</p>
              ) : (
                course.clos?.map((clo) => (
                  <div key={clo.id} className="p-4 rounded-lg bg-academic-bg">
                    <p className="text-sm font-semibold text-academic-text">{clo.code}</p>
                    <p className="text-sm text-academic-text-muted mt-1">{clo.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(clo.program_outcomes || []).map((po) => (
                        <span key={po} className="badge badge-info text-[10px]">PO-{po.toUpperCase()}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="py-8 border-b border-academic-border">
            <h3 className="section-title mb-4">Weekly Plan</h3>
            <div className="space-y-4">
              {(course.weekly_plans || []).length === 0 ? (
                <p className="text-sm text-academic-text-muted">No weekly plans saved.</p>
              ) : (
                course.weekly_plans
                  ?.sort((a, b) => a.week_number - b.week_number)
                  .map((week) => (
                    <div key={week.id} className="p-4 rounded-lg border border-academic-border">
                      <p className="text-sm font-semibold text-academic-primary">Week {week.week_number}: {week.title}</p>
                      {[
                        ['Topics', week.topics],
                        ['Learning Outcomes', week.learning_outcomes],
                        ['Activities', week.teaching_learning_activities],
                        ['Assessment', week.assessment_methods],
                      ].map(([label, items]) => (
                        <div key={label as string} className="mt-3">
                          <p className="text-xs font-semibold uppercase text-academic-text-muted">{label as string}</p>
                          <ul className="mt-1 space-y-1">
                            {((items as string[]) || []).map((item, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-academic-text">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))
              )}
            </div>
          </section>

          <section className="py-8 border-b border-academic-border">
            <h3 className="section-title mb-4">Grading System</h3>
            {[
              ['Midterm', midterm],
              ['Final', final],
            ].map(([label, items]) => (
              <div key={label as string} className="mb-5">
                <p className="text-sm font-semibold text-academic-text mb-2">{label as string}</p>
                {(items as typeof midterm).length === 0 ? (
                  <p className="text-sm text-academic-text-muted">No components saved.</p>
                ) : (
                  <table className="w-full text-sm">
                    <tbody>
                      {(items as typeof midterm).map((g) => (
                        <tr key={g.id} className="border-b border-academic-border">
                          <td className="py-2 text-academic-text">{g.component_name}</td>
                          <td className="py-2 text-right text-academic-text-muted">{g.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </section>

          <section className="py-8 border-b border-academic-border">
            <h3 className="section-title mb-4">Requirements and Policies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold uppercase text-academic-text-muted mb-2">Requirements</p>
                <ul className="space-y-2">
                  {lines(policy?.requirements).map((item, i) => <li key={i} className="text-sm text-academic-text">{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-academic-text-muted mb-2">Policies</p>
                <ul className="space-y-2">
                  {lines(policy?.policies).map((item, i) => <li key={i} className="text-sm text-academic-text">{item}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <div className="pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
              <div>
                <div className="h-16 border-b border-academic-text mb-2" />
                <p className="text-sm font-semibold text-academic-text">{course.user?.full_name || course.user?.name || 'Teacher'}</p>
                <p className="text-xs text-academic-text-muted">Teacher</p>
              </div>
              <div>
                <div className="h-16 border-b border-academic-text mb-2" />
                <p className="text-sm font-semibold text-academic-text">Administrator</p>
                <p className="text-xs text-academic-text-muted">Admin Review</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
