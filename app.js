const express = require('express');
const app = express();
const path = require ('node:path');
const { connectDb } = require('./src/db/initiate');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const cors = require('cors');
const indexRouter = require('./src/routes/indexRouter');
const genresRouter = require('./src/routes/genresRouter');
const gamesRouter = require('./src/routes/gamesRouter');
const developersRouter = require('./src/routes/developersRouter');
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

const assetsPath = path.join(__dirname, 'src', 'public');
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/games', gamesRouter);
app.use('/genres', genresRouter);
app.use('/developers', developersRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).send(err.message);
});

// instead send error
// app.use((req, res) => {
//     res.status(404).sendFile('/public/404.html', { root: __dirname });
// });

const PORT = process.env.NODE_ENV_PORT_LOCALHOST || 3005;

connectDb((err) => {
    if(!err) {
        app.listen(PORT, (error) => {
            if (error) throw error;
            console.log(`The app launched is listening on port ${PORT}!`);
        });
    };
});