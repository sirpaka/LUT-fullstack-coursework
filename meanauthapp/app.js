const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require('express-session');

//Connect to database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('Connected to database '+config.database)
});

// On Connection
mongoose.connection.on('error', (err) => {
    console.log('Database error'+err);
});

const app = express();

app.use(session({
    secret: 'yoursecret',
    resave: true,
    saveUninitialized: false
}));

const users = require('./routes/users');

// Port Number
const port = process.env.PORT || 8080;
//const port = 3000;

// CORS Middleware
app.use(cors());

// Body Parser Middleware
app.use(bodyParser.json());

app.use('/users', users);

// Passport Middlewate
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Set static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid endpoint');
})

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Start Server
app.listen(port, () => {
    console.log('Server started on port '+port);
});

