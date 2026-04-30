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
        res.status(200).send({
            success: true,
            data: navLinks
        });
    } catch(err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while loading the homepage.'
            }],
            errCode: 500
        });
    };
};

const getSearchedProduct =  [
    validateSearchProduct,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).send({
                errType: 'Invalid Input',
                errBody: errors.array(),
                errCode: 400
            });
        };

        try {
            // const { searchString } = matchedData(req);
            // const projectFields = { description: 0, isDefault: 0 };
            // const db = getDb();
            // const gamesDb = db.collection(gamesPath);
            // await gamesDb.createIndex({ name: "text" });
            // const query = { $text: { $search: searchString } };
            // const productsArr = await gamesDb.find(query).project(projectFields).toArray();
            // res.status(200).send({
            //     success: true,
            //     data: { productsArr }
            // });
            res.status(500).send({
                errType: 'Other',
                errBody: [{
                    msg: err || 'Error occured while searching for the game.'
                }],
                errCode: 500
            });
        } catch (err) {
            res.status(500).send({
                errType: 'Other',
                errBody: [{
                    msg: err || 'Error occured while searching for the game.'
                }],
                errCode: 500
            });
        };
    }
];


module.exports = {
    getHomepage,
    getSearchedProduct
};