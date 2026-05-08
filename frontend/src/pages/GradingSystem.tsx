import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Scale, Plus, X, Save, Trash2, PieChart } from 'lucide-react'
import { courseApi, gradingApi } from '../lib/api'
import toast from 'react-hot-toast'

interface GradingComponent {
  id?: string
  name: string
  percentage: number
}

interface ApiGradingComponent {
  id: number | string
  term: 'midterm' | 'final'
  component_name: string
  percentage: number
}

interface ApiCourse {
  id?: number | string
  course_code: string
  course_title: string
}

export default function GradingSystem() {
  const { courseId } = useParams()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || '')
  const [course, setCourse] = useState({ code: '', title: '' })
  const [midterm, setMidterm] = useState<GradingComponent[]>([])
  const [final, setFinal] = useState<GradingComponent[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [activeTerm, setActiveTerm] = useState<'midterm' | 'final'>('midterm')
  const [showAdd, setShowAdd] = useState(false)
  const [newComponent, setNewComponent] = useState({ name: '', percentage: 0 })

  const current = activeTerm === 'midterm' ? midterm : final
  const setCurrent = activeTerm === 'midterm' ? setMidterm : setFinal
  const total = current.reduce((sum, c) => sum + Number(c.percentage), 0)

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

  const mapApiComponent = (component: ApiGradingComponent): GradingComponent => ({
    id: String(component.id),
    name: component.component_name,
    percentage: component.percentage,
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

    const loadGrading = async () => {
      if (!selectedCourseId) {
        setCourse({ code: '', title: '' })
        setMidterm([])
        setFinal([])
        return
      }

      try {
        const [courseResponse, gradingResponse] = await Promise.all([
          courseApi.get(selectedCourseId),
          gradingApi.list(selectedCourseId),
        ])

        if (!isMounted) return

        const apiCourse = courseResponse.data as ApiCourse
        const components = gradingResponse.data as ApiGradingComponent[]
        setCourse({ code: apiCourse.course_code, title: apiCourse.course_title })
        setMidterm(components.filter((component) => component.term === 'midterm').map(mapApiComponent))
        setFinal(components.filter((component) => component.term === 'final').map(mapApiComponent))
      } catch (error) {
        if (isMounted) {
          setMidterm([])
          setFinal([])
          toast.error(getErrorMessage(error, 'Grading could not be loaded from the database.'))
        }
      }
    }

    loadGrading()

    return () => {
      isMounted = false
    }
  }, [selectedCourseId])

  const addComponent = async () => {
    if (!newComponent.name || newComponent.percentage <= 0) {
      toast.error('Name and percentage are required')
      return
    }
    if (!selectedCourseId) {
      toast.error('Please select a course first')
      return
    }
    if (total + newComponent.percentage > 100) {
      toast.error('Total would exceed 100%')
      return
    }

    try {
      const { data } = await gradingApi.create({
        course_id: selectedCourseId,
        term: activeTerm,
        component_name: newComponent.name,
        percentage: newComponent.percentage,
      })
      setCurrent([...current, mapApiComponent(data as ApiGradingComponent)])
      setNewComponent({ name: '', percentage: 0 })
      setShowAdd(false)
      toast.success('Component added')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to add component'))
    }
  }

  const removeComponent = async (index: number) => {
    const component = current[index]

    try {
      if (!component.id) {
        toast.error('Cannot remove a component that is not saved in the database.')
        return
      }
      await gradingApi.delete(component.id)
      setCurrent(current.filter((_, i) => i !== index))
      toast.success('Component removed')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to remove component'))
    }
  }

  const updateComponent = (index: number, field: 'name' | 'percentage', value: string | number) => {
    const updated = [...current]
    updated[index] = { ...updated[index], [field]: value }
    setCurrent(updated)
  }

  const handleSave = async () => {
    if (!selectedCourseId) {
      toast.error('Please select a course first')
      return
    }
    if (total !== 100) {
      toast.error(`Total must be 100% (currently ${total}%)`)
      return
    }

    try {
      await Promise.all(
        current.map((component) => {
          if (!component.id) {
            throw new Error('Cannot save a component that is not in the database.')
          }
          return gradingApi.update(component.id, {
            term: activeTerm,
            component_name: component.name,
            percentage: Number(component.percentage),
          })
        })
      )
      toast.success('Grading system saved')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to save grading system'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Grading System</h1>
          <p className="page-subtitle">
            {course.code && course.title
              ? `${course.code} - ${course.title} - Configure assessment components and percentages`
              : 'Select a course to configure assessment components and percentages'}
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={!selectedCourseId}>
          <Save className="w-4 h-4" /> Save Grading
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

      <div className="flex items-center gap-1 bg-academic-bg p-1 rounded-xl w-fit">
        {(['midterm', 'final'] as const).map((term) => (
          <button
            key={term}
            onClick={() => setActiveTerm(term)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTerm === term
                ? 'bg-white text-academic-primary shadow-sm'
                : 'text-academic-text-muted hover:text-academic-text'
            }`}
          >
            {term} Grade
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title capitalize">{activeTerm} Components</h2>
            <button onClick={() => setShowAdd(true)} className="btn-accent text-xs" disabled={!selectedCourseId}>
              <Plus className="w-3.5 h-3.5" /> Add Component
            </button>
          </div>

          <div className="space-y-3">
            {current.map((component, index) => (
              <div key={component.id || index} className="flex items-center gap-4 p-4 rounded-xl bg-academic-bg border border-academic-border group">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 text-academic-primary" />
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={component.name} onChange={(e) => updateComponent(index, 'name', e.target.value)} className="input-field text-sm" placeholder="Component name" />
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} max={100} value={component.percentage} onChange={(e) => updateComponent(index, 'percentage', Number(e.target.value))} className="input-field w-24 text-sm" />
                    <span className="text-sm text-academic-text-muted font-medium">%</span>
                  </div>
                </div>
                <button onClick={() => removeComponent(index)} className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-academic-border flex items-center justify-between">
            <span className="text-sm font-medium text-academic-text">Total</span>
            <span className={`text-lg font-bold ${total === 100 ? 'text-emerald-600' : 'text-red-500'}`}>{total}%</span>
          </div>
          {total !== 100 && <p className="text-xs text-red-500 mt-1 text-right">Total must equal exactly 100%</p>}
        </div>

        <div className="card">
          <h2 className="section-title mb-5">Distribution</h2>
          <div className="space-y-3">
            {current.map((component, index) => {
              const colors = ['bg-academic-primary', 'bg-academic-accent', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500']
              const color = colors[index % colors.length]
              return (
                <div key={component.id || index}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-academic-text font-medium">{component.name}</span>
                    <span className="text-academic-text-muted">{component.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-academic-bg overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${component.percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-academic-bg border border-academic-border">
            <div className="flex items-center gap-3">
              <PieChart className="w-5 h-5 text-academic-accent" />
              <div>
                <p className="text-sm font-semibold text-academic-text">{total === 100 ? 'Balanced Distribution' : 'Unbalanced Distribution'}</p>
                <p className="text-xs text-academic-text-muted">
                  {total === 100 ? 'Your grading system is properly configured.' : `Adjust components to reach 100% (currently ${total}%).`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-academic-primary">Add Component</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-academic-bg">
                <X className="w-4 h-4 text-academic-text-muted" />
              </button>
            </div>
            <div>
              <label className="label">Component Name</label>
              <input type="text" value={newComponent.name} onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })} className="input-field" placeholder="e.g. Midterm Examination" />
            </div>
            <div>
              <label className="label">Percentage (%)</label>
              <input type="number" min={1} max={100} value={newComponent.percentage} onChange={(e) => setNewComponent({ ...newComponent, percentage: Number(e.target.value) })} className="input-field" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowAdd(false)} className="btn-ghost">Cancel</button>
              <button onClick={addComponent} className="btn-primary">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
