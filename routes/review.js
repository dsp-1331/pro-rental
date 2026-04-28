const express= require('express');
const router= express.Router({mergeParams:true});
//import wrapAsync
const wrapAsync= require("../utils/wrapAsync.js");
//rquire listingSchema and reviewSchema for server side validation
const {listingSchema, reviewSchema}= require("../schema.js");
//import ExpressError
const ExpressError= require("../utils/ExpressError.js");
const Listing= require("../models/list.js");
const Review= require("../models/review.js");


//this function is for the server side review validation
const validateReview= (req,res,next)=>{
    let result= reviewSchema.validate(req.body);
    console.log("Result: ", result);
    console.log("Output: ", req.body);
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg= error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
    
};

//Review route
//Review post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let{id}= req.params;
    let listing= await Listing.findById(id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    //save both in database
    await newReview.save();
    await listing.save();
    console.log("New review saved:", newReview);
    req.flash("success", "New Review is created!!");
    // res.send("new review saved");
    res.redirect(`/listings/${id}`);

    
}));

//Review Delete Route
router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let{id, reviewId}= req.params;
    // Remove the review ID reference from the Listing's reviews array
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    //Delete the actual review document from the Review collection
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!!");
    res.redirect(`/listings/${id}`)
}));

module.exports= router;