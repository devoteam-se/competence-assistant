-- migrate:up
CREATE TABLE events (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    voting_end_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
  );


CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(255) NOT NULL
  );

CREATE TYPE session_type AS ENUM ('SESSION', 'ROUNDTABLE', 'WORKSHOP', 'LAB');

CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  name VARCHAR (255) NOT NULL,
  description VARCHAR NOT NULL,
  type session_type NOT NULL,
  duration int NOT NULL,
  recording_url VARCHAR(512),
  slides_url VARCHAR(512),
  meeting_url VARCHAR(512),
  event_id UUID,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_event_id
    FOREIGN KEY(event_id) 
	    REFERENCES events(id)
      ON DELETE SET NULL
);

CREATE TABLE tracks (
  id UUID PRIMARY KEY,
  name VARCHAR (255) NOT NULL,
  color VARCHAR (255) NOT NULL,
  obsolete BOOLEAN DEFAULT FALSE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE schedule_rooms (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_event_id
    FOREIGN KEY(event_id) 
	    REFERENCES events(id)
	ON DELETE CASCADE
);

CREATE TABLE schedule_breaks (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  start timestamp with time zone NOT NULL,
  "end" timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_event_id
    FOREIGN KEY(event_id) 
	    REFERENCES events(id)
	ON DELETE CASCADE
);

CREATE TABLE schedule_sessions (
  id UUID PRIMARY KEY,
  session_id UUID NOT NULL,
  event_id UUID NOT NULL,
  room_id UUID NOT NULL,
  start timestamp with time zone NOT NULL,
  "end" timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT fk_session_id
    FOREIGN KEY(session_id) 
	    REFERENCES sessions(id)
	ON DELETE CASCADE,
  CONSTRAINT fk_event_id
    FOREIGN KEY(event_id) 
	    REFERENCES events(id)
	ON DELETE CASCADE,
  CONSTRAINT fk_room_id
    FOREIGN KEY(room_id) 
	    REFERENCES schedule_rooms(id)
	ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION delete_schedule_on_event_id_update()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	IF NEW.event_id != OLD.event_id OR NEW.event_id IS NULL THEN
		 DELETE from schedule_sessions WHERE session_id = NEW.id;
	END IF; 

	RETURN NEW;
END;
$$;

CREATE TRIGGER delete_schedule_on_event_id_update_trigger
  BEFORE UPDATE
  ON sessions
  FOR EACH ROW
  EXECUTE PROCEDURE delete_schedule_on_event_id_update();

CREATE TABLE sessions_tracks (
    session_id UUID,
    track_id UUID,
    CONSTRAINT fk_session_id
    	FOREIGN KEY(session_id) 
	   	 REFERENCES sessions(id)
       ON DELETE CASCADE,
  	CONSTRAINT fk_track_id
    	FOREIGN KEY(track_id) 
	   	 REFERENCES tracks(id),
    PRIMARY KEY(session_id, track_id)
);

CREATE TABLE votes (
    session_id UUID,
    user_id VARCHAR(255),
    CONSTRAINT fk_session_id
    	FOREIGN KEY(session_id) 
	   	 REFERENCES sessions(id)
       ON DELETE CASCADE,
  	CONSTRAINT fk_user_id
    	FOREIGN KEY(user_id) 
	   	 REFERENCES users(id)
       ON DELETE CASCADE,
    PRIMARY KEY(session_id, user_id)
);

CREATE TABLE hosts (
    session_id UUID,
    user_id VARCHAR(255),
    CONSTRAINT fk_session_id
    	FOREIGN KEY(session_id) 
	   	 REFERENCES sessions(id)
       ON DELETE CASCADE,
  	CONSTRAINT fk_user_id
    	FOREIGN KEY(user_id) 
	   	 REFERENCES users(id)
       ON DELETE CASCADE,
    PRIMARY KEY(session_id, user_id)
);

-- migrate:down
DROP TRIGGER IF EXISTS delete_schedule_on_event_id_update_trigger ON sessions;
DROP FUNCTION IF EXISTS delete_schedule_on_event_id_update;
DROP TABLE IF EXISTS schedule_sessions;
DROP TABLE IF EXISTS schedule_rooms;
DROP TABLE IF EXISTS schedule_breaks;
DROP TABLE IF EXISTS hosts;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS sessions_tracks;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;
DROP TYPE IF EXISTS session_type;
DROP TYPE IF EXISTS session_state;
