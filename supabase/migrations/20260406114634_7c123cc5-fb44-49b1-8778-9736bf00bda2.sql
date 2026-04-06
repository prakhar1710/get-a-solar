
-- Recreate view with SECURITY INVOKER to fix the security definer warning
CREATE OR REPLACE VIEW public.vendor_directory 
WITH (security_invoker = true) AS
SELECT id, full_name, user_type
FROM public.profiles
WHERE user_type = 'vendor';
