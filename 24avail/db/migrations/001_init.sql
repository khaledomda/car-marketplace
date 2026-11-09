-- 24avail core schema
-- Principles:
--   1. Nothing is ever lost: every action is written to the append-only `events` table
--      (UPDATE/DELETE are blocked by trigger). Counters are fast caches that can be rebuilt.
--   2. Customers are identified by an anonymous device id today; the future mobile app links
--      that id to a real account (customers.account_id) so history, ratings, searches carry over.
--   3. Future features (payments, pharmacy accounts, deliveries, partners) already have tables,
--      so turning them on later needs no data migration.

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------- settings / feature flags
CREATE TABLE settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO settings (key, value) VALUES
  ('trial_mode',                   'true'),
  ('payments_enabled',             'false'),
  ('reveal_pharmacy_before_payment','true'),   -- later: false => pharmacy hidden until paid
  ('search_radius_km',             '7'),
  ('enforce_search_radius',        'false'),   -- later: true => only pharmacies within radius
  ('service_fee',                  '{"type":"flat","amount":0,"currency":"SAR"}'),
  ('notification_channel',         '"whatsapp"'), -- later: "app"
  ('max_pharmacies_per_request',   '5');

-- ---------------------------------------------------------------- brands that must never appear
CREATE TABLE blocked_brands (
  id       serial PRIMARY KEY,
  pattern  text NOT NULL UNIQUE,     -- case-insensitive regex, matched against names/chain
  note     text
);

-- Postgres regex: \m / \M are word boundaries. Patterns are kept specific so generic
-- Arabic words (e.g. "الدواء" = "the medicine") inside other pharmacy names are not blocked.
INSERT INTO blocked_brands (pattern, note) VALUES
  ('nahdi',                                  'Al-Nahdi'),
  ('النهدي',                                  'Al-Nahdi (ar)'),
  ('\mdawaa\M|\mal[- ]?dawa\M',              'Al-Dawaa'),
  ('صيدليات\s+الدواء|^\s*(صيدلية\s+)?الدواء\s*$', 'Al-Dawaa (ar)'),
  ('\munited\s*pharm',                       'United Pharmacy'),
  ('صيدليات\s+المتحدة|صيدلية\s+المتحدة',        'United (ar)');

CREATE OR REPLACE FUNCTION is_blocked_brand(t text) RETURNS boolean
LANGUAGE sql STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM blocked_brands b WHERE coalesce(t,'') ~* b.pattern)
$$;

-- ---------------------------------------------------------------- partners (logistics, groups, advertisers, insurers ...)
CREATE TABLE partners (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL CHECK (type IN ('logistics','pharmacy_group','advertiser','insurer','payment','other')),
  name        text NOT NULL,
  name_ar     text,
  contact     jsonb NOT NULL DEFAULT '{}',
  -- config.adapter selects the integration module in lib/partners (e.g. "manual", "webhook").
  config      jsonb NOT NULL DEFAULT '{"adapter":"manual"}',
  coverage    jsonb NOT NULL DEFAULT '{}',
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE partner_applications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind         text NOT NULL CHECK (kind IN ('pharmacy','logistics','advertiser','other')),
  business     text NOT NULL,
  contact_name text,
  phone        text NOT NULL,
  message      text,
  status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','accepted','rejected')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------- pharmacies
CREATE TABLE pharmacies (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  public_code      text NOT NULL UNIQUE DEFAULT upper(substr(md5(random()::text), 1, 6)),
  name_en          text,
  name_ar          text,
  chain            text,
  group_partner_id uuid REFERENCES partners(id),
  district         text,
  address          text,
  city             text NOT NULL DEFAULT 'Madinah',
  lat              double precision,
  lng              double precision,
  phone            text,                 -- E.164, e.g. +966148xxxxxx
  whatsapp         text,                 -- E.164 mobile used for wa.me
  is_24h           boolean NOT NULL DEFAULT false,
  opening_hours    jsonb,
  delivery_mode    text NOT NULL DEFAULT 'none' CHECK (delivery_mode IN ('none','own','platform','both')),
  status           text NOT NULL DEFAULT 'active' CHECK (status IN ('active','hidden','closed')),
  verified         boolean NOT NULL DEFAULT false,
  is_demo          boolean NOT NULL DEFAULT false,
  source           text NOT NULL DEFAULT 'manual',  -- google | osm | manual | application
  source_ref       text,                            -- e.g. Google place_id
  metadata         jsonb NOT NULL DEFAULT '{}',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source, source_ref),
  CHECK (name_en IS NOT NULL OR name_ar IS NOT NULL)
);
CREATE INDEX pharmacies_geo_idx    ON pharmacies (lat, lng) WHERE status = 'active';
CREATE INDEX pharmacies_status_idx ON pharmacies (status);

