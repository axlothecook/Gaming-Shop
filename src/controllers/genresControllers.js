const { getDb } = require('../db/initiate');
const supabase = require('../../supabase');
const { ObjectId } = require('mongodb');
const { decode }  = require('base64-arraybuffer');
require('dotenv').config();
const {
    body,
    validationResult,
    matchedData
} = require('express-validator');
const {
    navLinks,
    alphaErr,
    lengthErr
} = require('../../data');
const {
    generateName,
    updateGamesGenreArr
} = require('../functionality/functions');

const path = process.env.GENRE_PATH;
const gamesPath = process.env.GAMES_PATH;

const validateGenre = [
    body('name').trim()
    .isLength({ min: 2, max: 100 }).withMessage(`Genre name ${lengthErr} 2 and 100 characters.`)
    .matches(/^[A-Za-z0-9 ]+$/).withMessage(`Genre name field ${alphaErr}`),
];

const validateUpdateGenre = [
    body('name')
    .isLength({ min: 2, max: 150 }).withMessage(`Genre name ${lengthErr} 2 and 150 characters.`)
    .matches(/^[A-Za-z0-9:!?; ]+$/).withMessage(`Genre name ${alphaErr}`)
    .optional()
];

// GET ALL GENRES
const getAllGenres = async (req, res) => {
    try {
        const projectFields = { _id: 1, name: 1, url: 1 };
        const sortBy = { name: 1 };
        const db = getDb();
        const genreArr = await db.collection(path).find().project(projectFields).sort(sortBy).toArray();

        res.status(200).send({
            success: true,
            data: {
                title: 'Genres',
                path,
                arr: genreArr,
            }
        });
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: err || 'Error occured while fetching all genres.',
            errCode: 500
        });
    };
};

// GET INDIVIDUAL GENRE INFO
const getSpecificGenre = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const genre = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });
            const projectFields = { description: 0, isDefault: 0 };
            const sortBy = { name: 1 };
            const productsArr = await db.collection(gamesPath).find({ genres: genre.name }).sort(sortBy).project(projectFields).toArray();
            res.status(200).send({
                success: true,
                data: {
                    path,
                    genre,
                    productsArr
                }
            });
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: 'Error occured while retrieving the genre data due to invalid ID provided.',
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: err || 'Error occured while fetching genre information.',
            errCode: 500
        });
    }
};

// CREATE A GENRE
const postCreateGenre = [
    validateGenre,
    async (req, res) => {
        try {
            if (req.err) {
                res.status(400).send({
                    errType: 'File Upload Error',
                    errBody: errors.array(),
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
            
            const { name } = matchedData(req);
            const db = getDb();
            const genreDb = db.collection(path);
            const checkIfGenreAlreadyExists = await genreDb.findOne({ name: name });

            if (checkIfGenreAlreadyExists) {
                res.status(400).send({ 
                    errType: 'Duplicate Item',
                    err: 'A genre of the same name already exists.',
                    errCode: 400
                });
            } else {
                const file = req.file;
                const newName = generateName(file.originalname);
                const fileBase64 = decode(file.buffer.toString('base64'));
                const { data, error } = await supabase.storage
                .from('genres-user-photos')
                .upload(newName, fileBase64, {
                    contentType: file.mimetype,
                    cacheControl: '1',
                    upsert: false
                });

                if (error != null) {
                    res.status(500).send({ 
                        errType: 'Supabase Error',
                        err: error || 'Failed to upload the image file.',
                        errCode: 500
                    });
                };

                const { data: obj } = supabase.storage
                .from('genres-user-photos')
                .getPublicUrl(data.path);

                await genreDb.insertOne({
                    name: name,
                    url: `url(${obj.publicUrl})`,
                    imgName: data.path,
                    numberOfGames: 0,
                    isDefault: false
                });
                const newGenre = await genreDb.findOne({ name: name });

                res.status(200).send({
                    success: true,
                    data: { gameID: newGenre._id }
                });
            };
        } catch (err) {
            res.status(500).send({
                errType: 'Other',
                errBody: err || 'Error occured while creating a new genre.',
                errCode: 500
            });
        };
    }
];

// UPDATE GENRE
const getUpdateGenre = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const genre = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });

            res.status(200).send({
                success: true,
                data: {
                    path,
                    genre
                }
            });

        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: 'Error occured while retrieving the genre data due to invalid ID provided.',
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: err || 'Error occured while fetching the genre data.',
            errCode: 500
        });
    };
};

