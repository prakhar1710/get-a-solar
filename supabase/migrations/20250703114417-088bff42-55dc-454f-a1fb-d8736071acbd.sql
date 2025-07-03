
-- Add email column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN email text;

-- Update the trigger function to also store the email from auth.users
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
    email,
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
    NEW.email,
    NOW(), 
    NOW()
  );
  RETURN NEW;
END;
$function$;

-- Update existing profiles with email from auth.users (optional, for existing users)
UPDATE public.profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.id = auth.users.id 
AND profiles.email IS NULL;
