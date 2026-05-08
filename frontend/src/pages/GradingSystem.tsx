import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Scale,
  Plus,
  X,
  Save,
  Trash2,
  PieChart,
} from 'lucide-react'
import { demoCourses } from '../data/demo-data'
import { ipt2Syllabus } from '../data/ipt2-syllabus'
import toast from 'react-hot-toast'

export default function GradingSystem() {
  const { courseId } = useParams()
  const course = demoCourses.find((c) => c.id === courseId) || demoCourses[0]
  const [midterm, setMidterm] = useState(ipt2Syllabus.midtermGrading)
  const [final, setFinal] = useState(ipt2Syllabus.finalGrading)
  const [activeTerm, setActiveTerm] = useState<'midterm' | 'final'>('midterm')
  const [showAdd, setShowAdd] = useState(false)
  const [newComponent, setNewComponent] = useState({ name: '', percentage: 0 })

  const current = activeTerm === 'midterm' ? midterm : final
  const setCurrent = activeTerm === 'midterm' ? setMidterm : setFinal
  const total = current.reduce((sum, c) => sum + c.percentage, 0)

  const addComponent = () => {
    if (!newComponent.name || newComponent.percentage <= 0) {
      toast.error('Name and percentage are required')
      return
    }
    if (total + newComponent.percentage > 100) {
      toast.error('Total would exceed 100%')
      return
    }
    setCurrent([...current, { ...newComponent }])
    setNewComponent({ name: '', percentage: 0 })
    setShowAdd(false)
    toast.success('Component added')
  }

  const removeComponent = (index: number) => {
    setCurrent(current.filter((_, i) => i !== index))
    toast.success('Component removed')
  }

  const updateComponent = (index: number, field: 'name' | 'percentage', value: string | number) => {
    const updated = [...current]
    updated[index] = { ...updated[index], [field]: value }
    setCurrent(updated)
  }

  const handleSave = () => {
    if (total !== 100) {
      toast.error(`Total must be 100% (currently ${total}%)`)
      return
    }
    toast.success('Grading system saved')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">Grading System</h1>
          <p className="page-subtitle">
            {course.code} — {course.title} · Configure assessment components and percentages
          </p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Save className="w-4 h-4" /> Save Grading
        </button>
      </div>

      {/* Term Toggle */}
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
        {/* Components List */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title capitalize">{activeTerm} Components</h2>
            <button onClick={() => setShowAdd(true)} className="btn-accent text-xs">
              <Plus className="w-3.5 h-3.5" /> Add Component
            </button>
          </div>

          <div className="space-y-3">
            {current.map((component, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-academic-bg border border-academic-border group"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 text-academic-primary" />
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={component.name}
                    onChange={(e) => updateComponent(index, 'name', e.target.value)}
                    className="input-field text-sm"
                    placeholder="Component name"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={component.percentage}
                      onChange={(e) => updateComponent(index, 'percentage', Number(e.target.value))}
                      className="input-field w-24 text-sm"
                    />
                    <span className="text-sm text-academic-text-muted font-medium">%</span>
                  </div>
                </div>
                <button
                  onClick={() => removeComponent(index)}
                  className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-5 pt-4 border-t border-academic-border flex items-center justify-between">
            <span className="text-sm font-medium text-academic-text">Total</span>
            <span
              className={`text-lg font-bold ${
                total === 100 ? 'text-emerald-600' : 'text-red-500'
              }`}
            >
              {total}%
            </span>
          </div>
          {total !== 100 && (
            <p className="text-xs text-red-500 mt-1 text-right">
              Total must equal exactly 100%
            </p>
          )}
        </div>

        {/* Visual Breakdown */}
        <div className="card">
          <h2 className="section-title mb-5">Distribution</h2>
          <div className="space-y-3">
            {current.map((component, index) => {
              const colors = [
                'bg-academic-primary',
                'bg-academic-accent',
                'bg-blue-500',
                'bg-emerald-500',
                'bg-violet-500',
                'bg-amber-500',
              ]
              const color = colors[index % colors.length]
              return (
                <div key={index}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-academic-text font-medium">{component.name}</span>
                    <span className="text-academic-text-muted">{component.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-academic-bg overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${component.percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-academic-bg border border-academic-border">
            <div className="flex items-center gap-3">
              <PieChart className="w-5 h-5 text-academic-accent" />
              <div>
                <p className="text-sm font-semibold text-academic-text">
                  {total === 100 ? 'Balanced Distribution' : 'Unbalanced Distribution'}
                </p>
                <p className="text-xs text-academic-text-muted">
                  {total === 100
                    ? 'Your grading system is properly configured.'
                    : `Adjust components to reach 100% (currently ${total}%).`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Component Modal */}
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
              <input
                type="text"
                value={newComponent.name}
                onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                className="input-field"
                placeholder="e.g. Midterm Examination"
              />
            </div>
            <div>
              <label className="label">Percentage (%)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={newComponent.percentage}
                onChange={(e) => setNewComponent({ ...newComponent, percentage: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowAdd(false)} className="btn-ghost">
                Cancel
              </button>
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
