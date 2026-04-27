const { MongoClient } = require('mongodb');
require('dotenv').config();

let dbConnection;

const connectDb = (cb) => {
    MongoClient.connect(process.env.NODE_ENV_DB_LOCALHOST)
    .then((client) => {
        dbConnection = client.db();
        return cb();
    })
    .catch(err => {
        console.error(err);
        return cb(err);
    })
};

const getDb = () => dbConnection;

module.exports = {
    connectDb,
    getDb
};