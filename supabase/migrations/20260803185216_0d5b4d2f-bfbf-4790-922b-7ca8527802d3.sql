CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, full_name, phone_number, pincode, user_type, electricity_bill, email
  )
  VALUES (
    NEW.id,
    NULLIF(COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      NEW.raw_user_meta_data ->> 'given_name',
      ''
    ), ''),
    NEW.raw_user_meta_data ->> 'phone_number',
    NEW.raw_user_meta_data ->> 'pincode',
    NEW.raw_user_meta_data ->> 'user_type',
    CASE
      WHEN NEW.raw_user_meta_data ->> 'electricity_bill' IS NOT NULL
      THEN (NEW.raw_user_meta_data ->> 'electricity_bill')::numeric
      ELSE NULL
    END,
    NEW.email
  );
  RETURN NEW;
END;
$function$;

UPDATE public.profiles p
SET full_name = COALESCE(NULLIF(p.full_name, ''), u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
    email = COALESCE(NULLIF(p.email, ''), u.email)
FROM auth.users u
WHERE u.id = p.id
  AND (NULLIF(p.full_name, '') IS NULL OR NULLIF(p.email, '') IS NULL);