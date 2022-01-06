var mongoose = require("mongoose");
const Comment = require("./comment");
const Reply = require("./reply");
const Schema = mongoose.Schema;

var bookSchema = new Schema({
	title: String,
	subtitle: String,
	image: String,
	plot: String,
	critique: String,
	recommendation: String,
	rating: {
        // Setting the field type
        type: Number,
        // Making the star rating required
        // required: "Please provide a rating (1-5 stars).",
        // Defining min and max values
       minimum: 1,
       maximum: 5	   	
        // Adding validation to see if the entry is an integer
        // validate: {
            // validator accepts a function definition which it uses for validation
        //     validator: Number.isInteger|| number.isDecimal,            
        //     message: "{VALUE} no es un número."
        // }
    },	
	createdAt: { type: Date, default: Date.now },	 
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
		googleName: String,
		facebookName: String
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
	replies: [
	  {
	     type: mongoose.Schema.Types.ObjectId,
	     ref: "Reply"
	  }
	]	
	
});

bookSchema.post("findOneAndDelete", async function (doc) {
	//console.log(doc);
				if(doc){				
				  await Comment.deleteMany({
				   _id: {
				        $in: doc.comments
				        }					 
				   }),					 
				   await Reply.deleteMany({
				   _id: {
				        $in: doc.replies
				        }					 
				   })
				}
})








module.exports = mongoose.model("Book", bookSchema);