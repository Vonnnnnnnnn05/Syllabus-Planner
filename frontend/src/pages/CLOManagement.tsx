import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, X, Save, Trash2, Link2, Edit3 } from 'lucide-react'
import { cloApi, courseApi } from '../lib/api'
import toast from 'react-hot-toast'

const programOutcomes = [
  { code: 'a', label: 'Knowledge' },
  { code: 'b', label: 'Problem Solving' },
  { code: 'c', label: 'Design' },
  { code: 'd', label: 'Teamwork' },
  { code: 'e', label: 'Ethics' },
  { code: 'f', label: 'Communication' },
  { code: 'g', label: 'Lifelong Learning' },
]

interface ApiClo {
  id: number | string
  code: string
  description: string
  program_outcomes?: string[]
}

interface CLO {
  id: string
  code: string
  description: string
  programOutcomes: string[]
}

interface ApiCourse {
  id: number | string
  course_code: string
  course_title: string
}

const emptyCLO: Partial<CLO> = { code: '', description: '', programOutcomes: [] }

export default function CLOManagement() {
  const { courseId } = useParams()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || '')
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [course, setCourse] = useState({ code: '', title: '' })
  const [clos, setClos] = useState<CLO[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCLO, setEditingCLO] = useState<CLO | null>(null)
  const [form, setForm] = useState<Partial<CLO>>(emptyCLO)

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

  const mapApiCLO = (clo: ApiClo): CLO => ({
    id: String(clo.id),
    code: clo.code,
    description: clo.description,
    programOutcomes: clo.program_outcomes || [],
  })

  useEffect(() => {
    let isMounted = true

    const loadCourses = async () => {
      setIsLoadingCourses(true)
      try {
        const { data } = await courseApi.list()
        if (!isMounted) return

        const loadedCourses = data as ApiCourse[]
        setCourses(loadedCourses)

        if (!selectedCourseId && loadedCourses.length > 0) {
          setSelectedCourseId(String(loadedCourses[0].id))
        }
      } catch (error) {
        if (isMounted) {
          setCourses([])
          toast.error(getErrorMessage(error, 'Courses could not be loaded from the database.'))
        }
      } finally {
        if (isMounted) {
          setIsLoadingCourses(false)
        }
      }
    }

    loadCourses()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadCLOs = async () => {
      if (!selectedCourseId) {
        setCourse({ code: '', title: '' })
        setClos([])
        return
      }

      try {
        const [courseResponse, closResponse] = await Promise.all([
          courseApi.get(selectedCourseId),
          cloApi.list(selectedCourseId),
        ])

        if (!isMounted) return

        const apiCourse = courseResponse.data as ApiCourse
        setCourse({ code: apiCourse.course_code, title: apiCourse.course_title })
        setClos((closResponse.data as ApiClo[]).map(mapApiCLO))
      } catch (error) {
        if (isMounted) {
          setClos([])
          toast.error(getErrorMessage(error, 'CLOs could not be loaded from the database.'))
        }
      }
    }

    loadCLOs()

    return () => {
      isMounted = false
    }
  }, [selectedCourseId])

  const togglePO = (poCode: string) => {
    setForm((prev) => ({
      ...prev,
      programOutcomes: prev.programOutcomes?.includes(poCode)
        ? prev.programOutcomes.filter((c) => c !== poCode)
        : [...(prev.programOutcomes || []), poCode],
    }))
  }

  const openAdd = () => {
    if (!selectedCourseId) {
      toast.error('Please select a course first')
      return
    }
    setEditingCLO(null)
    setForm(emptyCLO)
    setShowForm(true)
  }

  const openEdit = (clo: CLO) => {
    setEditingCLO(clo)
    setForm({ ...clo })
    setShowForm(true)
  }

  const saveCLO = async () => {
    if (!form.code || !form.description) {
      toast.error('Code and description are required')
      return
    }

    const payload = {
      course_id: selectedCourseId,
      code: form.code,
      description: form.description,
      program_outcomes: form.programOutcomes || [],
    }

    try {
      if (editingCLO) {
        const { data } = await cloApi.update(editingCLO.id, payload)
        setClos((prev) => prev.map((clo) => (clo.id === editingCLO.id ? mapApiCLO(data as ApiClo) : clo)))
        toast.success('CLO updated')
      } else {
        const { data } = await cloApi.create(payload)
        setClos((prev) => [...prev, mapApiCLO(data as ApiClo)])
        toast.success('CLO added')
      }
      setShowForm(false)
      setForm(emptyCLO)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to save CLO'))
    }
  }

  const removeCLO = async (id: string) => {
    if (!confirm('Remove this CLO?')) return

    try {
      await cloApi.delete(id)
      setClos((prev) => prev.filter((c) => c.id !== id))
      toast.success('CLO removed')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to remove CLO'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Course Learning Outcomes</h1>
          <p className="page-subtitle">
            {course.code && course.title
              ? `${course.code} - ${course.title} - Map CLOs to Program Outcomes`
              : 'Select a course to manage CLOs.'}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" disabled={!selectedCourseId}>
          <Plus className="w-4 h-4" /> Add CLO
        </button>
      </div>

      <div className="card p-4">
        <label className="label">Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="input-field appearance-none cursor-pointer"
          disabled={isLoadingCourses}
        >
          <option value="">{isLoadingCourses ? 'Loading courses...' : 'Select a course'}</option>
          {courses.map((courseOption) => (
            <option key={String(courseOption.id)} value={String(courseOption.id)}>
              {courseOption.course_code} - {courseOption.course_title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {clos.map((clo, index) => (
          <div key={clo.id} className="card group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-academic-primary/5 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-academic-primary">{clo.code}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-academic-text">
                      CLO {index + 1}: {clo.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Link2 className="w-3.5 h-3.5 text-academic-text-muted" />
                      <span className="text-xs text-academic-text-muted">Mapped to Program Outcomes:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {clo.programOutcomes.map((po) => (
                        <span key={po} className="px-2 py-1 rounded-md bg-academic-accent/10 text-academic-accent-dark text-xs font-semibold">
                          PO-{po.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(clo)} className="p-1.5 rounded-md text-academic-text-muted hover:bg-academic-bg hover:text-academic-accent">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeCLO(clo.id)} className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="section-title mb-5">CLO-Program Outcome Mapping Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-academic-bg">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted sticky left-0 bg-academic-bg">CLO</th>
                {programOutcomes.map((po) => (
                  <th key={po.code} className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted min-w-[60px]">
                    <div className="flex flex-col items-center">
                      <span className="text-academic-accent font-bold">{po.code.toUpperCase()}</span>
                      <span className="text-[10px] normal-case text-academic-text-muted/70">{po.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-border">
              {clos.map((clo) => (
                <tr key={clo.id} className="hover:bg-academic-bg/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-academic-text sticky left-0 bg-white">{clo.code}</td>
                  {programOutcomes.map((po) => (
                    <td key={po.code} className="px-3 py-3 text-center">
                      {clo.programOutcomes.includes(po.code) ? (
                        <div className="w-6 h-6 rounded-md bg-academic-accent/15 flex items-center justify-center mx-auto">
                          <span className="text-xs font-bold text-academic-accent-dark">✓</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-academic-bg flex items-center justify-center mx-auto">
                          <span className="text-xs text-academic-text-muted">-</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-academic-border">
              <h2 className="text-lg font-semibold text-academic-primary">{editingCLO ? 'Edit CLO' : 'Add New CLO'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-academic-bg">
                <X className="w-4 h-4 text-academic-text-muted" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">CLO Code</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-field" placeholder="e.g. CLO6" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[80px] resize-none" placeholder="At the end of the course, a student can..." />
              </div>
              <div>
                <label className="label">Map to Program Outcomes</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {programOutcomes.map((po) => (
                    <button
                      key={po.code}
                      type="button"
                      onClick={() => togglePO(po.code)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        form.programOutcomes?.includes(po.code)
                          ? 'bg-academic-primary text-white border-academic-primary'
                          : 'bg-white text-academic-text-muted border-academic-border hover:border-academic-primary/30'
                      }`}
                    >
                      <span className="font-bold">{po.code.toUpperCase()}</span> - {po.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
                <button onClick={saveCLO} className="btn-primary">
                  <Save className="w-4 h-4" /> Save CLO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
