CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE users
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    avatar      TEXT    NOT NULL,
    first_name  TEXT    NOT NULL,
    last_name   TEXT    NOT NULL,
    age         INTEGER NOT NULL CHECK (age >= 0),
    nationality TEXT    NOT NULL
);
CREATE INDEX idx_users_nationality
    ON users(nationality);
CREATE TABLE hobbies
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
CREATE TABLE user_hobbies
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id  INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    hobby_id INTEGER NOT NULL REFERENCES hobbies (id) ON DELETE CASCADE
);
CREATE INDEX idx_user_hobbies_hobby
    ON user_hobbies(hobby_id, user_id);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20260905162836'),
  ('20260905192815');
