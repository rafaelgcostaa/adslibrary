import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  CreditCard,
  User
} from 'lucide-react'
import { motion } from 'framer-motion'

const Header = () => {
  const { user, profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Search className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Facebook Ads Analyzer
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Credits Display */}
          {profile && (
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <CreditCard className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                R$ {profile.credits_balance?.toFixed(2) || '0,00'}
              </span>
              <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                Adicionar
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {profile?.subscription_plan || 'free'}
                </p>
              </div>
            </div>

            <button
              onClick={signOut}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header