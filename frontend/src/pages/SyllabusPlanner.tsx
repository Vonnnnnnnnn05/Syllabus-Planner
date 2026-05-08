import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Target,
  ListChecks,
  ClipboardList,
  Save,
  ArrowRight,
} from 'lucide-react'
import { courseApi, weeklyPlanApi } from '../lib/api'
import toast from 'react-hot-toast'

interface WeeklyPlan {
  week: number
  title: string
  learningOutcomes: string[]
  topics: string[]
  teachingActivities: string[]
  assessmentMethods: string[]
  relatedCLO: string[]
}

type EditableWeeklyPlan = WeeklyPlan & { id?: string }

interface ApiCourse {
  id?: number | string
  course_code: string
  course_title: string
  semester: string
  academic_year: string
  department?: { department_name: string } | null
}

interface ApiWeeklyPlan {
  id: number | string
  week_number: number
  title: string
  learning_outcomes?: string[]
  topics?: string[]
  teaching_learning_activities?: string[]
  assessment_methods?: string[]
  related_clo?: string[]
}

const createBlankWeeks = (): EditableWeeklyPlan[] =>
  Array.from({ length: 16 }, (_, index) => ({
    week: index + 1,
    title: `Week ${index + 1}`,
    learningOutcomes: [],
    topics: [],
    teachingActivities: [],
    assessmentMethods: [],
    relatedCLO: [],
  }))

