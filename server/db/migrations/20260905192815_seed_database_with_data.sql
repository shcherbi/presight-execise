-- migrate:up

-- 1000 users, matching the 1000 pre-rendered avatars in db/avatars/<id>.svg.
-- Names, ages, nationalities and hobbies are all drawn with RANDOM(), so
-- values repeat naturally (shared last names, lumpy filter counts).

INSERT INTO hobbies (id, name)
VALUES (1, 'Reading'),
       (2, 'Hiking'),
       (3, 'Photography'),
       (4, 'Cooking'),
       (5, 'Gaming'),
       (6, 'Cycling'),
       (7, 'Painting'),
       (8, 'Running'),
       (9, 'Swimming'),
       (10, 'Chess'),
       (11, 'Gardening'),
       (12, 'Yoga'),
       (13, 'Fishing'),
       (14, 'Traveling'),
       (15, 'Blogging'),
       (16, 'Woodworking'),
       (17, 'Knitting'),
       (18, 'Surfing'),
       (19, 'Skiing'),
       (20, 'Climbing'),
       (21, 'Dancing'),
       (22, 'Singing'),
       (23, 'Guitar'),
       (24, 'Piano'),
       (25, 'Pottery'),
       (26, 'Calligraphy'),
       (27, 'Astronomy'),
       (28, 'Birdwatching'),
       (29, 'Baking'),
       (30, 'Volunteering'),
       (31, 'Podcasting');

WITH RECURSIVE
    seq(i) AS (SELECT 1
               UNION ALL
               SELECT i + 1
               FROM seq
               WHERE i < 1000),
    first_names(k, v) AS (VALUES (0, 'Aisha'),
                                 (1, 'Liam'),
                                 (2, 'Noor'),
                                 (3, 'Mateo'),
                                 (4, 'Sofia'),
                                 (5, 'Omar'),
                                 (6, 'Hana'),
                                 (7, 'Lucas'),
                                 (8, 'Amara'),
                                 (9, 'Yusuf'),
                                 (10, 'Elena'),
                                 (11, 'Kai'),
                                 (12, 'Priya'),
                                 (13, 'Ethan'),
                                 (14, 'Leila'),
                                 (15, 'Diego'),
                                 (16, 'Mei'),
                                 (17, 'Jonas'),
                                 (18, 'Zara'),
                                 (19, 'Andre'),
                                 (20, 'Ingrid'),
                                 (21, 'Tariq'),
                                 (22, 'Clara'),
                                 (23, 'Hugo'),
                                 (24, 'Nadia'),
                                 (25, 'Rafael'),
                                 (26, 'Yuki'),
                                 (27, 'Samir'),
                                 (28, 'Marta'),
                                 (29, 'Oliver'),
                                 (30, 'Fatima'),
                                 (31, 'Niklas'),
                                 (32, 'Chiara'),
                                 (33, 'Idris'),
                                 (34, 'Anya'),
                                 (35, 'Tomas'),
                                 (36, 'Selma'),
                                 (37, 'Arjun'),
                                 (38, 'Freya'),
                                 (39, 'Hassan')),
    last_names(k, v) AS (VALUES (0, 'Rahman'),
                                (1, 'Novak'),
                                (2, 'Silva'),
                                (3, 'Okafor'),
                                (4, 'Fischer'),
                                (5, 'Haddad'),
                                (6, 'Tanaka'),
                                (7, 'Moreau'),
                                (8, 'Kowalski'),
                                (9, 'Rossi'),
                                (10, 'Nguyen'),
                                (11, 'Andersen'),
                                (12, 'Bakker'),
                                (13, 'Costa'),
                                (14, 'Iqbal'),
                                (15, 'Petrov'),
                                (16, 'Garcia'),
                                (17, 'Muller'),
                                (18, 'Kim'),
                                (19, 'Lindqvist'),
                                (20, 'Almeida'),
                                (21, 'Dubois'),
                                (22, 'Farooq'),
                                (23, 'Hansen'),
                                (24, 'Ivanova'),
                                (25, 'Jensen'),
                                (26, 'Khan'),
                                (27, 'Lopez'),
                                (28, 'Mensah'),
                                (29, 'Nakamura'),
                                (30, 'Oduya'),
                                (31, 'Papadakis'),
                                (32, 'Quintero'),
                                (33, 'Reyes'),
                                (34, 'Sharma'),
                                (35, 'Toure'),
                                (36, 'Ubeda'),
                                (37, 'Varga'),
                                (38, 'Wagner'),
                                (39, 'Zhang')),
    nationalities(k, v) AS (VALUES (0, 'Emirati'),
                                   (1, 'Indian'),
                                   (2, 'Egyptian'),
                                   (3, 'British'),
                                   (4, 'Emirati'),
                                   (5, 'Filipino'),
                                   (6, 'Pakistani'),
                                   (7, 'Indian'),
                                   (8, 'French'),
                                   (9, 'German'),
                                   (10, 'Emirati'),
                                   (11, 'Lebanese'),
                                   (12, 'Indian'),
                                   (13, 'Japanese'),
                                   (14, 'Brazilian'),
                                   (15, 'Nigerian'),
                                   (16, 'Emirati'),
                                   (17, 'Jordanian'),
                                   (18, 'Indian'),
                                   (19, 'Spanish'),
                                   (20, 'Chinese'),
                                   (21, 'Filipino'),
                                   (22, 'Italian'),
                                   (23, 'Egyptian'),
                                   (24, 'Emirati'),
                                   (25, 'Russian'),
                                   (26, 'Pakistani'),
                                   (27, 'Kenyan'),
                                   (28, 'Indian'),
                                   (29, 'Turkish'),
                                   (30, 'Filipino'),
                                   (31, 'Dutch'),
                                   (32, 'Emirati'),
                                   (33, 'Korean'),
                                   (34, 'Swedish'),
                                   (35, 'Moroccan'),
                                   (36, 'Australian')),
    draw AS MATERIALIZED (SELECT i,
                                 abs(random()) % 40      AS fk,
                                 abs(random()) % 40      AS lk,
                                 abs(random()) % 37      AS nk,
                                 18 + abs(random()) % 53 AS age
                          FROM seq)
INSERT
INTO users (id, avatar, first_name, last_name, age, nationality)
SELECT i,
       '/avatars/' || i || '.svg',
       f.v,
       l.v,
       d.age, -- 18..70
       n.v
FROM draw d
         JOIN first_names f ON f.k = d.fk
         JOIN last_names l ON l.k = d.lk
         JOIN nationalities n ON n.k = d.nk;

WITH counts AS MATERIALIZED (SELECT id, abs(random()) % 11 AS n FROM users),
     ranked AS (SELECT c.id                                                    AS user_id,
                       h.id                                                    AS hobby_id,
                       c.n,
                       row_number() OVER (PARTITION BY c.id ORDER BY random()) AS rn
                FROM counts c
                         CROSS JOIN hobbies h)
INSERT
INTO user_hobbies (user_id, hobby_id)
SELECT user_id, hobby_id
FROM ranked
WHERE rn <= n;

-- migrate:down

DELETE
FROM user_hobbies;
DELETE
FROM users;
DELETE
FROM hobbies;
DELETE
FROM sqlite_sequence
WHERE name IN ('user_hobbies', 'users', 'hobbies');
