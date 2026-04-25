const mongoose= require("mongoose");

const Schema= mongoose.Schema;

//create Schema for the review
const reviewSchema= new Schema({
    comment: {
        type:String,
        // required: true,
    },
    rating:{
        type: Number,
        min:1,
        max: 5
    },
    createdAt:{
        type:Date,
        default: Date.now // Pass the function dont call it 
    }
});

//create model and export

module.exports= mongoose.model("Review" ,reviewSchema);