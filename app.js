const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const ejsExpressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
    .connect('mongodb+srv://kohli10:1234@cluster0-wyvbr.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MONGODB CONNECTIONS ESTABLISHED'))
    .catch((err) => console.log('error occured'));

app.use(ejsExpressLayouts);
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'staic')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session management
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
    }),
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());

// global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Passport
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
            // check User exists
            if (!user) {
                return done(null, false, { message: 'That Email is not registered' });
            }

            // compare passwords
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password Incorrect' });
                }
            });
        });
    }),
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// Routes
app.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log(req.user)
    res.render('userdashboard', {
        name: req.user.name,
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/payments', (req, res) => { 
    res.render('payments')
})

app.post('/payments', (req, res) => { 
    console.log(req.body);
})

app.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ msg: `Please fill all the fields` });
    }

    if (password != password2) {
        errors.push({ msg: `password do not match` });
    }

    if (password.length < 6) {
        errors.push({ msg: `Password must be 6 or more characters` });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        User.findOne({ email: email }).then((user) => {
            console.log(user);
            if (user) {
                console.log(user);
                errors.push({ msg: `Username with this Email already exists` });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password,
                });

                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        } else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then((user) => {
                                    req.flash('success_msg', 'You are registerd now you can login');
                                    res.redirect('/login');
                                })
                                .catch((err) => console.log(`error ${err}`));
                        }
                    }),
                );
            }
        });
    }
});

// login
app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Successfully Logout');
    res.redirect('/login');
});

//  checking if user is authenticated
function ensureAuthenticated(req, res, next) {
    console.log('Reached to ensureAuthenticated');
    if (req.isAuthenticated) {
        return next();
    }

    req.flash('error_msg', 'You need to login first');
    res.redirect('/login');
}

// Stripe API payments


const PORT = 5000;

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
