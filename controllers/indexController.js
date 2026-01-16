const db = require('../db/queries');
const {
    navLinks,
    alphaErr,
    lengthErr,
    gamesInStoreArray,
    genresListArray,
    devsListArray
} = require('../data');

const {
    query,
    validationResult,
    matchedData
} = require('express-validator');

const validateSearchProduct = [
    query('searchString').trim()
    .isLength({ min: 1, max: 70 }).withMessage(`Search word(s) ${lengthErr} 1 and 70 characters.`)
    .matches(/^[A-Za-z0-9 +,.?()!:]+$/).withMessage(`Search word(s) ${alphaErr}`)
];

const getHomepage = (req, res) => {
    res.render('index', {
        title: 'Game Shop',
        navLinks,
        errors: null
    });
};

const getCategories = async (req, res) => {
    // const genreList = await db.getAllGenres();
    // const devList = await db.getAllDevelopers();
    res.render('categories', {
        title: 'Categories',
        navLinks,
        genresListArray,
        devsListArray
    });
};

const getSearchedProduct =  [
    validateSearchProduct,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // console.log('errors:');
            // console.log(errors);
            // console.log('REQUEST:');
            // console.log(req.body);
            return res.status(400).render('index', {
                title: 'Game Shop',
                navLinks,
                errors: errors.array()
            });
        };

        const { searchString } = matchedData(req);
        console.log('searchString: ');
        console.log(searchString)
        const productsArray = gamesInStoreArray.filter(game => game.name.includes(searchString) || game.name.includes(searchString.toLowerCase()) || game.name.includes(searchString.toUpperCase()));
        // console.log(productsArray)
        // const products = await db.getOneOrMultipleProducts(searchString);
        console.log('found products:');
        console.log(productsArray);
        res.render('search', {
            title: `Search results for ${searchString}`,
            btnTitle: 'Go back to Products',
            navLinks,
            productsArray
        });
    }
];


module.exports = {
    getHomepage,
    getCategories,
    getSearchedProduct
};