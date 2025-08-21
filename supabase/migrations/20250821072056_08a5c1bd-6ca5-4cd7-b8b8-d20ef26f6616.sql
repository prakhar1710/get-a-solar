-- Remove the overly permissive public read policy
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;

-- Add secure policy for customers to view their own projects
CREATE POLICY "Customers can view their own projects" ON public.projects
FOR SELECT 
USING (auth.uid() = customer_id);

-- Add secure policy for authenticated vendors to view only open projects
CREATE POLICY "Authenticated vendors can view open projects" ON public.projects
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND status = 'open'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_type = 'vendor'
  )
);