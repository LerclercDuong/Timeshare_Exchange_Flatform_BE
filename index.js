const express = require('express');
const app = express();
const PORT = 8080;
const router = require('./src/routes/v1');
const mongoDB = require('./src/configs/database');
const http = require('http');
const path = require('path');
const cors = require('cors');
// Import multer like the other dependencies
const multer  = require('multer')
// Set multer file storage folder
const upload = multer({ dest: 'uploads/' })
/////----////
const hbs = require('express-handlebars');

app.engine(
    'hbs',
    hbs.engine({
        extname: '.hbs', //rename file handlebars --> hbs
        helpers: {
            sum: (a, b) => a + b,
        }
    }),
);
app.set('views engine', 'hbs');
app.set('views', './src/resources/views');

/////----////

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

var httpServer = http.createServer(app);

mongoDB.connect();

app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// console.log(path.join(__dirname, '/src/static/img'))

// app.use('/static', express.static(path.join(__dirname, '/src/static')))
app.use('/static', express.static(path.join(__dirname, 'src/public/img')))
console.log(path.join(__dirname, 'src/public'))
router(app);

httpServer.listen(PORT, function () {
    console.log('listening on port 8080');
});