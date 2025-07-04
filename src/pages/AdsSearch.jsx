import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Heart, 
  Download, 
  ExternalLink, 
  MessageCircle,
  TrendingUp,
  Eye,
  Calendar,
  Globe,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { searchAds, consumeCredits, saveBusca, toggleFavorite } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const AdsSearch = () => {
  const { profile, refreshProfile } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    country: 'BR',
    platform: 'all',
    dateRange: '30',
    adType: 'all',
    status: 'active'
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Digite uma palavra-chave para buscar')
      return
    }

    // Verificar créditos
    if (profile?.credits_balance < 2.50) {
      toast.error('Créditos insuficientes. Adicione mais créditos para continuar.')
      return
    }

    setLoading(true)
    
    try {
      // Buscar anúncios
      const data = await searchAds(searchQuery, filters)
      
      if (data.success) {
        setResults(data.results)
        
        // Consumir créditos
        await consumeCredits(2.50, 'search', `Busca por: ${searchQuery}`)
        
        // Salvar no histórico
        await saveBusca(searchQuery, filters, data.results)
        
        // Atualizar perfil
        await refreshProfile()
        
        toast.success(`${data.results.length} anúncios encontrados!`)
      } else {
        throw new Error('Erro na busca')
      }
    } catch (error) {
      console.error('Erro na busca:', error)
      toast.error('Erro ao buscar anúncios. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async (ad) => {
    try {
      const result = await toggleFavorite(ad.id)
      
      if (result.action === 'added') {
        toast.success('Anúncio adicionado aos favoritos!')
      } else {
        toast.success('Anúncio removido dos favoritos!')
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error)
      toast.error('Erro ao gerenciar favorito')
    }
  }

  const handleDownload = (ad) => {
    // Simular download
    const dataStr = JSON.stringify(ad, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `anuncio_${ad.advertiser_name}_${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('Download iniciado!')
  }

  const getScoreColor = (score) => {
    const numScore = parseFloat(score)
    if (numScore >= 8) return 'text-green-500'
    if (numScore >= 6) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBackground = (score) => {
    const numScore = parseFloat(score)
    if (numScore >= 8) return 'bg-green-50 dark:bg-green-900/20'
    if (numScore >= 6) return 'bg-yellow-50 dark:bg-yellow-900/20'
    return 'bg-red-50 dark:bg-red-900/20'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Buscar Anúncios
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Explore milhares de anúncios do Facebook e identifique oportunidades de negócio
        </p>
      </motion.div>

      {/* Credits Warning */}
      {profile?.credits_balance < 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Créditos baixos
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Você tem apenas R$ {profile?.credits_balance?.toFixed(2)} em créditos. 
                Cada busca custa R$ 2,50. Considere adicionar mais créditos.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Digite palavras-chave, produto ou nicho..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim() || profile?.credits_balance < 2.50}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Buscando...' : 'Buscar (R$ 2,50)'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  País
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="BR">Brasil</option>
                  <option value="US">Estados Unidos</option>
                  <option value="ALL">Todos os países</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plataforma
                </label>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Todas</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="audience_network">Audience Network</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Período
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Anúncio
                </label>
                <select
                  value={filters.adType}
                  onChange={(e) => setFilters(prev => ({ ...prev, adType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Todos</option>
                  <option value="image">Imagem</option>
                  <option value="video">Vídeo</option>
                  <option value="carousel">Carrossel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="active">Ativos</option>
                  <option value="inactive">Inativos</option>
                  <option value="all">Todos</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Ad Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    <img
                      src={ad.image_url}
                      alt="Ad creative"
                      className="w-full h-48 lg:h-32 object-cover rounded-lg"
                    />
                  </div>

                  {/* Ad Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          {ad.headline}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Por {ad.advertiser_name} • {ad.niche}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(ad.scalability_score)}`}>
                        <TrendingUp className={`inline h-4 w-4 mr-1 ${getScoreColor(ad.scalability_score)}`} />
                        <span className={getScoreColor(ad.scalability_score)}>
                          {ad.scalability_score}/10
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {ad.description}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Anúncios Ativos</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.active_ads_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Impressões</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.impressions_range}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Alcance</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.reach_range}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Plataformas</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {ad.platforms.join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleFavorite(ad)}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">Favoritar</span>
                        </button>
                        <button
                          onClick={() => handleDownload(ad)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-sm">Download</span>
                        </button>
                      </div>

                      <div className="flex space-x-2">
                        {ad.whatsapp_url && (
                          <a
                            href={ad.whatsapp_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">WhatsApp</span>
                          </a>
                        )}
                        <a
                          href={ad.landing_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="text-sm">Ver Anúncio</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Faça uma busca para descobrir anúncios incríveis e oportunidades de negócio
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default AdsSearch