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
    updateGamesDevArray
} = require('../functionality/functions');

const path = process.env.DEV_PATH;
const gamesPath = process.env.GAMES_PATH;

const validateDeveloper = [
    body('name').trim()
    .isLength({ min: 2, max: 150 }).withMessage(`Developer name ${lengthErr} 2 and 150 characters.`)
    .matches(/^[A-Za-z0-9:!?; ]+$/).withMessage(`Developer name ${alphaErr}`)
];

const validateUpdateDeveloper = [
    body('name')
    .isLength({ min: 2, max: 150 }).withMessage(`Developer name ${lengthErr} 2 and 150 characters.`)
    .matches(/^[A-Za-z0-9:!?; ]+$/).withMessage(`Developer name ${alphaErr}`)
    .optional()
];

// GET ALL DEVS
const getAllDevelopers = async (req, res) => {
    try {
        console.log("GETTING ALL DEVS");
        const projectFields = { _id: 1, name: 1, url: 1 };
        const sortBy = { name: 1 };
        const db = getDb();
        const devArr = await db.collection(path).find().project(projectFields).sort(sortBy).toArray();

        // res.render('category', {
        //     title: 'Developers',
        //     navLinks,
        //     path,
        //     arr: devArr
        // });
        res.status(200).send({
            success: true,
            data: {
                title: "Developers",
                path,
                arr: devArr,
            }
        });
    } catch (err) {
        // throw new Error(`Error occured while fetching all developers.`, err);
        res.status(500).send({
            err: err ? err : 'Error occured while fetching all developers.'
        });
    };
};

// GET INDIVIDUAL DEVELOPER INFO
const getSpecificDeveloper= async (req, res) => {
    console.log('FETCHING SINGLE DEV INFO');
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const dev = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });
            // console.log(dev);
            const projectFields = { description: 0, isDefault: 0 };
            const sortBy = { name: 1 };
            const productsArr = await db.collection(gamesPath).find({ developers: dev.name }).sort(sortBy).project(projectFields).toArray();
            // console.log(productsArr);

            // res.render('partials/genreAndDevTemplate', {
            //     title: `${dev.name}`,
            //     btnTitle: 'Go back to categories',
            //     path,
            //     imgStyling: '70% 120%',
            //     navLinks,
            //     category: dev,
            //     productsArr,
            // });
            res.status(200).send({
                success: true,
                data: {
                    path,
                    dev,
                    productsArr
                }
            });
        } else {
            res.status(500).send({
                err: err ? err : 'Error occured while retrieving the developer due to invalid ID provided.'
            });
        };
    } catch (err) {
        res.status(500).send({
            err: err ? err : 'Error occured while fetching the developer.'
        });
    };
};

// CREATE A DEVELOPER
const postCreateDeveloper = [
    validateDeveloper,
    async (req, res) => {
        try {
            console.log('POSTING DEV NEW ADD');
            if (req.err) {
                console.log(req.err);
                // return res.status(400).render('createGenreAndDev', {
                //     title: 'Add a new developer',
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
                // return res.status(400).render('createGenreAndDev', {
                //     title: 'Add a new developer',
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

            // console.log(req.file)

            const { name } = matchedData(req);
            const db = getDb();
            const devDb = db.collection(path);
            const checkIfDevAlreadyExists = await devDb.findOne({ name: name });
            // console.log('checkIfDevAlreadyExists:', checkIfDevAlreadyExists);

            if (checkIfDevAlreadyExists) {
                // return res.status(400).render('createGenreAndDev', {
                //     title: 'Add a new genre',
                //     btnTitle: 'Go back',
                //     navLinks,
                //     path,
                //     errors: [{
                //         msg: 'Developer already exists.'
                //     }]
                // });
                res.status(404).send({
                    errType: "Already exists",
                    errBody: 'A developer with the same name already exists.',
                    errCode: 404
                });
            } else {
                const file = req.file;
                const newName = generateName(file.originalname);
                const fileBase64 = decode(file.buffer.toString('base64'));
                const { data, error } = await supabase.storage
                .from('devs-user-photos')
                .upload(newName, fileBase64, {
                    contentType: file.mimetype,
                    cacheControl: '1',
                    upsert: false
                });
                console.log('data from supabase:');
                console.log(data);
                if (error != null) throw error;

                const { data: obj } = supabase.storage
                .from('devs-user-photos')
                .getPublicUrl(data.path);

                // console.log('link from supabase:');
                // console.log(obj);

                await devDb.insertOne({
                    name: name,
                    url: `url(${obj.publicUrl})`,
                    imgName: data.path,
                    numberOfGames: 0,
                    isDefault: false
                });
                const newDev = await devDb.findOne({ name: name });
                console.log('newDev:');
                console.log(newDev);

                // res.redirect(`/${path}/${newDev._id}`);
                res.status(200).send({
                    success: true,
                    data: {
                        gameID: newDev._id
                    }
                });
            };
        } catch (err) {
            // throw new Error(`Error occured while uploading photo of the developer.`, err);
            res.status(500).send({
                errType: "Other",
                errBody: 'Error occured while creating a new developer.',
                errCode: 500
            });
        };
    }
];

// UPDATE DEVELOPER
const getUpdateDeveloper = async (req, res) => {    
    try {
        console.log('GETTING DEV UPDATE');
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const dev = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });
            // console.log(dev);

            // res.render('editGenreAndDev', {
            //     title: `Edit ${dev.name}`,
            //     btnTitle: `Return to ${dev.name}`,
            //     navLinks,
            //     path,
            //     category: dev,
            //     errors: null
            // });
            res.status(200).send({
                success: true,
                data: {
                    path,
                    dev
                }
            });
        } else {
            console.log('id is not valid');
            res.status(500).send({
                err: err ? err : 'Error occured while retrieving the dev due to invalid ID provided.'
            });
        };
    } catch (err) {
        console.log('smt else');
        res.status(500).send({
            err: err ? err : 'Error occured while fetching the dev.'
        });
    };
};

