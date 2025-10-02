import mongoose from "mongoose";
import Listing from "../models/listing.js";
import data from "./data.js";



const MONGO_URL= "mongodb://127.0.0.1:27017/wanderLust";
main()
 .then(() => {
    console.log("Connected");
 })
 .catch((err) => {
    console.log(err);
 });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    let updateData = data.map((obj) => ({...obj, owner: "68d3e1b82b7a103eaadb95fc"})); 
    await Listing.insertMany(updateData);
    console.log("Data was intilized");
};

initDB();


