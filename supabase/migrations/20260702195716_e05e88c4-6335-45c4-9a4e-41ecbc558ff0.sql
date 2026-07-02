CREATE OR REPLACE VIEW public.vendor_directory 
WITH (security_invoker = false) AS
SELECT id, full_name, user_type
FROM public.profiles
WHERE user_type = 'vendor';

GRANT SELECT ON public.vendor_directory TO anon, authenticated;