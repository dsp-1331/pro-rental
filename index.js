const express= require("express");
const app= express();

const mongoose= require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

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


const Listing= require("./models/list.js");
main()
.then(()=>{console.log("Database connection successful.");})
.catch((err)=>{console.log(err);});

app.listen(8080,()=>{
    console.log("Listening on port 8080");
});

app.get("/",(req,res)=>{
    res.send("I am root");
});

// app.get("/test",async(req,res)=>{
//     let list2= new Listening({
//         title:"Goa",
//         desc:"This is Goa property" ,
        
//         price: 20000,
//         loc: "Goa, India",
//         country: "India",
//     });
//     //  list1.save()
//     //  .then((res)=>{
//     //     console.log(res);
//     //  })
//     //  .catch((err)=>{
//     //     console.log(err);
//     //  })

//     await list2.save();
//     console.log("data saved");
//     res.send("data saved");
// });


//Index Route
app.get("/listings",async(req,res)=>{
   let alldata= await Listing.find();
//    console.log(alldata);
   res.render("listings/index.ejs",{alldata});

});

//Create route
app.get("/listings/new",(req,res)=>{
    console.log("Create route");
    res.render("listings/new.ejs");
});

//save create route data in database
app.post("/listings",async(req,res)=>{
    let data=req.body.listing;
    console.log(req.body.listing);
    // Handle image field if it's a string
    if (data.image && typeof data.image === "string") {
        data.image = {
        url: data.image,
        filename: "listingimage",
        };
    }
     // Convert price to number
    data.price = data.price ? Number(data.price) : 0;
     try {
    await Listing.create(data); // ✅ correct Mongoose method
    console.log("Listing created:", data);
    res.redirect("/listings");
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(500).send("Error creating listing");
    }

    // await Listing.insertOne(data);
    // res.redirect("/listings")
});


//Read- Show Route
// work- Return data of specific id 
app.get("/listings/:id", async(req,res)=>{
    let{id}= req.params;
    //fetch data using id
    let data= await Listing.findById(id);
    res.render("listings/show.ejs",{data});
});


//Update
//Edit and update route
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    let data= await Listing.findById(id);
    console.log(req.params);
    console.log(data);
    
    res.render("listings/edit.ejs",{data});
});

//Update data
app.put("/listings/:id",async(req,res)=>{
    let data=req.body;
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,data,{runValidators:true});
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    let deletedData=await Listing.findByIdAndDelete(id);
    console.log(deletedData);
    res.redirect("/listings");
});



