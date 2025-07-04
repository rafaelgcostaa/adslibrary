import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout/Layout'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import AdsSearch from './pages/AdsSearch'
import CreativeGenerator from './pages/CreativeGenerator'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/auth" replace />
}

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ads/search" element={<AdsSearch />} />
                <Route path="/niches" element={<div>Nichos em desenvolvimento...</div>} />
                <Route path="/favorites" element={<div>Favoritos em desenvolvimento...</div>} />
                <Route path="/ideas" element={<div>Gerador de Ideias em desenvolvimento...</div>} />
                <Route path="/creatives/images" element={<CreativeGenerator />} />
                <Route path="/creatives/texts" element={<CreativeGenerator />} />
                <Route path="/reports" element={<div>Relatórios em desenvolvimento...</div>} />
                <Route path="/team" element={<div>Gerenciamento de Equipe em desenvolvimento...</div>} />
                <Route path="/settings" element={<div>Configurações em desenvolvimento...</div>} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
                className: 'dark:bg-gray-800 dark:text-white',
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App