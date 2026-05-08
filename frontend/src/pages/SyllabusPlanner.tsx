import { useState } from 'react'
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
import { demoCourses } from '../data/demo-data'
import { ipt2Syllabus, type WeeklyPlan } from '../data/ipt2-syllabus'
import toast from 'react-hot-toast'

export default function SyllabusPlanner() {
  const { courseId } = useParams()
  const course = demoCourses.find((c) => c.id === courseId) || demoCourses[0]
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [plans, setPlans] = useState<WeeklyPlan[]>(ipt2Syllabus.weeklyPlans)
  const [activeTab, setActiveTab] = useState<'content' | 'outcomes' | 'activities' | 'assessment'>('content')

  const currentPlan = plans.find((p) => p.week === selectedWeek) || plans[0]

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

  const handleSave = () => {
    toast.success(`Week ${selectedWeek} saved successfully`)
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
          <h1 className="page-header">{course.code} — {course.title}</h1>
          <p className="page-subtitle">{course.semester} · {course.academicYear} · {course.department}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4" /> Save Week
          </button>
        </div>
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
