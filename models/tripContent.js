var mongoose = require("mongoose");

// SCHEMA SETUP

// const ImageSchema = new mongoose.Schema({
// 	url: String,
// 	filename: String	
// })

const tripContentSchema = new mongoose.Schema({
	title: String,
	image: String,
	imageFn: String,	
	// images:  [ImageSchema],
	content: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		googleName: String,
		// facebookName: String
	},
});

module.exports = mongoose.model("TripContent", tripContentSchema);

