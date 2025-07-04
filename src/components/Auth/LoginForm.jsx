import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

const LoginForm = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      return
    }
    
    setLoading(true)
    
    try {
      const { error } = await signIn(formData.email, formData.password)
      // Error handling is done in the signIn function
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleDemoLogin = async (email, password) => {
    setFormData({ email, password })
    setLoading(true)
    
    try {
      await signIn(email, password)
    } catch (error) {
      console.error('Demo login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Entre na sua conta
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Acesse sua plataforma de análise de anúncios
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Não tem uma conta?{' '}
            <button
              onClick={onToggleMode}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Criar conta
            </button>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Contas de Demonstração:
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleDemoLogin('admin@demo.com', 'demo123')}
              disabled={loading}
              className="w-full text-left p-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            >
              <strong>Admin:</strong> admin@demo.com / demo123
            </button>
            <button
              onClick={() => handleDemoLogin('user@demo.com', 'demo123')}
              disabled={loading}
              className="w-full text-left p-2 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            >
              <strong>Usuário:</strong> user@demo.com / demo123
            </button>
          </div>
        </div>

        {/* Configuration Notice */}
        {(!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co') && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ Configure o Supabase para usar a autenticação real. 
              <br />
              <span className="text-xs">Clique em "Connect to Supabase" no topo da página.</span>
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default LoginForm