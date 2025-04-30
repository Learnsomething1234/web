if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

console.log(process.env.CLOUD_NAME)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const path = require("path");
const Review = require("./models/review.js");
const ejsMate = require("ejs-mate");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expresserror.js");
const { listingSchema } = require("./schema.js");
const listing = require("./route/listing.js");
const reviews = require("./route/review.js");
const user = require("./route/user.js");
const user1 = require("./route/login.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const mongourl = "mongodb://127.0.0.1:27017/wanderLust";

const dbUrl = process.env.ATLASDB_URL;
const store = MongoStore.create({
    mongoUrl: mongourl,
    collectionName: "sessions",
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})
store.on("error", (err) => {
    console.log("error in mongo session store", err);
})

const sessionOption = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
};


app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser());



main().then(() => {
    console.log("connected succesfully");
}).catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.currentUser = req.user;

    next();
});

app.use("/listing", listing);
app.use("/listing/:id/reviews", reviews);
app.use("/", user);
app.use("/", user1);
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"));
})

app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }
    let { status = 500, message = "something went wrong" } = err;
    res.render("\listing/error.ejs", { err });
});
app.listen(8080, () => {
    console.log("server is listening to port");

});