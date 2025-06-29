-- Create helper functions for authentication
CREATE OR REPLACE FUNCTION get_user_email_by_university_id(university_id_param text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM users WHERE university_id = university_id_param LIMIT 1;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_user_email_by_university_id(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_email_by_university_id(text) TO anon;

-- Create a trigger function to automatically create user profile after email confirmation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create profile if email is confirmed and profile doesn't exist
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    INSERT INTO public.users (id, email, name, university_id, mobile, gender, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
      COALESCE(NEW.raw_user_meta_data->>'university_id', 'TEMP_' || substr(NEW.id::text, 1, 8)),
      COALESCE(NEW.raw_user_meta_data->>'mobile', ''),
      COALESCE(NEW.raw_user_meta_data->>'gender', 'Male'),
      COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();