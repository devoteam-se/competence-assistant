-- migrate:up
CREATE TYPE session_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

ALTER TABLE sessions ADD COLUMN level session_level;

-- migrate:down
ALTER TABLE sessions DROP COLUMN level;

DROP TYPE IF EXISTS session_level;
