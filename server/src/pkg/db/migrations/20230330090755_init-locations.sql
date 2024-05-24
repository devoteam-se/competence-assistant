-- migrate:up
CREATE TABLE IF NOT EXISTS location_rooms_templates (
  location_name VARCHAR(255) NOT NULL,
  room_name VARCHAR(255) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  PRIMARY KEY(location_name, room_name)
);

-- migrate:down
DROP TABLE IF EXISTS location_rooms_templates;

