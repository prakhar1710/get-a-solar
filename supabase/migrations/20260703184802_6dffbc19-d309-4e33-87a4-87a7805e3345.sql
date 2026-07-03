CREATE OR REPLACE VIEW public.vendor_directory 
WITH (security_invoker = true) AS
SELECT id, full_name, user_type
FROM public.profiles
WHERE user_type = 'vendor';

ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS vendor_name text;

UPDATE public.bids b
SET vendor_name = p.full_name
FROM public.profiles p
WHERE b.vendor_id = p.id;