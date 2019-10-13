const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const router = express.Router();


// app.get('/dashboard', (req, res) => {
//     res.send("dashboard");
// })

app.get('/dashboard', (req,res)=>{
    res.render('user');
})
const PORT=5000;


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

