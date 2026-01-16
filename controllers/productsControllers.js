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
    body,
    validationResult,
    matchedData
} = require('express-validator');
const _ = require('lodash'); 

//cannot create genre / dev if they already exist
const validateProduct = [
    body('name').trim()
    .isLength({ min: 2, max: 70 }).withMessage(`Title ${lengthErr} 2 and 70 characters.`)
    .matches(/^[A-Za-z0-9 +.,!?:]+$/).withMessage(`Title ${alphaErr}`),
    body('price').trim()
    .isLength({ min: 1, max: 3 }).withMessage(`Price ${lengthErr} 3 characters.`)
    .isInt({ min: 1, max: 100 }).withMessage('Price range allows numbers in $1 - $100 range.'),
    body('rating').trim()
    .isLength({ min: 1, max: 2 }).withMessage(`Price ${lengthErr} 2 characters.`)
    .isInt({ min: 1, max: 10 }).withMessage('Rating range allows numbers in 1 - 10 range.'),
    body('description').trim()
    .isLength({ min: 1, max: 500 }).withMessage(`Description ${lengthErr} 500 characters.`)
    .matches(/^[A-Za-z0-9,. ",':()+]+$/).withMessage(`Description ${alphaErr}`),
    body('genre-0').trim()
    .notEmpty().withMessage(`First field must have a value other than 'None'.`),
    body('genre-1').trim()
    .optional({ values: "falsy" }),
    body('genre-2').trim()
    .optional({ values: "falsy" }),
    body('genre-3').trim()
    .optional({ values: "falsy" }),
    body('genre-4').trim()
    .optional({ values: "falsy" }),
    body('dev-0').trim()
    .notEmpty().withMessage(`First field must have a value other than 'None'`),
    body('dev-1').trim()
    .optional({ values: "falsy" }),
    body('dev-2').trim()
    .optional({ values: "falsy" }),
];

let productsArray = [];

const fillArrFunction = (mainArr, tempArr) => {
    let tempMainArr = mainArr;
    if (tempMainArr.length > 0) {
        let elToRemoveArray = [];
        tempArr.forEach(game => (tempMainArr.includes(game)) ? elToRemoveArray.push(game) : null);
        if (elToRemoveArray.length > 0) elToRemoveArray.forEach(game => {
            let index = tempArr.findIndex(el => el === game);
            tempArr.splice(index, 1);
        });

        if (tempArr.length > 0) tempMainArr.push(...tempArr);
    } else tempMainArr.push(...tempArr);
    return tempMainArr;
};

const addItems = (filterArr, type, id) => {
    let tempArr = [];
    const selected = filterArr[id - 1].name;
    tempArr = (type.includes('genre')) ? gamesInStoreArray.filter(game => game.genre.includes(selected)) : gamesInStoreArray.filter(game => game.developers.includes(selected));
    productsArray = fillArrFunction(productsArray, tempArr);
    filterArr[id - 1].checked = true;
};

const removeItems = (filterArr, type) => {
    let tempArr = [];
    filterArr.forEach(category => {
        if (category.checked === true) {
            tempArr = (type.includes('genre')) ? gamesInStoreArray.filter(game => game.genre.includes(category.name)) : gamesInStoreArray.filter(game => game.developers.includes(category.name));
            productsArray = fillArrFunction(productsArray, tempArr);
        };
    });
    return productsArray;
};


// RENDER PRODUCTS PAGE
const getProducts = async (req, res) => {
    // const products = await db.getAllProducts();
    if (!_.isEmpty(req.query)) {
        const type = Object.keys(req.query)[0];
        const value = req.query[Object.keys(req.query)[0]];
        const id = parseInt(type.split("-")[1]);

        // a check has been ticked on
        if (value === 'false') {
            (type.includes('genre')) ? addItems(genresListArray, type, id) : addItems(devsListArray, type, id);
        } else {
        // a check has been ticked off
            (type.includes('genre')) ? genresListArray[id - 1].checked = false : devsListArray[id - 1].checked = false;
            productsArray = [];
            removeItems(genresListArray, 'genre');
            removeItems(devsListArray, 'dev');
        };
    } else productsArray = [];

    res.render('products', {
        title: 'Games',
        btnText: 'game',
        navLinks,
        productsArray: productsArray.length > 0 ? productsArray : gamesInStoreArray,
        genresListArray,
        devsListArray,
        errors: null,
    });
};

// CREATE NEW GAME
const getNewProduct = (req, res) => {
    res.render('createProduct', {
        title: 'Create new game',
        btnTitle: 'Return to products',
        navLinks,
        genresListArray,
        devsListArray,
        errors: null,
    });
};

const postNewProduct = [
    validateProduct,
    async (req, res) => {
        const errors = validationResult(req);
        console.log('errors:');
        console.log(errors);
        console.log('REQUEST:');
        console.log(req.body);

        if (!errors.isEmpty()) {
            return res.status(400).render('createProduct', {
                title: 'Create new game',
                btnTitle: 'Return to products',
                navLinks,
                genresListArray,
                devsListArray,
                errors: errors.array(),
            });
        };

        if (req.body.gameImg.includes('.')) {
            imgCheck = req.body.gameImg.split(".")[1];
            if(imgCheck !== 'jpg' && imgCheck !== 'jpeg' && imgCheck !== 'png') {
                return res.status(400).render('createProduct', {
                    title: 'Create new game',
                    btnTitle: 'Return to products',
                    navLinks,
                    genresListArray,
                    devsListArray,
                    errors: [{
                        msg: 'Incorrect file format.'
                    }],
                });
            }
        } else {
            return res.status(400).render('createProduct', {
                title: 'Create new game',
                btnTitle: 'Return to products',
                navLinks,
                genresListArray,
                devsListArray,
                errors: [{
                    msg: 'Incorrect file format.'
                }],
            });
        }

        // const { 
        //     createProductName, 
        //     createPriceName, 
        //     createDescriptionName,
        //     selectFirstGenre,
        //     selectSecondaryGenre,
        //     selectThirdGenre,
        //     selectFirstDev,
        //     selectSecondaryDev,
        //     selectThirdDev
        // } = matchedData(req);
        
        const createProductName = req.body.name;
        // const checkIfAlreadyExists = db.searchSpecificProduct(createProductName);
        // await db.createProduct(
        //     createProductName, 
        //     createPriceName, 
        //     createDescriptionName,
        //     selectFirstGenre,
        //     selectSecondaryGenre,
        //     selectThirdGenre,
        //     selectFirstDev,
        //     selectSecondaryDev,
        //     selectThirdDev
        // );
        res.redirect('/products');
    }
];

// RENDER INDIVIDUAL PRODUCT PAGE
const getIndividualProduct = async (req, res) => {
    // const { product } = db.getSpecificProduct(req.params.id);
    // console.log('required id: ' + req.params.id);
    const product = gamesInStoreArray.filter(game => game.id == req.params.id);
    // console.log('getting individual product');
    // console.log(req.params.id)
    
    res.render('partials/individualProduct', {
        title: product[0].name,
        btnTitle: 'Return to products',
        navLinks,
        product: product[0],
        errors: null,
    });
};

// UPDATE
const getUpdateProduct = (req, res) => {
    // const product = db.getSpecificProduct(req.params.id);

    const product = gamesInStoreArray.filter(game => game.id == req.params.id);
    // console.log('product:')
    // console.log(product[0]);

    res.render('editProduct', {
        title: `Edit ${product[0].name}`,
        btnTitle: 'Return',
        navLinks,
        product: product[0],
        genresListArray,
        devsListArray,
        errors: null,
    });
};

const postUpdateProduct = [
    validateProduct,
    async (req, res) => {
        const product = gamesInStoreArray.filter(game => game.id == req.params.id);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // console.log('errors:');
            // console.log(errors);
            // console.log('REQUEST:');
            // console.log(req.body);
            return res.status(400).render('editProduct', {
                title: `Edit ${product[0].name}`,
                btnTitle: `Return to ${product[0].name}`,
                navLinks,
                product: product[0],
                genresListArray,
                devsListArray,
                errors: errors.array(),
            });
        };

        if (req.body.gameImg.length > 0 && req.body.gameImg.includes('.')) {
            let imgCheck = req.body.gameImg.split(".")[1];
            if (imgCheck !== 'jpg' && imgCheck !== 'jpeg' && imgCheck !== 'png') {
                return res.status(400).render('editProduct', {
                    title: `Edit ${product[0].name}`,
                    btnTitle: `Return to ${product[0].name}`,
                    navLinks,
                    product: product[0],
                    genresListArray,
                    devsListArray,
                    errors: [{
                        msg: 'Incorrect file format.'
                    }],
                });
            }
        };

        // const { 
        //     id,
        //     createProductName, 
        //     createPriceName, 
        //     createDescriptionName,
        //     selectFirstGenre,
        //     selectSecondaryGenre,
        //     selectThirdGenre,
        //     selectFirstDev,
        //     selectSecondaryDev,
        //     selectThirdDev
        // } = matchedData(req);

        // await db.updateProduct(
        //     id,
        //     createProductName, 
        //     createPriceName, 
        //     createDescriptionName,
        //     selectFirstGenre,
        //     selectSecondaryGenre,
        //     selectThirdGenre,
        //     selectFirstDev,
        //     selectSecondaryDev,
        //     selectThirdDev
        // );

        // console.log(req.params.id)
        // console.log('REQUEST:');
        // console.log(req.body.name);
        const game = req.body;
        console.log('new game:');
        console.log(game);

        const createProductName = req.body.name;

        
        res.redirect(`/products/${req.params.id}`);
    }
];

const getDeleteProduct = async (req, res) => {
    // await db.deleteProduct(req.params.id);
    
    res.redirect('/products');
};

module.exports = {
    getProducts,

    getNewProduct,
    postNewProduct,

    getIndividualProduct,
    getUpdateProduct,
    postUpdateProduct,
    
    getDeleteProduct
};