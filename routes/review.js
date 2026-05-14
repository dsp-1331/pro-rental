const express= require('express');
const router= express.Router({mergeParams:true});
//import wrapAsync
const wrapAsync= require("../utils/wrapAsync.js");
//rquire listingSchema and reviewSchema for server side validation
const { reviewSchema}= require("../schema.js");
//import ExpressError
const ExpressError= require("../utils/ExpressError.js");
const Listing= require("../models/list.js");
const Review= require("../models/review.js");
const reviewController= require("../controllers/review.js");

const { validateReview, isLoggedIn, isReviewAuthor }= require("../middleware.js");

//Review route
//Review post route
router.post("/",isLoggedIn ,validateReview,wrapAsync(reviewController.createReview));

//Review Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,wrapAsync(reviewController.destroyReview));

module.exports= router;