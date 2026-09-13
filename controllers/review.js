const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {

        let { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
         req.flash("success", "New Review created!");
        res.redirect(`/listings/${id}`);

    };

module.exports.deleteReview = async (req, res) => {

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
         req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);

    }