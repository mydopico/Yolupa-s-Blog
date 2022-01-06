const express = require("express");
const router = express.Router();
const { tripSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Trip = require("../models/trip");
const Comment = require("../models/comment");
const TripContent = require("../models/tripContent");
const Reply = require("../models/reply");
const { isLoggedIn, validateTrip, isTripAuthor } = require("../middleware");
const countries = require('../public/javascripts/countries');


const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});

// ROUTES



router.get("/trips", catchAsync(async (req, res) => {
	const trips = await Trip.find({}).sort({'createdAt': -1});	
	res.render("trips/index", { trips });	
}));
//console.log(countries);

router.post("/trips", isLoggedIn, validateTrip, catchAsync(async (req, res, next) =>{		
	const geoData = await geocoder.forwardGeocode({
		query: req.body.trip.location,				
		limit: 1
	}).send()	
	// const nameCapitalized = trip.location.charAt(0).toUpperCase() + trip.location.slice(1)
	const trip = new Trip(req.body.trip);
	console.log(trip);
	trip.geometry = geoData.body.features[0].geometry;
	// trip.location.charAt(0).toUpperCase() + trip.location.slice(1);
	//console.log(trip.geometry);
	trip.author.id = req.user._id;
	trip.author.username = req.user.username;
	trip.author.googleName = req.user.googleName;	
	//trip.code= `${countries[trip.location.split(",")[1]].code};
	//trip.hdi= `${countries[trip.title].hdi};
	for (let i = 0; i < countries.length; i++) {
        // console.log(countries[i].country); 
        // console.log(trip.location.split(", ")[1]); 
		
		if( trip.location.split(", ")[1] == countries[i].country  ){
		   console.log(countries[i].country, countries[i].code, countries[i].hdi);	
		   trip.code = countries[i].code;
		   trip.hdi = countries[i].hdi;
		   console.log(trip.code, trip.hdi);	
	   }	
     }	
	
	await trip.save();
	console.log(trip.code);
	console.log(trip);
	res.redirect(`/trips/${trip._id}`)  	
}));

router.get("/trips/new", isLoggedIn, (req, res) => {
	res.render("trips/new");
});


// SHOW 
router.get("/trips/:id", catchAsync(async (req, res) => {
	//const trips = await Trip.find({});
	const trip = await Trip.findById(req.params.id).populate("tripContents").populate({
		 path: 'comments',
          populate: [{
            path: 'replies',
            model: 'Reply',
		   //populate: [{ path: 'author', model: 'User' }]
            },{
               path: 'likes',
               model: 'User'
              },
            {
              path: 'replies.author',
              model: 'User'
            }] 
	})
	if(!trip){
		req.flash("error", "Ese viaje no existe");
		return res.redirect("/trips");
	}
	res.render("trips/show", { trip })
	//console.log(trip);
}));

// EDIT

router.get("/trips/:id/edit", isLoggedIn, isTripAuthor, catchAsync(async (req, res) =>{
	const trip = await Trip.findById(req.params.id);	
	res.render("trips/edit", {trip});
}));


// UPDATE

router.put("/trips/:id",isLoggedIn, validateTrip, isTripAuthor, catchAsync(async(req, res) => {
	const trip = await Trip.findByIdAndUpdate(req.params.id, {...req.body.trip});
	res.redirect(`/trips/${trip._id}`);	
}));

// DESTROY

router.delete("/trips/:id",isLoggedIn, isTripAuthor, catchAsync(async(req, res) => {
	const { id } = req.params; 
	await Comment.updateMany({}, {$pull: {replies: this._id}});
	await Trip.findByIdAndDelete(id);
	res.redirect("/trips");
// 	Trip.findById(req.params.id, function(err, trip){
// 		if(err){
// 			res.redirect("/trips");
// 		} else {									 
// // 			// deletes all tripContent associated with the trip
//             TripContent.deleteMany({"_id": {$in: trip.tripContents}}, function (err) {
//                     if (err) {
//                         console.log(err);
//                         return res.redirect("/trips");
//                     }			
			
// // 			// {$pull: {replies: req.params.reply_id}}
// // 			// deletes all comments associated with the trip
//             Comment.deleteMany({"_id": {$in: trip.comments}}, //{ $pull: {"comments":{"reply_id": req.params.reply_id} }},
//              function (err) {
//                 if (err) {
//                     console.log(err);
//                     return res.redirect("/trips");
//                 }
					            
//               //       delete the trip
//                     trip.deleteOne();
//                     req.flash("success", "Viaje borrado");
//                     res.redirect("/trips");
//                });
//            });				
				
// 						}
// 	});
	
}));


module.exports = router;