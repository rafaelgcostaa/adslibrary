import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Heart, 
  Image, 
  FileText, 
  BarChart3, 
  Users, 
  Settings,
  Lightbulb,
  TrendingUp
} from 'lucide-react'
import { motion } from 'framer-motion'

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Buscar Anúncios', path: '/ads/search' },
    { icon: TrendingUp, label: 'Nichos Trending', path: '/niches' },
    { icon: Heart, label: 'Favoritos', path: '/favorites' },
    { icon: Lightbulb, label: 'Gerador de Ideias', path: '/ideas' },
    { icon: Image, label: 'Gerador de Imagens', path: '/creatives/images' },
    { icon: FileText, label: 'Gerador de Textos', path: '/creatives/texts' },
    { icon: BarChart3, label: 'Relatórios', path: '/reports' },
    { icon: Users, label: 'Equipe', path: '/team' },
    { icon: Settings, label: 'Configurações', path: '/settings' }
  ]

  const containerVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  }

  return (
    <motion.aside 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen"
    >
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.div key={item.path} variants={itemVariants}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Upgrade Banner */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="m-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white"
      >
        <h3 className="font-semibold text-sm mb-2">Upgrade para Premium</h3>
        <p className="text-xs text-blue-100 mb-3">
          Tenha acesso ilimitado a todas as funcionalidades
        </p>
        <button className="w-full bg-white text-blue-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
          Fazer Upgrade
        </button>
      </motion.div>
    </motion.aside>
  )
}

export default Sidebar