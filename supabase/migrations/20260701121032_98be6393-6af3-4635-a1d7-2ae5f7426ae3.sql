
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  installation_quality SMALLINT NOT NULL CHECK (installation_quality BETWEEN 1 AND 5),
  timeline_promptness SMALLINT NOT NULL CHECK (timeline_promptness BETWEEN 1 AND 5),
  subsidy_paperwork SMALLINT NOT NULL CHECK (subsidy_paperwork BETWEEN 1 AND 5),
  communication_professionalism SMALLINT NOT NULL CHECK (communication_professionalism BETWEEN 1 AND 5),
  average_rating NUMERIC(3,2) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Customers can create reviews for their completed projects"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = customer_id
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
        AND p.customer_id = auth.uid()
        AND p.status IN ('completed', 'awarded', 'closed')
    )
  );

CREATE POLICY "Customers can update their own reviews"
  ON public.reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can delete their own reviews"
  ON public.reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = customer_id);

CREATE INDEX reviews_vendor_id_idx ON public.reviews(vendor_id);
CREATE INDEX reviews_customer_id_idx ON public.reviews(customer_id);

CREATE OR REPLACE FUNCTION public.set_review_average()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.average_rating := ROUND((
    NEW.installation_quality
    + NEW.timeline_promptness
    + NEW.subsidy_paperwork
    + NEW.communication_professionalism
  )::numeric / 4.0, 2);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER reviews_set_average
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_review_average();
