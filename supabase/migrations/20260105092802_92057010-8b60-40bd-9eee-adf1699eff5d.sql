-- Fix 1: Update handle_new_user_profile() to validate user inputs
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
DECLARE
  v_user_type TEXT;
  v_phone TEXT;
  v_pincode TEXT;
  v_full_name TEXT;
BEGIN
  -- Validate and constrain user_type
  v_user_type := NEW.raw_user_meta_data ->> 'user_type';
  IF v_user_type IS NULL OR v_user_type NOT IN ('customer', 'vendor') THEN
    RAISE EXCEPTION 'Invalid user_type: must be customer or vendor';
  END IF;
  
  -- Validate phone number (must be 10 digits if provided)
  v_phone := NEW.raw_user_meta_data ->> 'phone_number';
  IF v_phone IS NOT NULL AND v_phone != '' AND NOT (v_phone ~ '^[0-9]{10}$') THEN
    RAISE EXCEPTION 'Invalid phone_number: must be exactly 10 digits';
  END IF;
  
  -- Validate pincode (must be 6 digits if provided)
  v_pincode := NEW.raw_user_meta_data ->> 'pincode';
  IF v_pincode IS NOT NULL AND v_pincode != '' AND NOT (v_pincode ~ '^[0-9]{6}$') THEN
    RAISE EXCEPTION 'Invalid pincode: must be exactly 6 digits';
  END IF;
  
  -- Constrain full_name length (max 100 chars)
  v_full_name := substring(COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''), 1, 100);
  
  INSERT INTO public.profiles (
    id, full_name, phone_number, pincode, user_type, electricity_bill, email
  )
  VALUES (
    NEW.id,
    v_full_name,
    NULLIF(v_phone, ''),
    NULLIF(v_pincode, ''),
    v_user_type,
    CASE WHEN NEW.raw_user_meta_data ->> 'electricity_bill' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'electricity_bill')::numeric ELSE NULL END,
    NEW.email
  );
  RETURN NEW;
END;
$function$;

-- Fix 2: Add CHECK constraints on profiles table for defense-in-depth
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_user_type;
ALTER TABLE public.profiles ADD CONSTRAINT check_user_type CHECK (user_type IN ('customer', 'vendor'));

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_phone_format;
ALTER TABLE public.profiles ADD CONSTRAINT check_phone_format CHECK (phone_number IS NULL OR phone_number ~ '^[0-9]{10}$');

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_pincode_format;
ALTER TABLE public.profiles ADD CONSTRAINT check_pincode_format CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$');

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS check_full_name_length;
ALTER TABLE public.profiles ADD CONSTRAINT check_full_name_length CHECK (char_length(full_name) <= 100);

-- Fix 3: Drop old storage policy that uses profiles.user_type='admin'
DROP POLICY IF EXISTS "Admins can view all vendor certifications" ON storage.objects;

-- Fix 4: Create new storage policy using has_role()
CREATE POLICY "Admins can view all vendor certifications"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'vendor-certifications' 
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);