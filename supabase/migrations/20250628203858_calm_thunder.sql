/*
  # Create bus schedules table

  1. New Tables
    - `bus_schedules`
      - `id` (uuid, primary key)
      - `time` (text) - departure time
      - `starting_point` (text) - starting location
      - `route` (text) - full route description
      - `end_point` (text) - destination
      - `direction` (text) - direction type
      - `gender` (text, optional) - Male, Female, or null for all
      - `bus_type` (text, optional) - type of bus
      - `remarks` (text, optional) - additional notes
      - `description` (text, optional) - description
      - `schedule_type` (text) - Regular or Friday
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `bus_schedules` table
    - Add policies for authenticated users to read schedules
    - Add policies for students to see gender-appropriate schedules
    - Add policies for admin to manage schedules
*/

CREATE TABLE IF NOT EXISTS bus_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time text NOT NULL,
  starting_point text NOT NULL,
  route text NOT NULL,
  end_point text NOT NULL,
  direction text NOT NULL CHECK (direction IN ('CityToIIUC', 'IIUCToCity', 'ToUniversity', 'FromUniversity')),
  gender text CHECK (gender IN ('Male', 'Female')),
  bus_type text,
  remarks text,
  description text,
  schedule_type text NOT NULL CHECK (schedule_type IN ('Regular', 'Friday')) DEFAULT 'Regular',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE bus_schedules ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can read schedules
CREATE POLICY "Authenticated users can read schedules"
  ON bus_schedules
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Students see gender-appropriate schedules
CREATE POLICY "Students see appropriate schedules"
  ON bus_schedules
  FOR SELECT
  TO authenticated
  USING (
    -- Admin and teachers can see all
    get_user_role(auth.uid()) IN ('admin', 'teacher')
    OR
    -- Students see schedules for their gender or general schedules
    (
      get_user_role(auth.uid()) = 'student'
      AND (
        bus_schedules.gender IS NULL 
        OR bus_schedules.gender = get_user_gender(auth.uid())
      )
    )
  );

-- Policy: Admin can insert schedules
CREATE POLICY "Admin can insert schedules"
  ON bus_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role(auth.uid()) = 'admin');

-- Policy: Admin can update schedules
CREATE POLICY "Admin can update schedules"
  ON bus_schedules
  FOR UPDATE
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- Policy: Admin can delete schedules
CREATE POLICY "Admin can delete schedules"
  ON bus_schedules
  FOR DELETE
  TO authenticated
  USING (get_user_role(auth.uid()) = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bus_schedules_time ON bus_schedules(time);
CREATE INDEX IF NOT EXISTS idx_bus_schedules_gender ON bus_schedules(gender);
CREATE INDEX IF NOT EXISTS idx_bus_schedules_schedule_type ON bus_schedules(schedule_type);
CREATE INDEX IF NOT EXISTS idx_bus_schedules_direction ON bus_schedules(direction);