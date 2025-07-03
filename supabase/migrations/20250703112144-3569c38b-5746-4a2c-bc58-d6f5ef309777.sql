
-- First, let's update the RLS policies to allow profile creation during signup
-- We need to allow upsert operations for new users

-- Drop the existing conflicting policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;

-- Create a single, clear INSERT policy that works during signup
CREATE POLICY "Users can insert their own profile during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Also update the trigger function to handle signup data properly
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    phone_number, 
    pincode, 
    user_type, 
    electricity_bill,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'pincode',
    NEW.raw_user_meta_data->>'user_type',
    CASE 
      WHEN NEW.raw_user_meta_data->>'electricity_bill' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'electricity_bill')::numeric 
      ELSE NULL 
    END,
    NOW(), 
    NOW()
  );
  RETURN NEW;
END;
$function$;
