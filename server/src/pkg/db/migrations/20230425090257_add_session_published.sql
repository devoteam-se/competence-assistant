-- migrate:up
ALTER TABLE sessions ADD COLUMN published BOOLEAN NOT NULL DEFAULT FALSE;

-- migrate:down
ALTER TABLE sessions DROP COLUMN published;