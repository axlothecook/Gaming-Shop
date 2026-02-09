const pool = require('./pool');

// GET 
// get all products in products page - add amount of games
async function getAllProducts() {
    const { rows } = await pool.query(`
        SELECT GAMES.genre_id, GAMES.name, GAMES.price, GAMES.rating, GAMES.url, GENRES.genre_id, GENRES.name, GENRES.checked, DEVELOPERS.developer_id, DEVELOPERS.name, DEVELOPERS.checked
        FROM GAMES
        INNER JOIN GAMES_GENRES
        ON GAMES.game_id = GAMES_GENRES.games_id
        INNER JOIN GENRES
        ON GENRES.genre_id = GAMES_GENRES.genre_id
        INNER JOIN GAMES_DEVELOPERS
        ON GAMES.game_id = GAMES_DEVELOPERS.games_id
        INNER JOIN DEVELOPERS
        ON DEVELOPERS.developer_id = GAMES_DEVELOPERS.developer_id
    `);
    return rows;
};

// get one specific product
async function getSpecificProduct(id) {
    const { row } = await pool.query(`
        SELECT GAMES.genre_id, GAMES.name, GAMES.price, GAMES.description, GAMES.rating, GAMES.url, GAMES.isDefault, GENRES.name, DEVELOPERS.name
        FROM GAMES 
        INNER JOIN GAMES_GENRES
        ON GAMES.game_id = GAMES_GENRES.games_id
        INNER JOIN GENRES
        ON GENRES.genre_id = GAMES_GENRES.genre_id
        INNER JOIN GAMES_DEVELOPERS
        ON GAMES.game_id = GAMES_DEVELOPERS.games_id
        INNER JOIN DEVELOPERS
        ON DEVELOPERS.developer_id = GAMES_DEVELOPERS.developer_id
        WHERE GAMES.game_id 
        LIKE '%${id}%'
    `);
    return row;
};

// get all genres
async function getAllGenres() {
    const { rows } = await pool.query(`
        SELECT genre_id, name, url 
        FROM GENRES
    `);
    return rows;
};

// get one specific genre - add amount of games
async function getProductsOfGenre(id) {
    const { rows } = await pool.query(`
        SELECT GENRES.genre_id, GENRES.name, GENRES.url, GENRES.isDefault, GAMES.game_id, GAMES.name, GAMES.price, GAMES.rating, GAMES.url, DEVELOPERS.name
        FROM GENRES 
        INNER JOIN GAMES_GENRES
        ON GENRES.genre_id = GAMES_GENRES.genre_id
        INNER JOIN GAMES
        ON GAMES.game_id = GAMES_GENRES.game_id
        INNER JOIN GAMES_DEVELOPERS
        ON GAMES.game_id = GAMES_DEVELOPERS.game_id
        INNER JOIN DEVELOPERS
        ON DEVELOPERS.developer_id = GAMES_DEVELOPERS.developer_id
        WHERE GENRES.genre_id 
        LIKE '%${id}%'
    `);
    return rows;
};

// get all developers
async function getAllDevelopers() {
    const { rows } = await pool.query(`
        SELECT developer_id, name, url 
        FROM DEVELOPERS
    `);
    return rows;
};

// get one specific developer - add amount of games
async function getProductsOfDevs(id) {
    const { rows } = await pool.query(`
        SELECT DEVELOPERS.developer_id, DEVELOPERS.name, DEVELOPERS.url, DEVELOPERS.isDefault, GAMES.game_id, GAMES.name, GAMES.price, GAMES.rating, GAMES.url
        FROM DEVELOPERS 
        INNER JOIN GAMES_DEVELOPERS
        ON DEVELOPERS.developer_id = GAMES_DEVELOPERS.developer_id
        INNER JOIN GAMES
        ON GAME.game_id = GAMES_DEVELOPERS.game_id
        WHERE DEVELOPERS.developer_id 
        LIKE '%${id}%'
    `);
    return rows;
};

