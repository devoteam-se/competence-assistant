-- migrate:up
UPDATE sessions SET published = TRUE WHERE sessions.event_id IS NOT NULL;

-- migrate:down
UPDATE sessions SET published = FALSE;