var mongoose = require("mongoose");
const Comment = require("./comment");
const TripContent = require("./tripContent");
const Reply = require("./reply");
const Schema = mongoose.Schema;
 
var tripSchema = new mongoose.Schema({
	title: String,
	subtitle: String,
	image: String,
	thanks: String,
	content: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
	location: String,
	continent: String,
	code: String,
	hdi: Number,
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
	],
	tripContents: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "TripContent"
      }
   ]	
});



tripSchema.post("findOneAndDelete", async function (doc) {
	
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
				   }),					  	    
				   await TripContent.deleteMany({
				   _id: {
				        $in: doc.tripContents
				        }
				   })
				}
})



module.exports = mongoose.model("Trip", tripSchema);