DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients JSONB,
  PRIMARY KEY(id)
);

CREATE TABLE logs (
  log_id BIGINT GENERATED ALWAYS AS IDENTITY,
  id BIGINT,
  date_of_event TEXT NOT NULL,
  notes TEXT,
  rating INT,
  PRIMARY KEY(log_id),
  CONSTRAINT fk_recipe
    FOREIGN KEY (id) 
      REFERENCES recipes(id)
);
