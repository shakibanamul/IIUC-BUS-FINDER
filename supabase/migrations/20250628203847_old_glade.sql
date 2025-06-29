-- 1. Create `users` table for IIUC Bus System

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  university_id text UNIQUE NOT NULL,
  mobile text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('Male', 'Female')),
  role text NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  created_at timestamptz DEFAULT now()
);

-- 2. Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM users WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION get_user_gender(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT gender FROM users WHERE id = user_id;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_gender(uuid) TO authenticated;

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- 4.1 INSERT: Users can insert their own data
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 4.2 SELECT: Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 4.3 UPDATE: Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 4.4 SELECT: Admin can read all users
CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- 4.5 UPDATE: Admin can update all users
CREATE POLICY "Admin can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- 4.6 DELETE: Admin can delete users
CREATE POLICY "Admin can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_university_id ON users(university_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);