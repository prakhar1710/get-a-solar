DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;

CREATE POLICY "Authenticated users can view reviews"
ON public.reviews
FOR SELECT
TO authenticated
USING (true);

REVOKE ALL ON public.reviews FROM anon;
REVOKE ALL ON public.blog_subscribers FROM anon;
GRANT INSERT ON public.blog_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT INSERT ON public.blog_subscribers TO authenticated;
GRANT SELECT ON public.blog_subscribers TO authenticated;