-- Run once on an existing PostgreSQL/Neon/Supabase database before saving the new admin fields.
-- Existing prices, product IDs, variant IDs and galleries are preserved.
BEGIN;
ALTER TABLE products ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10, 2);
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS color_hex VARCHAR(7);
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}';
COMMIT;
