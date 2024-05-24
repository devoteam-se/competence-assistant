-- migrate:up
ALTER TABLE sessions
    ADD COLUMN created_from_session_id uuid DEFAULT NULL
        REFERENCES sessions (id) ON DELETE SET NULL;

COMMENT ON COLUMN sessions.created_from_session_id IS 'Reference to the session this session was created from.';

-- migrate:down
ALTER TABLE sessions
    DROP COLUMN created_from_session_id;

