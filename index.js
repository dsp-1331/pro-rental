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

//require listing router
const listings= require("./routes/listing.js");
//require review router
const reviews= require("./routes/review.js");
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



app.listen(8080,()=>{
    console.log("Listening on port 8080");
});

app.get("/",(req,res)=>{
    res.send("I am root");
});



app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);


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



