-- migrate:up
ALTER TABLE user_favourite_sessions
    ADD CONSTRAINT user_favourite_sessions_pkey PRIMARY KEY (user_id, session_id);

-- migrate:down
ALTER TABLE user_favourite_sessions
    DROP CONSTRAINT user_favourite_sessions_pkey;
