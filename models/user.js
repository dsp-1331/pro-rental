const { string, required } = require("joi");
const mongoose= require("mongoose");

const Schema= mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose").default;

const userSchema= new Schema({
     // email is often added here since username is handled by the plugin
    email:{
        type:String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);