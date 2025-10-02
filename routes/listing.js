import express from "express";
import wrapAsync from "../utility/wrapAsync.js";
import validateObjectId from "../utility/validateObjectId.js";
import { isLoggedIn, isOwner, listingValidate } from "../middleware.js";
import * as listingController from "../controller/listings.js";
import multer from "multer";
import {storage} from "../cloudConfig.js";

const router = express.Router();
const upload = multer({storage});


// INDEX & POST ROUTE
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single("listing[image]"), listingValidate, wrapAsync(listingController.postListing));

// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW, UPDATE & DELETE ROUTE
router.route("/:id")
    .get(validateObjectId, wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        validateObjectId,
        upload.single("listing[image]"),
        listingValidate,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        validateObjectId,
        wrapAsync(listingController.destroyLising)
    );

// EDIT ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing)
);

export default router;
