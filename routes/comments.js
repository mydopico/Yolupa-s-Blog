const express = require("express");
const router = express.Router();
const { commentSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Trip = require("../models/trip");
const Comment = require("../models/comment");
const Reply = require("../models/reply");
const User = require("../models/user");
const Book = require("../models/book");
const { isLoggedIn, validateComment, isCommentAuthor } = require("../middleware");


// ROUTES

// NEW COMMENT ROUTE
// trips

router.get("/trips/:id/comments/new", isLoggedIn, catchAsync(async(req, res) => {	
	const trip = await Trip.findById(req.params.id);
	res.render("comments/new", { trip });	
}));

// books 
router.get("/books/:id/comments/new", isLoggedIn, catchAsync(async(req, res) => {
	const book = await Book.findById(req.params.id);
	res.render("comments/newB", { book });	
}));


// CREATE COMMENT ROUTE
// trips 

router.post("/trips/:id/comments", isLoggedIn, validateComment, catchAsync(async(req, res) => {
	const trip = await Trip.findById(req.params.id);
	const comment = new Comment(req.body.comment);
	comment.author.id = req.user._id;
	comment.author.username = req.user.username;
	comment.author.googleName = req.user.googleName;
	trip.comments.push(comment);
	await comment.save();
	await trip.save();
	req.flash("success", "Comentario añadido");
 	res.redirect(`/trips/${trip._id}`)	
}));

// books
router.post("/books/:id/comments", isLoggedIn, validateComment, catchAsync(async(req, res) => {
	const book = await Book.findById(req.params.id);
	const comment = new Comment(req.body.comment);
	comment.author.id = req.user._id;
	comment.author.username = req.user.username;
	comment.author.googleName = req.user.googleName;
	book.comments.push(comment);
	await comment.save();
	await book.save();
	req.flash("success", "Comentario añadido");
 	res.redirect(`/books/${book._id}`);	
}));

// EDIT COMMENT ROUTE  
// trips 
router.get("/trips/:id/comments/:comment_id/edit", isLoggedIn, isCommentAuthor, catchAsync(async(req, res) => {
	const comment = await Comment.findById(req.params.comment_id);
	res.render("comments/edit", {trip_id: req.params.id, comment});	
}));

// books 
router.get("/books/:id/comments/:comment_id/edit", isLoggedIn, isCommentAuthor, catchAsync(async(req, res) => {
	const comment = await Comment.findById(req.params.comment_id);
	res.render("comments/editB", {book_id: req.params.id, comment});	
}));

// UPDATE COMMENT ROUTE 
// trips             
router.put("/trips/:id/comments/:comment_id", isLoggedIn, isCommentAuthor, validateComment, catchAsync(async(req, res) => {
	const comment = await Comment.findByIdAndUpdate(req.params.comment_id, {...req.body.comment});
	req.flash("success", "Comentario actualizado");
	res.redirect("/trips/" + req.params.id);	
}));

// books             
router.put("/books/:id/comments/:comment_id", isLoggedIn, isCommentAuthor, validateComment, catchAsync(async(req, res) => {
	const comment = await Comment.findByIdAndUpdate(req.params.comment_id, {...req.body.comment});
	req.flash("success", "Comentario actualizado");
	res.redirect("/books/" + req.params.id);	
}));


// DESTROY COMMENT ROUTE 
// trips        /walks/:id/comments/:
router.delete("/trips/:id/comments/:comment_id", isLoggedIn, isCommentAuthor, catchAsync(async(req, res) => {
	const {id, comment_id} = req.params;
	await Trip.findByIdAndUpdate(id, {$pull: {comments: comment_id}});
	await Comment.findByIdAndDelete(comment_id);
	req.flash("success", "Comentario borrado");
 	res.redirect(`/trips/${id}`);
	// Comment.findById(req.params.comment_id, function(err, comment){
	// 	if(err) {
	// 		res.redirect("back");
	// 	} else {
	// 		 // deletes all comments associated with the campground
	// Reply.remove({"_id": {$in: comment.replies}}, function (err) {
	// if (err) {
	// console.log(err);
	// return res.redirect("/trips");
	// }              
	// //  delete the comment
	// comment.remove();
	// req.flash("success", "Comentario borrado");
	// res.redirect("/trips/" + req.params.id);
	// });
			
	// 	}
	// });
}));

// books 
router.delete("/books/:id/comments/:comment_id", isLoggedIn, isCommentAuthor, catchAsync(async(req, res) => {
	const {id, comment_id} = req.params;
	await Book.findByIdAndUpdate(id, {$pull: {comments: comment_id}});
	await Comment.findByIdAndDelete(comment_id);
	req.flash("success", "Comentario borrado");
 	res.redirect(`/books/${id}`);	
}));

// LIKES
// trips 
router.post("/trips/:id/comments/:comment_id/likes", isLoggedIn, catchAsync(async(req, res) => {
	
            const comment = await Comment.findById(req.params.comment_id);            				
		    const foundLikes = comment.likes.some(function (item) {						
			    return item.equals(req.user._id);
			 });					
			 if (foundLikes) {
                 // user already add like to likes, removing 
                 comment.likes.pull(req.user._id);
             } else {
                 // adding like to comment
                 comment.likes.push(req.user);
             }						
			 comment.save();
             res.redirect("back"); 	 
}));

// books 
router.post("/books/:id/comments/:comment_id/likes", isLoggedIn, catchAsync(async(req, res) => {
	
            const comment = await Comment.findById(req.params.comment_id);            
	        const foundLikes = comment.likes.some(function (item) {						
					 return item.equals(req.user._id);
					 });
	
			if (foundLikes) {
            // user already add like to likes, removing 
                comment.likes.pull(req.user._id);
             } else {
            // adding like to comment
                comment.likes.push(req.user);
             }					
			 comment.save();
             res.redirect("back");                   
}));







module.exports = router;