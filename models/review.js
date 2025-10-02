import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        trim: true,
        minlength: [5, "Comment should be at least 5 characters long"],
        maxlength: [300, "Comment cannot exceed 500 characters"]
    },
    rating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating cannot be more than 5"],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const  Review = mongoose.model("Review", reviewSchema);

export default Review;