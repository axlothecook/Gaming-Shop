const { Client } = require('pg');
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS GAMES (
  game_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255),
  price integer,
  description VARCHAR (255),
  rating integer,
  url VARCHAR (255),
  isDefault boolean
);

CREATE TABLE IF NOT EXISTS GENRES (
  genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255),
  url VARCHAR (255),
  checked boolean,
  isDefault boolean
);

CREATE TABLE IF NOT EXISTS DEVELOPERS (
  developer_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR (255),
  url VARCHAR (255),
  checked boolean,
  isDefault boolean
);

CREATE TABLE GAMES_GENRES (
  game_id INTEGER references GAMES(game_id),
  genre_id INTEGER references GENRES(genre_id),
  primary key(game_id, genre_id)
);

CREATE TABLE GAMES_DEVELOPERS (
  game_id INTEGER references GAMES(game_id),
  developer_id INTEGER references DEVELOPERS(developer_id),
  primary key(game_id, developer_id)
);
`;

const main = async () => {
    ('seeding...');
    const client = new Client({ connectionString: process.env.NODE_ENV_DB_LOCALHOST });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('done');
};

main();