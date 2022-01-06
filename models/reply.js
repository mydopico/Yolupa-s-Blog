var mongoose = require("mongoose");

// SCHEMA SETUP

var replySchema = new mongoose.Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },	
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		googleName: String,
		// facebookName: String
	}
	  // likes: [
	  // {
	  // type: mongoose.Schema.Types.ObjectId,
	  // ref: "User"
	  // }
	  // ]
});

module.exports = mongoose.model("Reply", replySchema);