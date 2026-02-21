INSERT INTO issues (title, description, category, status, priority, reporter_name, reporter_email, reporter_phone, latitude, longitude, address, department, upvotes, created_at, updated_at, resolved_at) VALUES
('Large pothole on MG Road', 'A dangerous pothole near the central bus stop causing accidents for two-wheelers. About 2 feet wide and 6 inches deep.', 'pothole', 'reported', 'high', 'Arjun Mehta', 'arjun.m@email.com', '9876543210', 12.9716, 77.5946, 'MG Road, Near Central Bus Stop, Bengaluru', 'Roads & Infrastructure', 24, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NULL),

('Water pipeline burst on 5th Cross', 'Major water leak from the main pipeline. Water is flooding the street and wasting thousands of litres daily.', 'water_leak', 'in_progress', 'critical', 'Priya Sharma', 'priya.s@email.com', '9876543211', 12.9352, 77.6245, '5th Cross, Indiranagar, Bengaluru', 'Water Supply', 45, NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', NULL),

('Streetlight not working on Brigade Road', 'Three consecutive streetlights are not functioning for the past week. The area becomes very dark and unsafe at night.', 'streetlight', 'resolved', 'medium', 'Karthik Iyer', 'karthik.i@email.com', '9876543212', 12.9719, 77.6072, 'Brigade Road, Near Garuda Mall, Bengaluru', 'Electrical', 12, NOW() - INTERVAL '14 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

('Blocked drainage causing waterlogging', 'The storm drain is completely blocked with garbage. During rains, the entire area gets flooded knee-deep.', 'drainage', 'reported', 'high', 'Meena Kumari', 'meena.k@email.com', '9876543213', 12.9783, 77.5713, 'Rajajinagar 2nd Block, Bengaluru', 'Drainage & Sewage', 38, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL),

('Garbage not collected for a week', 'The BBMP garbage truck has not visited our area for over a week. Garbage is piling up at the collection point and attracting stray dogs.', 'garbage', 'in_progress', 'medium', 'Suresh Reddy', 'suresh.r@email.com', '9876543214', 12.9698, 77.7500, 'Whitefield Main Road, Bengaluru', 'Sanitation', 19, NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days', NULL),

('Road surface damaged after construction', 'The road was dug up for cable laying 2 months ago but never properly repaired. The surface is uneven and dangerous.', 'road_damage', 'reported', 'medium', 'Lakshmi Narasimhan', 'lakshmi.n@email.com', '9876543215', 12.9850, 77.5533, 'Malleswaram 15th Cross, Bengaluru', 'Roads & Infrastructure', 15, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days', NULL),

('Sewage overflow near school', 'Raw sewage is overflowing onto the road right next to the government school. This is a serious health hazard for children.', 'sewage', 'in_progress', 'critical', 'Anjali Desai', 'anjali.d@email.com', '9876543216', 12.9560, 77.5900, 'Basavanagudi, Near Govt School, Bengaluru', 'Drainage & Sewage', 67, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', NULL),

('Multiple potholes on Outer Ring Road', 'A stretch of about 200 meters has multiple potholes making it extremely dangerous for commuters during rush hour.', 'pothole', 'reported', 'critical', 'Ravi Kumar', 'ravi.k@email.com', '9876543217', 12.9300, 77.6800, 'Outer Ring Road, Near Marathahalli Bridge, Bengaluru', 'Roads & Infrastructure', 89, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NULL),

('Streetlight pole leaning dangerously', 'A streetlight pole is leaning at a 45-degree angle after being hit by a truck. It could fall anytime and injure pedestrians.', 'streetlight', 'resolved', 'critical', 'Deepak Joshi', 'deepak.j@email.com', '9876543218', 12.9400, 77.5800, 'Jayanagar 4th Block, Bengaluru', 'Electrical', 33, NOW() - INTERVAL '20 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

('Water contamination in Koramangala', 'The tap water has turned yellowish and has a foul smell. Multiple residents in the area are falling sick.', 'water_leak', 'in_progress', 'critical', 'Nisha Patel', 'nisha.p@email.com', '9876543219', 12.9352, 77.6245, 'Koramangala 1st Block, Bengaluru', 'Water Supply', 102, NOW() - INTERVAL '2 days', NOW() - INTERVAL '6 hours', NULL),

('Illegal garbage dumping in empty plot', 'An empty plot is being used as an illegal garbage dump. The smell is unbearable and mosquito breeding is rampant.', 'garbage', 'dismissed', 'low', 'Ramesh Gupta', 'ramesh.g@email.com', '9876543220', 12.9600, 77.5700, 'BTM Layout 2nd Stage, Bengaluru', 'Sanitation', 8, NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days', NULL),

('Broken footpath tiles causing injuries', 'Several tiles on the footpath are broken or missing. An elderly person tripped and fell yesterday.', 'road_damage', 'reported', 'high', 'Kavitha Rao', 'kavitha.r@email.com', '9876543221', 12.9750, 77.6100, 'Commercial Street, Bengaluru', 'Roads & Infrastructure', 21, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days', NULL);

-- Add some status update history
INSERT INTO issue_updates (issue_id, old_status, new_status, comment, updated_by, created_at) VALUES
(2, 'reported', 'in_progress', 'Dispatched maintenance team to assess the burst pipeline.', 'Admin - Water Dept', NOW() - INTERVAL '3 days'),
(3, 'reported', 'in_progress', 'Electrical team assigned for repair.', 'Admin - Electrical', NOW() - INTERVAL '10 days'),
(3, 'in_progress', 'resolved', 'All three streetlights have been repaired and tested.', 'Admin - Electrical', NOW() - INTERVAL '2 days'),
(5, 'reported', 'in_progress', 'Notified sanitation contractor. Pickup scheduled for tomorrow.', 'Admin - Sanitation', NOW() - INTERVAL '3 days'),
(7, 'reported', 'in_progress', 'Emergency sewage cleanup team dispatched.', 'Admin - Drainage', NOW() - INTERVAL '2 days'),
(9, 'reported', 'in_progress', 'Emergency crew sent to secure the pole.', 'Admin - Electrical', NOW() - INTERVAL '15 days'),
(9, 'in_progress', 'resolved', 'Pole has been replaced with a new one.', 'Admin - Electrical', NOW() - INTERVAL '5 days'),
(10, 'reported', 'in_progress', 'Water quality testing initiated. Advisory issued to residents.', 'Admin - Water Dept', NOW() - INTERVAL '1 day'),
(11, 'reported', 'dismissed', 'This is private property. The owner has been notified separately.', 'Admin - Sanitation', NOW() - INTERVAL '25 days');
