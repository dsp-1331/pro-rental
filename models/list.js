const mongoose= require("mongoose");
//require Review model
const Review= require("./review");
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
            default: "https://t4.ftcdn.net/jpg/01/28/13/43/360_F_128134342_LrI1CSKCncfyBRPlTayXcGCFm0ys0WOB.jpg",
            // 1. Setter: If user sends an empty string, it forces Mongoose to use the default
            set: (v) => v === "" 
                ? "https://t4.ftcdn.net/jpg/01/28/13/43/360_F_128134342_LrI1CSKCncfyBRPlTayXcGCFm0ys0WOB.jpg" 
                : v,
            // // 2. Validator: Ensures the string looks like an image link
            // match: [
            //     /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i,
            //     "Please enter a valid image URL (jpg, png, etc.)"
            // ]
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

    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

//delete listing and their associated reviews from the database 
//using mongoose middleware

listSchema.post('findOneAndDelete', async(listing)=>{
console.log("Post mongoose middlware is called");
if(listing){
   await Review.deleteMany({_id: {$in: listing.reviews}});
  
}

});


//create listing model
const Listing= mongoose.model("Listing",listSchema);
module.exports= Listing;