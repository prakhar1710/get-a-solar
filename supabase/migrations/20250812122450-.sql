-- Restrict bid visibility and enable minimal vendor identity visibility for customers
BEGIN;

-- Ensure RLS enabled
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 1) Tighten bids SELECT policies: remove permissive ones
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'bids' AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.bids;', pol.policyname);
  END LOOP;
END$$;

-- Vendors can view only their own bids
CREATE POLICY "Vendors can view own bids"
ON public.bids
FOR SELECT
USING (auth.uid() = vendor_id);

-- Customers can view bids placed on their projects
CREATE POLICY "Customers can view bids on their projects"
ON public.bids
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.projects p
    WHERE p.id = public.bids.project_id
      AND p.customer_id = auth.uid()
  )
);

-- 2) Allow customers to view vendor profile info only when related to their project bids
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Customers can view vendor profiles for their project bids'
  ) THEN
    CREATE POLICY "Customers can view vendor profiles for their project bids"
    ON public.profiles
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1
        FROM public.bids b
        JOIN public.projects p ON p.id = b.project_id
        WHERE b.vendor_id = public.profiles.id
          AND p.customer_id = auth.uid()
      )
    );
  END IF;
END$$;

COMMIT;