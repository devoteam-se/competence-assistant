-- migrate:up
ALTER TABLE sessions ADD COLUMN feedback_url VARCHAR(512);
-- migrate:down
ALTER TABLE sessions DROP COLUMN feedback_url;

