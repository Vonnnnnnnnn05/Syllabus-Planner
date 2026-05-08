import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Printer,
  Download,
  BookOpen,
  Target,
  Scale,
  FileText,
  ListChecks,
  CheckCircle2,
  GraduationCap,
  Calendar,
  User,
  Building2,
} from 'lucide-react'
import { demoCourses } from '../data/demo-data'
import { ipt2Syllabus } from '../data/ipt2-syllabus'
import toast from 'react-hot-toast'

export default function SyllabusView() {
  const { courseId } = useParams()
  const course = demoCourses.find((c) => c.id === courseId) || demoCourses[0]
  const s = ipt2Syllabus

  const handlePrint = () => {
    toast.success('Preparing print view...')
    setTimeout(() => window.print(), 500)
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/courses"
            className="p-2 rounded-lg border border-academic-border hover:bg-academic-bg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-academic-text-muted" />
          </Link>
          <div>
            <h1 className="page-header mb-0">Syllabus View</h1>
            <p className="page-subtitle">{course.code} — {course.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn-ghost border border-academic-border">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={() => toast.success('PDF export coming soon')}
            className="btn-primary"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Syllabus Document */}
      <div className="bg-white rounded-2xl border border-academic-border shadow-soft p-8 lg:p-12 max-w-5xl mx-auto print:shadow-none print:border-none">
        {/* Institution Header */}
        <div className="text-center pb-8 border-b-2 border-academic-primary/10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-academic-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-academic-primary tracking-tight">
            Sultan Kudarat State University
          </h2>
          <p className="text-sm text-academic-text-muted mt-1">College of Computing and Information Technology</p>
          <p className="text-sm text-academic-text-muted">{course.department}</p>
        </div>

        {/* Course Header */}
        <div className="py-8 border-b border-academic-border">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge badge-info text-xs">{course.semester}</span>
            <span className="badge badge-neutral text-xs">{course.academicYear}</span>
            <span className="badge badge-neutral text-xs">{course.creditUnits} Units</span>
          </div>
          <h1 className="text-3xl font-bold text-academic-primary tracking-tight">
            {course.code}: {course.title}
          </h1>
          <p className="text-sm text-academic-text-muted mt-2 max-w-2xl">{course.description}</p>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-academic-border">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-academic-accent" />
            <div>
              <p className="text-xs text-academic-text-muted">Faculty</p>
              <p className="text-sm font-medium text-academic-text">{s.faculty}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-academic-accent" />
            <div>
              <p className="text-xs text-academic-text-muted">Program</p>
              <p className="text-sm font-medium text-academic-text">{s.program}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-academic-accent" />
            <div>
              <p className="text-xs text-academic-text-muted">Duration</p>
              <p className="text-sm font-medium text-academic-text">{s.totalHours} hours ({s.lectureHours} lec + {s.labHours} lab)</p>
            </div>
          </div>
        </div>

        {/* Course Objectives */}
        <div className="py-8 border-b border-academic-border">
          <h2 className="text-lg font-bold text-academic-primary flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-academic-accent" />
            Course Objectives
          </h2>
          <ul className="space-y-2">
            {s.courseObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-academic-text">
                <span className="w-5 h-5 rounded-full bg-academic-primary/5 flex items-center justify-center text-xs font-bold text-academic-primary shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {obj}
              </li>
            ))}
          </ul>
        </div>

        {/* CLOs */}
        <div className="py-8 border-b border-academic-border">
          <h2 className="text-lg font-bold text-academic-primary flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-academic-accent" />
            Course Learning Outcomes (CLOs)
          </h2>
          <div className="space-y-3">
            {s.clos.map((clo, i) => (
              <div key={clo.id} className="p-4 rounded-xl bg-academic-bg border border-academic-border">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-academic-primary/10 flex items-center justify-center text-sm font-bold text-academic-primary shrink-0">
                    {clo.code}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-academic-text">{clo.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {clo.programOutcomes.map((po) => (
                        <span
                          key={po}
                          className="px-2 py-0.5 rounded-md bg-academic-accent/10 text-academic-accent-dark text-xs font-semibold"
                        >
                          PO-{po.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Plan */}
        <div className="py-8 border-b border-academic-border">
          <h2 className="text-lg font-bold text-academic-primary flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-academic-accent" />
            Weekly Course Plan
          </h2>
          <div className="space-y-3">
            {s.weeklyPlans.map((week) => (
              <div key={week.week} className="p-4 rounded-xl border border-academic-border hover:shadow-soft transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-lg bg-academic-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
                    W{week.week}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-academic-text">{week.title}</h3>
                    {week.topics.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-academic-text-muted mb-1">Topics</p>
                        <ul className="space-y-1">
                          {week.topics.map((topic, i) => (
                            <li key={i} className="text-xs text-academic-text-muted flex items-start gap-1.5">
                              <span className="text-academic-accent mt-0.5">•</span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {week.learningOutcomes.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-academic-text-muted mb-1">Learning Outcomes</p>
                        {week.learningOutcomes.map((lo, i) => (
                          <p key={i} className="text-xs text-academic-text-muted">{lo}</p>
                        ))}
                      </div>
                    )}
                    {week.teachingActivities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-academic-text-muted mb-1">Activities</p>
                        {week.teachingActivities.map((act, i) => (
                          <p key={i} className="text-xs text-academic-text-muted">{act}</p>
                        ))}
                      </div>
                    )}
                    {week.assessmentMethods.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-academic-text-muted mb-1">Assessment</p>
                        {week.assessmentMethods.map((am, i) => (
                          <p key={i} className="text-xs text-academic-text-muted">{am}</p>
                        ))}
                      </div>
                    )}
                    {week.relatedCLO.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {week.relatedCLO.map((clo) => (
                          <span key={clo} className="badge badge-info text-[10px]">{clo}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grading System */}
        <div className="py-8 border-b border-academic-border">
          <h2 className="text-lg font-bold text-academic-primary flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-academic-accent" />
            Grading System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-academic-bg border border-academic-border">
              <h3 className="text-sm font-bold text-academic-primary mb-3">Midterm Grade</h3>
              <div className="space-y-2">
                {s.midtermGrading.map((g, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-academic-text">{g.name}</span>
                    <span className="font-semibold text-academic-primary">{g.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-xl bg-academic-bg border border-academic-border">
              <h3 className="text-sm font-bold text-academic-primary mb-3">Final Term Grade</h3>
              <div className="space-y-2">
                {s.finalGrading.map((g, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-academic-text">{g.name}</span>
                    <span className="font-semibold text-academic-primary">{g.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-academic-accent/5 border border-academic-accent/20">
            <p className="text-sm text-academic-text">
              <strong>Final Grade =</strong> Midterm Grade (50%) + Final Term Grade (50%)
            </p>
          </div>
        </div>

        {/* Rubrics */}
        <div className="py-8 border-b border-academic-border">
          <h2 className="text-lg font-bold text-academic-primary flex items-center gap-2 mb-4">
            <ListChecks className="w-5 h-5 text-academic-accent" />
            Grading Rubrics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-academic-border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-academic-bg">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Criteria</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted w-1/4">Excellent (4)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted w-1/4">Good (3)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted w-1/4">Fair (2)</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted w-1/4">Poor (1)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-academic-border">
                {s.rubrics.map((r, i) => (
                  <tr key={i} className="hover:bg-academic-bg/30">
                    <td className="px-4 py-3 font-semibold text-academic-text">{r.name}</td>
                    <td className="px-4 py-3 text-xs text-academic-text-muted">{r.excellent}</td>
                    <td className="px-4 py-3 text-xs text-academic-text-muted">{r.good}</td>
                    <td className="px-4 py-3 text-xs text-academic-text-muted">{r.fair}</td>
                    <td className="px-4 py-3 text-xs text-academic-text-muted">{r.poor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* References */}
        <div className="py-8 border-b border-academic-border">
          <h2 className="text-lg font-bold text-academic-primary flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-academic-accent" />
            References
          </h2>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-2">Textbooks</p>
            {s.references.filter((r) => r.type === 'textbook').map((ref, i) => (
              <p key={i} className="text-sm text-academic-text pl-3">
                {ref.author} ({ref.year}). <em>{ref.title}</em>.
              </p>
            ))}
            <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mt-4 mb-2">Online References</p>
            {s.references.filter((r) => r.type === 'online').map((ref, i) => (
              <p key={i} className="text-sm text-academic-text pl-3">
                {ref.title} — {ref.link}
              </p>
            ))}
          </div>
        </div>

        {/* Requirements & Policies */}
        <div className="py-8 border-b border-academic-border">
          <h2 className="text-lg font-bold text-academic-primary flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-academic-accent" />
            Course Requirements & Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-2">Requirements</p>
              <ul className="space-y-2">
                {s.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-academic-text">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-2">Policies</p>
              <ul className="space-y-2">
                {s.policies.map((pol, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-academic-text">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    {pol}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="h-16 border-b border-academic-text mb-2" />
              <p className="text-sm font-semibold text-academic-text">{s.faculty}</p>
              <p className="text-xs text-academic-text-muted">Faculty</p>
            </div>
            <div>
              <div className="h-16 border-b border-academic-text mb-2" />
              <p className="text-sm font-semibold text-academic-text">{s.programChair}</p>
              <p className="text-xs text-academic-text-muted">Program Chairperson</p>
            </div>
            <div>
              <div className="h-16 border-b border-academic-text mb-2" />
              <p className="text-sm font-semibold text-academic-text">{s.dean}</p>
              <p className="text-xs text-academic-text-muted">College Dean</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
