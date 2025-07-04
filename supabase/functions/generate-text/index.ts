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
    const { productInfo, textType } = await req.json()
    
    // Simular tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Templates de copy baseados no produto
    const headlines = [
      `🔥 ${productInfo.name} - ${productInfo.mainBenefit || 'Transforme Sua Vida'}!`,
      `💰 Descubra Como ${productInfo.name} Pode Mudar Tudo`,
      `⚡ URGENTE: ${productInfo.name} com Desconto Especial`,
      `🎯 ${productInfo.name} - Método Aprovado por Especialistas`,
      `✨ ${productInfo.name} - Resultados em Tempo Recorde`
    ]
    
    const descriptions = [
      `Você está cansado de tentar métodos que não funcionam?

🎯 ATENÇÃO: ${productInfo.name} é a solução que você estava procurando!

💡 INTERESSE: ${productInfo.description || 'Nossa abordagem única combina ciência e praticidade para resultados reais.'}

❤️ DESEJO: Imagine-se ${productInfo.mainBenefit || 'vivendo a vida dos seus sonhos'}, com mais confiança, energia e sucesso. Nossos clientes relatam transformações incríveis!

⚡ AÇÃO: Não perca esta oportunidade única! Clique agora e comece sua transformação hoje mesmo!`,
      
      `PARE TUDO! 🛑

Se você está lendo isso, é porque chegou a hora de mudar sua vida com ${productInfo.name}.

✅ Mais de 10.000 pessoas já transformaram suas vidas
✅ Método comprovado e testado
✅ Resultados em tempo recorde
✅ Garantia de satisfação

${productInfo.targetAudience ? `Especialmente desenvolvido para ${productInfo.targetAudience}.` : ''}

💥 OFERTA LIMITADA: ${productInfo.price || 'Preço especial'} apenas hoje!

👆 CLIQUE AGORA E GARANTE SUA VAGA!`
    ]
    
    const ctas = [
      '🚀 QUERO TRANSFORMAR MINHA VIDA AGORA!',
      '💰 GARANTIR MINHA VAGA COM DESCONTO!',
      '⚡ COMEÇAR MINHA TRANSFORMAÇÃO HOJE!',
      '🎯 QUERO ACESSO IMEDIATO!',
      '✨ SIM, EU QUERO MUDAR MINHA VIDA!'
    ]
    
    const scarcityElements = [
      '⏰ ÚLTIMAS 24 HORAS - Oferta Especial!',
      '🔥 APENAS 50 VAGAS RESTANTES!',
      '⚡ PROMOÇÃO RELÂMPAGO - SÓ HOJE!',
      '🎯 ÚLTIMAS UNIDADES DISPONÍVEIS!',
      '💥 OFERTA EXPIRA EM BREVE!'
    ]
    
    const socialProof = [
      '⭐ Mais de 10.000 clientes satisfeitos',
      '🏆 Método aprovado por especialistas',
      '💬 "Mudou minha vida completamente!" - Maria S.',
      '🎖️ Certificado de qualidade internacional',
      '📈 98% de aprovação dos clientes'
    ]
    
    const randomHeadline = headlines[Math.floor(Math.random() * headlines.length)]
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]
    const randomCta = ctas[Math.floor(Math.random() * ctas.length)]
    
    const generatedText = {
      headline: randomHeadline,
      description: randomDescription,
      cta: randomCta,
      variations: {
        scarcity: scarcityElements.slice(0, 3),
        social_proof: socialProof.slice(0, 3)
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        generated_text: generatedText,
        credits_used: 3.00,
        generation_id: 'txt_' + Math.random().toString(36).substr(2, 9)
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