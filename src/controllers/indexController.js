const { getDb } = require('../db/initiate');
require('dotenv').config();
const {
    query,
    validationResult,
    matchedData
} = require('express-validator');
const {
    navLinks,
    alphaErr,
    lengthErr,
} = require('../../data');

const gamesPath = process.env.GAMES_PATH;

const validateSearchProduct = [
    query('searchString').trim()
    .isLength({ min: 1, max: 70 }).withMessage(`Search word(s) ${lengthErr} 1 and 70 characters.`)
    .matches(/^[A-Za-z0-9 +,.?()!:]+$/).withMessage(`Search word(s) ${alphaErr}`)
];

const getHomepage = async (req, res) => {
    try {
        // res.render('index', {
        //     title: 'Game Shop',
        //     navLinks,
        //     errors: null
        // });

        res.status(200).send({
            success: true,
            data: navLinks
        });
    } catch(err) {
        res.status(500).send({
            err: err ? err : 'Error occured while loading homepage.'
        });
        // throw new Error(`Error occured while loading homepage.`, err);
    };
};

const getSearchedProduct =  [
    validateSearchProduct,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('errors:');
            console.log(errors.array());
            console.log(req.body);
            return res.status(400).render('index', {
                title: 'Game Shop',
                navLinks,
                errors: errors.array()
            });
        };

        try {
            const { searchString } = matchedData(req);
            const projectFields = { description: 0, isDefault: 0 };
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            await gamesDb.createIndex({ name: "text" });
            const query = { $text: { $search: searchString } };
            const productsArr = await gamesDb.find(query).project(projectFields).toArray();
            // res.render('search', {
            //     title: `Search results for ${searchString}`,
            //     btnTitle: 'Go back to Products',
            //     navLinks,
            //     productsArr
            // });
            res.status(200).send({
                success: true,
                data: {
                    productsArr
                }
            });
        } catch (err) {
            // throw new Error(`error when getting search results.`, err);
            res.status(500).send({
                err: err ? err : 'Error occured while searching for the game.'
            });
        };
    }
];


module.exports = {
    getHomepage,
    getSearchedProduct
};