-- Hard guarantee: excluded chains can never be inserted, whatever the import path.
CREATE OR REPLACE FUNCTION pharmacies_block_brands() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF is_blocked_brand(NEW.name_en) OR is_blocked_brand(NEW.name_ar) OR is_blocked_brand(NEW.chain) THEN
    RAISE EXCEPTION 'blocked_brand: % / %', NEW.name_en, NEW.name_ar USING ERRCODE = 'check_violation';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER pharmacies_block_brands_trg BEFORE INSERT OR UPDATE ON pharmacies
  FOR EACH ROW EXECUTE FUNCTION pharmacies_block_brands();

CREATE TABLE pharmacy_stats (
  pharmacy_id         uuid PRIMARY KEY REFERENCES pharmacies(id) ON DELETE CASCADE,
  profile_views       bigint NOT NULL DEFAULT 0,
  search_appearances  bigint NOT NULL DEFAULT 0,
  contact_clicks      bigint NOT NULL DEFAULT 0,
  requests_total      bigint NOT NULL DEFAULT 0,
  requests_available  bigint NOT NULL DEFAULT 0,
  requests_unavailable bigint NOT NULL DEFAULT 0,
  completed_services  bigint NOT NULL DEFAULT 0,
  rating_sum          bigint NOT NULL DEFAULT 0,
  rating_count        bigint NOT NULL DEFAULT 0,
  avg_response_secs   double precision,
  last_activity_at    timestamptz
);

-- Future pharmacy logins (dashboard, payments). Created now so ids never change.
CREATE TABLE pharmacy_accounts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id    uuid NOT NULL REFERENCES pharmacies(id),
  phone          text NOT NULL,
  email          text,
  password_hash  text,
  role           text NOT NULL DEFAULT 'owner' CHECK (role IN ('owner','pharmacist','staff')),
  payout_details jsonb,
  active         boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (pharmacy_id, phone)
);

-- ---------------------------------------------------------------- medicines (SFDA registry + herbal)
CREATE TABLE drugs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_name      text NOT NULL,
  trade_name_ar   text,
  generic_name    text,                -- scientific / active ingredient(s)
  strength        text,
  dosage_form     text,
  route           text,
  package_size    text,
  manufacturer    text,
  country         text,
  reg_no          text,                -- SFDA registration number
  price_sar       numeric(10,2),
  legal_status    text,                -- OTC | Prescription | Controlled
  product_type    text NOT NULL DEFAULT 'human' CHECK (product_type IN ('human','herbal','supplement','veterinary','other')),
  atc_code        text,
  aliases         text[] NOT NULL DEFAULT '{}',
  search_text     text NOT NULL,       -- normalized (lib/normalize.ts), built at import
  active          boolean NOT NULL DEFAULT true,
  source          text NOT NULL DEFAULT 'seed',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX drugs_reg_no_uniq ON drugs (reg_no) WHERE reg_no IS NOT NULL;
