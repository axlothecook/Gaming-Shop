const { getDb } = require('../db/initiate');
const supabase = require('../../supabase');
const { ObjectId } = require('mongodb');
const { decode }  = require('base64-arraybuffer');
const { parsed } = require('dotenv').config();
const _ = require('lodash'); 
const {
    body,
    validationResult,
    matchedData
} = require('express-validator');
const {
    alphabetArray,
    priceArray,
    ratingArray,
    navLinks,
    alphaErr,
    lengthErr
} = require('../../data');
const {
    generateName,
    filterQuery,
    paginationProcessing,
    updateMultiple,
} = require('../functionality/functions');

const path = parsed.GAMES_PATH;
const devPath = parsed.DEV_PATH;
const genresPath = parsed.GENRE_PATH;

// const path = process.env.GAMES_PATH;
// const devPath = process.env.DEV_PATH;
// const genresPath = process.env.GENRE_PATH;

const validateProduct = [
    body('name').trim()
    .isLength({ min: 2, max: 70 }).withMessage(`Title ${lengthErr} 2 and 70 characters`)
    .matches(/^[A-Za-z0-9 +.,!?:]+$/).withMessage(`Title ${alphaErr}`),
    body('price').trim()
    .custom(num => num.length <= 2).withMessage('Price must be a maximum 2 digit number')
    .custom(num => (0 <= parseInt(num) && parseInt(num) <= 100)).withMessage('Allowed price ranges between $0 - $100')
    .optional({ nullable: true, checkFalsy: true }),
    body('rating').trim()
    .custom(num => num.length <= 2).withMessage('Rating must be a maximum 2 digit number')
    .custom(num => (1 <= parseInt(num) && parseInt(num) <= 10)).withMessage('Allowed rating ranges between 1 - 10')
    .optional({ nullable: true, checkFalsy: true }),
    body('description').trim()
    .isLength({ min: 1, max: 500 }).withMessage(`Description ${lengthErr} 1 and 500 characters`)
    .matches(/^[A-Za-z0-9,. ",':()+]+$/).withMessage(`Description ${alphaErr}`),
    body('genre')
    .custom(arr => arr !== undefined).withMessage('Must select at least one genre'),
    body('dev')
    .custom(arr => arr !== undefined).withMessage('Must select at least one developer'),
];

const getQuery = (query) => {
    if (_.isEmpty(query)) return null;
    if (Object.keys(query).length === 1 && query.page) return null;
    
    let resultQuery = {};
    if (query.Name) resultQuery.name = filterQuery.byAlphabet(query.Name);
    if (query.Price) resultQuery.price = filterQuery.byPrice(query.Price);
    if (query.Rating) resultQuery.rating = filterQuery.byRating(query.Rating);
    if (query.Genres) resultQuery.genres = filterQuery.byGenreOrDev(query.Genres);
    if (query.Developers) resultQuery.developers = filterQuery.byGenreOrDev(query.Developers);

    return resultQuery;
};

// RENDER PRODUCTS PAGE
const getProducts = async (req, res) => {
    try {
        console.log('query: ', req.query);
        console.log('pag: ', req.pagination);
        const projectFieldsGames = { description: 0, isDefault: 0 };
        const projectFieldsOther = { name: 1, numberOfGames: 1 };
        const sortGamesBy = { name: req.query.sort ? parseInt(req.query.sort) : 1 };
        const sortOtherBy = { name: 1 };
        const db = getDb();
        const gamesDb = db.collection(path);
        const genreDb = db.collection(genresPath);
        const devDb = db.collection(devPath);
        const genreArr = await genreDb.find().sort(sortOtherBy).project(projectFieldsOther).toArray();
        const devArr = await devDb.find().sort(sortOtherBy).project(projectFieldsOther).toArray();
        const { limit, skip } = req.pagination;
        const filter = getQuery(req.query);
        // let filter = { genres: 'Adventure' };
        // const filter = null;
        // console.log('filter: ', filter);
        const productsArr = filter 
            ? await gamesDb.find(filter).sort(sortGamesBy).project(projectFieldsGames).toArray()
            : await gamesDb.find({}, { limit, skip }).sort(sortGamesBy).project(projectFieldsGames).toArray();

        const pagesCount = await paginationProcessing(limit, gamesDb, filter);
        // console.log('pagesCount: ', pagesCount);
        res.status(200).send({
            success: true,
            data: {
                gamesArr: productsArr,
                genresArr: genreArr,
                devsArr: devArr,
                alphabetArray,
                priceArray,
                ratingArray,
                pagesCount,
                errors: null
            }
        });

        // res.render('products', {
        //     title: 'Games',
        //     btnText: 'game',
        //     navLinks,
        //     productsArr,
        //     genresListArray: genreArr,
        //     devsListArray: devArr,
        //     alphabetArray,
        //     priceArray,
        //     ratingArray,
        //     pagesCount,
        //     errors: null
        // });
    } catch (err) {
        res.status(500).send({
            err: err ? err : 'Error occured while fetching all products.'
        });
        // throw new Error(`Error occured while fetching products.`, err);
    };
};

// CREATE NEW GAME
const getNewProduct = async (req, res) => {
    try {
        const projectFields = { _id: 1, name: 1 };
        const db = getDb();
        const genreArr = await db.collection(genresPath).find().project(projectFields).toArray();
        const devArr = await db.collection(devPath).find().project(projectFields).toArray();

        res.render('createProduct', {
            title: 'Add a new game',
            btnTitle: 'Go Back',
            navLinks,
            genresListArray: genreArr,
            devsListArray: devArr,
            errors: null,
        });
    } catch (err) {
        throw new Error(`Error occured while fetching creating product template.`, err);
    };
};

const postNewProduct = [
    validateProduct,
    async (req, res) => {
        try {
            console.log('POSTING NEW PRODUCT');
            const db = getDb();
            const genreDb = await db.collection(genresPath);
            const devDb = await db.collection(devPath);
            const gamesDb = await db.collection(path);
            const genreArr = await genreDb.find().project({ name: 1 }).toArray();
            const devArr = await devDb.find().project({ name: 1 }).toArray();

            if (req.err) {
                console.error('other error: ', req.err);
                return res.status(400).render('createProduct', {
                    title: 'Add a new game',
                    btnTitle: 'Go Back',
                    navLinks,
                    genresListArray: genreArr,
                    devsListArray: devArr,
                    errors: [{
                        msg: req.err
                    }]
                });
            };

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // console.error('validator error: ', errors.array());
                return res.status(400).render('createProduct', {
                    title: 'Add a new game',
                    btnTitle: 'Go Back',
                    navLinks,
                    genresListArray: genreArr,
                    devsListArray: devArr,
                    errors: errors.array(),
                });
            };

            const inputData = matchedData(req);
            console.log('inputData: ', inputData);
            const checkIfGameAlreadyExists = await gamesDb.find({ name: inputData.name }).project({ name: 1 }).toArray();
            console.log('checkIfGameAlreadyExists:', checkIfGameAlreadyExists);
            if (checkIfGameAlreadyExists.length > 0) {
                return res.status(400).render('createProduct', {
                    title: 'Add a new game',
                    btnTitle: 'Go Back',
                    navLinks,
                    genresListArray: genreArr,
                    devsListArray: devArr,
                    errors: [{
                        msg: 'A game with the same name already exists.'
                    }]
                });
            } else {
                console.log('everything oke');
                const file = req.file;
                const newName = generateName(file.originalname);
                const fileBase64 = decode(file.buffer.toString('base64'));
                const { data, error } = await supabase.storage
                .from('games-user-photos')
                .upload(newName, fileBase64, {
                    contentType: file.mimetype,
                    cacheControl: '1',
                    upsert: false
                });
                // console.log('data from supabase:');
                // console.log(data);
                if (error != null) throw error;

                const { data: obj } = supabase.storage
                .from('games-user-photos')
                .getPublicUrl(data.path);

                // console.log('link from supabase:');
                // console.log(obj);

                const newGame = {
                    name: inputData.name,
                    url: `url(${obj.publicUrl})`,
                    imgName: data.path,
                    genres: (typeof inputData.genre === 'string') ? [inputData.genre] : inputData.genre, 
                    developers: (typeof inputData.dev === 'string') ? [inputData.dev] : inputData.dev,
                    price: parseInt(inputData.price),
                    description: inputData.description,
                    rating: parseInt(inputData.rating),
                    isDefault: false
                };

                await gamesDb.insertOne(newGame);
                const newDev = await gamesDb.findOne({ name: inputData.name });
                console.log('newDev:');
                console.log(newDev);
                // console.log(newDev.genres);
                // console.log(newDev.developers);

                // inputData.genre, inputData.dev
                await updateMultiple(newDev.genres, genreDb);
                await updateMultiple(newDev.developers, devDb);

                // console.log(newDev._id);
                res.redirect(`/games/${newDev._id}`);
                // res.redirect('/games');
            };
        } catch (err) {
            throw new Error(`Error occured while creating the game.`, err);
        };
    }
];

// RENDER INDIVIDUAL PRODUCT PAGE
const getIndividualProduct = async (req, res) => {
    console.log('required id: ' + req.params.id);
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gameDb = db.collection(path);
            const product = await gameDb.findOne({ _id: new ObjectId(req.params.id) });
            console.log('game found: ', product.name);
            
            // res.render('partials/individualProduct', {
            //     title: product.name,
            //     btnTitle: 'Go Back',
            //     navLinks,
            //     product,
            //     errors: null,
            // });

            res.status(200).send({
                success: true,
                data: {
                    product,
                    errors: null,
                }
            });
        } else {
            // console.error('error retrieving the game');
            // res.redirect('/games');
            res.status(500).send({
                err: err ? err : 'Error occured while retrieving the game due to invalid ID provided.'
            });
        };
    } catch (err) {
        // throw new Error(`Error occured while retrieving the game.`, err);
        res.status(500).send({
            err: err ? err : 'Error occured while retrieving the game.'
        });
    };
};

