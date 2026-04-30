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
        const projectFields = { _id: 1, name: 1, url: 1 };
        const sortBy = { name: 1 };
        const db = getDb();
        const devArr = await db.collection(path).find().project(projectFields).sort(sortBy).toArray();

        res.status(200).send({
            success: true,
            data: {
                title: "Developers",
                path,
                arr: devArr,
            }
        });
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while fetching all developers.'
            }],
            errCode: 500
        });
    };
};

// GET INDIVIDUAL DEVELOPER INFO
const getSpecificDeveloper= async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const dev = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });
            const projectFields = { description: 0, isDefault: 0 };
            const sortBy = { name: 1 };
            const productsArr = await db.collection(gamesPath).find({ developers: dev.name }).sort(sortBy).project(projectFields).toArray();

            res.status(200).send({
                success: true,
                data: {
                    path,
                    dev,
                    productsArr
                }
            });
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while retrieving developer data due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: 'Error occured while fetching developer data.'
            }],
            errCode: 500
        });
    };
};

// CREATE A DEVELOPER
const postCreateDeveloper = [
    validateDeveloper,
    async (req, res) => {
        try {
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

            const { name } = matchedData(req);
            const db = getDb();
            const devDb = db.collection(path);
            const checkIfDevAlreadyExists = await devDb.findOne({ name: name });

            if (checkIfDevAlreadyExists) {
                res.status(400).send({ 
                    errType: 'Duplicate Item',
                    errBody: [{
                        msg: 'A developer of the same name already exists.'
                    }],
                    errCode: 400
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
                .from('devs-user-photos')
                .getPublicUrl(data.path);

                await devDb.insertOne({
                    name: name,
                    url: `url(${obj.publicUrl})`,
                    imgName: data.path,
                    numberOfGames: 0,
                    isDefault: false
                });
                const newDev = await devDb.findOne({ name: name });

                res.status(200).send({
                    success: true,
                    data: { gameID: newDev._id }
                });
            };
        } catch (err) {
            res.status(500).send({
                errType: 'Other',
                errBody: [{
                    msg: err || 'Error occured while creating a new developer.'
                }],
                errCode: 500
            });
        };
    }
];

// UPDATE DEVELOPER
const getUpdateDeveloper = async (req, res) => {    
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const dev = await db.collection(path).findOne({ _id: new ObjectId(req.params.id) });

            res.status(200).send({
                success: true,
                data: {
                    path,
                    dev
                }
            });
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while retrieving developer data due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while retrieving developer data.'
            }],
            errCode: 500
        });
    };
};

const postUpdateDeveloper = [
    validateUpdateDeveloper,
    async (req, res) => {
        
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            const devDb = await db.collection(path);
            const dev = await devDb.findOne({ _id: new ObjectId(req.params.id) });
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
                const projectFields = { _id: 1, name: 1, developers: 1 };
                const gamesToUpdate = await gamesDb.find({ developers: dev.name }).project(projectFields).toArray();
                let updateDoc;
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
                    .from('devs-user-photos')
                    .getPublicUrl(data.path);
                    if (req.body.name.length > 0) {
                        if (dev.name !== name) {
                            updateDoc = {
                                $set: {
                                    name: name,
                                    url: `url(${obj.publicUrl})`
                                }
                            };
                            await updateGamesDevArray(gamesToUpdate, gamesDb, dev.name, name);
                        } else {
                            res.status(400).send({ 
                                errType: 'Duplicate Item',
                                errBody: [{
                                    msg: 'A developer of the same name already exists.'
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
                        if (dev.name !== name) {
                            updateDoc = {
                                $set: {
                                    name: name
                                }
                            };
                            await updateGamesDevArray(gamesToUpdate, gamesDb, dev.name, name);
                        } else {
                            res.status(400).send({ 
                                errType: 'Duplicate Item',
                                errBody: [{
                                    msg: 'A developer of the same name already exists.'
                                }],
                                errCode: 400
                            });
                        };
                    };
                };
                if (req.file || req.body.name.length > 0) {
                    const query = { _id: new ObjectId(req.params.id) };
                    await devDb.updateOne(query, updateDoc);
                };
                res.status(200).send({ success: true });
            } catch (err) {
                res.status(500).send({
                    errType: 'Other',
                    errBody: [{
                        msg: err || 'Error occured while updating developer data.'
                    }],
                    errCode: 500
                });
            };
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while updating developer data due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    }
];

// DELETE DEVELOPER
const getDeleteDeveloper = async (req, res) => {
    try {
        if (ObjectId.isValid(req.params.id)) {
            const db = getDb();
            const gamesDb = db.collection(gamesPath);
            const devDb = db.collection(path);
            const dev = await devDb.findOne({ _id: new ObjectId(req.params.id) });

            const projectFields = { _id: 1, name: 1, developers: 1 };
            const gamesToUpdate = await gamesDb.find({ developers: dev.name }).project(projectFields).toArray();
            let warning = [];
            if (gamesToUpdate.length > 0) warning = gamesToUpdate.filter(game => game.developers.length === 1);

            if (warning.length === 0) {
                if (gamesToUpdate.length > 0) await updateGamesDevArray(gamesToUpdate, gamesDb, dev.name);

                const { data, error } = await supabase
                .storage
                .from('devs-user-photos')
                .remove([dev.imgName])

                if (error != null) {
                    res.status(500).send({ 
                        errType: 'Supabase Error',
                        errBody: [{
                            msg: error || 'Failed to delete the image file.'
                        }],
                        errCode: 500
                    });
                };

                await devDb.deleteOne({ _id: new ObjectId(req.params.id) });

                res.status(200).send({ success: true });
            } else {
                res.status(400).send({ 
                    errType: 'Unable to Delete',
                    errBody: [{
                        msg: 'Unable to delete the developer as it is the only developer to at least one if its games.'
                    }],
                    errCode: 400
                });
            };
        } else {
            res.status(400).send({
                errType: 'Invalid ID',
                errBody: [{
                    msg: 'Error occured while deleting the developer due to invalid ID provided.'
                }],
                errCode: 400
            });
        };
    } catch (err) {
        res.status(500).send({
            errType: 'Other',
            errBody: [{
                msg: err || 'Error occured while deleting the developers.'
            }],
            errCode: 500
        });
    };
};

module.exports = {
    getAllDevelopers,
    getSpecificDeveloper,
    
    postCreateDeveloper,

    getUpdateDeveloper,
    postUpdateDeveloper,

    getDeleteDeveloper
};