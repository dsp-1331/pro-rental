const express= require('express');
const router= express.Router();
//import wrapAsync
const wrapAsync= require("../utils/wrapAsync.js");
//rquire listingSchema and reviewSchema for server side validation
const {listingSchema, reviewSchema}= require("../schema.js");
//import ExpressError
const ExpressError= require("../utils/ExpressError.js");
const Listing= require("../models/list.js");

//this function is used for the validate data for server side validation 
const validateFunction= (req,res,next)=>{
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


//Index Route
router.get("/",wrapAsync(async(req,res)=>{
   let alldata= await Listing.find({});
//    console.log(alldata);
   res.render("listings/index.ejs",{alldata});

}));

//Create route
router.get("/new",(req,res)=>{
    console.log("Create route");
    res.render("listings/new.ejs");
});

//save create route data in database
router.post("/", validateFunction,wrapAsync(async(req,res,next)=>{
   
    let newListing= await Listing.create(req.body.listing); // save data in db
    console.log("request body data: ", req.body);
    console.log("Listing data: ", req.body.listing);


    console.log("Listing created:", newListing);
    res.redirect("/listings");
    
}));


//Read- Show Route
// work- Return data of specific id 
router.get("/:id", wrapAsync(async(req,res)=>{
    let{id}= req.params;
    //fetch data using id
    let data= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{data});
}));


//Update
//Edit and update route
//edit route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let data= await Listing.findById(id);
    
    res.render("listings/edit.ejs",{data});
}));

//Update data
router.put("/:id",validateFunction, wrapAsync(async(req,res)=>{
    let {id}= req.params;
      
    let updatedData=await Listing.findByIdAndUpdate(id,{ ...req.body.listing },{runValidators:true});
    console.log("new Listing updated",updatedData );
    res.redirect(`/listings/${id}`);
}));

//listing delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedData=await Listing.findByIdAndDelete(id);
    console.log("Deleted data from router:" ,deletedData);
    res.redirect("/listings");
}));


module.exports= router;