const postUpdateDeveloper = [
    validateUpdateDeveloper,
    async (req, res) => {
        console.log('POSTED DEV UPDATE');
        
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            const devDb = await db.collection(path);
            const dev = await devDb.findOne({ _id: new ObjectId(req.params.id) });
            if (req.err) {
                console.log(req.err);
                // return res.status(400).render('editGenreAndDev', {
                //     title: `Edit ${dev.name}`,
                //     btnTitle: `Return to ${dev.name}`,
                //     navLinks,
                //     path,
                //     category: dev,
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
                //     title: `Edit ${dev.name}`,
                //     btnTitle: `Return to ${dev.name}`,
                //     navLinks,
                //     path,
                //     category: dev,
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
                const projectFields = { _id: 1, name: 1, developers: 1 };
                const gamesToUpdate = await gamesDb.find({ developers: dev.name }).project(projectFields).toArray();
                let updateDoc;
                console.log(dev);
                if (req.file) {
                    const file = req.file;
                    const fileBase64 = decode(file.buffer.toString('base64'));
                    const { data, error } = await supabase.storage
                    .from('devs-user-photos')
                    .update(dev.imgName, fileBase64, {
                        contentType: file.mimetype,
                        cacheControl: '1',
                        upsert: false
                    });
                    if (error != null) throw error;

                    const { data: obj } = supabase.storage
                    .from('devs-user-photos')
                    .getPublicUrl(data.path);

                    if (req.body.name.length > 0 && dev.name !== name) {
                        updateDoc = {
                            $set: {
                                name: name,
                                url: `url(${obj.publicUrl})`
                            }
                        };
                        await updateGamesDevArray(gamesToUpdate, gamesDb, dev.name, name);
                    } else {
                        updateDoc = {
                            $set: {
                                url: `url(${obj.publicUrl})`
                            }
                        };
                    };
                } else {
                    if (req.body.name.length > 0 && dev.name !== name) {
                        console.log('proceeding w update');
                        updateDoc = {
                            $set: {
                                name: name
                            }
                        };
                        await updateGamesDevArray(gamesToUpdate, gamesDb, dev.name, name);
                    } else console.log('no update');
                };
                if (req.file || (req.body.name.length > 0 && dev.name !== name)) {
                    const query = { _id: new ObjectId(req.params.id) };
                    await devDb.updateOne(query, updateDoc);
                };
                // res.redirect(`/${path}/${req.params.id}`);
                res.status(200).send({
                    success: true,
                });
            } catch (err) {
                // throw new Error(`Error occured while uploading developer data`, err);
                res.status(500).send({
                    errType: "Other",
                    errBody: 'Error occured while uploading update',
                    errCode: 500
                });
            };
        } else {
            // throw new Error(`Invalid developer id`, err);
            // res.redirect(`/games/${req.params.id}`);
            res.status(500).send({
                errType: "ID",
                errBody: 'Error occured due to invalid id.',
                errCode: 500
            });
        };
    }
];

// DELETE DEVELOPER
const getDeleteDeveloper = async (req, res) => {
    try {
        console.log('DELETING DEV');
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            const devDb = db.collection(path);
            const dev = await devDb.findOne({ _id: new ObjectId(req.params.id) });

            const projectFields = { _id: 1, name: 1, developers: 1 };
            console.log('dev.name: ', dev.name);
            const gamesToUpdate = await gamesDb.find({ developers: dev.name }).project(projectFields).toArray();
            let warning = [];
            if (gamesToUpdate.length > 0) warning = gamesToUpdate.filter(game => game.developers.length === 1);

            if (warning.length === 0) {
                console.log('warning = 0')
                if (gamesToUpdate.length > 0) await updateGamesDevArray(gamesToUpdate, gamesDb, dev.name);

                const { data, error } = await supabase
                .storage
                .from('devs-user-photos')
                .remove([dev.imgName])

                console.log('dev deletion img:', data);

                if (error != null) throw error;

                const deleteResult = await devDb.deleteOne({ _id: new ObjectId(req.params.id) });

                console.log('mongodb dev dlt: ', deleteResult);
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
                err: err ? err : 'Error occured while deleting the developer due to invalid ID provided.'
            });
        };
    } catch (err) {
        res.status(500).send({
            err: err ? err : 'Error occured while deleting the developer.'
        });
    };
};

module.exports = {
    getAllDevelopers,
    getSpecificDeveloper,

    // getCreateDeveloper,
    postCreateDeveloper,

    getUpdateDeveloper,
    postUpdateDeveloper,

    getDeleteDeveloper
};