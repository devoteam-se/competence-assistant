-- migrate:up
ALTER TABLE sessions ADD COLUMN max_participants int;

-- migrate:down
ALTER TABLE sessions DROP COLUMN max_participants;