// UPDATE
const getUpdateProduct = async (req, res) => {
    try {
        console.log('GETTING GAME UPDATE: ', req.params.id);
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const game = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });
            const devArr = await db.collection(devPath).find().project({ name: 1 }).toArray();
            const genreArr = await db.collection(genresPath).find().project({ name: 1 }).toArray();

            // console.log('UPA:', devArr, genreArr);

            // res.render('editProduct', {
            //     title: `Edit ${game.name}`,
            //     btnTitle: 'Return',
            //     navLinks,
            //     product: game,
            //     genresListArray: genreArr,
            //     devsListArray: devArr,
            //     errors: null,
            // });
            res.status(200).send({
                success: true,
                data: {
                    game: game,
                    genresArray: genreArr,
                    devsArray: devArr,
                    errors: null,
                }
            });

        } else {
            // games route that doesnt exist here
            // throw new Error(`Error occured while fetching the gaming.`, err);
            res.status(500).send({
                err: err ? err : 'Error occured due to invalid id.'
            });
        };
    } catch (err) {
        res.status(500).send({
            err: err ? err : 'Error occured while fetching product updating info.'
        });
        // throw new Error(`Error occured while fetching specific gaming info.`, err);
    };
};

//validateProduct
const postUpdateProduct = async (req, res) => {
    console.log('POST GAME UPDATE');
    console.log(req.file);
    console.log(req.body);
    // console.log(req);
    res.status(200).send({
        success: true,
    });
    // const db = getDb();
    // const genreDb = await db.collection(genresPath);
    // const genreArr = await genreDb.find().project({ name: 1 }).toArray();
    // const devDb = await db.collection(devPath);
    // const devArr = await devDb.find().project({ name: 1 }).toArray();
    // const gamesDb = await db.collection(path);

    // if (ObjectId.isValid(req.params.id)) {
    //     const originalGame = await gamesDb.findOne({ _id: new ObjectId(req.params.id) });

    //     if (req.err) {
    //         console.error('other error: ', req.err);
    //         // return res.status(400).render('editProduct', {
    //         //     title: `Edit ${originalGame.name}`,
    //         //     btnTitle: `Return to ${originalGame.name}`,
    //         //     navLinks,
    //         //     product: originalGame,
    //         //     genresListArray: genreArr,
    //         //     devsListArray: devArr,
    //         //     errors: errors.array(),
    //         // });
    //         res.status(400).send({
    //             errTpe: 'Multer',
    //             errBody: errors.array(),
    //             errCode: 400
    //         });
    //     };

    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         console.log('validation errors:', errors.isEmpty());
    //         // return res.status(400).render('editProduct', {
    //         //     title: `Edit ${originalGame.name}`,
    //         //     btnTitle: `Return to ${originalGame.name}`,
    //         //     navLinks,
    //         //     product: originalGame,
    //         //     genresListArray: genreArr,
    //         //     devsListArray: devArr,
    //         //     errors: errors.array(),
    //         // });
    //         res.status(400).send({
    //             errTpe: 'Validation',
    //             errBody: errors.array(),
    //             errCode: 400
    //         });
    //     };

    //     // console.log('originalGame: ', originalGame);
    //     const updatedData = matchedData(req);
    //     console.log('updatedData: ', updatedData);
    //     let updateDoc;
    //     console.log('req.file: ', req.file);
    //     if (req.file) {
    //         console.log('updating with file');
    //         const file = req.file;
    //         const fileBase64 = decode(file.buffer.toString('base64'));
    //         const { data, error } = await supabase.storage
    //         .from('games-user-photos')
    //         .update(originalGame.imgName, fileBase64, {
    //             contentType: file.mimetype,
    //             cacheControl: '1',
    //             upsert: false
    //         });
    //         console.log('data from supabase:');
    //         console.log(data);
    //         if (error != null) throw error;

    //         const { data: obj } = supabase.storage
    //         .from('games-user-photos')
    //         .getPublicUrl(data.path);

    //         console.log('link from supabase:');
    //         console.log(obj);

    //         updateDoc = {
    //             $set: {
    //                 name: updatedData.name ? updatedData.name : originalGame.name,
    //                 url: `url(${obj.publicUrl})`,
    //                 imgName: data.path,
    //                 price: updatedData.price ? parseInt(updatedData.price) : originalGame.price,
    //                 rating: updatedData.rating ? parseInt(updatedData.rating) : originalGame.rating,
    //                 description: updatedData.description ? updatedData.description : originalGame.description,
    //                 genres: updatedData.genre ? (typeof updatedData.genre === 'string') ? [updatedData.genre] : updatedData.genre : [...originalGame.genres],
    //                 developers: updatedData.dev ? (typeof updatedData.dev === 'string') ? [updatedData.dev] : updatedData.dev : [...originalGame.developers],
    //             }
    //         };
    //     } else {
    //         console.log('updating without file');
    //         updateDoc = {
    //             $set: {
    //                 name: updatedData.name ? updatedData.name : originalGame.name,
    //                 price: updatedData.price ? parseInt(updatedData.price) : originalGame.price,
    //                 rating: updatedData.rating ? parseInt(updatedData.rating) : originalGame.rating,
    //                 description: updatedData.description ? updatedData.description : originalGame.description,
    //                 genres: updatedData.genre ? (typeof updatedData.genre === 'string') ? [updatedData.genre] : updatedData.genre : [...originalGame.genres],
    //                 developers: updatedData.dev ? (typeof updatedData.dev === 'string') ? [updatedData.dev] : updatedData.dev : [...originalGame.developers],
    //             }
    //         };
    //     };
    //     const query = { _id: new ObjectId(req.params.id) };
    //     const results = await gamesDb.updateOne(query, updateDoc);
    //     await updateMultiple(updatedData.genre, genreDb, originalGame.genres);
    //     await updateMultiple(updatedData.dev, devDb, originalGame.developers);
    //     console.log('results: ', results);
    //     // res.redirect(`/games/${req.params.id}`);
    //     res.status(200).send({
    //         success: true,
    //     });
    // } else {
    //     // res.redirect(`/games/${req.params.id}`);
    //     res.status(500).send({
    //         errType: "ID",
    //         errBody: 'Error occured due to invalid id.',
    //         errCode: 500
    //     });
    // };
}
// ];

const getDeleteProduct = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const devDb = db.collection(devPath);
            const genreDb = db.collection(genresPath);
            const gamesDb = db.collection(path);
            const game = await gamesDb.findOne({ _id: new ObjectId(req.params.id) });

            // console.log('game: ', game);

            const { data, error } = await supabase
            .storage
            .from('games-user-photos')
            .remove([game.imgName])

            console.log('game deletion img:', data);

            if (error != null) throw error;

            const updateDoc = { $inc: { numberOfGames: -1 } };
            game.genres.forEach(async item => await genreDb.updateOne({ name: item }, updateDoc));
            game.developers.forEach(async item => await devDb.updateOne({ name: item }, updateDoc));

            const deleteResult = await gamesDb.deleteOne({ _id: new ObjectId(req.params.id) });

            console.log('mongodb dev dlt: ', deleteResult);
            res.redirect('/games');
        } else {
            // games route that doesnt exist here
            throw new Error(`Error occured while deleting dev.`, err);
        };
    } catch (err) {
        throw new Error(`Error occured while deleting the developer.`, err);
    };
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