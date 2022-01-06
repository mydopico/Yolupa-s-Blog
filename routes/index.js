const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require('../utils/catchAsync');
const User = require("../models/user");
const Trip = require("../models/trip");
const Book = require("../models/book");


// ROUTES

router.get("/", async(req, res) => {
	const trip = await Trip.find({}).sort({'createdAt': -1});
	const book = await Book.find({}).sort({'createdAt':-1});
	res.render("home", { trip, book });		
});


// REGISTER FORM

router.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('register');
});


router.post("/register", catchAsync(async(req, res, next) => {
  try {	
	const { email, username, password } = req.body;
	const user = new User({email, username}); 
	if(req.body.adminCode === "SecretCode170576"){
		user.isAdmin = true;
	}
	const registeredUser = await User.register(user, password);
	req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Bienvenido/a a este Blog!');
            res.redirect('/');
     })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }	
}));


// LOGIN

// router.get("/login", (req, res) => {
// 	res.render("login");
// });
router.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('login');
})

router.post("/login", passport.authenticate("local", {
	// failureFlash: true, failureRedirect: '/login'
	// successRedirect: "/",	
	failureRedirect: "/login",
	failureFlash: true
}), (req, res) => {
    req.flash('success', 'Bienvenido/a');
    const redirectUrl = req.session.returnTo || '/';
    res.redirect(redirectUrl);
});


// LOGOUT

router.get("/logout", (req, res) => {
	req.logout();	
	req.flash("success", "Hasta pronto!");
	res.redirect("back");
});


module.exports = router;