//SEARCH
async function searchSpecificProduct(name) {
    const { row } = await pool.query(`
        SELECT GAMES.genre_id, GAMES.name, GAMES.price, GAMES.description, GAMES.rating, GAMES.url, GAMES.isDefault, GENRES.name, DEVELOPERS.name
        FROM GAMES 
        INNER JOIN GAMES_GENRES
        ON GAMES.game_id = GAMES_GENRES.games_id
        INNER JOIN GENRES
        ON GENRES.genre_id = GAMES_GENRES.genre_id
        INNER JOIN GAMES_DEVELOPERS
        ON GAMES.game_id = GAMES_DEVELOPERS.games_id
        INNER JOIN DEVELOPERS
        ON DEVELOPERS.developer_id = GAMES_DEVELOPERS.developer_id
        WHERE GAMES.name 
        LIKE '%${name}%'
    `);
    return row;
};


// CREATE 
// new game - connect with genre and dev
let genres = ['Action', 'Cozy'];
async function createProduct(name, price, rating, description, url, genres, developers) {
    await pool.query(`
        INSERT INTO GAMES (name, price, rating, description, url) 
        VALUES ($1) ($2) ($3) ($4) ($5)`, 
        [name, price, rating, description, url]
    );

    // one game ID
    let gameId = await pool.query(`
        SELECT game_id 
        FROM GAMES 
        WHERE name 
        LIKE '%${name}%'`
    );

    // array of genre IDs
    let genreIdArr = await pool.query(`
        SELECT genre_id 
        FROM GENRES 
        WHERE GENRES.name = ALL (ARRAY[($1)])`, 
        [genres]
    );

    let genreArr = [];
    genreIdArr.forEach(item => genreArr.push([gameId, item]));

    await pool.query(`INSERT INTO GAMES_GENRES (game_id, genre_id) VALUES %L`, genreArr);

    // array of dev IDs
    let devIdArr = await pool.query(`
        SELECT dev_id 
        FROM DEVELOPERS 
        WHERE DEVELOPERS.name = ALL (ARRAY[($1)])`, 
        [developers]
    );

    let devArr = [];
    devIdArr.forEach(item => devArr.push([gameId, item]));

    await pool.query(`INSERT INTO GAMES_DEVELOPERS (game_id, developer_id) VALUES %L`, devArr);
};

// new genre
async function createGenre(name, url, checked, isDefault) {
    await pool.query(`
        INSERT INTO GENRES (name, url, checked, isDefault) 
        VALUES ($1) ($2) ($3) ($4)`, 
        [name, url, checked, isDefault]
    );
};

// new developer
async function createDeveloper(name, url, checked, isDefault) {
    await pool.query(`
        INSERT INTO DEVELOPERS (name, url, checked, isDefault) 
        VALUES ($1) ($2) ($3) ($4)`, 
        [name, url, checked, isDefault]
    );
};

// do i GAMES.game_id or just game_id?
// do i id = LIKE '%${id}%' or id = '%${id}%'?

