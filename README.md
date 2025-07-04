# Facebook Ads Analyzer - SaaS Platform

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

### 👥 Gestão de Equipes
- **Colaboração**: Adicione membros à sua equipe
- **Controle de Permissões**: Diferentes níveis de acesso
- **Relatórios de Equipe**: Monitoramento de atividades

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Framework principal
- **React Router** - Navegação
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Recharts** - Gráficos e visualizações
- **React Hot Toast** - Notificações

### Backend & Banco de Dados
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **Row Level Security** - Segurança avançada
- **Edge Functions** - Funções serverless

### Integrações
- **Facebook Ads Library API** - Dados de anúncios
- **PIAPI.AI** - Geração de imagens
- **OpenAI GPT-4** - Geração de textos
- **Stripe** - Processamento de pagamentos

## 🏗️ Arquitetura

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Auth/           # Componentes de autenticação
│   └── Layout/         # Layout e navegação
├── contexts/           # Contextos React
│   ├── AuthContext.jsx # Gerenciamento de autenticação
│   └── ThemeContext.jsx # Sistema de temas
├── lib/               # Configurações e utilitários
│   └── supabase.js    # Cliente Supabase
├── pages/             # Páginas da aplicação
│   ├── AuthPage.jsx   # Login/Registro
│   ├── Dashboard.jsx  # Dashboard principal
│   ├── AdsSearch.jsx  # Busca de anúncios
│   └── CreativeGenerator.jsx # Geração de criativos
└── styles/            # Estilos globais
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

#### profiles
- Dados do usuário e configurações de conta
- Saldo de créditos e plano de assinatura
- Integração com Supabase Auth

#### ads_data
- Dados coletados da API do Facebook
- Metadados dos anúncios e criativos
- Informações de performance

#### ai_analysis
- Análises geradas pela IA
- Scores de escalabilidade
- Classificação de nichos

#### user_searches
- Histórico de buscas do usuário
- Parâmetros utilizados
- Consumo de créditos

#### generated_creatives
- Criativos gerados (imagens e textos)
- Prompts utilizados
- Custos associados

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Conta no Supabase
- Chaves de API das integrações

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd facebook-ads-analyzer
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas chaves de API
```

4. **Configure o banco de dados Supabase**
   - Crie um novo projeto no Supabase
   - Execute as migrações SQL fornecidas
   - Configure as políticas RLS

5. **Execute o projeto**
```bash
npm run dev
```

## 🔧 Configuração das APIs

### Facebook Ads Library
1. Crie uma aplicação no Facebook Developers
2. Obtenha o App ID e Access Token
3. Configure as permissões necessárias

### PIAPI.AI
1. Registre-se no PIAPI.AI
2. Obtenha sua chave de API
3. Configure os limites de uso

### OpenAI
1. Crie uma conta na OpenAI
2. Gere uma chave de API
3. Configure os modelos desejados

### Stripe
1. Crie uma conta no Stripe
2. Configure os produtos e preços
3. Obtenha as chaves públicas e secretas

## 📊 Funcionalidades de IA

### Análise de Escalabilidade
- **Volume de Anúncios**: Quantidade de anúncios ativos
- **Diversidade de Anunciantes**: Número de diferentes anunciantes
- **Consistência Temporal**: Estabilidade ao longo do tempo
- **Taxa de Crescimento**: Crescimento do nicho

### Geração de Criativos
- **Prompts Otimizados**: Templates testados para cada tipo
- **Variações Automáticas**: Múltiplas opções para teste
- **Estrutura AIDA**: Metodologia comprovada de conversão

## 🔒 Segurança

### Autenticação
- Supabase Auth com JWT
- Row Level Security (RLS)
- Políticas granulares de acesso

### Pagamentos
- Integração segura com Stripe
- Webhooks para sincronização
- Auditoria completa de transações

### APIs
- Rate limiting automático
- Chaves criptografadas
- Logs de auditoria

## 📈 Planos e Preços

### Gratuito
- 3 dias de teste
- R$ 10 em créditos
- Funcionalidades básicas

### Intermediário
- R$ 29/mês
- R$ 100 em créditos
- Recursos expandidos

### Premium
- R$ 99/mês
- R$ 500 em créditos
- Acesso completo + equipe

## 🎯 Roadmap

### Versão 1.0 (Atual)
- ✅ Sistema de autenticação
- ✅ Busca de anúncios
- ✅ Geração de criativos
- ✅ Sistema de pagamentos

### Versão 1.1
- 📊 Relatórios avançados
- 👥 Gestão de equipes
- 📱 App mobile
- 🔔 Notificações push

### Versão 2.0
- 🤖 IA mais avançada
- 📈 Análise preditiva
- 🔗 Integrações adicionais
- 🌍 Suporte multi-idioma

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

- Email: suporte@facebookadsanalyzer.com
- Discord: [Comunidade](https://discord.gg/example)
- Documentação: [Docs](https://docs.facebookadsanalyzer.com)

---

**Desenvolvido com ❤️ para marketeiros digitais que buscam resultados excepcionais**