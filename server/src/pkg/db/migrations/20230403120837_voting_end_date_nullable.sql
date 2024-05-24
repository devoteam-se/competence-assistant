-- migrate:up
ALTER TABLE events
    ALTER COLUMN voting_end_date DROP NOT NULL;

-- migrate:down
ALTER TABLE events
    ALTER COLUMN voting_end_date SET NOT NULL;
