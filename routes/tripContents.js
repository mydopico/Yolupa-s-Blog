const express = require("express");
const router = express.Router({mergeParams: true});
const { tripContentSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Trip = require("../models/trip");
const User = require("../models/user");
const TripContent = require("../models/tripContent");
const middleware = require("../middleware");
const { cloudinary } = require("../cloudinary");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { isLoggedIn, validateTripContent, isTripContentAuthor } = require("../middleware");


// ROUTES



// NEW TRIPCONTENT ROUTE
// trips
router.get("/trips/:id/tripContents/new", isLoggedIn, catchAsync(async(req, res) => {
	const trip = await Trip.findById(req.params.id);
	res.render("tripContents/new", { trip });		
}));

// CREATE TRIPCONTENT ROUTE
// trips 


/// new post route
	
router.post("/trips/:id/tripContents", isLoggedIn,  upload.single('image'), validateTripContent, catchAsync(async(req, res) => {
	//console.log(req.body);
	const trip = await Trip.findById(req.params.id).populate("tripContents");
	const tripContent = new TripContent(req.body.tripContent);		
	tripContent.image = req.file.path;		
	tripContent.imageFn = req.file.filename;		
	tripContent.author.id = req.user._id;
	tripContent.author.username = req.user.username;
	tripContent.author.googleName = req.user.googleName;
	trip.tripContents.push(tripContent);	
	 await tripContent.save();
	 await trip.save();
	// console.log(trip);
	 req.flash("success", "Contenido añadido");
	 res.redirect(`/trips/${trip._id}`);
}));




// EDIT tripContents ROUTE  
// tripContents
   router.get("/trips/:id/tripContents/:tripContent_id/edit", isLoggedIn, isTripContentAuthor, catchAsync(async(req, res) => {
	   const tripContent = await TripContent.findById(req.params.tripContent_id);
	   res.render("tripContents/edit", {trip_id: req.params.id, tripContent});	
}));


// UPDATE TRIPCONTENT ROUTE 
            
router.put("/trips/:id/tripContents/:tripContent_id", isLoggedIn, isTripContentAuthor, upload.single('image'), validateTripContent, catchAsync(async(req, res) => {
	 //     console.log(req.body);
	 const trip = await Trip.findById(req.params.id).populate("tripContents");
     const tripContent = await TripContent.findByIdAndUpdate(req.params.tripContent_id, { ...req.body.tripContent });
	 if(req.file){
	    tripContent.image = req.file.path;		
	    tripContent.imageFn = req.file.filename;
	 }
	 await tripContent.save();
     req.flash('success', 'Contenido actualizado');
     res.redirect(`/trips/${trip._id}`);
}));



// DESTROY COMMENT ROUTE 

router.delete("/trips/:id/tripContents/:tripContent_id", isLoggedIn, isTripContentAuthor, catchAsync(async(req, res) => {
	const {id, tripContent_id} = req.params;
	await Trip.findByIdAndUpdate(id, { $pull: { tripContents: tripContent_id } });
	await TripContent.findByIdAndDelete(req.params.tripContent_id);
	req.flash("success", "Contenido borrado");
	res.redirect("/trips/" + req.params.id);	
}));




module.exports = router;