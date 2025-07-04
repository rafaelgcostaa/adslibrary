import React, { useState } from 'react'
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
  Globe
} from 'lucide-react'
import toast from 'react-hot-toast'

const AdsSearch = () => {
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

  // Mock data for demonstration
  const mockResults = [
    {
      id: '1',
      headline: '🔥 Transforme Seu Corpo em 30 Dias',
      description: 'Método revolucionário que já ajudou +10mil pessoas a perder peso de forma saudável. Clique e descubra o segredo!',
      advertiser: 'FitnessPro',
      niche: 'Fitness & Saúde',
      scalabilityScore: 8.5,
      activeAds: 247,
      imageUrl: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
      landingUrl: 'https://example.com/fitness',
      whatsappUrl: 'https://wa.me/5511999999999',
      platforms: ['Facebook', 'Instagram'],
      impressions: '100K - 500K',
      reach: '50K - 200K'
    },
    {
      id: '2',
      headline: '💰 Ganhe R$ 3000 Trabalhando Online',
      description: 'Método comprovado para gerar renda extra trabalhando apenas 2h por dia. Mais de 5000 alunos já transformaram suas vidas!',
      advertiser: 'RendaOnline',
      niche: 'Educação Online',
      scalabilityScore: 7.8,
      activeAds: 156,
      imageUrl: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=400',
      landingUrl: 'https://example.com/renda',
      whatsappUrl: null,
      platforms: ['Facebook', 'Instagram', 'Audience Network'],
      impressions: '50K - 200K',
      reach: '30K - 100K'
    },
    {
      id: '3',
      headline: '✨ Pele Perfeita em 7 Dias',
      description: 'Descubra o routine de skincare que celebridades usam. Resultados visíveis em uma semana ou seu dinheiro de volta!',
      advertiser: 'BeautySecrets',
      niche: 'Beleza & Cosméticos',
      scalabilityScore: 9.2,
      activeAds: 389,
      imageUrl: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400',
      landingUrl: 'https://example.com/beauty',
      whatsappUrl: 'https://wa.me/5511888888888',
      platforms: ['Instagram', 'Facebook'],
      impressions: '200K - 1M',
      reach: '150K - 500K'
    }
  ]

  const handleSearch = async () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
      toast.success(`${mockResults.length} anúncios encontrados!`)
    }, 1500)
  }

  const handleFavorite = (adId) => {
    toast.success('Anúncio adicionado aos favoritos!')
  }

  const handleDownload = (ad) => {
    toast.success('Download iniciado!')
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-500'
    if (score >= 6) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBackground = (score) => {
    if (score >= 8) return 'bg-green-50 dark:bg-green-900/20'
    if (score >= 6) return 'bg-yellow-50 dark:bg-yellow-900/20'
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
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Buscando...' : 'Buscar'}
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
                      src={ad.imageUrl}
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
                          Por {ad.advertiser} • {ad.niche}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(ad.scalabilityScore)}`}>
                        <TrendingUp className={`inline h-4 w-4 mr-1 ${getScoreColor(ad.scalabilityScore)}`} />
                        <span className={getScoreColor(ad.scalabilityScore)}>
                          {ad.scalabilityScore}/10
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
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.activeAds}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Impressões</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.impressions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Alcance</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.reach}</p>
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
                          onClick={() => handleFavorite(ad.id)}
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
                        {ad.whatsappUrl && (
                          <a
                            href={ad.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">WhatsApp</span>
                          </a>
                        )}
                        <a
                          href={ad.landingUrl}
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