const db = require('../db/queries');
const {
    navLinks,
    alphaErr,
    lengthErr,
    gamesInStoreArray,
    devsListArray
} = require('../data');
const {
    body,
    validationResult,
    matchedData
} = require('express-validator');

const validateDeveloper = [
    body('name').trim()
    .isLength({ min: 2, max: 70 }).withMessage(`Developer name ${lengthErr} 2 and 70 characters.`)
    .matches(/^[A-Za-z0-9 ]+$/).withMessage(`Developer name ${alphaErr}`)
];

const path = 'developers';

// GET INDIVIDUAL DEVELOPER INFO
const getSpecificDeveloper= async (req, res) => {
    // const { fetchedDeveloper } = await db.getProductsOfGenre(req.params.id);

    console.log('FETCHING SINGLE DEV INFO');
    const fetchedDev = devsListArray.filter(game => game.id == req.params.id)[0];
    const productsArray = gamesInStoreArray.filter(game => game.developers.includes(fetchedDev.name));
    console.log(fetchedDev)

    res.render('partials/genreAndDevTemplate', {
        title: `${fetchedDev.name}`,
        btnTitle: 'Go back to categories',
        path,
        imgStyling: 'contain',
        navLinks,
        category: fetchedDev,
        productsArray,
    });
};

// CREATE A DEVELOPER
const getCreateDeveloper = (req, res) => {
    // const fetchedDev = db.getSpecificDev(req.params.id);
    console.log('PROVIDING DEV CREATE');

    res.render('createGenreAndDev', {
        title: 'Add a new developer',
        btnTitle: 'Go back',
        navLinks,
        path,
        errors: null,
    });
};

const postCreateDeveloper = [
    validateDeveloper,
    async (req, res) => {
        console.log('POSTING DEV NEW ADD');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('createGenreAndDev', {
                title: 'Add a new developer',
                btnTitle: 'Go back',
                navLinks,
                path,
                errors: errors.array(),
            });
        };

        if (req.body.gameImg.includes('.')) {
            let imgCheck = req.body.gameImg.split(".")[1];
            if (imgCheck !== 'jpg' && imgCheck !== 'jpeg' && imgCheck !== 'png') {
                return res.status(400).render('createGenreAndDev', {
                    title: 'Add a new developer',
                    btnTitle: 'Go back',
                    navLinks,
                    path,
                    errors: [{
                        msg: 'Incorrect file format.'
                    }],
                });
            }
        } else {
            return res.status(400).render('createGenreAndDev', {
                title: 'Add a new developer',
                btnTitle: 'Go back',
                navLinks,
                path,
                errors: [{
                    msg: 'Incorrect file format.'
                }],
            });
        }

        const { name } = matchedData(req);
        // const checkIfAlreadyExists = db.searchSpecificDev(name);

        const checkIfAlreadyExists = false;

        if (checkIfAlreadyExists) {
            return res.status(400).render('createGenreAndDev', {
                title: 'Add a new genre',
                btnTitle: 'Go back',
                navLinks,
                path,
                errors: [{
                    msg: 'Developer already exists.'
                }]
            });
        } else {
            // await db.createDev(name);

            res.render('partials/genreAndDevTemplate', {
                title: `${name}`,
                btnTitle: 'Go back to categories',
                path,
                imgStyling: 'cover',
                navLinks,
                category: devsListArray[0],
                productsArray: [],
            });
        }
    }
];

// UPDATE DEVELOPER
const getUpdateDeveloper = async (req, res) => {
    // const fetchedDev = db.getSpecificDev(req.params.id);
    
    console.log('GETTING DEV UPDATE');
    const fetchedDev = devsListArray.filter(game => game.id == req.params.id)[0];
    console.log(fetchedDev);

    res.render('editGenreAndDev', {
        title: `Edit ${fetchedDev.name}`,
        btnTitle: `Return to ${fetchedDev.name}`,
        navLinks,
        path,
        category: fetchedDev,
        errors: null
    });
};

const postUpdateDeveloper = [
    validateDeveloper,
    async (req, res) => {
        console.log('POSTED DEV UPDATE');
        console.log(req.params.id)
        const fetchedDev = devsListArray.filter(game => game.id == req.params.id)[0];

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('editGenreAndDev', {
                title: `Edit ${fetchedDev.name}`,
                btnTitle: `Return to ${fetchedDev.name}`,
                navLinks,
                path,
                category: fetchedDev,
                errors: errors.array(),
            });
        };

        if (req.body.gameImg.length > 0 && req.body.gameImg.includes('.')) {
            let imgCheck = req.body.gameImg.split(".")[1];
            if (imgCheck !== 'jpg' && imgCheck !== 'jpeg' && imgCheck !== 'png') {
                return res.status(400).render('editGenreAndDev', {
                    title: `Edit ${fetchedDev.name}`,
                    btnTitle: `Return to ${fetchedDev.name}`,
                    navLinks,
                    path,
                    category: fetchedDev,
                    errors: [{
                        msg: 'Incorrect file format.'
                    }],
                });
            }
        };

        // const { name } = matchedData(req);
        const name = fetchedDev.name;
        console.log(name)
        // await db.updateDev(req.params.id, name);
        res.redirect(`/${path}/${req.params.id}`);
    }
];

// DELETE DEVELOPER
const getDeleteDeveloper = async (req, res) => {
    // await db.deleteDev(req.params.id);
    console.log('DELETING DEV');
    console.log(req.params.id);

    res.redirect('/category');
};

module.exports = {
    getSpecificDeveloper,

    getCreateDeveloper,
    postCreateDeveloper,

    getUpdateDeveloper,
    postUpdateDeveloper,

    getDeleteDeveloper
};