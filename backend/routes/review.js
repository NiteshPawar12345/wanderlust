const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");

const reviewController = require("../controllers/review.js");

//post review route

router.post("/", isLoggedIn,reviewController.createReview);

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;