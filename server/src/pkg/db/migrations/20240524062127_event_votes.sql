-- migrate:up
ALTER TABLE votes
  ADD COLUMN event_id uuid REFERENCES events(id) ON DELETE CASCADE;

UPDATE
  votes
SET
  event_id =(
    SELECT
      event_id
    FROM
      sessions
    WHERE
      sessions.id = votes.session_id);

-- cleanup invalid votes
DELETE FROM votes
WHERE event_id IS NULL;

ALTER TABLE votes
  ALTER COLUMN event_id SET NOT NULL;

ALTER TABLE votes
  DROP CONSTRAINT votes_pkey;

ALTER TABLE votes
  ADD PRIMARY KEY (session_id, user_id, event_id);

-- migrate:down
ALTER TABLE votes
  DROP COLUMN event_id;

ALTER TABLE votes
  ADD PRIMARY KEY (session_id, user_id);

