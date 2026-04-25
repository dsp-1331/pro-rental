const express= require("express");
const app= express();

const mongoose= require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
//rquire listingSchema and reviewSchema for server side validation
const {listingSchema, reviewSchema}= require("./schema.js");

async function main() {
    await mongoose.connect(mongo_url);
}
//public 
//set ejs
const path= require("path");
app.use(express.static(path.join(__dirname,"public")));

//method -override setup
const methodOverride= require("method-override");
app.use(methodOverride("_method"));

// setup for ejs-mate
const ejsMate= require("ejs-mate");
app.engine('ejs',ejsMate);

app.set("views",path.join(__dirname, "views"));
app.set("view engine","ejs");

//to parse the data from url
app.use(express.urlencoded({extended:true}));

//import wrapAsync
const wrapAsync= require("./utils/wrapAsync.js");

//import ExpressError
const ExpressError= require("./utils/ExpressError.js");

const Listing= require("./models/list.js");
const Review= require("./models/review.js");
main()
.then(()=>{
    console.log("Database connection successful.");
    console.log("Connected to database: ", mongoose.connection.name);
})
.catch((err)=>{console.log(err);});

app.get("/test-db", async (req, res) => {
    let all = await Listing.find({});
    res.json(all); // This will show you exactly what is inside the DB
});

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

app.listen(8080,()=>{
    console.log("Listening on port 8080");
});

app.get("/",(req,res)=>{
    res.send("I am root");
});




//Index Route
app.get("/listings",wrapAsync(async(req,res)=>{
   let alldata= await Listing.find({});
//    console.log(alldata);
   res.render("listings/index.ejs",{alldata});

}));

//Create route
app.get("/listings/new",(req,res)=>{
    console.log("Create route");
    res.render("listings/new.ejs");
});

//save create route data in database
app.post("/listings", validateFunction,wrapAsync(async(req,res,next)=>{
   
    let newListing= await Listing.create(req.body.listing); // save data in db
    console.log("request body data: ", req.body);
    console.log("Listing data: ", req.body.listing);


    console.log("Listing created:", newListing);
    res.redirect("/listings");
    
}));


//Read- Show Route
// work- Return data of specific id 
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let{id}= req.params;
    //fetch data using id
    let data= await Listing.findById(id);
    res.render("listings/show.ejs",{data});
}));


//Update
//Edit and update route
//edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let data= await Listing.findById(id);
    
    res.render("listings/edit.ejs",{data});
}));

//Update data
app.put("/listings/:id",validateFunction, wrapAsync(async(req,res)=>{
    let {id}= req.params;
      
    let updatedData=await Listing.findByIdAndUpdate(id,{ ...req.body.listing },{runValidators:true});
    console.log("new Listing updated",updatedData );
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedData=await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listings");
}));


//Review route
//post route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let{id}= req.params;
    let listing= await Listing.findById(id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    //save both in database
    await newReview.save();
    await listing.save();
    console.log("New review saved:", newReview);
    
    // res.send("new review saved");
    res.redirect(`/listings/${id}`);

    
}));

//Page not found error
app.use("/{*any}",(req,res,next)=>{
    throw new ExpressError(404, "Page not found");
});


//error handling
app.use((err, req,res, next)=>{
    let{statusCode=500, message="Something went wrong"}= err;
    // res.status(statusCode).send(message);

    res.status(statusCode).render("error.ejs",{err});
});



