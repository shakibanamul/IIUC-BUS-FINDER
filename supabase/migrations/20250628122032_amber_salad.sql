/*
  # Create notices table

  1. New Tables
    - `notices`
      - `id` (uuid, primary key)
      - `title` (text) - notice title
      - `content` (text) - notice content
      - `published_at` (timestamp)

  2. Security
    - Enable RLS on `notices` table
    - Add policies for all authenticated users to read notices
    - Add policies for admin to manage notices
*/

CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  published_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read notices
CREATE POLICY "Authenticated users can read notices"
  ON notices
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admin can insert notices
CREATE POLICY "Admin can insert notices"
  ON notices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admin can update notices
CREATE POLICY "Admin can update notices"
  ON notices
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admin can delete notices
CREATE POLICY "Admin can delete notices"
  ON notices
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notices_published_at ON notices(published_at);