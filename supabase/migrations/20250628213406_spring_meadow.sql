/*
  # Create complaints table for student complaints

  1. New Tables
    - `complaints`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text) - complaint title
      - `description` (text) - detailed complaint description
      - `category` (text) - type of complaint
      - `priority` (text) - urgency level
      - `status` (text) - current status
      - `bus_route` (text, optional) - related bus route
      - `incident_time` (text, optional) - when incident occurred
      - `admin_response` (text, optional) - admin response
      - `resolved_at` (timestamp, optional) - resolution time
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `complaints` table
    - Add policies for students to create and view their own complaints
    - Add policies for admin to view and manage all complaints
*/

CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('delay', 'safety', 'driver_behavior', 'bus_condition', 'route_issue', 'other')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')) DEFAULT 'pending',
  bus_route text,
  incident_time text,
  admin_response text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Policy: Students can insert their own complaints
CREATE POLICY "Students can insert own complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND get_user_role(auth.uid()) = 'student'
  );

-- Policy: Users can read their own complaints
CREATE POLICY "Users can read own complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Admin can read all complaints
CREATE POLICY "Admin can read all complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- Policy: Admin can update all complaints
CREATE POLICY "Admin can update all complaints"
  ON complaints
  FOR UPDATE
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- Policy: Admin can delete complaints
CREATE POLICY "Admin can delete complaints"
  ON complaints
  FOR DELETE
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at);