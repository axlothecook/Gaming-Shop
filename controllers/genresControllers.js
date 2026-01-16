const db = require('../db/queries');
const {
    navLinks,
    alphaErr,
    lengthErr,
    gamesInStoreArray,
    genresListArray
} = require('../data');
const {
    body,
    validationResult,
    matchedData
} = require('express-validator');

const validateGenre = [
    body('name').trim()
    .isLength({ min: 2, max: 100 }).withMessage(`Genre name ${lengthErr} 2 and 100 characters.`)
    .matches(/^[A-Za-z0-9- ]+$/).withMessage(`Genre name field ${alphaErr}`),
];

const path = 'genres';

// GET INDIVIDUAL GENRE INFO
const getSpecificGenre = async (req, res) => {
    // const { fetchedGenre } = await db.getProductsOfGenre(req.params.id);

    console.log('FETCHING SINGLE GENRE INFO');
    const fetchedGenre = genresListArray.filter(game => game.id == req.params.id)[0];
    const productsArray = gamesInStoreArray.filter(game => game.genre.includes(fetchedGenre.name));
    // console.log(fetchedGenre)

    res.render('partials/genreAndDevTemplate', {
        title: `${fetchedGenre.name}`,
        btnTitle: 'Go back to categories',
        path,
        imgStyling: 'cover',
        navLinks,
        category: fetchedGenre,
        productsArray,
    });
};

// CREATE A GENRE
const getCreateGenre = (req, res) => {
    // const fetchedGenre = db.getSpecificGenre(req.params.id);
    console.log('PROVIDING GENRE CREATE');

    res.render('createGenreAndDev', {
        title: 'Add a new genre',
        btnTitle: 'Go back',
        navLinks,
        path,
        errors: null,
    });
};

const postCreateGenre = [
    validateGenre,
    async (req, res) => {
        console.log('POSTING NEW GENRE ADD');
        const errors = validationResult(req);
        console.log(req.body);
        if (!errors.isEmpty()) {
            return res.status(400).render('createGenreAndDev', {
                title: 'Add a new genre',
                btnTitle: 'Go back',
                navLinks,
                path,
                errors: errors.array(),
            });
        };

        const { name } = matchedData(req);
        // let imgCheck = req.body.gameImg;
        // console.log('image path1:');
        // console.log(typeof imgCheck);
        if (req.body.gameImg.includes('.')) {
            imgCheck = req.body.gameImg.split(".")[1];
            if (imgCheck !== 'jpg' && imgCheck !== 'jpeg' && imgCheck !== 'png') {
                return res.status(400).render('createGenreAndDev', {
                    title: 'Add a new genre',
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
                title: 'Add a new genre',
                btnTitle: 'Go back',
                navLinks,
                path,
                errors: [{
                    msg: 'Incorrect file format.'
                }],
            });
        }
        // const results = matchedData(req);
        // console.log('results:');
        // console.log(results);
        // const checkIfAlreadyExists = db.searchSpecificGenre(name);

        const checkIfAlreadyExists = false;

        if (checkIfAlreadyExists) {
            return res.status(400).render('createGenreAndDev', {
                title: 'Add a new genre',
                btnTitle: 'Go back',
                navLinks,
                path,
                errors: [{
                    msg: 'Genre already exists.'
                }]
            });
        } else {
            // await db.createGenre(name);

            res.render('partials/genreAndDevTemplate', {
                title: `${name}`,
                btnTitle: 'Go back to categories',
                path,
                imgStyling: 'cover',
                navLinks,
                category: genresListArray[0],
                productsArray: [],
            });
        }
    }
];

// UPDATE GENRE
const getUpdateGenre = async (req, res) => {
    // const fetchedGenre = db.getSpecificGenre(req.params.id);
    
    console.log('GETTING GENRE UPDATE');
    const fetchedGenre = genresListArray.filter(game => game.id == req.params.id)[0];
    console.log(fetchedGenre);

    res.render('editGenreAndDev', {
        title: `Edit ${fetchedGenre.name}`,
        btnTitle: `Return to ${fetchedGenre.name}`,
        navLinks,
        path,
        category: fetchedGenre,
        errors: null
    });
};

const postUpdateGenre = [
    validateGenre,
    async (req, res) => {
        console.log('POSTED GENRE UPDATE');
        console.log(req.params.id)
        const fetchedGenre = genresListArray.filter(game => game.id == req.params.id)[0];

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('editGenreAndDev', {
                title: `Edit ${fetchedGenre.name}`,
                btnTitle: `Return to ${fetchedGenre.name}`,
                navLinks,
                path,
                category: fetchedGenre,
                errors: errors.array(),
            });
        };

        if (req.body.gameImg.length > 0 && req.body.gameImg.includes('.')) {
            let imgCheck = req.body.gameImg.split(".")[1];
            if (imgCheck !== 'jpg' && imgCheck !== 'jpeg' && imgCheck !== 'png') {
                return res.status(400).render('editGenreAndDev', {
                    title: `Edit ${fetchedGenre.name}`,
                    btnTitle: `Return to ${fetchedGenre.name}`,
                    navLinks,
                    path,
                    category: fetchedGenre,
                        errors: [{
                        msg: 'Incorrect file format.'
                    }],
                });
            }
        };

        // const { name } = matchedData(req);
        const name = fetchedGenre.name;
        console.log(name)
        // await db.updateGenre(req.params.id, name);

        res.redirect(`/${path}/${req.params.id}`);
    }
];

// DELETE GENRE
const getDeleteGenre = async (req, res) => {
    // await db.deleteGenre(req.params.id);
    console.log('DELETING GENRE');
    console.log(req.params.id);

    res.redirect('/category');
};

module.exports = {
    getSpecificGenre,

    getCreateGenre,
    postCreateGenre,

    getUpdateGenre,
    postUpdateGenre,
    
    getDeleteGenre
};