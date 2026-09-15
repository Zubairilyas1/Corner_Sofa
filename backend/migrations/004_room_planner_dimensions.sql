-- Optional verified catalogue measurements used by the room planner.
ALTER TABLE products ADD COLUMN IF NOT EXISTS dimensions_cm JSONB;
