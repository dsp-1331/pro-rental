const Listing= require("../models/list.js");
const Review= require("../models/review.js");

module.exports.createReview= async(req,res)=>{
    let{id}= req.params;
    let listing= await Listing.findById(id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    //save both in database
    await newReview.save();
    await listing.save();
    console.log("New review saved:", newReview);
    req.flash("success", "New Review is created!!");
    // res.send("new review saved");
    res.redirect(`/listings/${id}`);   
};

module.exports.destroyReview= async(req,res)=>{
    let{id, reviewId}= req.params;
    // Remove the review ID reference from the Listing's reviews array
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    //Delete the actual review document from the Review collection
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!!");
    res.redirect(`/listings/${id}`)
};