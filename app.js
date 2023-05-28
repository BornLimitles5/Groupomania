const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const handlebars = require('handlebars');
const handlebarsHelpers = require('handlebars-helpers');
const session = require('express-session');
const http = require('http');
const socketIO = require('socket.io');



//HBS
handlebarsHelpers({ handlebars });

const hbs = require('hbs');
const fs = require('fs');
const file = require("carbon-framework/lib/file");

const header = fs.readFileSync('./views/header.hbs', 'utf8');
const footer = fs.readFileSync('./views/footer.hbs', 'utf8');

hbs.registerPartial('header', header);
hbs.registerPartial('footer', footer);

//Fin HBS
dotenv.config({ path: './.env' });

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    charset: 'utf8mb4'
});

//Session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

// Dossier css et image
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Moteur de Template
app.set('view engine', 'hbs');

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Connexion réussie");
    }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Handle user disconnection event
    });
});


app.use("/", require('./routes/pages'));
app.use('/auth', require('./routes/auth'));




server.listen(3000, () => {
    console.log("C'est Parti sur le Port 3000");
});
