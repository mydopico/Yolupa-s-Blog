const express = require("express");
const router = express.Router();
const { replySchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Trip = require("../models/trip");
const Comment = require("../models/comment");
const Reply = require("../models/reply");
const User = require("../models/user");
const Book = require("../models/book");
const { isLoggedIn, validateReply, isReplyAuthor } = require("../middleware");

// ROUTES

// CREATE REPLY ROUTE
// trips 
router.post("/trips/:id/comments/:comment_id/replies", isLoggedIn, validateReply, catchAsync(async(req, res) => {		
	const comment = await Comment.findById(req.params.comment_id);	
	const reply = new Reply(req.body.reply);
	reply.author.id = req.user._id;
	reply.author.username = req.user.username;
	reply.author.googleName = req.user.googleName;
	comment.replies.push(reply);	
	const trip = await Trip.findByIdAndUpdate(req.params.id, {$push: {replies: reply._id}});	 
	await reply.save();
	await comment.save();
	await trip.save();	
	req.flash("success", "Respuesta añadida");
 	res.redirect(`/trips/${trip._id}`);	
}));


// books
router.post("/books/:id/comments/:comment_id/replies", isLoggedIn, validateReply, catchAsync(async(req, res) => {	
	const comment = await Comment.findById(req.params.comment_id);
	const reply = new Reply(req.body.reply);
	reply.author.id = req.user._id;
	reply.author.username = req.user.username;
	reply.author.googleName = req.user.googleName;
	comment.replies.push(reply);
	const book = await Book.findByIdAndUpdate(req.params.id, {$push: {replies: reply._id}});
	await reply.save();
	await comment.save();
	req.flash("success", "Respuesta añadida");
 	res.redirect(`/books/${book._id}`);	
}));


// UPDATE reply ROUTE 
// trips

router.put("/trips/:id/comments/:comment_id/replies/:reply_id", isLoggedIn, isReplyAuthor, validateReply, catchAsync(async(req, res) => {			
	const reply = await Reply.findByIdAndUpdate(req.params.reply_id, {...req.body.reply});	
	req.flash("success", "Respuesta actualizada");
	res.redirect("/trips/" + req.params.id);	
	 
}));


// books
router.put("/books/:id/comments/:comment_id/replies/:reply_id", isLoggedIn, isReplyAuthor, validateReply, catchAsync(async(req, res) => {			
	const reply = await Reply.findByIdAndUpdate(req.params.reply_id, {...req.body.reply});
	req.flash("success", "Respuesta actualizada");
	res.redirect("/books/" + req.params.id);	
	 
}));



// DESTROY COMMENT ROUTE 
// trips
router.delete("/trips/:id/comments/:comment_id/replies/:reply_id", isLoggedIn, isReplyAuthor, catchAsync(async(req, res) => {
	const {id, comment_id, reply_id} = req.params;
	await Trip.findByIdAndUpdate(id, {$pull: {replies: reply_id}});
	await Comment.findByIdAndUpdate(comment_id, {$pull: {replies: reply_id}});
	await Reply.findByIdAndDelete(reply_id);
	req.flash("success", "Respuesta borrada");
 	res.redirect(`/trips/${id}`);
	
}));

// books 
router.delete("/books/:id/comments/:comment_id/replies/:reply_id", isLoggedIn, isReplyAuthor, catchAsync(async(req, res) => {
	const {id, comment_id, reply_id} = req.params;
	await Book.findByIdAndUpdate(id, {$pull: {replies: reply_id}});
	await Comment.findByIdAndUpdate(comment_id, {$pull: {replies: reply_id}});
	await Reply.findByIdAndDelete(reply_id);
	req.flash("success", "Respuesta borrada");
 	res.redirect(`/books/${id}`);
	
}));


module.exports = router;