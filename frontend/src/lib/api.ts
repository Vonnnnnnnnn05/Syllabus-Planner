import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('syllabus_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('syllabus_token')
      localStorage.removeItem('syllabus_auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
}

export const courseApi = {
  list: (params?: Record<string, string>) => api.get('/courses', { params }),
  get: (id: string) => api.get(`/courses/${id}`),
  create: (data: Record<string, unknown>) => api.post('/courses', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
}

export const cloApi = {
  list: (courseId?: string) => api.get('/clos', { params: courseId ? { course_id: courseId } : undefined }),
  create: (data: Record<string, unknown>) => api.post('/clos', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/clos/${id}`, data),
  delete: (id: string) => api.delete(`/clos/${id}`),
}

export const weeklyPlanApi = {
  list: (courseId?: string) => api.get('/weekly-plans', { params: courseId ? { course_id: courseId } : undefined }),
  create: (data: Record<string, unknown>) => api.post('/weekly-plans', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/weekly-plans/${id}`, data),
  delete: (id: string) => api.delete(`/weekly-plans/${id}`),
}

export const gradingApi = {
  list: (courseId?: string, term?: string) =>
    api.get('/grading-systems', { params: { ...(courseId ? { course_id: courseId } : {}), ...(term ? { term } : {}) } }),
  create: (data: Record<string, unknown>) => api.post('/grading-systems', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/grading-systems/${id}`, data),
  delete: (id: string) => api.delete(`/grading-systems/${id}`),
}

export const syllabusApi = {
  list: (status?: string) => api.get('/syllabi', { params: status && status !== 'All' ? { status } : undefined }),
  create: (data: Record<string, unknown>) => api.post('/syllabi', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/syllabi/${id}`, data),
}

export const departmentApi = {
  list: () => api.get('/departments'),
}

export const userApi = {
  list: () => api.get('/users'),
  create: (data: Record<string, unknown>) => api.post('/users', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}
