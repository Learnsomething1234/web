const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const { isAuthor } = require("../middleware.js");
const ReviewController = require("../controller/review.js");


router.post("/", isLoggedIn, wrapAsync(ReviewController.createReview));

router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(ReviewController.destroyReview));
module.exports = router;