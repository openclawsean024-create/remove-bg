-- Remove.bg TW — Initial Schema
-- 2026-07-11 Sprint 1 — 5 tables + RLS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users (含 plan / credits)
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE,
  name            TEXT,
  password_hash   TEXT,
  role            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','payg','lite','pro','volume_plus','student','enterprise')),
  credits         INTEGER NOT NULL DEFAULT 1,
  credits_reset_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_used_at   TIMESTAMPTZ,
  email_verified  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Processed images (歷史紀錄)
CREATE TABLE IF NOT EXISTS images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL, -- null = anonymous trial
  original_url    TEXT NOT NULL,
  result_url      TEXT,
  background     TEXT DEFAULT 'transparent', -- transparent / white / custom_color / custom_image
  custom_color    TEXT,
  custom_image_url TEXT,
  format          TEXT NOT NULL DEFAULT 'png', -- png / jpg / webp
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  credits_charged INTEGER NOT NULL DEFAULT 0,
  width           INTEGER,
  height          INTEGER,
  size_bytes      INTEGER,
  error           TEXT,
  ip_address      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_status ON images(status);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);

-- API keys (for F-009 API access)
CREATE TABLE IF NOT EXISTS api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  key_hash        TEXT NOT NULL UNIQUE, -- hashed version
  key_prefix      TEXT NOT NULL, -- first 8 chars for display
  last_used_at    TIMESTAMPTZ,
  rate_limit      INTEGER NOT NULL DEFAULT 60, -- requests per minute
  revoked         BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);

-- Subscriptions (Stripe mirror)
CREATE TABLE IF NOT EXISTS subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  plan            TEXT NOT NULL,
  status          TEXT NOT NULL, -- active / canceled / past_due
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end   TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at 自動維護
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['users','images','subscriptions']) LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END $$;

-- RLS
ALTER TABLE users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE images        ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys      ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- users 自己讀自己
CREATE POLICY users_read_self ON users FOR SELECT USING (auth.uid()::text = id::text);

-- images 自己讀寫自己（匿名也可 INSERT，但 user_id 為 null）
CREATE POLICY images_read_own ON images FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY images_insert_own ON images FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);
CREATE POLICY images_public_insert ON images FOR INSERT WITH CHECK (true); -- anonymous trials
CREATE POLICY images_anon_read ON images FOR SELECT USING (user_id IS NULL); -- can read own anonymous result

-- api_keys 自己 CRUD
CREATE POLICY api_keys_self ON api_keys FOR ALL USING (auth.uid()::text = user_id::text);

-- subscriptions 自己讀
CREATE POLICY subscriptions_read_self ON subscriptions FOR SELECT USING (auth.uid()::text = user_id::text);

-- service_role bypass（後端 API 用）
-- service_role 預設 bypass RLS

DO $$ BEGIN RAISE NOTICE '✅ Remove.bg TW schema migration 完成'; END $$;