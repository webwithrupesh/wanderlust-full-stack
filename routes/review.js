const express = require("express");
const router = express.Router({ mergeParams: true }); // 🔴 CRITICAL FIX: yeh missing tha, isse req.params.id undefined aa raha tha

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { reviewSchema } = require("../schema.js");


// ===============================
// Validate Review
// ===============================

const validateReview = (req, res, next) => {

    let { error } = reviewSchema.validate(req.body);

    if (error) {

        let errMsg = error.details
            .map((el) => el.message)
            .join(", ");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// ===============================
// POST Review Route
// ===============================

router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        const newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        res.redirect(`/listings/${id}`);

    })
);


// ===============================
// DELETE Review Route
// ===============================

router.delete(
    "/:reviewId",
    wrapAsync(async (req, res) => {

        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {
            $pull: {
                reviews: reviewId
            }
        });

        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            throw new ExpressError(404, "Review not found");
        }

        res.redirect(`/listings/${id}`);

    })
);


module.exports = router;