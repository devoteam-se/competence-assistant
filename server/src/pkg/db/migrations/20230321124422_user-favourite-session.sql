-- migrate:up
CREATE TABLE user_favourite_sessions
(
    user_id    VARCHAR(255) NOT NULL,
    session_id UUID NOT NULL,
    CONSTRAINT fk_user_id
        FOREIGN KEY(user_id)
            REFERENCES users(id)
            ON DELETE CASCADE,
    CONSTRAINT fk_session_id
        FOREIGN KEY (session_id)
            REFERENCES sessions (id)
            ON DELETE CASCADE
);

-- migrate:down
DROP TABLE IF EXISTS user_favourite_sessions
