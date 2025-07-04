import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CreditCard, User, Crown, Zap } from 'lucide-react'
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

  const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project.supabase.co'

  const demoAccounts = [
    {
      email: 'admin@demo.com',
      password: 'demo123',
      name: 'Admin',
      description: 'Acesso completo',
      credits: 'R$ 100',
      plan: 'Premium',
      icon: Crown,
      color: 'purple'
    },
    {
      email: 'user@demo.com',
      password: 'demo123',
      name: 'Usuário',
      description: 'Plano intermediário',
      credits: 'R$ 50',
      plan: 'Intermediário',
      icon: User,
      color: 'blue'
    },
    {
      email: 'premium@demo.com',
      password: 'demo123',
      name: 'Premium',
      description: 'Testes extensivos',
      credits: 'R$ 500',
      plan: 'Premium',
      icon: Zap,
      color: 'yellow'
    },
    {
      email: 'free@demo.com',
      password: 'demo123',
      name: 'Gratuito',
      description: 'Plano básico',
      credits: 'R$ 10',
      plan: 'Gratuito',
      icon: CreditCard,
      color: 'gray'
    }
  ]

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

        {/* Demo Accounts - Only show if Supabase is configured */}
        {isSupabaseConfigured && (
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-center mb-3">
              <Zap className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Contas de Demonstração
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account, index) => {
                const IconComponent = account.icon
                return (
                  <motion.button
                    key={account.email}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleDemoLogin(account.email, account.password)}
                    disabled={loading}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      account.color === 'purple' ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:hover:bg-purple-900/40' :
                      account.color === 'blue' ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/40' :
                      account.color === 'yellow' ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/40' :
                      'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <IconComponent className={`h-6 w-6 mb-2 ${
                        account.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        account.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        account.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`} />
                      <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                        {account.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {account.credits}
                      </div>
                      <div className={`text-xs font-medium mt-1 px-2 py-1 rounded-full ${
                        account.color === 'purple' ? 'bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-300' :
                        account.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300' :
                        account.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {account.plan}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  <p className="font-semibold mb-1">✨ Usuários criados automaticamente!</p>
                  <p>Cada conta tem créditos pré-carregados para testar todas as funcionalidades da plataforma.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Notice */}
        {!isSupabaseConfigured && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Configure o Supabase para usar a autenticação real.
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Clique em "Connect to Supabase" no topo da página.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default LoginForm