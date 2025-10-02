import ExpressError from "./utility/ExpressError.js";
import {listingSchema, reviewSchema} from "./schema.js";
import Listing from "./models/listing.js";
import Review from "./models/review.js";

export const isLoggedIn = function (req, res, next){
    if(!(req.isAuthenticated())){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};

export const redirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    } 
    next();
};

export const isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "Access denied! You don’t have permission to perform this action.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

export const reviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "Access denied! You don’t have permission to perform this action.");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



 
export const listingValidate = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error)
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

export const reviewValidate = (req, res, next) => {
    
    if(req.body.review && req.body.review.rating){
        req.body.review.rating = Number(req.body.review.rating);
    }

    let {error} = reviewSchema.validate(req.body, {abortEarly: false});
    if(error){
        console.log(error)
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};