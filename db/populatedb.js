const { Client } = require('pg');
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR (255),
    genre_id text [],
    developer_id text [],
    description VARCHAR (255),
    price integer
);

CREATE TABLE IF NOT EXISTS genres (
    genre_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    action VARCHAR (255),
    adventure VARCHAR (255),
    fighting VARCHAR (255),
    platform VARCHAR (255),
    puzzle VARCHAR (255),
    racing VARCHAR (255),
    role-playing VARCHAR (255),
    shooter VARCHAR (255),
    simulation VARCHAR (255),
    sports VARCHAR (255),
    strategy VARCHAR (255),
    other VARCHAR (255)
);

CREATE TABLE IF NOT EXISTS developers (
    developer_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    activision-blizzard,
    blizzard-entertainment
    bethesda-softworks,
    capcom,
    cd-project-red,
    electronic-arts,
    epic-games
    kojima-production
    namco-bandai,
    microsoft-gaming,
    sega,
    sony,
    square-enix,
    riot-games,
    nintendo,
    take-two,
    ubisoft
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