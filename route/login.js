const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id);
    done(null,  user);
});

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});
router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), async(req, res) => {

    req.flash("success", "welcome to your account");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);


})
module.exports = router;