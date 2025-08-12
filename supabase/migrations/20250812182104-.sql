-- Blog subscribers table for newsletter signups
BEGIN;

CREATE TABLE IF NOT EXISTS public.blog_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS and restrict reads by default
ALTER TABLE public.blog_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including unauthenticated) to subscribe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'blog_subscribers' AND policyname = 'Anyone can subscribe'
  ) THEN
    CREATE POLICY "Anyone can subscribe"
    ON public.blog_subscribers
    FOR INSERT
    WITH CHECK (true);
  END IF;
END$$;

COMMIT;