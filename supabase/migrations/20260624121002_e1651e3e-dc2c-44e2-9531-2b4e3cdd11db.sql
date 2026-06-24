
-- Break recursion between projects and bids policies using SECURITY DEFINER functions

CREATE OR REPLACE FUNCTION public.vendor_has_bid_on_project(_project_id uuid, _vendor_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bids
    WHERE project_id = _project_id AND vendor_id = _vendor_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_project_owner(_project_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects
    WHERE id = _project_id AND customer_id = _user_id
  )
$$;

DROP POLICY IF EXISTS "Vendors can view projects they have bid on" ON public.projects;
CREATE POLICY "Vendors can view projects they have bid on"
  ON public.projects FOR SELECT
  USING (auth.uid() IS NOT NULL AND public.vendor_has_bid_on_project(id, auth.uid()));

DROP POLICY IF EXISTS "Customers can view bids on their projects" ON public.bids;
CREATE POLICY "Customers can view bids on their projects"
  ON public.bids FOR SELECT
  USING (public.is_project_owner(project_id, auth.uid()));
