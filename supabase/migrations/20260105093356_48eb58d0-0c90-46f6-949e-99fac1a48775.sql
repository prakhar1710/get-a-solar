-- Add explicit admin-only SELECT policy for blog_subscribers table
-- This documents the security intent and enables admin dashboard functionality
CREATE POLICY "Admins can view all subscribers"
ON public.blog_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));