
const Listing= require("../models/list.js");

module.exports.index= async(req,res)=>{
   let alldata= await Listing.find({});
//    console.log(alldata);
   res.render("listings/index.ejs",{alldata});

};

module.exports.renderNewForm= (req,res)=>{
      
    res.render("listings/new.ejs");
};

module.exports.createListing= async(req,res,next)=>{
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
    
};


module.exports.showListing= async(req,res)=>{
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
};


module.exports.renderEditForm=async(req,res)=>{
    let {id}= req.params;
    let data= await Listing.findById(id);
    if(!data){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    
    res.render("listings/edit.ejs",{data});
};

module.exports.updateListing= async(req,res)=>{
    let {id}= req.params;
    let updatedData=await Listing.findByIdAndUpdate(id,{ ...req.body.listing },{runValidators:true});
    console.log("new Listing updated",updatedData );
    req.flash("success", "Listing is updated!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing= async(req,res)=>{
    let {id}= req.params;
    let deletedData=await Listing.findByIdAndDelete(id);
    console.log("Deleted data from router:" ,deletedData);
    //flash msg when listing deleted
    req.flash("success", "Listing is deleted!!");
    res.redirect("/listings");
};