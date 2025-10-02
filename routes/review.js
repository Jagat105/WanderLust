import express from "express";
import wrapAsync from "../utility/wrapAsync.js";
import flash from "connect-flash";
import { reviewValidate, isLoggedIn, reviewAuthor } from "../middleware.js";
import * as reviewController from "../controller/reviews.js";

const router = express.Router({ mergeParams: true });
router.use(flash());

// REVIEWS POST ROUTE
router.post(
    "/",
    isLoggedIn,
    reviewValidate,
    wrapAsync(reviewController.createReview)
);

// REVIEW DELETE ROUTE
router.delete(
    "/:reviewId",
    isLoggedIn,
    reviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

export default router;
