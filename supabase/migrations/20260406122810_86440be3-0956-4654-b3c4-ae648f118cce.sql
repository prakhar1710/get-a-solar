
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.blog_subscribers;

CREATE POLICY "Anyone can subscribe"
ON public.blog_subscribers
FOR INSERT
TO public
WITH CHECK (
  email IS NOT NULL AND email <> '' AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);
