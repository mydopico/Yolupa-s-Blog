require("dotenv").config();
const dotenv=require('dotenv');
const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const mongoose = require("mongoose");
// const catchAsync = require('./utils/catchAsync');
// const Trip = require("./models/trip");
const User = require("./models/user");
// const Comment = require("./models/comment");
// const TripContent = require("./models/tripContent");
// const Reply = require("./models/reply");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
const findOrCreate = require('mongoose-findorcreate');
//const countries = require('./countries');
const helmet = require("helmet");

const ExpressError = require('./utils/ExpressError');
const mongoSanitize = require('express-mongo-sanitize');

const commentRoutes = require("./routes/comments");
const tripRoutes = require("./routes/trips");
const indexRoutes = require("./routes/index");
const bookRoutes = require("./routes/books");
const tripContentRoutes = require("./routes/tripContents");
const repliesRoutes = require("./routes/replies");


// app.use(require("express-session")({
// 	secret: "My blog wins the cutest blog again.",
// 	resave: false,
// 	saveUninitialized: false 
// }));


const MongoDBStore = require("connect-mongo");
// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yolupa_blog';
// const dbUrl = 'mongodb://localhost:27017/yolupa_blog';
mongoose.connect(dbUrl, {        
	useNewUrlParser: true,									
	useUnifiedTopology: true });

// mongoose.connect("mongodb://localhost:27017/yolupa_blog", {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

// const store = new MongoDBStore({
//     url: dbUrl,
//     secret,
//     touchAfter: 24 * 60 * 60
// });

// store.on("error", function (e) {
//     console.log("SESSION STORE ERROR", e)
// })

const sessionConfig = {
	store: MongoDBStore.create({
		mongoUrl:dbUrl,
		touchAfter: 24 * 3600 // time period in seconds
	}),
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}

app.use(session(sessionConfig));


app.use(flash());
// app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",	
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/jquery-3.6.0.min.js",  
	"https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.js"
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",	
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com/",	
    "https://use.fontawesome.com/",	             
	"https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css",
	"https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css",
	"https://res.cloudinary.com/yolupa/"
];
const connectSrcUrls = [
	"https://*.tiles.mapbox.com",
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",	
	 "https://res.cloudinary.com/yolupa/"
];
const fontSrcUrls = [
	"https://use.fontawesome.com/",
	"https://fonts.gstatic.com/",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/yolupa/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
				"https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.locals.moment = require('moment');
 require("moment/min/locales.min");
// PASSPORT CONFIGURATION

app.use(passport.initialize());
app.use(passport.session());

// app.use(require("express-session")({
// 	secret: "My blog wins the cutest blog again.",
// 	resave: false,
// 	saveUninitialized: false 
// }));
// app.use(passport.initialize());
// app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user.id);
}); 

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://wdb-test1.run-us-west2.goorm.io/auth/google/callback",
	userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"	
  },
  function(accessToken, refreshToken, profile, cb) {
	//console.log(profile);
    User.findOrCreate({ googleId: profile.id, googleName: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
));

// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "https://wdb-test1.run-us-west2.goorm.io/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
// 	console.log(profile);
//     User.findOrCreate({ facebookId: profile.id, facebookName: profile.displayName }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

app.use(function(req, res, next){	   
    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        // console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
    }	
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");	
   next();
});

app.use(indexRoutes);
app.use(tripRoutes);
app.use(commentRoutes);
app.use(bookRoutes);
app.use(tripContentRoutes);
app.use(repliesRoutes);




// GOOGLE 
app.get("/auth/google", 
	passport.authenticate("google", { scope: ["profile"] }));

app.get("/auth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  });

// FACEBOOK
// app.get('/auth/facebook',
//   passport.authenticate('facebook'));

// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Ha ocurrido un error'
    res.status(statusCode).render('error', { err })
})


const port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function(){
	console.log("Blog started...")
});