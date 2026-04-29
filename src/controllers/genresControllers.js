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
        console.log("GETTING ALL GENRES");
        const projectFields = { _id: 1, name: 1, url: 1 };
        const sortBy = { name: 1 };
        const db = getDb();
        const genreArr = await db.collection(path).find().project(projectFields).sort(sortBy).toArray();

        // res.render('category', {
        //     title: 'Genres',
        //     navLinks,
        //     path,
        //     arr: genreArr
        // });
        res.status(200).send({
            success: true,
            data: {
                title: 'Genres',
                path,
                arr: genreArr,
            }
        });
    } catch (err) {
        // throw new Error(`Error occured while fetching all genres.`, err);
        res.status(500).send({
            err: err ? err : 'Error occured while fetching all genres.'
        });
    };
};

// GET INDIVIDUAL GENRE INFO
const getSpecificGenre = async (req, res) => {
    console.log('FETCHING SINGLE GENRE INFO');
    try {
        console.log(req.params.id);
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const genre = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });
            console.log(genre);
            const projectFields = { description: 0, isDefault: 0 };
            const sortBy = { name: 1 };
            const productsArr = await db.collection(gamesPath).find({ genres: genre.name }).sort(sortBy).project(projectFields).toArray();
            // console.log(productsArr);

            // res.render('partials/genreAndDevTemplate', {
            //     title: `${genre.name}`,
            //     btnTitle: 'Go back to categories',
            //     path,
            //     imgStyling: '70% 120%',
            //     navLinks,
            //     category: genre,
            //     productsArr,
            // });
            res.status(200).send({
                success: true,
                data: {
                    path,
                    genre,
                    productsArr
                }
            });
        } else {
            console.log('id is not valid');
            res.status(500).send({
                err: err ? err : 'Error occured while retrieving the genre due to invalid ID provided.'
            });
        };
    } catch (err) {
        console.log('smt else');
        res.status(500).send({
            err: err ? err : 'Error occured while fetching the genre.'
        });
    }
};

// CREATE A GENRE
const postCreateGenre = [
    validateGenre,
    async (req, res) => {
        try {
            console.log('POSTING NEW GENRE');
            console.log('req.body: ', req.body);

            if (req.err) {
                console.log('req.err: ', req.err);
                // return res.status(400).render('createGenreAndDev', {
                //     title: 'Add a new genre',
                //     btnTitle: 'Go back',
                //     navLinks,
                //     path,
                //     errors: [{
                //         msg: req.err
                //     }]
                // });

                res.status(400).send({
                    errTpe: 'Multer',
                    errBody: errors.array(),
                    errCode: 400
                });
            };
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('errors.isEmpty():', errors.isEmpty());
                // return res.status(400).render('createGenreAndDev', {
                //     title: 'Add a new genre',
                //     btnTitle: 'Go back',
                //     navLinks,
                //     path,
                //     errors: errors.array(),
                // });
                res.status(400).send({
                    errTpe: 'Validation',
                    errBody: errors.array(),
                    errCode: 400
                });
            };
            

            console.log('passed');
            console.log('req.file: ', req.file);
            const { name } = matchedData(req);

            const db = getDb();
            const genreDb = db.collection(path);
            const checkIfGenreAlreadyExists = await genreDb.findOne({ name: name });
            console.log('checkIfGenreAlreadyExists:', checkIfGenreAlreadyExists);

            if (checkIfGenreAlreadyExists) {
                // return res.status(400).render('createGenreAndDev', {
                //     title: 'Add a new genre',
                //     btnTitle: 'Go back',
                //     navLinks,
                //     path,
                //     errors: [{
                //         msg: 'Genre already exists.'
                //     }]
                // });
                res.status(404).send({
                    errType: "Already exists",
                    errBody: 'A genre with the same name already exists.',
                    errCode: 404
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
                console.log('data from supabase:');
                console.log(data);
                if (error != null) throw error;

                const { data: obj } = supabase.storage
                .from('genres-user-photos')
                .getPublicUrl(data.path);

                console.log('link from supabase:');
                console.log(obj);

                await genreDb.insertOne({
                    name: name,
                    url: `url(${obj.publicUrl})`,
                    imgName: data.path,
                    numberOfGames: 0,
                    isDefault: false
                });
                const newGenre = await genreDb.findOne({ name: name });
                console.log('newGenre:');
                console.log(newGenre);

                // res.redirect(`/${path}/${newGenre._id}`);
                res.status(200).send({
                    success: true,
                    data: {
                        gameID: newGenre._id
                    }
                });
            };
        } catch (err) {
            // throw new Error(`Error occured while uploading photo of the genre.`, err);
            res.status(500).send({
                errType: "Other",
                errBody: 'Error occured while creating a new genre.',
                errCode: 500
            });
        };
    }
];

// UPDATE GENRE
const getUpdateGenre = async (req, res) => {
    try {
        console.log('GETTING GENRE UPDATE');
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const genre = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });
            console.log(genre);

            // res.render('editGenreAndDev', {
            //     title: `Edit ${genre.name}`,
            //     btnTitle: `Return to ${genre.name}`,
            //     navLinks,
            //     path,
            //     category: genre,
            //     errors: null
            // });

            res.status(200).send({
                success: true,
                data: {
                    path,
                    genre
                }
            });
        } else {
            console.log('id is not valid');
            res.status(500).send({
                err: err ? err : 'Error occured while retrieving the genre due to invalid ID provided.'
            });
        };
    } catch (err) {
        console.log('smt else');
        res.status(500).send({
            err: err ? err : 'Error occured while fetching the genre.'
        });
    };
};

