const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

const db = require('./config/keys').MONGO_URI;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then( ()=> console.log('Mongo DB is connected...'))
        .catch( (error)=> console.log(error));

const PORT = process.env.PORT || 3000;

//Ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//session
app.use(session({
secret: 'secret',
resave: true,
saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});