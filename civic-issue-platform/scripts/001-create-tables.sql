-- Create enum types
CREATE TYPE issue_status AS ENUM ('reported', 'in_progress', 'resolved', 'dismissed');
CREATE TYPE issue_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE issue_category AS ENUM ('pothole', 'water_leak', 'streetlight', 'drainage', 'garbage', 'road_damage', 'sewage', 'other');

-- Issues table
CREATE TABLE IF NOT EXISTS issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category issue_category NOT NULL DEFAULT 'other',
  status issue_status NOT NULL DEFAULT 'reported',
  priority issue_priority NOT NULL DEFAULT 'medium',
  reporter_name VARCHAR(100) NOT NULL,
  reporter_email VARCHAR(255),
  reporter_phone VARCHAR(20),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  image_url TEXT,
  department VARCHAR(100),
  admin_notes TEXT,
  upvotes INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Status history table for tracking updates
CREATE TABLE IF NOT EXISTS issue_updates (
  id SERIAL PRIMARY KEY,
  issue_id INT NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  old_status issue_status,
  new_status issue_status NOT NULL,
  comment TEXT,
  updated_by VARCHAR(100) DEFAULT 'System',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_created_at ON issues(created_at);
CREATE INDEX idx_issue_updates_issue_id ON issue_updates(issue_id);
