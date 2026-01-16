const pool = require('./pool');


// GET 
// get all products
async function getAllProducts() {
    const { rows } = await pool.query('SELECT * FROM products');
    return rows;
};

// get one or multiple products
async function getOneOrMultipleProducts(searchName) {
    const { row } = await pool.query(`SELECT * FROM products WHERE name LIKE '%${searchName}%'`);
    return row;
};

// get one specific product
async function getSpecificProduct(id) {
    const { row } = await pool.query(`SELECT product FROM products WHERE product_id LIKE '%${id}%'`);
    return row;
};

// get all genres
async function getAllGenres() {
    const { rows } = await pool.query('SELECT * FROM genres');
    return rows;
};

// get products of specific genre - FIX SO IT ALSO RETURNS NAME
async function getProductsOfGenre(id) {
    const { rows } = await pool.query(`SELECT *, name FROM genres WHERE genre_id LIKE '%${id}%'`);
    return rows;
};

// get all developers
async function getAllDevelopers() {
    const { rows } = await pool.query('SELECT * FROM developers');
    return rows;
};

// get products of specific developer - FIX SO IT ALSO RETURNS NAME
async function getProductsOfDevs(id) {
    const { rows } = await pool.query(`SELECT *, name FROM developers WHERE developer_id LIKE '%${id}%'`);
    return rows;
};

//SEARCH
// confirm product already exists
async function searchSpecificProduct(name) {
    const { row } = await pool.query(`SELECT product FROM products WHERE name LIKE '%${name}%'`);
    return row ? true : false;
};

// confirm genre already exists
async function searchSpecificGenre(name) {
    const { row } = await pool.query(`SELECT genre FROM genres WHERE name LIKE '%${name}%'`);
    return row ? true : false;
};

// confirm dev already exists
async function searchSpecificDev(name) {
    const { row } = await pool.query(`SELECT developer FROM developers WHERE name LIKE '%${name}%'`);
    return row ? true : false;
};


// CREATE 
// new product
async function createProduct(name, genre, dev, desc, price) {
    await pool.query('INSERT INTO products (name, genre, dev, desc, price) VALUES ($1) ($2) ($3) ($4) ($5)', [name, genre, dev, desc, price]);
};

// new genre - FIX
async function createGenre(name) {
    await pool.query('ALTER TABLE genres ADD ($1) VARCHAR(255)', [name]);
};

// new developer - FIX NOT COLUMN BUT ROW AS USUAL
async function createDeveloper(dev) {
    await pool.query('ALTER TABLE developers ADD ($1) VARCHAR(255)', [dev]);
};

// UPDATE
// product
async function updateProduct(id, name, price, desc, genre, dev) {
    await pool.query(`UPDATE products SET name = ($1), genre = ($2), dev = ($3), desc = ($4), price = ($5) WHERE product_id LIKE '%${id}%'`, [name, genre, price, desc, dev]);
};

// genre
async function updateGenre(id, newName) {
    await pool.query(`UPDATE genres SET name = ($1) WHERE genre_id LIKE '%${id}%'`, [newName, id]);
};

// developer
async function updateDeveloper(id, newName) {
    await pool.query(`UPDATE developers SET name = ($1) WHERE developer_id LIKE '%${id}%'`, [newName, id]);
};

// DELETE
//product
async function deleteProduct(id) {
    await pool.query(`DELETE FROM products WHERE product_id LIKE '%${id}%'`, [id]);
};

// genre
async function deleteGenre(id) {
    await pool.query(`DELETE FROM genres WHERE genre_id LIKE '%${id}%'`, [id]);
};

// developer
async function deleteDeveloper(id) {
    await pool.query(`DELETE FROM developers WHERE developer_id LIKE '%${id}%'`, [id]);
};


module.exports = {
    getAllProducts,
    getOneOrMultipleProducts,
    getSpecificProduct,
    getAllGenres,
    getProductsOfGenre,
    getAllDevelopers,
    getProductsOfDevs,

    searchSpecificProduct,
    searchSpecificGenre,
    searchSpecificDev,

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