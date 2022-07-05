const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs')
const db = mongojs('customerapp', ['users']);
const app = express();

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static path
app.use(express.static(path.join(__dirname, 'public')))

//Global vars
app.use(function(req, res, next) {
    res.locals.errors = null;
    next();
})

//Express Validator
app.use(expressValidator());

// const users = [
//     {
//         id: 1,
//         first_name: 'Jeff',
//         last_name: 'Bess'
//     },
//     {
//         id: 2,
//         first_name: 'Bob',
//         last_name: 'Smith'
//     },
//     {
//         id: 3,
//         first_name: 'Jill',
//         last_name: 'Jackson'
//     }
// ]

app.get('/', function(req, res){
    db.users.find(function (err, docs) {
        res.render('index', {
            title: 'Customers',
            users: docs
        });
    })
    
});

app.post('/users/add', function(req, res) {

    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();

    const errors = req.validationErrors();

    if(errors) {
        res.render('index', {
            title: 'Customers',
            users: users,
            errors: errors
        });
        console.log('ERRORS');

    } else {
        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        })
    }
   
    //console.log(newUser);
})

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    })
});
app.listen(3000, function() {
    console.log('Server started on port 3000');
})