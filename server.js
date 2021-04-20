'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('./public/'));
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
// app.use(methodoverride('method'));
// Express middleware
// Utilize ExpressJS functionality to parse the body of the request

// Specify a directory for static resources

// define our method-override reference

// Set the view engine for server-side templating

// Use app cors
app.use(cors())


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/', hamepageHandler)
app.post('/favorite-quotes', addFavor)
app.get('/favorite-quotes', showFavor)

let allQouts = []

function Quote(quote, character, image, characterDirection) {
    this.quote = quote;
    this.character = character;
    this.image = image;
    this.characterDirection = characterDirection;
    allQouts.push(this);
}
// callback functions
function hamepageHandler(request, response) {
    let url = `https://thesimpsonsquoteapi.glitch.me/quotes?count=10`
    superagent.get(url).set('User-Agent', '1.0').then(responseUrl => {
        responseUrl.body.forEach(quote => {
            let newQoute = new Quote(quote.quote, quote.character, quote.image, quote.characterDirection);
        })
        response.render('index', { qoutesResult: allQouts })
    })
}

function addFavor(request, response) {
    let direction = request.body.Direction;
    let character = request.body.character;
    let quote = request.body.quote;
    let image = request.body.image;
    let values = [character, quote, image, direction]
    let SQL = `INSERT INTO users (character, quote, image, direction)
    VALUES ($1,$2,$3,$4);`
    client.query(SQL, values).then(responseData => {

        response.render('fover')
    })
}

function showFavor(request, response) {
    let SQL = `SELECT * FROM users`;
    client.query(SQL).then(responseData => {
        console.log(responseData.rows);
        response.render('fover')
    })
}
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --

// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);