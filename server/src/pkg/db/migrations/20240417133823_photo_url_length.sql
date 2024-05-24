-- migrate:up
ALTER TABLE users
  ALTER COLUMN photo_url TYPE text;

-- migrate:down
ALTER TABLE users
  ALTER COLUMN photo_url TYPE VARCHAR(255);

