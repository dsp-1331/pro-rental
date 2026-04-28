const Listing= require("./models/list");
const Review= require("./models/review.js");
//import ExpressError
const ExpressError= require("./utils/ExpressError.js");
//rquire listingSchema and reviewSchema for server side validation
const {listingSchema, reviewSchema}= require("./schema.js");

module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        //save redirect url
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
   }
   next();
};//

// Post-Login Redirection is on the right track
module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
         // Use req.user._id (provided by Passport) to check ownership
        if( !listing.owner._id.equals(req.user._id)){
            req.flash("error", "You're not the owner of this listing");
            return res.redirect(`/listings/${id}`);
        }
        next();
};

module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id, reviewId}= req.params;
    let review = await Review.findById(reviewId);
         // Use req.user._id (provided by Passport) to check ownership
        if( !review.author.equals(res.locals.currUser._id)){
            req.flash("error", "You're not the author of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
};

//  this function is used for the validate data for server side validation 
module.exports.validateListing = (req,res,next)=>{
    // let result=listingSchema.validate(req.body);
    // console.log("Result:" ,result);
    // console.log("Incoming body: ", req.body.listing);
   let{ value,error}= listingSchema.validate(req.body);
   if(error){
    let errMsg= error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
   }
   else{
    // req.body= value;
    // console.log("Request body (Value) from validation function", value);    
    next();
   }
   
};


//this function is for the server side review validation
module.exports.validateReview= (req,res,next)=>{
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