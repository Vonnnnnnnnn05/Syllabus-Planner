import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import SyllabusPlanner from './pages/SyllabusPlanner'
import CLOManagement from './pages/CLOManagement'
import GradingSystem from './pages/GradingSystem'
import AICompanion from './pages/AICompanion'
import ApprovalWorkflow from './pages/ApprovalWorkflow'
import UserManagement from './pages/UserManagement'
import SyllabusView from './pages/SyllabusView'

function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />
}

function LoginRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : <Login />
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/syllabus-planner/:courseId?" element={<SyllabusPlanner />} />
          <Route path="/clos/:courseId?" element={<CLOManagement />} />
          <Route path="/grading/:courseId?" element={<GradingSystem />} />
          <Route path="/ai-companion" element={<AICompanion />} />
          <Route path="/approvals" element={<ApprovalWorkflow />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/syllabus-view/:courseId" element={<SyllabusView />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