// UPDATE
// product - connect w genre and dev
async function updateProduct(id, name, price, rating, description, url = null, newGenresArr, dev) {
    if (!url) {
        await pool.query(`
            UPDATE GAMES 
            SET name = ($1), price = ($2), rating = ($3), desc = ($4)
            WHERE game_id 
            LIKE '%${id}%'`, 
            [name, price, rating, description]
        );
    } else {
        await pool.query(`
            UPDATE GAMES 
            SET name = ($1), price = ($2), rating = ($3), desc = ($4), url = ($5)
            WHERE game_id 
            LIKE '%${id}%'`, 
            [name, price, rating, description, url]
        );
    }

    // array of genre IDs that have been present in game's info before changes
    let initialGenresIdsOfTheGame = await pool.query(`
        SELECT genre_id 
        FROM GAMES_GENRES 
        WHERE GAMES_GENRE.game_id LIKE '%${id}%'`
    );

    // array of genre names that have been present in game's info before changes
    let initialGenresOfTheGame = await pool.query(`
        SELECT name 
        FROM GENRES 
        WHERE GENRES.genre_id = ALL (ARRAY[($1)])`, 
        [initialGenresIdsOfTheGame]
    );

    // finding which genres to remove from and which to add to games_genres table
    let genresToRemove = [];
    let genresToAdd = [];
    for (let i = 0; i < newGenresArr.length; i++) {
        if (newGenresArr[i] != initialGenresOfTheGame[i]) {
            genresToRemove.push(initialGenresOfTheGame[i]);

            // incase the new value actually exists and is not empty
            if(newGenresArr[i] !== 'None') genresToAdd.push(newGenresArr[i]);
        };
    };

    // if there are elements to remove
    if (genresToRemove.length > 0) {

        // finding genre IDs to remove from their names
        initialGenresIdsOfTheGame = await pool.query(`
            SELECT genre_id 
            FROM GENRES 
            WHERE GENRE.name = ALL (ARRAY[($1)])`,
            [genresToRemove]
        );

        // removing genres from GAMES_GENRES table
        await pool.query(`
            DELETE FROM GAMES_GENRES 
            WHERE GAMES_GENRES.game_id = ALL (ARRAY[($1)])`,
            [initialGenresIdsOfTheGame]
        );

        // if there's new genres to add
        if (genresToAdd.length > 0) {
            // finding genre IDs from their names
            let newGenresIdToAdd = await pool.query(`
                SELECT genre_id 
                FROM GENRES 
                WHERE GENRE.name = ALL (ARRAY[($1)])`,
                [genresToAdd] 
            );

            // creating new array whose values correspond to GAMES_GENRES table form (game_id, genre_id)
            let toAddArr = [];
            newGenresIdToAdd.forEach(item => toAddArr.push([id, item]));

            // adding new pairings to GAMES_GENRES table
            await pool.query(`INSERT INTO GAMES_GENRES (game_id, genre_id) VALUES %L`, toAddArr);
        };
    }

};

// genre - update w games?
async function updateGenre(id, name, url = null) {
    if (!url) {
        await pool.query(`
            UPDATE GENRES 
            SET name = ($1) 
            WHERE genre_id 
            LIKE '%${id}%'`, 
            [name, id]
        );
    } else {
        await pool.query(`
            UPDATE GENRES 
            SET name = ($1), url = ($2)
            WHERE genre_id 
            LIKE '%${id}%'`, 
            [name, url, id]
        );
    }
};

// developer - update w games?
async function updateDeveloper(id, name, url = null) {
    if(!url) {
        await pool.query(`
            UPDATE DEVELOPERS 
            SET name = ($1) 
            WHERE developer_id 
            LIKE '%${id}%'`, 
            [name, id]
        );
    } else {
        await pool.query(`
            UPDATE DEVELOPERS 
            SET name = ($1), url = ($2)
            WHERE developer_id 
            LIKE '%${id}%'`, 
            [name, url, id]
        );
    }
};

// DELETE
//product - update w genre and dev
async function deleteProduct(id) {
    await pool.query(`
        DELETE FROM GAMES 
        WHERE game_id 
        LIKE '%${id}%'`, 
        [id]
    );
};

// genre - update w games
async function deleteGenre(id) {
    await pool.query(`
        DELETE FROM 
        GENRES WHERE genre_id 
        LIKE '%${id}%'`, 
        [id]
    );
};

// developer - update w games
async function deleteDeveloper(id) {
    await pool.query(`
        DELETE FROM DEVELOPERS 
        WHERE developer_id 
        LIKE '%${id}%'`, 
        [id]
    );
};


module.exports = {
    getAllProducts,
    getSpecificProduct,
    getAllGenres,
    getProductsOfGenre,
    getAllDevelopers,
    getProductsOfDevs,

    searchSpecificProduct,

    createProduct,
    createGenre,
    createDeveloper,

    updateProduct,
    updateGenre,
    updateDeveloper,

    deleteProduct,
    deleteGenre,
    deleteDeveloper
};