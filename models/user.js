var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var findOrCreate = require('mongoose-findorcreate');


userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	googleId: String,
	googleName: String,
	facebookId: String,
	facebookName: String,
	isAdmin: {type: Boolean, default: false}
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
module.exports = mongoose.model("User", userSchema);