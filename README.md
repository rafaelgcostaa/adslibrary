# Facebook Ads Analyzer - Plataforma SaaS

Uma plataforma SaaS completa para análise inteligente de anúncios do Facebook com IA, geração de criativos e insights de mercado.

## 🚀 Funcionalidades Principais

### 📊 Análise de Anúncios
- **Busca Avançada**: Acesso completo à Biblioteca de Anúncios do Facebook
- **Filtros Inteligentes**: Todos os filtros disponíveis na API oficial
- **IA de Análise**: Identificação automática de nichos escaláveis
- **Score de Escalabilidade**: Algoritmo proprietário para avaliar potencial

### 🎨 Geração de Criativos
- **Imagens com IA**: Integração com PIAPI.AI para geração de imagens
- **Copy Persuasiva**: Textos otimizados usando estrutura AIDA via OpenAI
- **Múltiplas Variações**: Geração de headlines, descrições e CTAs
- **Otimização para Conversão**: Elementos testados e aprovados

### 💳 Sistema de Pagamentos
- **Múltiplos Planos**: Gratuito, Intermediário e Premium
- **Sistema de Créditos**: Flexibilidade no uso das ferramentas
- **Integração Stripe**: Pagamentos seguros e recorrentes
- **Relatórios Detalhados**: Acompanhamento de uso e ROI

## 🛠️ Configuração Rápida

### 1. Conectar ao Supabase
1. Clique em **"Connect to Supabase"** no topo da aplicação
2. Isso configurará automaticamente seu projeto Supabase

### 2. Usuários de Demonstração (Criados Automaticamente!)

A migração cria automaticamente os seguintes usuários de teste:

| Usuário | Email | Senha | Créditos | Plano | Descrição |
|---------|-------|-------|----------|-------|-----------|
| **Admin** | `admin@demo.com` | `demo123` | R$ 100 | Premium | Acesso completo para testes administrativos |
| **Usuário** | `user@demo.com` | `demo123` | R$ 50 | Intermediário | Usuário padrão com funcionalidades médias |
| **Premium** | `premium@demo.com` | `demo123` | R$ 500 | Premium | Para testes extensivos de todas as funcionalidades |
| **Gratuito** | `free@demo.com` | `demo123` | R$ 10 | Gratuito | Para testar limitações do plano básico |

### 3. Funcionalidades por Plano

#### 🆓 Plano Gratuito
- R$ 10 em créditos iniciais
- Buscas limitadas (5 por dia)
- Geração básica de criativos
- Acesso por 3 dias

#### 💼 Plano Intermediário
- R$ 50 em créditos mensais
- Buscas expandidas (50 por dia)
- Geração avançada de criativos
- Relatórios básicos

#### 👑 Plano Premium
- R$ 500 em créditos mensais
- Buscas ilimitadas
- Todas as funcionalidades de IA
- Gerenciamento de equipe
- Relatórios avançados
- Suporte prioritário

## 🎯 Como Usar

### Fazer Login
1. Acesse a página de login
2. Use uma das contas demo ou crie sua própria conta
3. Explore as funcionalidades com os créditos pré-carregados

### Buscar Anúncios
1. Vá para **"Buscar Anúncios"**
2. Use filtros para refinar sua busca
3. Analise os resultados com scores de IA
4. Salve anúncios interessantes nos favoritos

### Gerar Criativos
1. Acesse **"Gerador de Criativos"**
2. Escolha entre geração de imagens ou textos
3. Configure os parâmetros desejados
4. Baixe ou copie os resultados

### Acompanhar Uso
1. Visualize seu saldo de créditos no header
2. Acesse relatórios detalhados no dashboard
3. Monitore seu histórico de atividades

## 🔧 Configuração Avançada (Opcional)

Para funcionalidades completas, configure estas variáveis no arquivo `.env`:

```env
# Facebook Ads Library API
VITE_FACEBOOK_APP_ID=your_facebook_app_id
VITE_FACEBOOK_ACCESS_TOKEN=your_facebook_access_token

# PIAPI.AI (Geração de Imagens)
VITE_PIAPI_API_KEY=your_piapi_api_key

# OpenAI (Geração de Textos)
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe (Pagamentos)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 📊 Funcionalidades de Teste

### Sistema de Créditos
- Cada ação consome créditos específicos
- Busca de anúncios: R$ 2,50
- Geração de imagem: R$ 5,00
- Geração de texto: R$ 3,00
- Favoritar anúncio: Gratuito

### Dados de Demonstração
- Histórico de uso pré-populado
- Exemplos de anúncios analisados
- Métricas de performance simuladas
- Relatórios com dados realistas

### Funcionalidades de IA (Simuladas)
- Score de escalabilidade de nichos
- Análise de tendências de mercado
- Classificação automática de anúncios
- Sugestões de otimização

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🔄 Resetar Dados Demo

Para resetar os créditos dos usuários demo, execute no Supabase SQL Editor:

```sql
SELECT reset_demo_credits();
```

## 🆘 Solução de Problemas

### Erro "Invalid login credentials"
- Verifique se o Supabase está conectado
- Confirme que a migração foi executada
- Use uma das contas demo listadas acima

### Problemas de Conexão
- Verifique sua conexão com a internet
- Confirme se as URLs do Supabase estão corretas
- Verifique se o projeto Supabase está ativo

### Créditos Não Aparecem
- Faça logout e login novamente
- Verifique se o perfil foi criado corretamente
- Execute a função de reset se necessário

## 📈 Próximos Passos

1. **Configurar APIs Externas**: Para funcionalidades reais de IA
2. **Personalizar Planos**: Ajustar preços e limites conforme necessário
3. **Adicionar Métricas**: Implementar analytics detalhados
4. **Expandir Funcionalidades**: Adicionar novos tipos de análise

## 🤝 Suporte

- **Email**: suporte@facebookadsanalyzer.com
- **Documentação**: Consulte este README
- **Issues**: Use o sistema de issues do repositório

---

**Desenvolvido com ❤️ para marketeiros digitais que buscam resultados excepcionais**