CREATE UNIQUE INDEX drugs_natural_uniq ON drugs (lower(trade_name), coalesce(lower(strength),''), coalesce(lower(dosage_form),'')) WHERE reg_no IS NULL;
CREATE INDEX drugs_search_trgm ON drugs USING gin (search_text gin_trgm_ops);
CREATE INDEX drugs_generic_idx ON drugs (lower(generic_name));

CREATE TABLE drug_stats (
  drug_id        uuid PRIMARY KEY REFERENCES drugs(id) ON DELETE CASCADE,
  search_hits    bigint NOT NULL DEFAULT 0,
  request_count  bigint NOT NULL DEFAULT 0,
  available_count bigint NOT NULL DEFAULT 0
);

-- Learned inventory: every pharmacist "available" answer is remembered,
-- so ranking improves over time and the future app can show likely stock.
CREATE TABLE availability_signals (
  pharmacy_id      uuid NOT NULL REFERENCES pharmacies(id) ON DELETE CASCADE,
  drug_id          uuid NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
  available_count  int NOT NULL DEFAULT 0,
  unavailable_count int NOT NULL DEFAULT 0,
  last_available_at timestamptz,
  last_answer_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (pharmacy_id, drug_id)
);
CREATE INDEX availability_drug_idx ON availability_signals (drug_id);

-- ---------------------------------------------------------------- customers
CREATE TABLE customers (
  id           uuid PRIMARY KEY,           -- anonymous device id (cookie) today
  account_id   uuid,                       -- future app account; many devices -> one account
  phone        text,
  name         text,
  locale       text,
  first_seen   timestamptz NOT NULL DEFAULT now(),
  last_seen    timestamptz NOT NULL DEFAULT now(),
  visits       bigint NOT NULL DEFAULT 1,
  searches     bigint NOT NULL DEFAULT 0,
  requests     bigint NOT NULL DEFAULT 0
);
CREATE INDEX customers_account_idx ON customers (account_id) WHERE account_id IS NOT NULL;

