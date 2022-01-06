const express = require("express");
const router = express.Router();
const { bookSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Book = require("../models/book");
const Comment = require("../models/comment");
const Reply = require("../models/reply");
const { isLoggedIn, validateBook, isBookAuthor } = require("../middleware");

// ROUTES

router.get("/books",  catchAsync(async (req, res) => {
	const book = await Book.find({}).sort({'createdAt':-1});
	res.render("books/index", { book });	
}));

router.post('/books', isLoggedIn, validateBook, catchAsync(async (req, res) => {	
    const book = new Book(req.body.book);
	book.author.id = req.user._id;
	book.author.username = req.user.username;
	book.author.googleName = req.user.googleName;	
    await book.save();	
    res.redirect(`/books/${book._id}`)
}));



router.get("/books/new", isLoggedIn, (req, res) => {
	res.render("books/new");
});


// SHOW
router.get("/books/:id", catchAsync(async (req, res) => {
	const book = await Book.findById(req.params.id).populate({
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
	res.render("books/show", {book});	
}));


// EDIT
router.get("/books/:id/edit", isLoggedIn, isBookAuthor, catchAsync(async (req, res) =>{
	const book = await Book.findById(req.params.id)
	res.render("books/edit", {book});	
}));


// UDDATE
router.put("/books/:id", isLoggedIn, validateBook, isBookAuthor, catchAsync(async (req, res) => {	
	const book = await Book.findByIdAndUpdate(req.params.id, {...req.body.book});
	res.redirect(`/books/${book._id}`);	
}));


router.delete("/books/:id", isLoggedIn, isBookAuthor,catchAsync(async (req, res)=> {
	const {id} = req.params;
	await Book.findByIdAndDelete(id);
	res.redirect("/books");	
}));


module.exports = router;


