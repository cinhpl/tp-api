// Configuration de express
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Lecture du fichier .env
require('dotenv').config()

// Lecture du fichier models/index.js afin de lancer la synchronisation de Sequelize
require('./models/index.js');

// Importation des routeurs
const indexRouter = require('./routes/index.js');
const productRouter = require('./routes/product.js');
const tagRouter = require('./routes/tags.js');
const usersRouter = require('./routes/users.js');
const adminsRouter = require('./routes/admins.js');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/tags', tagRouter);
app.use('/users', usersRouter);
app.use('/admins', adminsRouter);

module.exports = app;
