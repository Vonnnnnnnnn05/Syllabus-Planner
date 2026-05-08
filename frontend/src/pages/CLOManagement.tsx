import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Plus,
  X,
  Save,
  Trash2,
  Link2,
} from 'lucide-react'
import { demoCourses } from '../data/demo-data'
import { ipt2Syllabus, type CLO } from '../data/ipt2-syllabus'
import toast from 'react-hot-toast'

const programOutcomes = [
  { code: 'a', label: 'Knowledge', desc: 'Apply knowledge of computing and mathematics' },
  { code: 'b', label: 'Problem Solving', desc: 'Analyze and identify computing problems' },
  { code: 'c', label: 'Design', desc: 'Design, implement and evaluate solutions' },
  { code: 'd', label: 'Teamwork', desc: 'Function effectively on teams' },
  { code: 'e', label: 'Ethics', desc: 'Understand professional, ethical, and social responsibilities' },
  { code: 'f', label: 'Communication', desc: 'Communicate effectively with a range of audiences' },
  { code: 'g', label: 'Lifelong Learning', desc: 'Engage in continuous professional development' },
]

export default function CLOManagement() {
  const { courseId } = useParams()
  const course = demoCourses.find((c) => c.id === courseId) || demoCourses[0]
  const [clos, setClos] = useState<CLO[]>(ipt2Syllabus.clos)
  const [showAdd, setShowAdd] = useState(false)
  const [newCLO, setNewCLO] = useState<Partial<CLO>>({ code: '', description: '', programOutcomes: [] })

  const togglePO = (poCode: string) => {
    setNewCLO((prev) => ({
      ...prev,
      programOutcomes: prev.programOutcomes?.includes(poCode)
        ? prev.programOutcomes.filter((c) => c !== poCode)
        : [...(prev.programOutcomes || []), poCode],
    }))
  }

  const addCLO = () => {
    if (!newCLO.code || !newCLO.description) {
      toast.error('Code and description are required')
      return
    }
    setClos((prev) => [
      ...prev,
      {
        id: `clo${Date.now()}`,
        code: newCLO.code || '',
        description: newCLO.description || '',
        programOutcomes: newCLO.programOutcomes || [],
      },
    ])
    setNewCLO({ code: '', description: '', programOutcomes: [] })
    setShowAdd(false)
    toast.success('CLO added')
  }

  const removeCLO = (id: string) => {
    if (confirm('Remove this CLO?')) {
      setClos((prev) => prev.filter((c) => c.id !== id))
      toast.success('CLO removed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Course Learning Outcomes</h1>
          <p className="page-subtitle">
            {course.code} — {course.title} · Map CLOs to Program Outcomes
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add CLO
        </button>
      </div>

      {/* CLO Cards */}
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
                        <span
                          key={po}
                          className="px-2 py-1 rounded-md bg-academic-accent/10 text-academic-accent-dark text-xs font-semibold"
                        >
                          PO-{po.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeCLO(clo.id)}
                    className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mapping Matrix */}
      <div className="card">
        <h2 className="section-title mb-5">CLO–Program Outcome Mapping Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-academic-bg">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted sticky left-0 bg-academic-bg">
                  CLO
                </th>
                {programOutcomes.map((po) => (
                  <th
                    key={po.code}
                    className="text-center px-3 py-3 text-xs font-semibold uppercase tracking-wider text-academic-text-muted min-w-[60px]"
                  >
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
                  <td className="px-4 py-3 text-sm font-medium text-academic-text sticky left-0 bg-white">
                    {clo.code}
                  </td>
                  {programOutcomes.map((po) => {
                    const mapped = clo.programOutcomes.includes(po.code)
                    return (
                      <td key={po.code} className="px-3 py-3 text-center">
                        {mapped ? (
                          <div className="w-6 h-6 rounded-md bg-academic-accent/15 flex items-center justify-center mx-auto">
                            <span className="text-xs font-bold text-academic-accent-dark">✓</span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-md bg-academic-bg flex items-center justify-center mx-auto">
                            <span className="text-xs text-academic-text-muted">—</span>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add CLO Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-academic-border">
              <h2 className="text-lg font-semibold text-academic-primary">Add New CLO</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-academic-bg">
                <X className="w-4 h-4 text-academic-text-muted" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">CLO Code</label>
                <input
                  type="text"
                  value={newCLO.code}
                  onChange={(e) => setNewCLO({ ...newCLO, code: e.target.value })}
                  className="input-field"
                  placeholder="e.g. CLO6"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={newCLO.description}
                  onChange={(e) => setNewCLO({ ...newCLO, description: e.target.value })}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="At the end of the course, a student can..."
                />
              </div>
              <div>
                <label className="label">Map to Program Outcomes</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {programOutcomes.map((po) => (
                    <button
                      key={po.code}
                      onClick={() => togglePO(po.code)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                        newCLO.programOutcomes?.includes(po.code)
                          ? 'bg-academic-primary text-white border-academic-primary'
                          : 'bg-white text-academic-text-muted border-academic-border hover:border-academic-primary/30'
                      }`}
                    >
                      <span className="font-bold">{po.code.toUpperCase()}</span> · {po.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="btn-ghost">
                  Cancel
                </button>
                <button onClick={addCLO} className="btn-primary">
                  <Save className="w-4 h-4" /> Add CLO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
