const express= require('express');
const router= express.Router();
//import wrapAsync
const wrapAsync= require("../utils/wrapAsync.js");


const Listing= require("../models/list.js");
const {isLoggedIn, isOwner, validateListing }= require("../middleware.js");

const listingController= require("../controllers/listing.js");


// Root Path: /listings
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,  validateListing ,wrapAsync(listingController.createListing));


// New Route (Must be above /:id)
//Create route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// ID Path: /listings/:id
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner, validateListing , wrapAsync(listingController.updateListing))
.delete( isLoggedIn,isOwner ,wrapAsync(listingController.destroyListing));


//edit route
//checking user is logged in for make changes 
router.get("/:id/edit", isLoggedIn,isOwner ,wrapAsync(listingController.renderEditForm));


module.exports= router;