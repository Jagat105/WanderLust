import express from "express";
const router = express.Router();
import wrapAsync from "../utility/wrapAsync.js";
import passport from "passport";
import { redirectUrl } from "../middleware.js";
import * as userController from "../controller/users.js";

// SIGNUP ROUTE
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signUp));

// LOGIN ROUTE
router.route("/login")
    .get(userController.loginForm)
    .post(
        redirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        userController.login
    );

// LOGOUT ROUTE
router.get("/logout", userController.logout);

export default router;
