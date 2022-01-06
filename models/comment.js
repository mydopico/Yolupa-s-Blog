var mongoose = require("mongoose");

// SCHEMA SETUP

var commentSchema = new mongoose.Schema({
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
	},
	  likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
	replies: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Reply"
      }
		]
});

module.exports = mongoose.model("Comment", commentSchema);