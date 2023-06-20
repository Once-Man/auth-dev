const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

const loginView = async(req, res) => {
    res.render('login');
}

const registerView = async(req, res) => {
    res.render('register');
}

const registerStore = async(req, res) => {
    try {

        const {name, email, password, password2} = req.body;
        let errors = [];

        //Check required fields
        if(!name || !email || !password || !password2) {
            errors.push( { msg: 'Please fill in all fields' } );
        }

        //Check password match
        if(password !== password2) {
            errors.push( { msg: 'Password do not match' } );
        }

        //Check password length
        if(password.length < 6) {
            errors.push( { msg: 'Password show be at least 6 character' } );
        }

        if(errors.length > 0) {
            res.render('register', {
               errors,
               name,
               email,
               password,
               password2 
            });
        } else {

            //validation pass
            const user = await User.findOne({email: email});

            if(user){
                //user exist
                errors.push({ msg: 'Email is already exist' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2  
                });
            } else {
                 //Hash Password
                 const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({
                    name: name,
                    email: email,
                    password: hashedPassword
                    
                });
               
                newUser.save();
                req.flash('success_msg', 'You are now registered and can login')
                res.redirect('/users/login');
            } 

        }

    }catch(error){
        console.log(error.message);
    }
}

const loginPass = async(req, res, next) => {
    try{
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: true
          })
          (req, res, next);
    }catch(error){
        console.log(error.message);
    }
}

const logoutHandle = async(req ,res) => {
    // req.logout();
    // req.flash('success_msg', 'You are logged out');
    // res.redirect('/users/login');

    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/login');
    });
}

module.exports = {
    registerStore,
    registerView,
    loginView,
    loginPass,
    logoutHandle
}