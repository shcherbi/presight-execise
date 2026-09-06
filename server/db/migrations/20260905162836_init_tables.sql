-- migrate:up
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

-- migrate:down

DROP INDEX IF EXISTS idx_user_hobbies_hobby;
DROP TABLE IF EXISTS user_hobbies;

DROP TABLE IF EXISTS hobbies;

DROP INDEX IF EXISTS idx_users_nationality;
DROP TABLE IF EXISTS users;