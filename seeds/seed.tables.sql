BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Algorithms', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'algOne.png', 'bubble sort', 2),
  (2, 1, 'algTwo.png', 'quick sort', 3),
  (3, 1, 'algThree.png', 'merge sort', 4),
  (4, 1, 'algFour.png', 'binary search', 5),
  (5, 1, 'algFive.png', 'in-order traversal', 6),
  (6, 1, 'algSix.png', 'comb sort', 7),
  (7, 1, 'AlgSeven.png', 'heap sort', 8),
  (8, 1, 'algEight.png', 'post-order traversal', 9),
  (9, 1, 'algNine.png', 'linear search', 10),
  (10, 1, 'algTen.png', 'pre-order traversal', 11),
  (11, 1, 'algEleven.png', 'cycle detection', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
