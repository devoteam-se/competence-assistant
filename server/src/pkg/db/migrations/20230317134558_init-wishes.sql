-- migrate:up
CREATE TABLE wishes (
  id UUID PRIMARY KEY,
  name VARCHAR (255) NOT NULL,
  description VARCHAR NOT NULL,
  type session_type,
  level session_level,
  user_id VARCHAR(255),
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_user_id
    FOREIGN KEY(user_id) 
    REFERENCES users(id)
);


-- migrate:down
DROP TABLE IF EXISTS wishes;
