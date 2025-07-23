-- Fix the trigger function to properly handle phone number extraction
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Log the raw_user_meta_data for debugging
  RAISE LOG 'Creating profile for user % with metadata: %', NEW.id, NEW.raw_user_meta_data;
  
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