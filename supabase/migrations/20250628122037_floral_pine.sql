/*
  # Insert sample data for testing

  1. Sample Users
    - Admin user
    - Teacher user  
    - Student users (male and female)

  2. Sample Bus Schedules
    - Import existing schedule data from the application

  3. Sample Notices
    - Welcome notice
    - Service update notice
*/

-- Insert sample users (passwords will be set through Supabase Auth)
-- Note: These IDs should match the auth.users IDs created through signup

-- Sample bus schedules (converting from existing data)
INSERT INTO bus_schedules (time, starting_point, route, end_point, direction, gender, schedule_type) VALUES
-- Regular Schedule - Female Students
('6:40 AM', 'Baroyarhat', 'Baroyarhat–Mirsharai–Borodargahat–Sitakunda–IIUC', 'IIUC', 'CityToIIUC', 'Female', 'Regular'),
('6:45 AM', 'Hathazari College', 'Hathazari College–Borodighirpar–Baizid Link Road–IIUC', 'IIUC', 'CityToIIUC', 'Female', 'Regular'),
('6:50 AM', 'Didar Market', 'Didar Market–Kotowali–Kadamtali–Dewan Hat–IIUC', 'IIUC', 'CityToIIUC', 'Female', 'Regular'),
('7:00 AM', 'BOT', 'Muradpur–2 no gate–Baizid Link Road–IIUC', 'IIUC', 'CityToIIUC', 'Female', 'Regular'),
('7:00 AM', 'Chatteswari', 'Chatteswari Road–GEC–2 no gate–Baizid Link Road–IIUC', 'IIUC', 'CityToIIUC', 'Female', 'Regular'),

-- Regular Schedule - Male Students  
('8:30 AM', 'CUET', 'CUET Gate–Kuwaish–Oxygen–IIUC', 'IIUC', 'CityToIIUC', 'Male', 'Regular'),
('9:00 AM', 'BOT', 'BOT (Bahaddarhat)–Muradpur–2 no gate–Baizid Link Road–IIUC', 'IIUC', 'CityToIIUC', 'Male', 'Regular'),
('9:05 AM', 'Chatteswari', 'Chatteswari Road–GEC–2 no gate–Baizid Link Road–IIUC', 'IIUC', 'CityToIIUC', 'Male', 'Regular'),

-- Return Shuttles
('11:00 AM', 'IIUC', 'IIUC–KoibolyoDham–Noyabazar–Boropul', 'Boropul', 'IIUCToCity', 'Female', 'Regular'),
('1:30 PM', 'IIUC', 'All approved routes', 'All points', 'IIUCToCity', 'Female', 'Regular'),
('4:35 PM', 'IIUC', 'All approved routes', 'All points', 'IIUCToCity', 'Female', 'Regular'),

-- Friday Schedule
('7:30 AM', 'BOT', 'BOT–Chatteswari–WASA–GEC–Khulshi–AK Khan–IIUC', 'IIUC', 'ToUniversity', NULL, 'Friday'),
('7:45 AM', 'BOT', 'BOT–Muradpur–2 no gate–Baizid Link Road–IIUC', 'IIUC', 'ToUniversity', NULL, 'Friday'),
('8:00 AM', 'Agrabad', 'Agrabad–Noyabazar–Boropool–AK Khan–IIUC', 'IIUC', 'ToUniversity', NULL, 'Friday'),
('9:30 AM', 'BOT', 'BOT–Muradpur–2 no gate–Baizid Link Road–IIUC', 'IIUC', 'ToUniversity', NULL, 'Friday'),
('12:10 PM', 'IIUC', 'IIUC–AK Khan–Wireless–Khulshi–WASA–Chatteswari Road', 'Chatteswari Road', 'FromUniversity', NULL, 'Friday'),
('2:40 PM', 'IIUC', 'IIUC–Baizid Link Road–2 no gate–Muradpur–BOT', 'BOT', 'FromUniversity', NULL, 'Friday'),
('6:30 PM', 'IIUC', 'IIUC–AK Khan–Wireless–Khulshi–WASA–Chatteswari Road', 'Chatteswari Road', 'FromUniversity', NULL, 'Friday')

ON CONFLICT DO NOTHING;

-- Insert sample notices
INSERT INTO notices (title, content) VALUES
('Welcome to IIUC Bus System', 'Welcome to the new IIUC Bus Schedule Management System. You can now view schedules, submit feedback, and stay updated with the latest transport information.'),
('Service Update - New Routes Added', 'We have added new bus routes to better serve our students and faculty. Check the latest schedules for updated timings and routes.'),
('Friday Schedule Changes', 'Please note the special Friday schedule with AC bus services for teachers and staff. Regular students should check their designated timings.')

ON CONFLICT DO NOTHING;