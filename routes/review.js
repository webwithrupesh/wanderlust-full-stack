const express = require("express");
const router = express.Router({ mergeParams: true }); // 🔴 CRITICAL FIX: yeh missing tha, isse req.params.id undefined aa raha tha

const Listing = require("../models/listing.js");


const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");

const {validateReview, isLoggedIn} = require("../middleware.js");

const reviewController = require("../controllers/review.js");


// ===============================


// ===============================
// POST Review Route
// ===============================

router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));


// ===============================
// DELETE Review Route
// ===============================

router.delete(
    "/:reviewId",
    wrapAsync(reviewController.deleteReview)
);


module.exports = router;