const postUpdateGenre = [
    validateUpdateGenre,
    async (req, res) => {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            const genreDb = db.collection(path);
            const genre = await genreDb.findOne({ _id: new ObjectId(req.params.id) });

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
                const { name } = matchedData(req);
                const projectFields = { _id: 1, name: 1, genres: 1 };
                const gamesToUpdate = await gamesDb.find({ genres: genre.name }).project(projectFields).toArray();
                let updateDoc;

                if (req.file) {
                    const file = req.file;
                    const fileBase64 = decode(file.buffer.toString('base64'));
                    const { data, error } = await supabase.storage
                    .from('genres-user-photos')
                    .update(genre.imgName, fileBase64, {
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
                    .from('genres-user-photos')
                    .getPublicUrl(data.path);

                    if (req.body.name.length > 0) { 
                        if (genre.name !== name) {
                            updateDoc = {
                                $set: {
                                    name: name,
                                    url: `url(${obj.publicUrl})`
                                }
                            };
                            await updateGamesGenreArr(gamesToUpdate, gamesDb, genre.name, name);
                        } else {
                            res.status(400).send({ 
                                errType: 'Duplicate Item',
                                errBody: [{
                                    msg: 'A genre of the same name already exists.'
                                }],
                                errCode: 400
                            });
                        };
                    } else {
                        updateDoc = {
                            $set: {
                                url: `url(${obj.publicUrl})`
                            }
                        };
                    };
                } else {
                    if (req.body.name.length > 0) {
                        if (genre.name !== name) {
                            updateDoc = {
                                $set: {
                                    name: name
                                }
                            };
                            await updateGamesGenreArr(gamesToUpdate, gamesDb, genre.name, name);
                        } else {
                            res.status(400).send({ 
                                errType: 'Duplicate Item',
                                errBody: [{
                                    msg: 'A genre of the same name already exists.'
                                }],
                                errCode: 400
                            });
                        };
                    };
                };
                if (req.file || req.body.name.length) {
                    const query = { _id: new ObjectId(req.params.id) };
                    await genreDb.updateOne(query, updateDoc);
                };

                res.status(200).send({ success: true });
            } catch (err) {
                res.status(500).send({
                    errType: 'Other',
                    errBody: [{
                        msg: err || 'Error occured while updating the genre.'
                    }],
                    errCode: 500
                });
            };
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while retrieving updating developer data due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    }
];

// DELETE GENRE
const getDeleteGenre = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            const genreDb = db.collection(path);
            const genre = await genreDb.findOne({ _id: new ObjectId(req.params.id) });

            const projectFields = { _id: 1, name: 1, genres: 1 };
            const gamesToUpdate = await gamesDb.find({ genres: genre.name }).project(projectFields).toArray();
            let warning = [];
            if (gamesToUpdate.length > 0) warning = gamesToUpdate.filter(game => game.genres.length === 1);
            if (warning.length === 0) {
                if (gamesToUpdate.length > 0) await updateGamesGenreArr(gamesToUpdate, gamesDb, genre.name);

                const { data, error } = await supabase
                .storage
                .from('genres-user-photos')
                .remove([genre.imgName])

                if (error != null) {
                    res.status(500).send({ 
                        errType: 'Supabase Error',
                        errBody: [{
                            msg: error || 'Failed to delete the image file.'
                        }],
                        errCode: 500
                    });
                };

                await genreDb.deleteOne({ _id: new ObjectId(req.params.id) });
                res.status(200).send({ success: true });
            } else {
                res.status(400).send({ 
                    errType: 'Unable to Delete',
                    errBody: [{
                        msg: 'Unable to delete the genre as it is the only genre to at least one if its games.'
                    }],
                    errCode: 400
                });
            };
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while deleting the genre due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while deleting the genre.'
            }],
            errCode: 500
        });
    };
};

module.exports = {
    getAllGenres,
    getSpecificGenre,
    
    postCreateGenre,

    getUpdateGenre,
    postUpdateGenre,
    
    getDeleteGenre
};