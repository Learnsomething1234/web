const User = require("../models/user");

module.exports.signUp = async(req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wanderLust");
            res.redirect("/listing");
        })

    } catch (err) {
        console.log(err);
        res.redirect("/signup");
    }
}
module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are loggedOut");
        res.redirect("/login");
    })
}
module.exports.logIn = async(req, res) => {

    req.flash("success", "welcome to your account");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);


}
module.exports.renderLog = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.renderSign = (req, res) => {
    res.render("users/signup.ejs");;
}