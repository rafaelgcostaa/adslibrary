import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from '../components/Auth/LoginForm'
import RegisterForm from '../components/Auth/RegisterForm'
import { motion } from 'framer-motion'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Marketing Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Desvende os{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                segredos
              </span>{' '}
              dos anúncios de sucesso
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Analise milhares de anúncios do Facebook, identifique nichos lucrativos e gere criativos de alta conversão com inteligência artificial.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Acesso à biblioteca completa de anúncios do Facebook
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  IA para identificar nichos mais escaláveis
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700 dark:text-gray-300">
                  Gerador de criativos otimizados para conversão
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage