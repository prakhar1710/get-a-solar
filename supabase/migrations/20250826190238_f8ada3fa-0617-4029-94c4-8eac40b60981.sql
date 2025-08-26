-- Fix infinite recursion in RLS policies by removing circular dependencies

-- Drop the problematic profiles policy that causes infinite recursion
DROP POLICY IF EXISTS "Customers can view vendor profiles for their project bids" ON public.profiles;

-- Drop the projects policy that also contributes to the circular reference  
DROP POLICY IF EXISTS "Authenticated vendors can view open projects" ON public.projects;

-- Create safer, simpler policies without circular dependencies

-- Allow vendors to view open projects without checking profiles table
CREATE POLICY "Vendors can view open projects" 
ON public.projects 
FOR SELECT 
USING (
  status = 'open' AND 
  auth.uid() IS NOT NULL
);

-- Allow customers to view basic vendor profile info (without checking bids/projects)
CREATE POLICY "Public can view vendor profiles" 
ON public.profiles 
FOR SELECT 
USING (user_type = 'vendor');

-- Ensure users can still access their own profile  
-- (This policy already exists, but let's make sure it's working)
DROP POLICY IF EXISTS "Users can select own profile" ON public.profiles;
CREATE POLICY "Users can select own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);