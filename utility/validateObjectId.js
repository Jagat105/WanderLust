
import mongoose from "mongoose";
import ExpressError from "./ExpressError.js"; 


function validateObjectId(req, res, next) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ExpressError(400, "Invalid ID format"));
    }
    next();
}

export default validateObjectId;
