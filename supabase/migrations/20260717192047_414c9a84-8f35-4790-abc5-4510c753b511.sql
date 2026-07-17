ALTER TABLE public.bids
  ADD COLUMN IF NOT EXISTS equipment_brand TEXT,
  ADD COLUMN IF NOT EXISTS equipment_details TEXT;