CREATE POLICY "Vendors can view projects they have bid on"
ON public.projects
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.bids
    WHERE bids.project_id = projects.id
      AND bids.vendor_id = auth.uid()
  )
);