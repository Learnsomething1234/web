const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expresserror.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer = require('multer')
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage })

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.messsage).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));
router.route("/")
    .get(wrapAsync(listingController.index))
    // .post(upload.single('listing[image]'), (req, res) => {
    //     res.send(req.file);
    // });
    .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));

// .post(validateListing, wrapAsync(listingController.createListing));
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListring));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;