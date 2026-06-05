
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_user_type TEXT;
  v_phone TEXT;
  v_pincode TEXT;
  v_full_name TEXT;
BEGIN
  v_user_type := NEW.raw_user_meta_data ->> 'user_type';
  IF v_user_type IS NULL OR v_user_type NOT IN ('customer', 'vendor') THEN
    v_user_type := 'customer';
  END IF;

  v_phone := NEW.raw_user_meta_data ->> 'phone_number';
  IF v_phone IS NOT NULL AND v_phone != '' AND NOT (v_phone ~ '^[0-9]{10}$') THEN
    RAISE EXCEPTION 'Invalid phone_number: must be exactly 10 digits';
  END IF;

  v_pincode := NEW.raw_user_meta_data ->> 'pincode';
  IF v_pincode IS NOT NULL AND v_pincode != '' AND NOT (v_pincode ~ '^[0-9]{6}$') THEN
    RAISE EXCEPTION 'Invalid pincode: must be exactly 6 digits';
  END IF;

  v_full_name := substring(
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      ''
    ), 1, 100
  );

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
