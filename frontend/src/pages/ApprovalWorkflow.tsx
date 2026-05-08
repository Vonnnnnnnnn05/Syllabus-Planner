import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
  Clock,
  Filter,
} from 'lucide-react'
import { demoCourses, demoSyllabi } from '../data/demo-data'
import { formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

export default function ApprovalWorkflow() {
  const [filter, setFilter] = useState<'All' | 'Draft' | 'Under Review' | 'Revision Required' | 'Approved' | 'Published'>('All')
  const [selectedSyllabus, setSelectedSyllabus] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState('')
  const [syllabi, setSyllabi] = useState(demoSyllabi)

  const filtered = filter === 'All' ? syllabi : syllabi.filter((s) => s.status === filter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return 'badge-success'
      case 'Approved':
        return 'badge-success'
      case 'Under Review':
        return 'badge-warning'
      case 'Revision Required':
        return 'badge-danger'
      default:
        return 'badge-info'
    }
  }

  const handleApprove = (id: string) => {
    setSyllabi((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: 'Approved' as const, approvedBy: 'Elbren O. Antonio', notes: reviewNote || undefined }
          : s
      )
    )
    setSelectedSyllabus(null)
    setReviewNote('')
    toast.success('Syllabus approved')
  }

  const handleRequestRevision = (id: string) => {
    setSyllabi((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'Revision Required' as const, notes: reviewNote || undefined } : s
      )
    )
    setSelectedSyllabus(null)
    setReviewNote('')
    toast.success('Revision requested')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Approval Workflow</h1>
          <p className="page-subtitle">Review and approve syllabi submitted by faculty members.</p>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-text-muted" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="input-field pl-9 pr-8 appearance-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Under Review">Under Review</option>
            <option value="Revision Required">Revision Required</option>
            <option value="Approved">Approved</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-academic-bg border-b border-academic-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Course</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Submitted</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Reviewer</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-border">
              {filtered.map((syllabus) => {
                const course = demoCourses.find((c) => c.id === syllabus.courseId)
                return (
                  <tr key={syllabus.id} className="hover:bg-academic-bg/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-academic-primary/5 flex items-center justify-center shrink-0">
                          <ClipboardCheck className="w-4 h-4 text-academic-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-academic-text">
                            {course?.code} — {course?.title}
                          </p>
                          <p className="text-xs text-academic-text-muted">{course?.faculty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-academic-text-muted">
                      {syllabus.submittedAt ? (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(syllabus.submittedAt)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge text-[10px] ${getStatusBadge(syllabus.status)}`}>
                        {syllabus.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-academic-text-muted">
                      {syllabus.reviewedBy || 'Pending'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/syllabus-view/${course?.id}`}
                          className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-primary transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {syllabus.status === 'Under Review' && (
                          <button
                            onClick={() => setSelectedSyllabus(syllabus.id)}
                            className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-accent transition-colors"
                            title="Review"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm text-academic-text-muted">No syllabi in this status.</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedSyllabus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedSyllabus(null)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg">
            <div className="px-6 py-4 border-b border-academic-border">
              <h2 className="text-lg font-semibold text-academic-primary">Review Syllabus</h2>
              <p className="text-xs text-academic-text-muted mt-0.5">Provide feedback before approving or requesting revision.</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Review Notes</label>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="Enter your feedback or comments..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setSelectedSyllabus(null)} className="btn-ghost">
                  Cancel
                </button>
                <button
                  onClick={() => handleRequestRevision(selectedSyllabus)}
                  className="btn-ghost text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" /> Request Revision
                </button>
                <button
                  onClick={() => handleApprove(selectedSyllabus)}
                  className="btn-primary"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
