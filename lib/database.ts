export interface UserProfile {
  id: string;
  email: string;
  created_at: Date;
  character_level: number;
  current_xp: number;
  next_level_xp: number;
  strength: number;
  discipline: number;
  growth: number;
  total_wealth: number;
  daily_streak: number;
  last_checkin: Date | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  merchant: string | null;
  balance_after: number | null;
  created_at: Date;
}

export interface Quest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  category: string;
  difficulty: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xp_reward: number;
  status: 'active' | 'completed' | 'paused';
  created_at: Date;
  completed_at: Date | null;
  deadline: Date | null;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  xp_awarded: number;
  earned_at: Date;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  activity_date: Date;
  activities_completed: string[];
  xp_earned: number;
  streak_day: number;
}

// Database Schema for PostgreSQL/Supabase

export const DATABASE_SCHEMA = `
-- Enable RLS
ALTER DATABASE postgres SET timezone TO 'UTC';

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- RPG Character Stats
  character_level integer DEFAULT 1,
  current_xp integer DEFAULT 0,
  next_level_xp integer DEFAULT 1000,
  
  -- Core Attributes
  strength integer DEFAULT 10, -- Financial Strength (Net Worth)
  discipline integer DEFAULT 10, -- Daily logging consistency
  growth integer DEFAULT 10, -- Investment performance
  
  -- Financial Data
  total_wealth decimal(15,2) DEFAULT 0.00,
  
  -- Gamification
  daily_streak integer DEFAULT 0,
  last_checkin timestamptz,
  
  CONSTRAINT valid_level CHECK (character_level >= 1),
  CONSTRAINT valid_xp CHECK (current_xp >= 0),
  CONSTRAINT valid_attributes CHECK (
    strength >= 0 AND strength <= 100 AND
    discipline >= 0 AND discipline <= 100 AND
    growth >= 0 AND growth <= 100
  )
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Transaction Details
  transaction_date timestamptz NOT NULL,
  description text NOT NULL,
  amount decimal(12,2) NOT NULL,
  category text NOT NULL,
  type text CHECK (type IN ('income', 'expense')) NOT NULL,
  merchant text,
  balance_after decimal(15,2),
  
  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_amount CHECK (amount != 0)
);

-- Quests table (financial goals)
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Quest Details
  title text NOT NULL,
  description text,
  target_amount decimal(12,2) NOT NULL,
  current_amount decimal(12,2) DEFAULT 0.00,
  category text NOT NULL,
  difficulty text CHECK (difficulty IN ('Common', 'Rare', 'Epic', 'Legendary')) DEFAULT 'Common',
  
  -- Rewards
  xp_reward integer DEFAULT 100,
  
  -- Status
  status text CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  
  -- Dates
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  deadline timestamptz,
  
  CONSTRAINT valid_amounts CHECK (
    target_amount > 0 AND 
    current_amount >= 0 AND 
    current_amount <= target_amount
  )
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Achievement Details
  achievement_type text NOT NULL,
  title text NOT NULL,
  description text,
  icon text DEFAULT '🏆',
  xp_awarded integer DEFAULT 50,
  
  -- Earned timestamp
  earned_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_user_achievement UNIQUE(user_id, achievement_type)
);

-- Daily Activities table
CREATE TABLE IF NOT EXISTS daily_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity Date
  activity_date date DEFAULT CURRENT_DATE,
  
  -- Activities Completed (JSON array)
  activities_completed jsonb DEFAULT '[]'::jsonb,
  xp_earned integer DEFAULT 0,
  streak_day integer DEFAULT 1,
  
  -- Timestamp
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_user_daily UNIQUE(user_id, activity_date)
);

-- Bank Statements table (metadata only, not actual files)
CREATE TABLE IF NOT EXISTS bank_statements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Statement Info
  account_number_masked text, -- e.g., "****1234"
  statement_period_from date NOT NULL,
  statement_period_to date NOT NULL,
  opening_balance decimal(15,2),
  closing_balance decimal(15,2),
  
  -- Processing
  processed_at timestamptz DEFAULT now(),
  transaction_count integer DEFAULT 0,
  
  CONSTRAINT valid_period CHECK (statement_period_to >= statement_period_from)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_statements ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Transactions: Users can only see their own transactions
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Quests: Users can only see their own quests
CREATE POLICY "Users can read own quests"
  ON quests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own quests"
  ON quests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own quests"
  ON quests
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Achievements: Users can only see their own achievements
CREATE POLICY "Users can read own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own achievements"
  ON achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Daily Activities: Users can only see their own activities
CREATE POLICY "Users can read own activities"
  ON daily_activities
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own activities"
  ON daily_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own activities"
  ON daily_activities
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Bank Statements: Users can only see their own statements
CREATE POLICY "Users can read own statements"
  ON bank_statements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own statements"
  ON bank_statements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_quests_user_status ON quests(user_id, status);
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id, earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_activities_user_date ON daily_activities(user_id, activity_date DESC);

-- Functions for common operations

-- Function to update user wealth and attributes
CREATE OR REPLACE FUNCTION update_user_financial_stats(
  p_user_id uuid,
  p_net_worth decimal DEFAULT NULL,
  p_xp_to_add integer DEFAULT 0
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_profile user_profiles%ROWTYPE;
  new_level integer;
  new_xp integer;
  new_next_level_xp integer;
BEGIN
  -- Get current profile
  SELECT * INTO current_profile 
  FROM user_profiles 
  WHERE id = p_user_id;

  -- Calculate new XP and level
  new_xp := current_profile.current_xp + p_xp_to_add;
  new_level := current_profile.character_level;
  new_next_level_xp := current_profile.next_level_xp;

  -- Handle level ups
  WHILE new_xp >= new_next_level_xp LOOP
    new_xp := new_xp - new_next_level_xp;
    new_level := new_level + 1;
    new_next_level_xp := FLOOR(1000 * POWER(1.2, new_level - 1));
  END LOOP;

  -- Update profile
  UPDATE user_profiles SET
    current_xp = new_xp,
    character_level = new_level,
    next_level_xp = new_next_level_xp,
    total_wealth = COALESCE(p_net_worth, total_wealth),
    updated_at = now()
  WHERE id = p_user_id;
END;
$$;

-- Function to process daily check-in
CREATE OR REPLACE FUNCTION process_daily_checkin(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_streak integer := 0;
  last_checkin_date date;
  today_date date := CURRENT_DATE;
  xp_earned integer;
  result jsonb;
BEGIN
  -- Get current streak and last check-in
  SELECT daily_streak, last_checkin::date
  INTO current_streak, last_checkin_date
  FROM user_profiles
  WHERE id = p_user_id;

  -- Check if already checked in today
  IF last_checkin_date = today_date THEN
    RETURN jsonb_build_object('success', false, 'message', 'Already checked in today');
  END IF;

  -- Update streak
  IF last_checkin_date = today_date - INTERVAL '1 day' THEN
    -- Continue streak
    current_streak := current_streak + 1;
  ELSE
    -- Reset streak
    current_streak := 1;
  END IF;

  -- Calculate XP (base 25 + streak bonus)
  xp_earned := 25 + (current_streak * 2);

  -- Update user profile
  UPDATE user_profiles SET
    daily_streak = current_streak,
    last_checkin = now(),
    current_xp = current_xp + xp_earned
  WHERE id = p_user_id;

  -- Record daily activity
  INSERT INTO daily_activities (user_id, activity_date, activities_completed, xp_earned, streak_day)
  VALUES (
    p_user_id,
    today_date,
    '["daily_checkin"]'::jsonb,
    xp_earned,
    current_streak
  )
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    activities_completed = daily_activities.activities_completed || '["daily_checkin"]'::jsonb,
    xp_earned = daily_activities.xp_earned + xp_earned;

  -- Return result
  result := jsonb_build_object(
    'success', true,
    'xp_earned', xp_earned,
    'new_streak', current_streak,
    'message', 'Check-in successful!'
  );

  RETURN result;
END;
$$;
`;