-- ---------------------------------------------------------------- searches & prescription reads
CREATE TABLE searches (
  id            bigserial PRIMARY KEY,
  customer_id   uuid,
  query         text NOT NULL,
  normalized    text NOT NULL,
  source        text NOT NULL DEFAULT 'text' CHECK (source IN ('text','prescription','drug_photo','suggestion')),
  results_count int NOT NULL DEFAULT 0,
  top_drug_id   uuid,
  lat           double precision,
  lng           double precision,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX searches_created_idx ON searches (created_at);
CREATE INDEX searches_norm_idx ON searches (normalized);

CREATE TABLE rx_uploads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid,
  kind          text NOT NULL CHECK (kind IN ('prescription','drug_photo')),
  image_sha256  text NOT NULL,       -- image itself is NOT stored (privacy); only its fingerprint
  bytes         int,
  extracted     jsonb,
  matched       jsonb,
  model         text,
  status        text NOT NULL DEFAULT 'ok',
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------- medicine requests (core business object)
CREATE TABLE requests (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code           text NOT NULL UNIQUE,
  batch_id           uuid NOT NULL,         -- one customer ask fanned out to several pharmacies
  customer_id        uuid NOT NULL,
  pharmacy_id        uuid NOT NULL REFERENCES pharmacies(id),
  items              jsonb NOT NULL,        -- [{drug_id, name, strength, qty}]
  channel            text NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp','app','call')),
  fulfillment        text NOT NULL DEFAULT 'pickup' CHECK (fulfillment IN ('pickup','pharmacy_delivery','platform_delivery')),
  logistics_partner_id uuid REFERENCES partners(id),
  customer_lat       double precision,
  customer_lng       double precision,
  distance_km        double precision,
  status             text NOT NULL DEFAULT 'sent'
                     CHECK (status IN ('created','sent','opened','available','partial','unavailable','completed','cancelled','expired')),
  pharmacist_token_hash text NOT NULL UNIQUE,
  customer_token_hash   text NOT NULL UNIQUE,
  quoted_amount      numeric(10,2),
  service_fee        numeric(10,2) NOT NULL DEFAULT 0,
  pharmacist_note    text,
  flagged            boolean NOT NULL DEFAULT false,   -- e.g. confirmed from the customer's own device
  created_ip_hash    text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  opened_at          timestamptz,
  responded_at       timestamptz,
  completed_at       timestamptz
);
CREATE INDEX requests_pharmacy_idx ON requests (pharmacy_id, created_at DESC);
CREATE INDEX requests_customer_idx ON requests (customer_id, created_at DESC);
CREATE INDEX requests_status_idx   ON requests (status, created_at);

CREATE TABLE ratings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id   uuid NOT NULL UNIQUE REFERENCES requests(id),
  pharmacy_id  uuid NOT NULL REFERENCES pharmacies(id),
  customer_id  uuid NOT NULL,
  stars        smallint NOT NULL CHECK (stars BETWEEN 1 AND 5),
  comment      text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------- delivery & payments (ready for later)
CREATE TABLE deliveries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id    uuid NOT NULL REFERENCES requests(id),
  mode          text NOT NULL CHECK (mode IN ('pharmacy','platform')),
  partner_id    uuid REFERENCES partners(id),
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','assigned','picked_up','delivered','failed','cancelled')),
  fee           numeric(10,2),
  address       jsonb,
  tracking      jsonb NOT NULL DEFAULT '{}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id     uuid REFERENCES requests(id),
  customer_id    uuid NOT NULL,
  pharmacy_id    uuid REFERENCES pharmacies(id),
  medicine_amount numeric(10,2) NOT NULL DEFAULT 0,
  service_fee    numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee   numeric(10,2) NOT NULL DEFAULT 0,
  currency       text NOT NULL DEFAULT 'SAR',
  provider       text,
  provider_ref   text,
  status         text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','authorized','paid','refunded','failed','cancelled')),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------- offers & paid advertising
CREATE TABLE offers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id  uuid REFERENCES pharmacies(id),
  partner_id   uuid REFERENCES partners(id),
  title_en     text,
  title_ar     text,
  body_en      text,
  body_ar      text,
  badge        text,                 -- e.g. "-20%"
  image_url    text,
  link_url     text,
  placement    text NOT NULL DEFAULT 'home' CHECK (placement IN ('home','results','pharmacy')),
  sponsored    boolean NOT NULL DEFAULT false,
  fee_amount   numeric(10,2) NOT NULL DEFAULT 0,
  priority     int NOT NULL DEFAULT 0,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','live','paused','ended')),
  starts_at    timestamptz NOT NULL DEFAULT now(),
  ends_at      timestamptz,
  impressions  bigint NOT NULL DEFAULT 0,
  clicks       bigint NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX offers_live_idx ON offers (placement, status, priority DESC);

-- ---------------------------------------------------------------- traffic
CREATE TABLE daily_metrics (
  day     date NOT NULL,
  metric  text NOT NULL,
  value   bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (day, metric)
);

-- ---------------------------------------------------------------- the permanent ledger
CREATE TABLE events (
  id           bigserial PRIMARY KEY,
  type         text NOT NULL,              -- e.g. search, request.created, request.completed, rating.created
  actor_type   text NOT NULL,              -- customer | pharmacist | admin | system
  actor_id     text,
  subject_type text,                       -- pharmacy | drug | request | offer ...
  subject_id   text,
  payload      jsonb NOT NULL DEFAULT '{}',
  ip_hash      text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX events_type_time_idx    ON events (type, created_at);
CREATE INDEX events_subject_idx      ON events (subject_type, subject_id, created_at);

CREATE OR REPLACE FUNCTION events_append_only() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'events is append-only';
END $$;
CREATE TRIGGER events_no_update BEFORE UPDATE OR DELETE ON events
  FOR EACH ROW EXECUTE FUNCTION events_append_only();
CREATE TRIGGER events_no_truncate BEFORE TRUNCATE ON events
  FOR EACH STATEMENT EXECUTE FUNCTION events_append_only();
