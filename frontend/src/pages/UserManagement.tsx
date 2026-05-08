import { useState } from 'react'
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Shield,
  X,
  Save,
  Trash2,
} from 'lucide-react'
import { demoUsers, departments, roles } from '../data/demo-data'
import type { User } from '../data/demo-data'
import toast from 'react-hot-toast'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(demoUsers)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [form, setForm] = useState<Partial<User>>({
    fullName: '',
    email: '',
    role: 'Teacher',
    department: departments[0],
    status: 'Active',
  })

  const filtered = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'All' || u.role === filterRole
    return matchSearch && matchRole
  })

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Admin: 'badge-info',
      Teacher: 'badge-success',
      'Department Head': 'badge-warning',
      'Program Chair': 'badge-warning',
      Dean: 'badge-danger',
      Coordinator: 'badge-neutral',
    }
    return colors[role] || 'badge-neutral'
  }

  const openAdd = () => {
    setEditingUser(null)
    setForm({
      fullName: '',
      email: '',
      role: 'Teacher',
      department: departments[0],
      status: 'Active',
    })
    setShowModal(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setForm({ ...user })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.email) {
      toast.error('Full name and email are required')
      return
    }
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? { ...u, ...(form as User) } : u))
      )
      toast.success('User updated')
    } else {
      const newUser: User = {
        ...(form as User),
        id: `u${Date.now()}`,
        avatar: form.fullName?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'U',
      }
      setUsers((prev) => [...prev, newUser])
      toast.success('User created')
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('User removed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">User Management</h1>
          <p className="page-subtitle">Manage faculty, staff, and administrators across departments.</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" /> New User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
            placeholder="Search by name or email..."
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-academic-text-muted" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="input-field pl-9 pr-8 appearance-none cursor-pointer"
          >
            <option value="All">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-academic-bg border-b border-academic-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Department</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-academic-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-border">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-academic-bg/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-academic-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-academic-text">{user.fullName}</p>
                        <p className="text-xs text-academic-text-muted flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge text-[10px] ${getRoleBadge(user.role)}`}>{user.role}</span>
                  </td>
                  <td className="px-5 py-4 text-academic-text-muted">{user.department}</td>
                  <td className="px-5 py-4">
                    <span className={`badge text-[10px] ${user.status === 'Active' ? 'badge-success' : 'badge-neutral'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 rounded-md hover:bg-academic-bg text-academic-text-muted hover:text-academic-accent transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-academic-text-muted mx-auto mb-3" />
            <p className="text-sm text-academic-text-muted">No users found.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-elevated w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-academic-border">
              <h2 className="text-lg font-semibold text-academic-primary">
                {editingUser ? 'Edit User' : 'New User'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-academic-bg">
                <X className="w-4 h-4 text-academic-text-muted" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
                    className="input-field appearance-none cursor-pointer"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="input-field appearance-none cursor-pointer"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Save className="w-4 h-4" />
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
