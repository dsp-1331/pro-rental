const express= require('express');
const router= express.Router();
//import wrapAsync
const wrapAsync= require("../utils/wrapAsync.js");


const Listing= require("../models/list.js");
const {isLoggedIn, isOwner, validateListing }= require("../middleware.js");




//Index Route
router.get("/",wrapAsync(async(req,res)=>{
   let alldata= await Listing.find({});
//    console.log(alldata);
   res.render("listings/index.ejs",{alldata});

}));

//Create route
router.get("/new", isLoggedIn, (req,res)=>{
    
   //checking is user is logged in before creating listing
   
    res.render("listings/new.ejs");
});

//save create route data in database
router.post("/",isLoggedIn,  validateListing ,wrapAsync(async(req,res,next)=>{
     // 1. Create the instance but DON'T use Listing.create() yet
    let newListing = new Listing(req.body.listing);
    // console.log( "Req user: ",req.user);
     // 2. Assign the owner
    newListing.owner = req.user._id;
     // 3. Save it to the database
    await newListing.save(); 
  
    newListing.owner= req.user._id;
    req.flash("success", "Listing cretaed successfully!!");
   
    console.log("Listing created:", newListing);
    res.redirect("/listings");
    
}));


//Read- Show Route
// work- Return data of specific id 
router.get("/:id", wrapAsync(async(req,res)=>{
    let{id}= req.params;
    //fetch data using id
    let data= await Listing.findById(id)
    .populate({
        path:"reviews",populate:{
            path: "author"
        },
    }).populate("owner");
    //when listing doesnt exist send flash msg

    if(!data){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log("Display show route:", data);
    res.render("listings/show.ejs",{data});
}));


//Update
//Edit and update route
//edit route
//checking user is logged in for make changes 
router.get("/:id/edit", isLoggedIn,isOwner ,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let data= await Listing.findById(id);
    if(!data){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs",{data});
}));

//Update data
router.put("/:id", isLoggedIn,isOwner, validateListing , wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let updatedData=await Listing.findByIdAndUpdate(id,{ ...req.body.listing },{runValidators:true});
    console.log("new Listing updated",updatedData );
    req.flash("success", "Listing is updated!!");
    res.redirect(`/listings/${id}`);
}));

//listing delete route
router.delete("/:id", isLoggedIn,isOwner ,wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedData=await Listing.findByIdAndDelete(id);
    console.log("Deleted data from router:" ,deletedData);
    //flash msg when listing deleted
    req.flash("success", "Listing is deleted!!");
    res.redirect("/listings");
}));


module.exports= router;