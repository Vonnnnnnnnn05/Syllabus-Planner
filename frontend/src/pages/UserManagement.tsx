import { useEffect, useMemo, useState } from 'react'
import {
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Edit3,
  X,
  Save,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { departmentApi, userApi } from '../lib/api'
import toast from 'react-hot-toast'

const roles = ['Admin', 'Teacher'] as const

interface User {
  id: string
  fullName: string
  email: string
  role: 'Admin' | 'Teacher'
  department: string
  avatar: string
  status: 'Active' | 'Inactive'
}

interface ApiDepartment {
  id: number
  department_name: string
  department_code?: string
}

interface ApiUser {
  id: number | string
  name?: string
  full_name?: string
  fullName?: string
  email: string
  role: User['role']
  department_id?: number | null
  department?: ApiDepartment | string | null
  avatar?: string | null
  status?: User['status']
}

type UserForm = Partial<User> & {
  password?: string
}

const getInitials = (name = '') => {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return initials || 'U'
}

export default function UserManagement() {
  const { user: authUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [departmentOptions, setDepartmentOptions] = useState<ApiDepartment[]>(
    []
  )
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [form, setForm] = useState<UserForm>({
    fullName: '',
    email: '',
    role: 'Teacher',
    department: '',
    status: 'Active',
    password: '',
  })

  const isAdmin = authUser?.role === 'Admin'

  const isCurrentUser = (user: User) =>
    String(user.id) === String(authUser?.id) ||
    user.email === authUser?.email ||
    user.fullName === authUser?.fullName

  const departmentByName = useMemo(
    () =>
      departmentOptions.reduce<Record<string, ApiDepartment>>((lookup, department) => {
        lookup[department.department_name] = department
        return lookup
      }, {}),
    [departmentOptions]
  )

  const mapApiUser = (user: ApiUser): User => {
    const fullName = user.fullName || user.full_name || user.name || user.email
    const departmentFromId = departmentOptions.find(
      (department) => department.id === user.department_id
    )?.department_name
    const department =
      typeof user.department === 'string'
        ? user.department
        : user.department?.department_name || departmentFromId || ''

    return {
      id: String(user.id),
      fullName,
      email: user.email,
      role: user.role,
      department,
      avatar: user.avatar || getInitials(fullName),
      status: user.status || 'Active',
    }
  }

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

  const buildPayload = (formData: UserForm, includePassword: boolean) => {
    const fullName = formData.fullName?.trim() || ''
    const department = formData.department ? departmentByName[formData.department] : undefined
    const payload: Record<string, unknown> = {
      name: fullName,
      full_name: fullName,
      email: formData.email?.trim(),
      role: formData.role,
      department_id: department?.id ?? null,
      avatar: formData.avatar || getInitials(fullName),
      status: formData.status || 'Active',
    }

    if (includePassword && formData.password) {
      payload.password = formData.password
    }

    return payload
  }

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const [usersResponse, departmentsResponse] = await Promise.all([
          userApi.list(),
          departmentApi.list(),
        ])

        if (!isMounted) return

        const loadedDepartments = departmentsResponse.data as ApiDepartment[]
        if (loadedDepartments.length > 0) {
          setDepartmentOptions(loadedDepartments)
        }

        setUsers((usersResponse.data as ApiUser[]).map(mapApiUser))
      } catch (error) {
        if (isMounted) {
          setUsers([])
          toast.error(getErrorMessage(error, 'Users could not be loaded from the database.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  const visibleUsers = isAdmin ? users : users.filter(isCurrentUser)

  const filtered = visibleUsers.filter((u) => {
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
    }
    return colors[role] || 'badge-neutral'
  }

  const openAdd = () => {
    setEditingUser(null)
    setForm({
      fullName: '',
      email: '',
      role: 'Teacher',
      department: departmentOptions[0]?.department_name || '',
      status: 'Active',
      password: '',
    })
    setShowModal(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setForm({ ...user, password: '' })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.email) {
      toast.error('Full name and email are required')
      return
    }
    if (!editingUser && !form.password) {
      toast.error('Password is required for new users')
      return
    }
    setIsSaving(true)
    if (editingUser) {
      try {
        const { data } = await userApi.update(editingUser.id, buildPayload(form, !!form.password))
        const updatedUser = mapApiUser(data as ApiUser)
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updatedUser : u)))
        toast.success('User updated')
        setShowModal(false)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Unable to update user'))
      } finally {
        setIsSaving(false)
      }
    } else {
      try {
        const { data } = await userApi.create(buildPayload(form, true))
        setUsers((prev) => [mapApiUser(data as ApiUser), ...prev])
        toast.success('User created')
        setShowModal(false)
      } catch (error) {
        toast.error(getErrorMessage(error, 'Unable to create user'))
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await userApi.delete(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success('User removed')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to delete user'))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-header">{isAdmin ? 'User Management' : 'My Account'}</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Manage Admin and Teacher accounts.'
              : 'View your own account and reset your password anytime.'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" /> New User
          </button>
        )}
      </div>

      {isAdmin && (
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
      )}

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
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
            <p className="text-sm text-academic-text-muted">
              {isLoading ? 'Loading users...' : 'No users found.'}
            </p>
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
                    disabled={!isAdmin}
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
                    disabled={!isAdmin}
                  >
                    {departmentOptions.map((d) => (
                      <option key={d.id} value={d.department_name}>
                        {d.department_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {editingUser && (
                <div>
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              )}
              {!editingUser && (
                <div>
                  <label className="label">Temporary Password</label>
                  <input
                    type="password"
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              )}
              <div>
                <label className="label">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as User['status'] })}
                  className="input-field appearance-none cursor-pointer"
                  disabled={!isAdmin}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSaving}>
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
