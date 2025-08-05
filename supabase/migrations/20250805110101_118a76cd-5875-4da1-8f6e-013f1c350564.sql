-- Create function to handle new user signup and populate profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    phone_number, 
    pincode, 
    user_type, 
    electricity_bill,
    email
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
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
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();