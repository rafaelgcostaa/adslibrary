/*
  # Create Demo Users and Setup

  1. New Tables
    - `profiles` table for user profile data
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `credits_balance` (numeric, default 10.00)
      - `subscription_plan` (text, default 'free')
      - `subscription_status` (text, default 'active')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Functions
    - `update_user_credits` function for credit management
    - Trigger function to auto-create profiles

  3. Security
    - Enable RLS on `profiles` table
    - Add policies for authenticated users to manage their own data

  4. Demo Data
    - Instructions for creating demo users (must be done manually in Supabase Auth)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  credits_balance numeric DEFAULT 10.00,
  subscription_plan text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Function to update user credits
CREATE OR REPLACE FUNCTION update_user_credits(
  user_uuid uuid,
  amount numeric,
  transaction_type text DEFAULT 'consumption',
  description text DEFAULT ''
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the user's credits balance
  UPDATE profiles 
  SET 
    credits_balance = CASE 
      WHEN transaction_type = 'consumption' THEN credits_balance - amount
      ELSE credits_balance + amount
    END,
    updated_at = now()
  WHERE id = user_uuid;
  
  -- You could also log the transaction here if needed
  -- INSERT INTO credit_transactions (user_id, amount, type, description) 
  -- VALUES (user_uuid, amount, transaction_type, description);
END;
$$;

-- Function to handle new user profile creation
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

-- Trigger to automatically create profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update existing users without profiles (if any)
INSERT INTO profiles (id, email, full_name, credits_balance, subscription_plan, subscription_status)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', ''),
  10.00,
  'free',
  'active'
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;