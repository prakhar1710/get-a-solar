
-- 1. Lock down has_role: revoke from PUBLIC and anon; keep for authenticated (needed by RLS)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- 2. Prevent vendors from creating projects (and thus from seeing competitor bids on their own projects)
DROP POLICY IF EXISTS "Customers can insert their own projects" ON public.projects;
CREATE POLICY "Customers can insert their own projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = customer_id
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.user_type = 'customer'
  )
);
