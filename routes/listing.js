const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { listingSchema } = require("../schema.js");


// Validate Listing
const validateListing = (req, res, next) => {

    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details
            .map((el) => el.message)
            .join(", ");

        throw new ExpressError(400, errMsg);
    }

    next();
};


// Index Route
router.get("/", wrapAsync(async (req, res) => {

    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });

}));


// New Route — 🔴 yeh route "/:id" se PEHLE hona chahiye, warna Express "new" ko id samajh lega
router.get("/new", (req, res) => {

    res.render("listings/new.ejs");

});


// Create Route
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {

        const newListing = new Listing(req.body.listing);

        await newListing.save();

        res.redirect("/listings");

    })
);


// Show Route
router.get("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;

    const listing = await Listing
        .findById(id)
        .populate("reviews");

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/show.ejs", { listing });

}));


// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    res.render("listings/edit.ejs", { listing });

}));


// Update Route
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { new: true, runValidators: true }
        );

        if (!updatedListing) {
            throw new ExpressError(404, "Listing not found");
        }

        res.redirect("/listings");

    })
);


// Delete Listing Route
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {

        let { id } = req.params;

        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            throw new ExpressError(404, "Listing not found");
        }

        res.redirect("/listings");

    })
);


module.exports = router;