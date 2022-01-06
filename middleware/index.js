const { tripSchema, commentSchema, bookSchema, replySchema, tripContentSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Trip = require("../models/trip");
const Book = require("../models/book");
const Comment = require("../models/comment");
const Reply = require("../models/reply");
const TripContent = require("../models/tripContent");

// MIDDLEWARE



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl
        req.flash('error', 'Por favor, inicia sesión o regístrate');
        return res.redirect('/login');
    }
    next();
}

// VALIDATION
module.exports.validateTrip = (req, res, next) => {	
    const { error } = tripSchema.validate(req.body);	
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateBook = (req, res, next) => {	
    const { error } = bookSchema.validate(req.body);	
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {	
    const { error } = commentSchema.validate(req.body);	
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReply = (req, res, next) => {	
    const { error } = replySchema.validate(req.body);	
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateTripContent = (req, res, next) => {	
    const { error } = tripContentSchema.validate(req.body);	
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// CHECK OWNERSHIP

module.exports.isTripAuthor = async (req, res, next) => {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if ( !(trip.author.equals(req.user._id) || req.user.isAdmin) ) {
        req.flash('error', 'No tienes permiso');
        return res.redirect(`/trips/${id}`);
    }
    next();
}

module.exports.isBookAuthor = async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (! (book.author.equals(req.user._id) || req.user.isAdmin) ) {
        req.flash('error', 'No tienes permiso');
        return res.redirect(`/books/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, comment_id } = req.params;
    const comment = await Comment.findById(comment_id);
    if (! (comment.author.equals(req.user._id) || req.user.isAdmin) )  {
        req.flash('error', 'No tienes permiso');
        return res.redirect("back");
    }
    next();
}

module.exports.isTripContentAuthor = async (req, res, next) => {
    const { id, tripContent_id } = req.params;
    const tripContent = await TripContent.findById(tripContent_id);
    if (! (tripContent.author.equals(req.user._id) || req.user.isAdmin) )  {
        req.flash('error', 'No tienes permiso');
        return res.redirect("back");
    }
    next();
}


module.exports.isReplyAuthor = async (req, res, next) => {
    const { id, reply_id } = req.params;
    const reply = await Reply.findById(reply_id);
    if (! (reply.author.equals(req.user._id) || req.user.isAdmin) ) {
        req.flash('error', 'No tienes permiso');
        return res.redirect("back");
    }
    next();
}




