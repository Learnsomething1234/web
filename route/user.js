const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const userController = require("../controller/user.js");
const { saveRedirectUrl } = require("../middleware.js");

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id);
    done(null,  user);
});
router.get("/logout", userController.logOut)
router.route("/signup")
    .get(userController.renderSign)
    .post(userController.signUp);

router.route("/login")
    .get(userController.renderLog)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true, }), userController.logIn);

module.exports = router;