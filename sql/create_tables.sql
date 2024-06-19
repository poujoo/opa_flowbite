DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS scores;


CREATE TABLE games (
  game_id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE scores (
  user_id VARCHAR(100) PRIMARY KEY,
  game_id SERIAL,
  score SERIAL,
  created_at TIMESTAMP NOT NULL,
  CONSTRAINT fk_games
      FOREIGN KEY(game_id) 
        REFERENCES games(game_id)
);

INSERT INTO games(name,created_at)VALUES ('Fast Squares',CLOCK_TIMESTAMP());
INSERT INTO scores (user_id,game_id,score,created_at)VALUES('user_2hVo6z2HsN04bRGO6hzWnnpmqkR', 2, 0, CLOCK_TIMESTAMP());