import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { searchQuery, filters } = await req.json()
    
    // Simular busca na API do Facebook Ads Library
    const mockResults = [
      {
        id: 'fb_ad_' + Math.random().toString(36).substr(2, 9),
        advertiser_name: 'FitnessPro Brasil',
        headline: '🔥 Perca 10kg em 30 Dias - Método Aprovado',
        description: 'Transforme seu corpo com nosso método revolucionário. Mais de 50.000 pessoas já conseguiram resultados incríveis!',
        image_url: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
        landing_url: 'https://example.com/fitness-pro',
        whatsapp_url: 'https://wa.me/5511999999999',
        platforms: ['Facebook', 'Instagram'],
        niche: 'Fitness & Saúde',
        impressions_range: '100K - 500K',
        reach_range: '50K - 200K',
        active_ads_count: Math.floor(Math.random() * 500) + 50,
        scalability_score: (Math.random() * 3 + 7).toFixed(1)
      },
      {
        id: 'fb_ad_' + Math.random().toString(36).substr(2, 9),
        advertiser_name: 'Renda Online Academy',
        headline: '💰 R$ 5000/mês Trabalhando de Casa',
        description: 'Descubra como milhares de pessoas estão ganhando dinheiro online. Método passo a passo para iniciantes.',
        image_url: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=400',
        landing_url: 'https://example.com/renda-online',
        whatsapp_url: null,
        platforms: ['Facebook', 'Instagram', 'Audience Network'],
        niche: 'Educação Online',
        impressions_range: '200K - 1M',
        reach_range: '100K - 500K',
        active_ads_count: Math.floor(Math.random() * 300) + 100,
        scalability_score: (Math.random() * 2 + 8).toFixed(1)
      },
      {
        id: 'fb_ad_' + Math.random().toString(36).substr(2, 9),
        advertiser_name: 'Beauty Secrets',
        headline: '✨ Pele de Porcelana em 7 Dias',
        description: 'O segredo das coreanas para uma pele perfeita. Skincare que realmente funciona!',
        image_url: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400',
        landing_url: 'https://example.com/beauty-secrets',
        whatsapp_url: 'https://wa.me/5511888888888',
        platforms: ['Instagram', 'Facebook'],
        niche: 'Beleza & Cosméticos',
        impressions_range: '150K - 750K',
        reach_range: '75K - 300K',
        active_ads_count: Math.floor(Math.random() * 400) + 150,
        scalability_score: (Math.random() * 2.5 + 7.5).toFixed(1)
      }
    ]

    // Filtrar resultados baseado na query
    const filteredResults = mockResults.filter(ad => 
      ad.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.niche.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return new Response(
      JSON.stringify({
        success: true,
        results: filteredResults,
        total: filteredResults.length,
        credits_used: 2.50
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})