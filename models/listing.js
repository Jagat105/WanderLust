import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Review from "./review.js"

const listingSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        minlength : [3, "Title must be atleast 3 characters long"],
        maxlength: [100, "Title cannot be exceed 100 characters"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "title cannot be exceed 500, characters"]
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
            set: (v) => v === "" 
                ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200" 
                : v
        }},
    price: {
        type: Number,
        required: true,
        default: 499,
        min: [0, "Price cannot be negative"]
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    geometry: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number], 
    }
},
 category: {
        type: String,
        enum: ["trending","rooms","cities","mountains","arctic","luxury","beach","lakefront","pools","camping","farm"],
        default: "trending" 
    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});



listingSchema.index({ geometry: "2dsphere" });

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;