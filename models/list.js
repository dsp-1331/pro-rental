const mongoose= require("mongoose");

const Schema= mongoose.Schema;
//create schema
const listSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
   
    image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://clubmahindra.gumlet.io/blog/media/section_images/shuttersto-6d71496a31ac52b.jpg?w=376&dpr=2.6",
    }
},

    price:{
        type:Number,
        default:0
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
});


//create listing model
const Listing= mongoose.model("Listing",listSchema);
module.exports= Listing;