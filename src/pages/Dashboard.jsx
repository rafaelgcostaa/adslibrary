import React from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  TrendingUp, 
  Image, 
  FileText, 
  Heart,
  BarChart3,
  ArrowUpRight,
  Users,
  CreditCard
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { profile } = useAuth()

  const stats = [
    {
      icon: Search,
      label: 'Buscas Realizadas',
      value: '247',
      change: '+12%',
      color: 'blue'
    },
    {
      icon: Heart,
      label: 'Anúncios Favoritos',
      value: '89',
      change: '+8%',
      color: 'red'
    },
    {
      icon: Image,
      label: 'Criativos Gerados',
      value: '156',
      change: '+23%',
      color: 'green'
    },
    {
      icon: BarChart3,
      label: 'Nichos Analisados',
      value: '34',
      change: '+5%',
      color: 'purple'
    }
  ]

  const recentActivity = [
    {
      action: 'Busca realizada',
      target: 'Nicho: Fitness',
      time: '2 min atrás',
      status: 'success'
    },
    {
      action: 'Criativo gerado',
      target: 'Imagem para campanha',
      time: '15 min atrás',
      status: 'success'
    },
    {
      action: 'Anúncio favoritado',
      target: 'Produto de beleza',
      time: '1h atrás',
      status: 'info'
    },
    {
      action: 'Relatório exportado',
      target: 'Análise semanal',
      time: '2h atrás',
      status: 'success'
    }
  ]

  const topNiches = [
    { name: 'Fitness & Saúde', ads: 1247, growth: '+15%' },
    { name: 'E-commerce', ads: 892, growth: '+8%' },
    { name: 'Educação Online', ads: 634, growth: '+22%' },
    { name: 'Tecnologia', ads: 543, growth: '+12%' },
    { name: 'Beleza', ads: 456, growth: '+18%' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bem-vindo de volta! Aqui está um resumo da sua atividade.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Atividade Recente
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'info' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.target}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Credits Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Saldo de Créditos</p>
                <p className="text-2xl font-bold">
                  R$ {profile?.credits_balance?.toFixed(2) || '0,00'}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-200" />
            </div>
            <button className="w-full mt-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 rounded-lg font-medium transition-all">
              Adicionar Créditos
            </button>
          </div>

          {/* Plan Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Seu Plano
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium capitalize">
                {profile?.subscription_plan || 'free'}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Aproveite ao máximo todas as funcionalidades
            </p>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all">
              Fazer Upgrade
            </button>
          </div>
        </motion.div>
      </div>

      {/* Top Niches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Nichos em Destaque
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topNiches.map((niche, index) => (
              <div key={niche.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {niche.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {niche.ads} anúncios ativos
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500 font-medium">
                    {niche.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard