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
    sortInputArr,
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
                sortInputArr,
                priceArray,
                ratingArray,
                pagesCount
            }
        });
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while fetching all products.'
            }],
            errCode: 500
        });
    };
};

// RENDER INDIVIDUAL PRODUCT PAGE
const getIndividualProduct = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gameDb = db.collection(path);
            const product = await gameDb.findOne({ _id: new ObjectId(req.params.id) });

            res.status(200).send({
                success: true,
                data: { product }
            });

        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while retrieving game data due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while retrieving the game.'
            }],
            errCode: 500
        });
    };
};

// CREATE NEW GAME
const getNewProduct = async (req, res) => {
    try {
        const projectFields = { _id: 1, name: 1 };
        const db = getDb();
        const genreArr = await db.collection(genresPath).find().project(projectFields).toArray();
        const devArr = await db.collection(devPath).find().project(projectFields).toArray();
        res.status(200).send({
            success: true,
            data: {
                title: 'Add a new game',
                genreArr,
                devArr,
            }
        });
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while fetching add game template.'
            }],
            errCode: 500
        });
    };
};

const postNewProduct = [
    validateProduct,
    async (req, res) => {
        try {
            const db = getDb();
            const genreDb = await db.collection(genresPath);
            const devDb = await db.collection(devPath);
            const gamesDb = await db.collection(path);
            const genreArr = await genreDb.find().project({ name: 1 }).toArray();
            const devArr = await devDb.find().project({ name: 1 }).toArray();

            if (req.err) {
                res.status(400).send({
                    errType: 'Failed File Upload',
                    errBody: [{
                        msg: req.err
                    }],
                    errCode: 400
                });
            };

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).send({
                    errType: 'Invalid Input',
                    errBody: errors.array(),
                    errCode: 400
                });
            };

            const inputData = matchedData(req);
            const checkIfGameAlreadyExists = await gamesDb.find({ name: inputData.name }).project({ name: 1 }).toArray();
            if (checkIfGameAlreadyExists.length > 0) {
                res.status(400).send({ 
                    errType: 'Duplicate Item',
		            errBody: [{
                        msg: 'A game of the same name already exists.'
                    }],
                    errCode: 400
                });
            } else {
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

                if (error != null) {
                    res.status(500).send({ 
                        errType: 'Supabase Error',
                        errBody: [{
                            msg: error || 'Failed to upload the image file.'
                        }],
                        errCode: 500
                    });
                };

                const { data: obj } = supabase.storage
                .from('games-user-photos')
                .getPublicUrl(data.path);

                const newObj = {
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

                await gamesDb.insertOne(newObj);
                const newGame = await gamesDb.findOne({ name: inputData.name });
                await updateMultiple(newGame.genres, genreDb);
                await updateMultiple(newGame.developers, devDb);

                res.status(200).send({
                    success: true,
                    data: { gameID: newGame._id }
                });

            };
        } catch (err) {
            res.status(500).send({
                errType: 'Other',
                errBody: [{
                    msg: err || 'Error occured while creating a new game.'
                }],
                errCode: 500
            });
        };
    }
];

// UPDATE
const getUpdateProduct = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const game = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });
            const devArr = await db.collection(devPath).find().project({ name: 1 }).toArray();
            const genreArr = await db.collection(genresPath).find().project({ name: 1 }).toArray();
            res.status(200).send({
                success: true,
                data: {
                    game: game,
                    genresArray: genreArr,
                    devsArray: devArr
                }
            });

        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while retrieving game data due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while fetching game info.'
            }],
            errCode: 500
        });
    };
};

const postUpdateProduct = [
    validateProduct,
    async (req, res) => {
        const db = getDb();
        const genreDb = await db.collection(genresPath);
        const genreArr = await genreDb.find().project({ name: 1 }).toArray();
        const devDb = await db.collection(devPath);
        const devArr = await devDb.find().project({ name: 1 }).toArray();
        const gamesDb = await db.collection(path);

        if (ObjectId.isValid(req.params.id)) {
            const originalGame = await gamesDb.findOne({ _id: new ObjectId(req.params.id) });

            if (req.err) {
                res.status(400).send({
                    errType: 'Failed File Upload',
                    errBody: [{
                        msg: req.err
                    }],
                    errCode: 400
                });
            };

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).send({
                    errType: 'Invalid Input',
                    errBody: errors.array(),
                    errCode: 400
                });
            };

            try {
                const updatedData = matchedData(req);
                const checkIfGameAlreadyExists = await gamesDb.find({ name: updatedData.name }).project({ name: 1 }).toArray();
                if (checkIfGameAlreadyExists.length > 0) {
                    res.status(400).send({ 
                        errType: 'Duplicate Item',
                        errBody: [{
                            msg: 'A game of the same name already exists.'
                        }],
                        errCode: 400
                    });
                };

                let updateDoc;
                if (req.file) {
                    const file = req.file;
                    const fileBase64 = decode(file.buffer.toString('base64'));
                    const { data, error } = await supabase.storage
                    .from('games-user-photos')
                    .update(originalGame.imgName, fileBase64, {
                        contentType: file.mimetype,
                        cacheControl: '1',
                        upsert: false
                    });

                    if (error != null) {
                        res.status(500).send({ 
                            errType: 'Supabase Error',
                            errBody: [{
                                msg: error || 'Failed to upload the image file.'
                            }],
                            errCode: 500
                        });
                    };

                    const { data: obj } = supabase.storage
                    .from('games-user-photos')
                    .getPublicUrl(data.path);

                    updateDoc = {
                        $set: {
                            name: updatedData.name ? updatedData.name : originalGame.name,
                            url: `url(${obj.publicUrl})`,
                            imgName: data.path,
                            price: updatedData.price ? parseInt(updatedData.price) : originalGame.price,
                            rating: updatedData.rating ? parseInt(updatedData.rating) : originalGame.rating,
                            description: updatedData.description ? updatedData.description : originalGame.description,
                            genres: updatedData.genre ? (typeof updatedData.genre === 'string') ? [updatedData.genre] : updatedData.genre : [...originalGame.genres],
                            developers: updatedData.dev ? (typeof updatedData.dev === 'string') ? [updatedData.dev] : updatedData.dev : [...originalGame.developers],
                        }
                    };
                } else {
                    updateDoc = {
                        $set: {
                            name: updatedData.name ? updatedData.name : originalGame.name,
                            price: updatedData.price ? parseInt(updatedData.price) : originalGame.price,
                            rating: updatedData.rating ? parseInt(updatedData.rating) : originalGame.rating,
                            description: updatedData.description ? updatedData.description : originalGame.description,
                            genres: updatedData.genre ? (typeof updatedData.genre === 'string') ? [updatedData.genre] : updatedData.genre : [...originalGame.genres],
                            developers: updatedData.dev ? (typeof updatedData.dev === 'string') ? [updatedData.dev] : updatedData.dev : [...originalGame.developers],
                        }
                    };
                };
                const query = { _id: new ObjectId(req.params.id) };
                await gamesDb.updateOne(query, updateDoc);
                await updateMultiple(updatedData.genre, genreDb, originalGame.genres);
                await updateMultiple(updatedData.dev, devDb, originalGame.developers);
                res.status(200).send({ success: true });
            } catch (err) {
                res.status(500).send({
                    errType: 'Other',
                    errBody: [{
                        msg: err || 'Error occured while updating the game info.'
                    }],
                    errCode: 500
                });

            };
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while updating the game info due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    }
];

const getDeleteProduct = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const devDb = db.collection(devPath);
            const genreDb = db.collection(genresPath);
            const gamesDb = db.collection(path);
            const game = await gamesDb.findOne({ _id: new ObjectId(req.params.id) });

            const { data, error } = await supabase
            .storage
            .from('games-user-photos')
            .remove([game.imgName])

            if (error != null) {
                res.status(500).send({ 
                    errType: 'Supabase Error',
                    errBody: [{
                        msg: error || 'Failed to delete the image file.'
                    }],
                    errCode: 500
                });
            };

            const updateDoc = { $inc: { numberOfGames: -1 } };
            game.genres.forEach(async item => await genreDb.updateOne({ name: item }, updateDoc));
            game.developers.forEach(async item => await devDb.updateOne({ name: item }, updateDoc));
            await gamesDb.deleteOne({ _id: new ObjectId(req.params.id) });
            res.status(200).send({ success: true });
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while deleting the game due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while deleting the game.'
            }],
            errCode: 500
        });
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