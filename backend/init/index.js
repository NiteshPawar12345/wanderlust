const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderlustDB";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
   console.log("Connected to DB"); 
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68a46a295f31bda27f0edfbf"}));
    await Listing.insertMany(initData.data)
    console.log("data was initialize");
}
initDB();