const mongoose= require("mongoose");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongo_url);
}

const Listening= require("../models/list.js");
main()
.then(()=>{console.log("Database connection successful.");})
.catch((err)=>{console.log(err);});

const initData= require("./init.js");

const initDB=async ()=>{
    await Listening.deleteMany({});
    await Listening.insertMany(initData.data);
    console.log("Data has been added in database");
}

initDB();