export default function SyllabusPlanner() {
  const { courseId } = useParams()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || '')
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [course, setCourse] = useState({
    code: '',
    title: '',
    semester: '',
    academicYear: '',
    department: '',
  })
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [plans, setPlans] = useState<EditableWeeklyPlan[]>(createBlankWeeks())
  const [activeTab, setActiveTab] = useState<'content' | 'outcomes' | 'activities' | 'assessment'>('content')

  const currentPlan = plans.find((p) => p.week === selectedWeek) || plans[0]

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

  const mapApiPlan = (plan: ApiWeeklyPlan): EditableWeeklyPlan => ({
    id: String(plan.id),
    week: plan.week_number,
    title: plan.title,
    learningOutcomes: plan.learning_outcomes || [],
    topics: plan.topics || [],
    teachingActivities: plan.teaching_learning_activities || [],
    assessmentMethods: plan.assessment_methods || [],
    relatedCLO: plan.related_clo || [],
  })

  useEffect(() => {
    let isMounted = true

    const loadPlanner = async () => {
      if (!selectedCourseId) {
        setCourse({ code: '', title: '', semester: '', academicYear: '', department: '' })
        setPlans(createBlankWeeks())
        return
      }

      try {
        const [courseResponse, weeklyPlansResponse] = await Promise.all([
          courseApi.get(selectedCourseId),
          weeklyPlanApi.list(selectedCourseId),
        ])

        if (!isMounted) return

        const apiCourse = courseResponse.data as ApiCourse
        const apiPlans = weeklyPlansResponse.data as ApiWeeklyPlan[]
        setCourse({
          code: apiCourse.course_code,
          title: apiCourse.course_title,
          semester: apiCourse.semester,
          academicYear: apiCourse.academic_year,
          department: apiCourse.department?.department_name || '',
        })
        setPlans(apiPlans.length > 0 ? apiPlans.map(mapApiPlan) : createBlankWeeks())
      } catch (error) {
        if (isMounted) {
          setPlans(createBlankWeeks())
          toast.error(getErrorMessage(error, 'Weekly plans could not be loaded from the database.'))
        }
      }
    }

    loadPlanner()

    return () => {
      isMounted = false
    }
  }, [selectedCourseId])

  const updatePlan = (field: keyof WeeklyPlan, value: string | string[]) => {
    setPlans((prev) =>
      prev.map((p) => (p.week === selectedWeek ? { ...p, [field]: value } : p))
    )
  }

  const addItem = (field: 'topics' | 'learningOutcomes' | 'teachingActivities' | 'assessmentMethods') => {
    updatePlan(field, [...currentPlan[field], ''])
  }

  const updateItem = (
    field: 'topics' | 'learningOutcomes' | 'teachingActivities' | 'assessmentMethods',
    index: number,
    value: string
  ) => {
    const updated = [...currentPlan[field]]
    updated[index] = value
    updatePlan(field, updated)
  }

  const removeItem = (
    field: 'topics' | 'learningOutcomes' | 'teachingActivities' | 'assessmentMethods',
    index: number
  ) => {
    const updated = currentPlan[field].filter((_, i) => i !== index)
    updatePlan(field, updated)
  }

  const buildPayload = (plan: EditableWeeklyPlan) => ({
    course_id: selectedCourseId,
    week_number: plan.week,
    title: plan.title,
    learning_outcomes: plan.learningOutcomes,
    topics: plan.topics,
    teaching_learning_activities: plan.teachingActivities,
    assessment_methods: plan.assessmentMethods,
    related_clo: plan.relatedCLO,
  })

  const handleSave = async () => {
    if (!selectedCourseId) {
      toast.error('Please select a course first')
      return
    }

    try {
      if (currentPlan.id) {
        const { data } = await weeklyPlanApi.update(currentPlan.id, buildPayload(currentPlan))
        const updatedPlan = mapApiPlan(data as ApiWeeklyPlan)
        setPlans((prev) => prev.map((plan) => (plan.week === selectedWeek ? updatedPlan : plan)))
      } else {
        const { data } = await weeklyPlanApi.create(buildPayload(currentPlan))
        const createdPlan = mapApiPlan(data as ApiWeeklyPlan)
        setPlans((prev) => prev.map((plan) => (plan.week === selectedWeek ? createdPlan : plan)))
      }
      toast.success(`Week ${selectedWeek} saved successfully`)
    } catch (error) {
      toast.error(getErrorMessage(error, `Unable to save week ${selectedWeek}`))
    }
  }

  const tabs = [
    { key: 'content', label: 'Content', icon: BookOpen },
    { key: 'outcomes', label: 'Learning Outcomes', icon: Target },
    { key: 'activities', label: 'Activities', icon: ListChecks },
    { key: 'assessment', label: 'Assessment', icon: ClipboardList },
  ] as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link to="/courses" className="text-xs text-academic-text-muted hover:text-academic-primary transition-colors">
              Courses
            </Link>
            <ArrowRight className="w-3 h-3 text-academic-text-muted" />
            <span className="text-xs text-academic-text-muted">Syllabus Planner</span>
          </div>
          <h1 className="page-header">
            {course.code && course.title ? `${course.code} - ${course.title}` : 'Syllabus Planner'}
          </h1>
          <p className="page-subtitle">
            {course.code
              ? `${course.semester} - ${course.academicYear} - ${course.department}`
              : 'Select a course to plan weekly syllabus content.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="btn-primary" disabled={!selectedCourseId}>
            <Save className="w-4 h-4" /> Save Week
          </button>
        </div>
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
      {/* Week Selector */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedWeek((w) => Math.max(1, w - 1))}
            disabled={selectedWeek === 1}
            className="p-1.5 rounded-lg border border-academic-border hover:bg-academic-bg disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {plans.map((plan) => (
              <button
                key={plan.week}
                onClick={() => setSelectedWeek(plan.week)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  plan.week === selectedWeek
                    ? 'bg-academic-primary text-white shadow-sm'
                    : plan.week < selectedWeek
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-academic-bg text-academic-text-muted border border-academic-border hover:bg-academic-surface-alt'
                }`}
              >
                W{plan.week}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSelectedWeek((w) => Math.min(plans.length, w + 1))}
            disabled={selectedWeek === plans.length}
            className="p-1.5 rounded-lg border border-academic-border hover:bg-academic-bg disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 px-1">
          <p className="text-sm font-semibold text-academic-primary">
            Week {selectedWeek}: {currentPlan.title}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-academic-bg p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-academic-primary shadow-sm'
                : 'text-academic-text-muted hover:text-academic-text'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'content' && (
          <div className="space-y-4">
            <div>
              <label className="label">Week Title</label>
              <input
                type="text"
                value={currentPlan.title}
                onChange={(e) => updatePlan('title', e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label">Topics Covered</label>
                <button
                  onClick={() => addItem('topics')}
                  className="text-xs font-medium text-academic-accent hover:text-academic-accent-dark"
                >
                  + Add Topic
                </button>
              </div>
              <div className="space-y-2">
                {currentPlan.topics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-academic-primary/10 flex items-center justify-center text-xs font-bold text-academic-primary shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => updateItem('topics', i, e.target.value)}
                      className="input-field flex-1"
                      placeholder="Enter topic..."
                    />
                    <button
                      onClick={() => removeItem('topics', i)}
                      className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'outcomes' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label">Intended Learning Outcomes</label>
                <button
                  onClick={() => addItem('learningOutcomes')}
                  className="text-xs font-medium text-academic-accent hover:text-academic-accent-dark"
                >
                  + Add Outcome
                </button>
              </div>
              <div className="space-y-2">
                {currentPlan.learningOutcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-academic-accent/10 flex items-center justify-center text-xs font-bold text-academic-accent shrink-0 mt-1">
                      {i + 1}
                    </span>
                    <textarea
                      value={outcome}
                      onChange={(e) => updateItem('learningOutcomes', i, e.target.value)}
                      className="input-field flex-1 min-h-[60px] resize-none"
                      placeholder="Students will be able to..."
                    />
                    <button
                      onClick={() => removeItem('learningOutcomes', i)}
                      className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-academic-border">
              <label className="label">Related CLOs</label>
              <div className="flex flex-wrap gap-2">
                {['CLO1', 'CLO2', 'CLO3', 'CLO4', 'CLO5'].map((clo) => (
                  <button
                    key={clo}
                    onClick={() => {
                      const has = currentPlan.relatedCLO.includes(clo)
                      updatePlan(
                        'relatedCLO',
                        has ? currentPlan.relatedCLO.filter((c) => c !== clo) : [...currentPlan.relatedCLO, clo]
                      )
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      currentPlan.relatedCLO.includes(clo)
                        ? 'bg-academic-primary text-white border-academic-primary'
                        : 'bg-white text-academic-text-muted border-academic-border hover:border-academic-primary/30'
                    }`}
                  >
                    {clo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label">Teaching & Learning Activities</label>
                <button
                  onClick={() => addItem('teachingActivities')}
                  className="text-xs font-medium text-academic-accent hover:text-academic-accent-dark"
                >
                  + Add Activity
                </button>
              </div>
              <div className="space-y-2">
                {currentPlan.teachingActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0 mt-1">
                      {i + 1}
                    </span>
                    <textarea
                      value={activity}
                      onChange={(e) => updateItem('teachingActivities', i, e.target.value)}
                      className="input-field flex-1 min-h-[60px] resize-none"
                      placeholder="Describe activity..."
                    />
                    <button
                      onClick={() => removeItem('teachingActivities', i)}
                      className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label">Assessment Methods</label>
                <button
                  onClick={() => addItem('assessmentMethods')}
                  className="text-xs font-medium text-academic-accent hover:text-academic-accent-dark"
                >
                  + Add Method
                </button>
              </div>
              <div className="space-y-2">
                {currentPlan.assessmentMethods.map((method, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0 mt-1">
                      {i + 1}
                    </span>
                    <textarea
                      value={method}
                      onChange={(e) => updateItem('assessmentMethods', i, e.target.value)}
                      className="input-field flex-1 min-h-[60px] resize-none"
                      placeholder="Describe assessment method..."
                    />
                    <button
                      onClick={() => removeItem('assessmentMethods', i)}
                      className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

