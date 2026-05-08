import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowRight,
  Plus,
  Save,
  Trash2,
  Edit3,
  X,
  ShieldCheck,
  ClipboardList,
} from 'lucide-react'
import { courseApi, requirementPolicyApi } from '../lib/api'
import toast from 'react-hot-toast'

interface ApiCourse {
  id: number | string
  course_code: string
  course_title: string
  semester: string
  academic_year: string
  department?: { department_name: string } | null
}

interface ApiPolicy {
  id: number | string
  course_id: number | string
  requirements: string
  policies: string
}

interface PolicyItem {
  id?: string
  requirements: string
  policies: string
}

export default function Policies() {
  const { courseId } = useParams()
  const [courses, setCourses] = useState<ApiCourse[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || '')
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [course, setCourse] = useState({ code: '', title: '', semester: '', academicYear: '', department: '' })
  const [policyItems, setPolicyItems] = useState<PolicyItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<PolicyItem | null>(null)
  const [form, setForm] = useState({ requirements: '', policies: '' })

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
          toast.error(getErrorMessage(error, 'Courses could not be loaded.'))
        }
      } finally {
        if (isMounted) setIsLoadingCourses(false)
      }
    }

    loadCourses()
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadPolicies = async () => {
      if (!selectedCourseId) {
        setCourse({ code: '', title: '', semester: '', academicYear: '', department: '' })
        setPolicyItems([])
        return
      }

      setIsLoading(true)
      try {
        const [courseResponse, policiesResponse] = await Promise.all([
          courseApi.get(selectedCourseId),
          requirementPolicyApi.list(selectedCourseId),
        ])

        if (!isMounted) return

        const apiCourse = courseResponse.data as ApiCourse
        setCourse({
          code: apiCourse.course_code,
          title: apiCourse.course_title,
          semester: apiCourse.semester,
          academicYear: apiCourse.academic_year,
          department: apiCourse.department?.department_name || '',
        })

        setPolicyItems(
          (policiesResponse.data as ApiPolicy[]).map((p) => ({
            id: String(p.id),
            requirements: p.requirements,
            policies: p.policies,
          }))
        )
      } catch (error) {
        if (isMounted) {
          setPolicyItems([])
          toast.error(getErrorMessage(error, 'Policies could not be loaded.'))
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPolicies()
    return () => { isMounted = false }
  }, [selectedCourseId])

  const openAdd = () => {
    setEditingPolicy(null)
    setForm({ requirements: '', policies: '' })
    setShowModal(true)
  }

  const openEdit = (policy: PolicyItem) => {
    setEditingPolicy(policy)
    setForm({ requirements: policy.requirements, policies: policy.policies })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.requirements.trim() || !form.policies.trim()) {
      toast.error('Both requirements and policies are required.')
      return
    }

    setIsSaving(true)
    try {
      if (editingPolicy?.id) {
        const { data } = await requirementPolicyApi.update(editingPolicy.id, {
          requirements: form.requirements,
          policies: form.policies,
        })
        const updated = data as ApiPolicy
        setPolicyItems((prev) =>
          prev.map((p) => (p.id === editingPolicy.id ? { id: String(updated.id), requirements: updated.requirements, policies: updated.policies } : p))
        )
        toast.success('Policy updated successfully')
      } else {
        const { data } = await requirementPolicyApi.create({
          course_id: selectedCourseId,
          requirements: form.requirements,
          policies: form.policies,
        })
        const created = data as ApiPolicy
        setPolicyItems((prev) => [
          ...prev,
          { id: String(created.id), requirements: created.requirements, policies: created.policies },
        ])
        toast.success('Policy added successfully')
      }
      setShowModal(false)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to save policy'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this policy entry?')) return

    try {
      await requirementPolicyApi.delete(id)
      setPolicyItems((prev) => prev.filter((p) => p.id !== id))
      toast.success('Policy deleted')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to delete policy'))
    }
  }

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
            <span className="text-xs text-academic-text-muted">Requirements & Policies</span>
          </div>
          <h1 className="page-header">
            {course.code && course.title ? `${course.code} - ${course.title}` : 'Requirements & Policies'}
          </h1>
          <p className="page-subtitle">
            {course.code
              ? `${course.semester} - ${course.academicYear} - ${course.department}`
              : 'Select a course to manage its requirements and policies.'}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" disabled={!selectedCourseId}>
          <Plus className="w-4 h-4" /> Add Policy
        </button>
      </div>

      {/* Course Selector */}
      <div className="card p-4">
        <label className="label">Course</label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="input-field appearance-none cursor-pointer"
          disabled={isLoadingCourses}
        >
          <option value="">{isLoadingCourses ? 'Loading courses...' : 'Select a course'}</option>
          {courses.map((c) => (
            <option key={String(c.id)} value={String(c.id)}>
              {c.course_code} - {c.course_title}
            </option>
          ))}
        </select>
      </div>

      {/* Policy Cards */}
      {isLoading ? (
        <div className="card text-center py-12">
          <p className="text-sm text-academic-text-muted">Loading policies...</p>
        </div>
      ) : policyItems.length === 0 ? (
        <div className="card text-center py-12">
          <ShieldCheck className="w-10 h-10 text-academic-text-muted mx-auto mb-3" />
          <p className="text-sm text-academic-text-muted">
            {selectedCourseId ? 'No policies found for this course. Click "Add Policy" to create one.' : 'Select a course above to get started.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {policyItems.map((policy, index) => (
            <div key={policy.id || index} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-academic-primary/5 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-academic-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-academic-text">Policy Entry #{index + 1}</h3>
                    <p className="text-xs text-academic-text-muted">{course.code} - {course.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(policy)}
                    className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-accent transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {policy.id && (
                    <button
                      onClick={() => handleDelete(policy.id!)}
                      className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-2">Requirements</p>
                  <ul className="space-y-2">
                    {policy.requirements.split('\n').filter(Boolean).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-academic-text">
                        <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-blue-600 shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-academic-text-muted mb-2">Policies</p>
                  <ul className="space-y-2">
                    {policy.policies.split('\n').filter(Boolean).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-academic-text">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-600 shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-academic-border">
              <h2 className="text-lg font-semibold text-academic-primary">
                {editingPolicy ? 'Edit Policy' : 'Add Policy'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-academic-bg">
                <X className="w-4 h-4 text-academic-text-muted" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Requirements</label>
                <p className="text-[11px] text-academic-text-muted mb-1.5">Enter each requirement on a new line.</p>
                <textarea
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  className="input-field min-h-[120px] resize-none"
                  placeholder={"Attendance of at least 80%\nSubmission of all projects\nCompletion of midterm and final exams"}
                  required
                />
              </div>
              <div>
                <label className="label">Policies</label>
                <p className="text-[11px] text-academic-text-muted mb-1.5">Enter each policy on a new line.</p>
                <textarea
                  value={form.policies}
                  onChange={(e) => setForm({ ...form, policies: e.target.value })}
                  className="input-field min-h-[120px] resize-none"
                  placeholder={"Late submissions receive 10% deduction per day\nNo make-up exams without valid excuse\nPlagiarism results in zero grade"}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : editingPolicy ? 'Save Changes' : 'Add Policy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
