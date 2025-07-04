/*
  # Criar usuários de demonstração com créditos

  1. Usuários Demo
    - Admin: admin@demo.com com R$ 100 em créditos
    - Usuário: user@demo.com com R$ 50 em créditos
    - Teste Premium: premium@demo.com com R$ 500 em créditos

  2. Configurações
    - Senhas padronizadas para demo: demo123
    - Diferentes níveis de planos para teste
    - Créditos suficientes para testar todas as funcionalidades

  3. Segurança
    - Usuários criados apenas se não existirem
    - Profiles automáticos com RLS habilitado
*/

-- Função para criar usuário demo se não existir
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
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  -- Se não existir, criar o usuário
  IF user_id IS NULL THEN
    -- Gerar ID único
    user_id := gen_random_uuid();
    
    -- Criptografar senha (usando crypt do pgcrypto)
    encrypted_password := crypt(user_password, gen_salt('bf'));
    
    -- Inserir usuário na tabela auth.users
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role
    ) VALUES (
      user_id,
      '00000000-0000-0000-0000-000000000000',
      user_email,
      encrypted_password,
      now(),
      now(),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      jsonb_build_object('full_name', user_name),
      false,
      'authenticated'
    );
    
    -- Criar perfil do usuário
    INSERT INTO profiles (
      id,
      email,
      full_name,
      credits_balance,
      subscription_plan,
      subscription_status,
      created_at,
      updated_at
    ) VALUES (
      user_id,
      user_email,
      user_name,
      initial_credits,
      user_plan,
      'active',
      now(),
      now()
    );
    
    RAISE NOTICE 'Usuário demo criado: % com R$ % em créditos', user_email, initial_credits;
  ELSE
    -- Se já existir, apenas atualizar os créditos
    UPDATE profiles 
    SET 
      credits_balance = initial_credits,
      subscription_plan = user_plan,
      updated_at = now()
    WHERE id = user_id;
    
    RAISE NOTICE 'Usuário demo atualizado: % com R$ % em créditos', user_email, initial_credits;
  END IF;
  
  RETURN user_id;
END;
$$;

-- Habilitar extensão pgcrypto se não estiver habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar usuários de demonstração
DO $$
DECLARE
  admin_id uuid;
  user_id uuid;
  premium_id uuid;
BEGIN
  -- Usuário Admin com créditos altos para testes completos
  admin_id := create_demo_user(
    'admin@demo.com',
    'demo123',
    'Administrador Demo',
    100.00,
    'premium'
  );
  
  -- Usuário padrão com créditos médios
  user_id := create_demo_user(
    'user@demo.com',
    'demo123',
    'Usuário Demo',
    50.00,
    'intermediate'
  );
  
  -- Usuário premium com muitos créditos para testes extensivos
  premium_id := create_demo_user(
    'premium@demo.com',
    'demo123',
    'Premium Demo',
    500.00,
    'premium'
  );
  
  -- Usuário gratuito com poucos créditos para testar limitações
  PERFORM create_demo_user(
    'free@demo.com',
    'demo123',
    'Free Demo',
    10.00,
    'free'
  );
  
  RAISE NOTICE 'Todos os usuários demo foram criados com sucesso!';
END;
$$;

-- Criar tabela de histórico de uso para demonstração
CREATE TABLE IF NOT EXISTS demo_usage_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  action_type text NOT NULL,
  description text,
  credits_used numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Inserir alguns dados de exemplo no histórico
INSERT INTO demo_usage_history (user_id, action_type, description, credits_used)
SELECT 
  p.id,
  action_type,
  description,
  credits_used
FROM profiles p
CROSS JOIN (
  VALUES 
    ('search', 'Busca por anúncios de fitness', 2.50),
    ('image_generation', 'Geração de imagem para campanha', 5.00),
    ('text_generation', 'Copy AIDA para produto', 3.00),
    ('search', 'Análise de nicho e-commerce', 2.50),
    ('image_generation', 'Criativo para Instagram Stories', 5.00),
    ('text_generation', 'Headlines para teste A/B', 3.00),
    ('search', 'Pesquisa de concorrentes', 2.50),
    ('favorite', 'Anúncio salvo nos favoritos', 0.00)
) AS actions(action_type, description, credits_used)
WHERE p.email LIKE '%@demo.com'
AND NOT EXISTS (
  SELECT 1 FROM demo_usage_history 
  WHERE user_id = p.id
);

-- Função para resetar créditos dos usuários demo (útil para testes)
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

-- Comentário final
COMMENT ON FUNCTION create_demo_user IS 'Cria usuários de demonstração com créditos para teste da plataforma';
COMMENT ON FUNCTION reset_demo_credits IS 'Reseta os créditos dos usuários demo para os valores padrão';
COMMENT ON TABLE demo_usage_history IS 'Histórico de uso dos usuários demo para demonstração';