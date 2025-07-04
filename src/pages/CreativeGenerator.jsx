import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Image, 
  FileText, 
  Wand2, 
  Download, 
  Copy, 
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { generateImage, generateText, consumeCredits, saveCreative } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const CreativeGenerator = () => {
  const { profile, refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('image')
  const [loading, setLoading] = useState(false)
  
  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageSettings, setImageSettings] = useState({
    style: 'photographic',
    aspect: '1:1',
    quality: 'high'
  })
  const [generatedImage, setGeneratedImage] = useState(null)

  // Text generation state
  const [productInfo, setProductInfo] = useState({
    name: '',
    description: '',
    targetAudience: '',
    mainBenefit: '',
    price: ''
  })
  const [textType, setTextType] = useState('complete')
  const [generatedText, setGeneratedText] = useState(null)

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Digite um prompt para gerar a imagem')
      return
    }

    // Verificar créditos
    if (profile?.credits_balance < 5.00) {
      toast.error('Créditos insuficientes. Você precisa de R$ 5,00 para gerar uma imagem.')
      return
    }

    setLoading(true)
    
    try {
      // Gerar imagem
      const data = await generateImage(imagePrompt, imageSettings)
      
      if (data.success) {
        setGeneratedImage({
          url: data.image_url,
          prompt: imagePrompt,
          timestamp: new Date().toISOString(),
          generation_id: data.generation_id
        })
        
        // Consumir créditos
        await consumeCredits(5.00, 'image_generation', `Geração de imagem: ${imagePrompt}`)
        
        // Salvar criativo
        await saveCreative('image', imagePrompt, null, data.image_url, imageSettings, 5.00)
        
        // Atualizar perfil
        await refreshProfile()
        
        toast.success('Imagem gerada com sucesso!')
      } else {
        throw new Error('Erro na geração da imagem')
      }
    } catch (error) {
      console.error('Erro na geração:', error)
      toast.error('Erro ao gerar imagem. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleTextGeneration = async () => {
    if (!productInfo.name.trim()) {
      toast.error('Digite pelo menos o nome do produto')
      return
    }

    // Verificar créditos
    if (profile?.credits_balance < 3.00) {
      toast.error('Créditos insuficientes. Você precisa de R$ 3,00 para gerar texto.')
      return
    }

    setLoading(true)
    
    try {
      // Gerar texto
      const data = await generateText(productInfo, textType)
      
      if (data.success) {
        setGeneratedText(data.generated_text)
        
        // Consumir créditos
        await consumeCredits(3.00, 'text_generation', `Geração de copy: ${productInfo.name}`)
        
        // Salvar criativo
        const fullText = `${data.generated_text.headline}\n\n${data.generated_text.description}\n\n${data.generated_text.cta}`
        await saveCreative('text', JSON.stringify(productInfo), fullText, null, { textType }, 3.00)
        
        // Atualizar perfil
        await refreshProfile()
        
        toast.success('Texto gerado com sucesso!')
      } else {
        throw new Error('Erro na geração do texto')
      }
    } catch (error) {
      console.error('Erro na geração:', error)
      toast.error('Erro ao gerar texto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Texto copiado para a área de transferência!')
  }

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage.url
      link.download = `imagem_gerada_${Date.now()}.jpg`
      link.click()
      toast.success('Download iniciado!')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gerador de Criativos
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Crie imagens e textos otimizados para suas campanhas com inteligência artificial
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
                Geração de imagem: R$ 5,00 | Geração de texto: R$ 3,00
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('image')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'image'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Image className="h-5 w-5 inline mr-2" />
              Gerador de Imagens (R$ 5,00)
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'text'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="h-5 w-5 inline mr-2" />
              Gerador de Textos (R$ 3,00)
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'image' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Image Generation Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descreva a imagem que você quer criar
                    </label>
                    <textarea
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: Uma pessoa feliz segurando um produto, estilo fotográfico profissional, iluminação natural, fundo neutro..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Estilo
                      </label>
                      <select
                        value={imageSettings.style}
                        onChange={(e) => setImageSettings(prev => ({ ...prev, style: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="photographic">Fotográfico</option>
                        <option value="illustration">Ilustração</option>
                        <option value="minimalist">Minimalista</option>
                        <option value="modern">Moderno</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Proporção
                      </label>
                      <select
                        value={imageSettings.aspect}
                        onChange={(e) => setImageSettings(prev => ({ ...prev, aspect: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="1:1">Quadrado (1:1)</option>
                        <option value="16:9">Paisagem (16:9)</option>
                        <option value="9:16">Retrato (9:16)</option>
                        <option value="4:3">Clássico (4:3)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Qualidade
                      </label>
                      <select
                        value={imageSettings.quality}
                        onChange={(e) => setImageSettings(prev => ({ ...prev, quality: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="standard">Padrão</option>
                        <option value="high">Alta</option>
                        <option value="ultra">Ultra</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleImageGeneration}
                    disabled={loading || !imagePrompt.trim() || profile?.credits_balance < 5.00}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Gerando imagem...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5 mr-2" />
                        Gerar Imagem (R$ 5,00)
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Image */}
                <div className="flex items-center justify-center">
                  {generatedImage ? (
                    <div className="space-y-4">
                      <img
                        src={generatedImage.url}
                        alt="Generated"
                        className="w-full max-w-md rounded-lg shadow-lg"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={downloadImage}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </button>
                        <button
                          onClick={handleImageGeneration}
                          disabled={loading || profile?.credits_balance < 5.00}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Image className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Sua imagem gerada aparecerá aqui</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'text' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Text Generation Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do Produto/Serviço
                    </label>
                    <input
                      type="text"
                      value={productInfo.name}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: Curso de Marketing Digital"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição do Produto
                    </label>
                    <textarea
                      value={productInfo.description}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Descreva brevemente o que seu produto faz..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Público-Alvo
                    </label>
                    <input
                      type="text"
                      value={productInfo.targetAudience}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: Empreendedores iniciantes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Principal Benefício
                    </label>
                    <input
                      type="text"
                      value={productInfo.mainBenefit}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, mainBenefit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Ex: Aumentar vendas em 300%"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preço (opcional)
                      </label>
                      <input
                        type="text"
                        value={productInfo.price}
                        onChange={(e) => setProductInfo(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Ex: R$ 497"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo de Copy
                      </label>
                      <select
                        value={textType}
                        onChange={(e) => setTextType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      >
                        <option value="complete">Copy Completa</option>
                        <option value="headline">Apenas Headline</option>
                        <option value="description">Apenas Descrição</option>
                        <option value="cta">Apenas CTA</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleTextGeneration}
                    disabled={loading || !productInfo.name.trim() || profile?.credits_balance < 3.00}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                        Gerando texto...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Gerar Copy AIDA (R$ 3,00)
                      </>
                    )}
                  </button>
                </div>

                {/* Generated Text */}
                <div className="space-y-4">
                  {generatedText ? (
                    <div className="space-y-6">
                      {/* Headline */}
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                            📢 HEADLINE
                          </h4>
                          <button
                            onClick={() => copyToClipboard(generatedText.headline)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-blue-800 dark:text-blue-200 font-medium">
                          {generatedText.headline}
                        </p>
                      </div>

                      {/* Description */}
                      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-900 dark:text-green-300">
                            📝 DESCRIÇÃO
                          </h4>
                          <button
                            onClick={() => copyToClipboard(generatedText.description)}
                            className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-green-800 dark:text-green-200 whitespace-pre-line">
                          {generatedText.description}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-orange-900 dark:text-orange-300">
                            🚀 CALL TO ACTION
                          </h4>
                          <button
                            onClick={() => copyToClipboard(generatedText.cta)}
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-orange-800 dark:text-orange-200 font-medium">
                          {generatedText.cta}
                        </p>
                      </div>

                      {/* Variations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">
                            ⏰ ESCASSEZ
                          </h4>
                          <ul className="space-y-1">
                            {generatedText.variations.scarcity.map((item, index) => (
                              <li key={index} className="text-sm text-red-800 dark:text-red-200">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                            ⭐ PROVA SOCIAL
                          </h4>
                          <ul className="space-y-1">
                            {generatedText.variations.social_proof.map((item, index) => (
                              <li key={index} className="text-sm text-purple-800 dark:text-purple-200">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button
                        onClick={() => copyToClipboard(`${generatedText.headline}\n\n${generatedText.description}\n\n${generatedText.cta}`)}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center"
                      >
                        <Copy className="h-5 w-5 mr-2" />
                        Copiar Copy Completa
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
                      <div>
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>Sua copy gerada aparecerá aqui</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default CreativeGenerator