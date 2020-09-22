DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients JSONB
);
