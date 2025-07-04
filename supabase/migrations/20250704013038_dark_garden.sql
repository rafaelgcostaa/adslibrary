/*
  # Configuração Completa do Banco de Dados - Facebook Ads Analyzer

  1. Tabelas Principais
    - `profiles` - Perfis de usuários com créditos e planos
    - `ads_data` - Dados dos anúncios coletados
    - `ai_analysis` - Análises geradas pela IA
    - `user_searches` - Histórico de buscas
    - `generated_creatives` - Criativos gerados
    - `credit_transactions` - Transações de créditos
    - `user_favorites` - Anúncios favoritos
    - `team_members` - Membros da equipe
    - `subscription_plans` - Planos de assinatura

  2. Funcionalidades
    - Sistema completo de créditos
    - Histórico detalhado de uso
    - Análises de IA simuladas
    - Gestão de favoritos
    - Sistema de equipes

  3. Dados de Demonstração
    - Usuários demo com diferentes planos
    - Anúncios de exemplo
    - Histórico de atividades
    - Análises pré-geradas
*/

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: profiles (já existe, mas vamos garantir)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  credits_balance numeric DEFAULT 10.00,
  subscription_plan text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  avatar_url text,
  company_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- =============================================
-- TABELA: subscription_plans
-- =============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price_monthly numeric DEFAULT 0,
  price_yearly numeric DEFAULT 0,
  credits_monthly numeric DEFAULT 0,
  features jsonb DEFAULT '[]',
  limits jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- TABELA: credit_transactions
-- =============================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  transaction_type text NOT NULL, -- 'consumption', 'purchase', 'bonus', 'refund'
  description text,
  action_type text, -- 'search', 'image_generation', 'text_generation', etc.
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own transactions" ON credit_transactions FOR SELECT TO authenticated USING (user_id = auth.uid());

-- =============================================
-- TABELA: ads_data
-- =============================================
CREATE TABLE IF NOT EXISTS ads_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  facebook_ad_id text UNIQUE,
  advertiser_name text,
  headline text,
  description text,
  image_url text,
  landing_url text,
  whatsapp_url text,
  platforms text[] DEFAULT '{}',
  country_code text DEFAULT 'BR',
  niche text,
  impressions_range text,
  reach_range text,
  active_ads_count integer DEFAULT 0,
  first_seen_date timestamptz,
  last_seen_date timestamptz,
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ads_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read ads data" ON ads_data FOR SELECT TO authenticated USING (true);

