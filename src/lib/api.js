import { supabase } from './supabase'

// Configuração das APIs
const API_CONFIG = {
  facebook: {
    enabled: !!import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN,
    baseUrl: 'https://graph.facebook.com/v18.0'
  },
  piapi: {
    enabled: !!import.meta.env.VITE_PIAPI_API_KEY,
    baseUrl: 'https://api.piapi.ai'
  },
  openai: {
    enabled: !!import.meta.env.VITE_OPENAI_API_KEY,
    baseUrl: 'https://api.openai.com/v1'
  }
}

// Função para buscar anúncios (Facebook Ads Library ou simulação)
export const searchAds = async (searchQuery, filters = {}) => {
  try {
    // Se a API do Facebook estiver configurada, usar a real
    if (API_CONFIG.facebook.enabled) {
      // Implementar chamada real para Facebook Ads Library
      const response = await fetch(`${API_CONFIG.facebook.baseUrl}/ads_archive`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN}`
        }
      })
      
      if (!response.ok) throw new Error('Erro na API do Facebook')
      return await response.json()
    }
    
    // Caso contrário, usar simulação via Edge Function
    const { data, error } = await supabase.functions.invoke('facebook-ads-search', {
      body: { searchQuery, filters }
    })
    
    if (error) throw error
    return data
    
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error)
    throw error
  }
}

// Função para gerar imagens (PIAPI ou simulação)
export const generateImage = async (prompt, settings = {}) => {
  try {
    // Se a API do PIAPI estiver configurada, usar a real
    if (API_CONFIG.piapi.enabled) {
      const response = await fetch(`${API_CONFIG.piapi.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PIAPI_API_KEY}`
        },
        body: JSON.stringify({ prompt, ...settings })
      })
      
      if (!response.ok) throw new Error('Erro na API do PIAPI')
      return await response.json()
    }
    
    // Caso contrário, usar simulação via Edge Function
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt, settings }
    })
    
    if (error) throw error
    return data
    
  } catch (error) {
    console.error('Erro ao gerar imagem:', error)
    throw error
  }
}

// Função para gerar textos (OpenAI ou simulação)
export const generateText = async (productInfo, textType = 'complete') => {
  try {
    // Se a API do OpenAI estiver configurada, usar a real
    if (API_CONFIG.openai.enabled) {
      const response = await fetch(`${API_CONFIG.openai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em copywriting e marketing digital. Crie copies persuasivas usando a estrutura AIDA.'
            },
            {
              role: 'user',
              content: `Crie uma copy para: ${JSON.stringify(productInfo)}`
            }
          ]
        })
      })
      
      if (!response.ok) throw new Error('Erro na API do OpenAI')
      return await response.json()
    }
    
    // Caso contrário, usar simulação via Edge Function
    const { data, error } = await supabase.functions.invoke('generate-text', {
      body: { productInfo, textType }
    })
    
    if (error) throw error
    return data
    
  } catch (error) {
    console.error('Erro ao gerar texto:', error)
    throw error
  }
}

// Função para consumir créditos
export const consumeCredits = async (amount, actionType, description) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    const { error } = await supabase.rpc('update_user_credits', {
      user_uuid: user.id,
      amount: amount,
      transaction_type: 'consumption',
      description: description,
      action_type: actionType
    })
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Erro ao consumir créditos:', error)
    throw error
  }
}

// Função para salvar busca no histórico
export const saveBusca = async (searchQuery, filters, results) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    const { error } = await supabase
      .from('user_searches')
      .insert({
        user_id: user.id,
        search_query: searchQuery,
        filters: filters,
        results_count: results.length,
        credits_used: 2.50
      })
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar busca:', error)
    throw error
  }
}

// Função para salvar criativo gerado
export const saveCreative = async (type, prompt, content, imageUrl, settings, creditsUsed) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    const { error } = await supabase
      .from('generated_creatives')
      .insert({
        user_id: user.id,
        creative_type: type,
        prompt: prompt,
        generated_content: content,
        image_url: imageUrl,
        settings: settings,
        credits_used: creditsUsed
      })
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Erro ao salvar criativo:', error)
    throw error
  }
}

// Função para adicionar/remover favoritos
export const toggleFavorite = async (adId, notes = '', tags = []) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('ad_id', adId)
      .single()
    
    if (existing) {
      // Remover favorito
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existing.id)
      
      if (error) throw error
      return { action: 'removed' }
    } else {
      // Adicionar favorito
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          ad_id: adId,
          notes: notes,
          tags: tags
        })
      
      if (error) throw error
      return { action: 'added' }
    }
  } catch (error) {
    console.error('Erro ao gerenciar favorito:', error)
    throw error
  }
}

// Função para obter estatísticas do dashboard
export const getDashboardStats = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    // Buscar estatísticas
    const [searches, favorites, creatives, transactions] = await Promise.all([
      supabase.from('user_searches').select('id').eq('user_id', user.id),
      supabase.from('user_favorites').select('id').eq('user_id', user.id),
      supabase.from('generated_creatives').select('id').eq('user_id', user.id),
      supabase.from('credit_transactions').select('amount, transaction_type').eq('user_id', user.id)
    ])
    
    const totalSpent = transactions.data
      ?.filter(t => t.transaction_type === 'consumption')
      ?.reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0
    
    return {
      searches: searches.data?.length || 0,
      favorites: favorites.data?.length || 0,
      creatives: creatives.data?.length || 0,
      totalSpent: totalSpent
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    throw error
  }
}

// Função para obter atividade recente
export const getRecentActivity = async (limit = 10) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    const { data, error } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    return data.map(transaction => ({
      action: getActionLabel(transaction.action_type),
      target: transaction.description,
      time: getTimeAgo(transaction.created_at),
      status: transaction.transaction_type === 'consumption' ? 'success' : 'info'
    }))
  } catch (error) {
    console.error('Erro ao obter atividade recente:', error)
    throw error
  }
}

// Funções auxiliares
const getActionLabel = (actionType) => {
  const labels = {
    search: 'Busca realizada',
    image_generation: 'Criativo gerado',
    text_generation: 'Texto gerado',
    favorite: 'Anúncio favoritado',
    purchase: 'Créditos adicionados',
    bonus: 'Bônus recebido'
  }
  return labels[actionType] || 'Ação realizada'
}

const getTimeAgo = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffInMinutes = Math.floor((now - past) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Agora mesmo'
  if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
  return `${Math.floor(diffInMinutes / 1440)} dias atrás`
}