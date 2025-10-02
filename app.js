import dotenv from "dotenv";
if(process.env.NODE_ENV !== "production"){
    dotenv.config();
}


import express from "express";
import mongoose from "mongoose";
import path,{dirname} from "path";
import { fileURLToPath } from "url";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utility/ExpressError.js";
import listings from "./routes/listing.js";
import reviews from "./routes/review.js";
import user from "./routes/user.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import flash  from "connect-flash";
import passport from "passport";
import LocalStrategy  from "passport-local";
import User from "./models/user.js";


const app = express();
const port = process.env.PORT||8080;


const MONGO_URL= "mongodb://127.0.0.1:27017/wanderLust";
const dbUrl = process.env.ATLASDB_URL || MONGO_URL;


async function main(){
    await mongoose.connect(dbUrl);
}
main()
 .then(() => {
    console.log("Connected");
 })
 .catch((err) => {
    console.log(err);
 });


const __filename = fileURLToPath(import.meta.url);
const  __dirname = dirname(__filename);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24* 3600
});
store.on("error",  (err) => {
    console.error("Error in mongo session store", err);
});


const sessionOption = {
    store, 
    secret: process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next(); 
});


app.use("/listings", listings)
app.use("/listings/:id/reviews", reviews);
app.use("/", user);


app.get("/", (req, res) => {
    res.redirect("/listings");
});


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});
app.use((err, req, res, next) => {
    console.log(err);
    let { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render("listings/error", {message});
});


app.listen(port, () => {
    console.log(`Listening port on ${port}`);
});