const postUpdateGenre = [
    validateUpdateGenre,
    async (req, res) => {
        console.log('POSTED GENRE UPDATE');

        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            const genreDb = db.collection(path);
            const genre = await genreDb.findOne({ _id: new ObjectId(req.params.id) });

            if (req.err) {
                console.log(req.err);
                // return res.status(400).render('editGenreAndDev', {
                //     title: `Edit ${genre.name}`,
                //     btnTitle: `Return to ${genre.name}`,
                //     navLinks,
                //     path,
                //     category: genre,
                //     errors: [{
                //         msg: req.err
                //     }]
                // });

                res.status(400).send({
                    errTpe: 'Multer',
                    errBody: errors.array(),
                    errCode: 400
                });
            };

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                // return res.status(400).render('editGenreAndDev', {
                //     title: `Edit ${genre.name}`,
                //     btnTitle: `Return to ${genre.name}`,
                //     navLinks,
                //     path,
                //     category: genre,
                //     errors: errors.array(),
                // });

                res.status(400).send({
                    errTpe: 'Validation',
                    errBody: errors.array(),
                    errCode: 400
                });
            };

            try {
                console.log('everything good');
                const { name } = matchedData(req);
                const projectFields = { _id: 1, name: 1, genres: 1 };
                const gamesToUpdate = await gamesDb.find({ genres: genre.name }).project(projectFields).toArray();
                let updateDoc;
                // console.log(genre);

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
                    if (error != null) throw error;

                    const { data: obj } = supabase.storage
                    .from('genres-user-photos')
                    .getPublicUrl(data.path);

                    if (req.body.name.length > 0 && genre.name !== name) {
                        updateDoc = {
                            $set: {
                                name: name,
                                url: `url(${obj.publicUrl})`
                            }
                        };
                        await updateGamesGenreArr(gamesToUpdate, gamesDb, genre.name, name);
                    } else {
                        updateDoc = {
                            $set: {
                                url: `url(${obj.publicUrl})`
                            }
                        };
                    };
                } else {
                    if (req.body.name.length > 0 && genre.name !== name) {
                        console.log('proceeding w update');
                        updateDoc = {
                            $set: {
                                name: name
                            }
                        };
                        await updateGamesGenreArr(gamesToUpdate, gamesDb, genre.name, name);
                    } else console.log('no update');
                };
                if (req.file || (req.body.name.length > 0 && genre.name !== name)) {
                    const query = { _id: new ObjectId(req.params.id) };
                    await genreDb.updateOne(query, updateDoc);
                };

                res.status(200).send({
                    success: true,
                });
                // res.redirect(`/${path}/${req.params.id}`);
            } catch (err) {
                // throw new Error(`Error occured while uploading genre data`, err);
                res.status(500).send({
                    errType: "Other",
                    errBody: 'Error occured while uploading update',
                    errCode: 500
                });
            };

        } else {
            // throw new Error(`Invalid genre id`, err);
            // res.redirect(`/games/${req.params.id}`);
            res.status(500).send({
                errType: "ID",
                errBody: 'Error occured due to invalid id.',
                errCode: 500
            });
        };
    }
];

// DELETE GENRE
const getDeleteGenre = async (req, res) => {
    try {
        console.log('DELETING GENRE');
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            const genreDb = db.collection(path);
            const genre = await genreDb.findOne({ _id: new ObjectId(req.params.id) });

            const projectFields = { _id: 1, name: 1, genres: 1 };
            const gamesToUpdate = await gamesDb.find({ genres: genre.name }).project(projectFields).toArray();
            console.log('gamesToUpdate: ', gamesToUpdate);
            let warning = [];
            if (gamesToUpdate.length > 0) warning = gamesToUpdate.filter(game => game.genres.length === 1);
            if (warning.length === 0) {
                console.log('warning = 0');
                if (gamesToUpdate.length > 0) await updateGamesGenreArr(gamesToUpdate, gamesDb, genre.name);

                const { data, error } = await supabase
                .storage
                .from('genres-user-photos')
                .remove([genre.imgName])

                console.log('genre deletion img:', data);

                if (error != null) throw error;

                const deleteResult = await genreDb.deleteOne({ _id: new ObjectId(req.params.id) });
                console.log('mongodb genre dlt: ', deleteResult);
                // res.redirect('/genres');
                res.status(200).send({
                    success: true,
                });
            } else {
                console.error('Error: ', warning);
                // res.redirect(`/${path}/${req.params.id}`);
                res.status(500).send({
                    err: warning
                });
            };
        } else {
            res.status(500).send({
                err: err ? err : 'Error occured while deleting the genre due to invalid ID provided.'
            });
        };
    } catch (err) {
        res.status(500).send({
            err: err ? err : 'Error occured while deleting the genre.'
        });
    };
};

module.exports = {
    getAllGenres,
    getSpecificGenre,

    // getCreateGenre,
    postCreateGenre,

    getUpdateGenre,
    postUpdateGenre,
    
    getDeleteGenre
};