-- =============================================
-- TABELA: ai_analysis
-- =============================================
CREATE TABLE IF NOT EXISTS ai_analysis (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_id uuid REFERENCES ads_data(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  scalability_score numeric DEFAULT 0,
  niche_classification text,
  target_audience text,
  conversion_potential text,
  market_saturation text,
  trend_analysis jsonb DEFAULT '{}',
  recommendations text[],
  analysis_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own analysis" ON ai_analysis FOR SELECT TO authenticated USING (user_id = auth.uid());

-- =============================================
-- TABELA: user_searches
-- =============================================
CREATE TABLE IF NOT EXISTS user_searches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  search_query text,
  filters jsonb DEFAULT '{}',
  results_count integer DEFAULT 0,
  credits_used numeric DEFAULT 2.50,
  search_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own searches" ON user_searches FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own searches" ON user_searches FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- =============================================
-- TABELA: generated_creatives
-- =============================================
CREATE TABLE IF NOT EXISTS generated_creatives (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  creative_type text NOT NULL, -- 'image', 'text', 'video'
  prompt text,
  generated_content text,
  image_url text,
  settings jsonb DEFAULT '{}',
  credits_used numeric DEFAULT 0,
  generation_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_creatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own creatives" ON generated_creatives FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own creatives" ON generated_creatives FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- =============================================
-- TABELA: user_favorites
-- =============================================
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ad_id uuid REFERENCES ads_data(id) ON DELETE CASCADE,
  notes text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, ad_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON user_favorites FOR ALL TO authenticated USING (user_id = auth.uid());

-- =============================================
-- TABELA: team_members
-- =============================================
CREATE TABLE IF NOT EXISTS team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  team_owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  member_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member', -- 'admin', 'member', 'viewer'
  permissions jsonb DEFAULT '{}',
  invited_at timestamptz DEFAULT now(),
  joined_at timestamptz,
  status text DEFAULT 'pending', -- 'pending', 'active', 'inactive'
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_owner_id, member_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team owners can manage members" ON team_members FOR ALL TO authenticated USING (team_owner_id = auth.uid());
CREATE POLICY "Members can read team info" ON team_members FOR SELECT TO authenticated USING (member_id = auth.uid());

-- =============================================
-- FUNÇÕES AUXILIARES
-- =============================================

-- Função para atualizar créditos do usuário
CREATE OR REPLACE FUNCTION update_user_credits(
  user_uuid uuid,
  amount numeric,
  transaction_type text DEFAULT 'consumption',
  description text DEFAULT '',
  action_type text DEFAULT 'manual'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualizar saldo de créditos
  UPDATE profiles 
  SET 
    credits_balance = CASE 
      WHEN transaction_type = 'consumption' THEN GREATEST(credits_balance - amount, 0)
      ELSE credits_balance + amount
    END,
    updated_at = now()
  WHERE id = user_uuid;
  
  -- Registrar transação
  INSERT INTO credit_transactions (user_id, amount, transaction_type, description, action_type)
  VALUES (user_uuid, amount, transaction_type, description, action_type);
END;
$$;

-- Função para criar usuário demo
CREATE OR REPLACE FUNCTION create_demo_user(
  user_email text,
  user_password text,
  user_name text,
  initial_credits numeric DEFAULT 50.00,
  user_plan text DEFAULT 'free'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
  encrypted_password text;
BEGIN
  -- Verificar se o usuário já existe
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    user_id := gen_random_uuid();
    encrypted_password := crypt(user_password, gen_salt('bf'));
    
    -- Inserir usuário
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role
    ) VALUES (
      user_id, '00000000-0000-0000-0000-000000000000', user_email,
      encrypted_password, now(), now(), now(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('full_name', user_name),
      false, 'authenticated'
    );
    
    -- Criar perfil
    INSERT INTO profiles (id, email, full_name, credits_balance, subscription_plan, subscription_status)
    VALUES (user_id, user_email, user_name, initial_credits, user_plan, 'active');
    
    RAISE NOTICE 'Usuário demo criado: % com R$ % em créditos', user_email, initial_credits;
  ELSE
    -- Atualizar usuário existente
    UPDATE profiles 
    SET credits_balance = initial_credits, subscription_plan = user_plan, updated_at = now()
    WHERE id = user_id;
    
    RAISE NOTICE 'Usuário demo atualizado: % com R$ % em créditos', user_email, initial_credits;
  END IF;
  
  RETURN user_id;
END;
$$;

-- Função para resetar créditos demo
CREATE OR REPLACE FUNCTION reset_demo_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles 
  SET 
    credits_balance = CASE 
      WHEN email = 'admin@demo.com' THEN 100.00
      WHEN email = 'user@demo.com' THEN 50.00
      WHEN email = 'premium@demo.com' THEN 500.00
      WHEN email = 'free@demo.com' THEN 10.00
      ELSE credits_balance
    END,
    updated_at = now()
  WHERE email LIKE '%@demo.com';
  
  RAISE NOTICE 'Créditos dos usuários demo foram resetados!';
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, credits_balance, subscription_plan, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    10.00,
    'free',
    'active'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Inserir planos de assinatura
INSERT INTO subscription_plans (name, slug, price_monthly, price_yearly, credits_monthly, features, limits) VALUES
('Gratuito', 'free', 0, 0, 10, 
 '["Busca básica de anúncios", "Geração limitada de criativos", "3 dias de teste"]',
 '{"searches_per_day": 5, "creatives_per_month": 3, "team_members": 0}'),
('Intermediário', 'intermediate', 29, 290, 50,
 '["Busca avançada", "Geração de criativos", "Relatórios básicos", "Suporte por email"]',
 '{"searches_per_day": 50, "creatives_per_month": 20, "team_members": 2}'),
('Premium', 'premium', 99, 990, 500,
 '["Busca ilimitada", "IA avançada", "Relatórios completos", "Gestão de equipe", "Suporte prioritário"]',
 '{"searches_per_day": -1, "creatives_per_month": -1, "team_members": 10}')
ON CONFLICT (slug) DO UPDATE SET
  price_monthly = EXCLUDED.price_monthly,
  credits_monthly = EXCLUDED.credits_monthly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;

-- Criar usuários demo
DO $$
BEGIN
  PERFORM create_demo_user('admin@demo.com', 'demo123', 'Administrador Demo', 100.00, 'premium');
  PERFORM create_demo_user('user@demo.com', 'demo123', 'Usuário Demo', 50.00, 'intermediate');
  PERFORM create_demo_user('premium@demo.com', 'demo123', 'Premium Demo', 500.00, 'premium');
  PERFORM create_demo_user('free@demo.com', 'demo123', 'Free Demo', 10.00, 'free');
END;
$$;

-- Inserir dados de anúncios de exemplo
INSERT INTO ads_data (facebook_ad_id, advertiser_name, headline, description, image_url, landing_url, whatsapp_url, platforms, niche, impressions_range, reach_range, active_ads_count) VALUES
('fb_ad_001', 'FitnessPro', '🔥 Transforme Seu Corpo em 30 Dias', 'Método revolucionário que já ajudou +10mil pessoas a perder peso de forma saudável. Clique e descubra o segredo!', 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://example.com/fitness', 'https://wa.me/5511999999999', ARRAY['Facebook', 'Instagram'], 'Fitness & Saúde', '100K - 500K', '50K - 200K', 247),
('fb_ad_002', 'RendaOnline', '💰 Ganhe R$ 3000 Trabalhando Online', 'Método comprovado para gerar renda extra trabalhando apenas 2h por dia. Mais de 5000 alunos já transformaram suas vidas!', 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://example.com/renda', NULL, ARRAY['Facebook', 'Instagram', 'Audience Network'], 'Educação Online', '50K - 200K', '30K - 100K', 156),
('fb_ad_003', 'BeautySecrets', '✨ Pele Perfeita em 7 Dias', 'Descubra o routine de skincare que celebridades usam. Resultados visíveis em uma semana ou seu dinheiro de volta!', 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://example.com/beauty', 'https://wa.me/5511888888888', ARRAY['Instagram', 'Facebook'], 'Beleza & Cosméticos', '200K - 1M', '150K - 500K', 389),
('fb_ad_004', 'TechStartup', '🚀 Automatize Seu Negócio com IA', 'Software que aumenta produtividade em 300%. Usado por +1000 empresas. Teste grátis por 14 dias!', 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://example.com/tech', NULL, ARRAY['Facebook', 'LinkedIn'], 'Tecnologia', '75K - 300K', '40K - 150K', 89),
('fb_ad_005', 'CursoMarketing', '📈 Domine o Marketing Digital', 'Curso completo com certificado. Do básico ao avançado. +500 aulas práticas. Garantia de 30 dias!', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://example.com/marketing', 'https://wa.me/5511777777777', ARRAY['Facebook', 'Instagram'], 'Educação Online', '120K - 600K', '80K - 300K', 234)
ON CONFLICT (facebook_ad_id) DO NOTHING;

-- Inserir análises de IA para os anúncios
INSERT INTO ai_analysis (ad_id, user_id, scalability_score, niche_classification, target_audience, conversion_potential, market_saturation, recommendations)
SELECT 
  a.id,
  p.id,
  CASE 
    WHEN a.advertiser_name = 'FitnessPro' THEN 8.5
    WHEN a.advertiser_name = 'RendaOnline' THEN 7.8
    WHEN a.advertiser_name = 'BeautySecrets' THEN 9.2
    WHEN a.advertiser_name = 'TechStartup' THEN 7.5
    WHEN a.advertiser_name = 'CursoMarketing' THEN 8.8
  END,
  a.niche,
  CASE 
    WHEN a.niche = 'Fitness & Saúde' THEN 'Pessoas de 25-45 anos interessadas em emagrecimento'
    WHEN a.niche = 'Educação Online' THEN 'Empreendedores e profissionais buscando renda extra'
    WHEN a.niche = 'Beleza & Cosméticos' THEN 'Mulheres de 20-40 anos preocupadas com skincare'
    WHEN a.niche = 'Tecnologia' THEN 'Empresários e gestores de pequenas e médias empresas'
    ELSE 'Público geral interessado no nicho'
  END,
  'Alto',
  'Médio',
  ARRAY['Testar variações de copy', 'Expandir para outras plataformas', 'Criar campanhas sazonais']
FROM ads_data a
CROSS JOIN profiles p
WHERE p.email = 'admin@demo.com'
ON CONFLICT DO NOTHING;

-- Inserir histórico de buscas para usuários demo
INSERT INTO user_searches (user_id, search_query, filters, results_count, credits_used)
SELECT 
  p.id,
  search_query,
  filters::jsonb,
  results_count,
  2.50
FROM profiles p
CROSS JOIN (
  VALUES 
    ('fitness emagrecimento', '{"country": "BR", "platform": "all"}', 15),
    ('curso online marketing', '{"country": "BR", "platform": "facebook"}', 23),
    ('produto beleza skincare', '{"country": "BR", "platform": "instagram"}', 18),
    ('software automação', '{"country": "BR", "platform": "all"}', 12),
    ('renda extra online', '{"country": "BR", "platform": "all"}', 31)
) AS searches(search_query, filters, results_count)
WHERE p.email LIKE '%@demo.com';

-- Inserir criativos gerados para demonstração
INSERT INTO generated_creatives (user_id, creative_type, prompt, generated_content, credits_used)
SELECT 
  p.id,
  creative_type,
  prompt,
  generated_content,
  CASE WHEN creative_type = 'image' THEN 5.00 ELSE 3.00 END
FROM profiles p
CROSS JOIN (
  VALUES 
    ('text', 'Copy para produto de fitness', '🔥 TRANSFORME SEU CORPO EM 30 DIAS!\n\nVocê está cansado de dietas que não funcionam?\n\n🎯 ATENÇÃO: Método revolucionário aprovado por nutricionistas!\n💡 INTERESSE: Perca até 10kg sem passar fome\n❤️ DESEJO: Imagine-se com o corpo dos seus sonhos\n⚡ AÇÃO: Clique agora e comece hoje mesmo!'),
    ('image', 'Pessoa feliz com produto fitness', 'Imagem gerada: pessoa sorrindo segurando produto fitness'),
    ('text', 'Headlines para curso online', 'HEADLINES GERADAS:\n• 📚 Domine o Marketing Digital em 30 Dias\n• 🚀 Do Zero ao Expert: Curso Completo\n• 💰 Ganhe R$ 5000/mês com Marketing Digital'),
    ('text', 'Copy para produto de beleza', '✨ PELE PERFEITA EM 7 DIAS!\n\nCansei de produtos que prometem e não entregam?\n\n🌟 NOVIDADE: Sérum anti-idade com resultados comprovados\n💎 Usado por celebridades de Hollywood\n🎁 OFERTA ESPECIAL: 50% OFF apenas hoje!\n👆 CLIQUE E GARANTE O SEU!')
) AS creatives(creative_type, prompt, generated_content)
WHERE p.email IN ('admin@demo.com', 'premium@demo.com');

-- Inserir favoritos para demonstração
INSERT INTO user_favorites (user_id, ad_id, notes, tags)
SELECT 
  p.id,
  a.id,
  'Anúncio interessante para análise',
  ARRAY['alta-conversao', 'nicho-quente']
FROM profiles p
CROSS JOIN ads_data a
WHERE p.email LIKE '%@demo.com'
AND a.advertiser_name IN ('FitnessPro', 'BeautySecrets')
LIMIT 10;

-- Inserir transações de créditos para histórico
INSERT INTO credit_transactions (user_id, amount, transaction_type, description, action_type)
SELECT 
  p.id,
  amount,
  transaction_type,
  description,
  action_type
FROM profiles p
CROSS JOIN (
  VALUES 
    (2.50, 'consumption', 'Busca por anúncios de fitness', 'search'),
    (5.00, 'consumption', 'Geração de imagem para campanha', 'image_generation'),
    (3.00, 'consumption', 'Copy AIDA para produto', 'text_generation'),
    (2.50, 'consumption', 'Análise de nicho e-commerce', 'search'),
    (50.00, 'purchase', 'Recarga de créditos - Plano Intermediário', 'purchase'),
    (10.00, 'bonus', 'Bônus de boas-vindas', 'bonus')
) AS transactions(amount, transaction_type, description, action_type)
WHERE p.email LIKE '%@demo.com';

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_ads_data_niche ON ads_data(niche);
CREATE INDEX IF NOT EXISTS idx_ads_data_advertiser ON ads_data(advertiser_name);
CREATE INDEX IF NOT EXISTS idx_ads_data_active ON ads_data(is_active);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_date ON credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_searches_user ON user_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_user ON ai_analysis(user_id);

-- Comentários para documentação
COMMENT ON TABLE profiles IS 'Perfis de usuários com informações de conta e créditos';
COMMENT ON TABLE ads_data IS 'Dados dos anúncios coletados da API do Facebook';
COMMENT ON TABLE ai_analysis IS 'Análises geradas pela IA para cada anúncio';
COMMENT ON TABLE user_searches IS 'Histórico de buscas realizadas pelos usuários';
COMMENT ON TABLE generated_creatives IS 'Criativos (imagens/textos) gerados pela IA';
COMMENT ON TABLE credit_transactions IS 'Histórico completo de transações de créditos';
COMMENT ON TABLE user_favorites IS 'Anúncios salvos como favoritos pelos usuários';
COMMENT ON TABLE team_members IS 'Membros da equipe para contas empresariais';
COMMENT ON TABLE subscription_plans IS 'Planos de assinatura disponíveis';

COMMENT ON FUNCTION update_user_credits IS 'Atualiza saldo de créditos e registra transação';
COMMENT ON FUNCTION create_demo_user IS 'Cria usuários de demonstração com créditos';
COMMENT ON FUNCTION reset_demo_credits IS 'Reseta créditos dos usuários demo';