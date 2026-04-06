
-- Drop the permissive RLS policy that exposes PII
DROP POLICY IF EXISTS "Public can view vendor profiles" ON public.profiles;

-- Create a public view with only non-sensitive fields
CREATE OR REPLACE VIEW public.vendor_directory AS
SELECT id, full_name, user_type
FROM public.profiles
WHERE user_type = 'vendor';

-- Grant public access to the view
GRANT SELECT ON public.vendor_directory TO anon, authenticated;
