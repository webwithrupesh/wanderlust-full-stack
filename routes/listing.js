const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const { listingSchema } = require("../schema.js");

const { isLoggedIn, isOwner, validateListing, isReviewAuthor } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); 
// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm );




// router.route()  Ye ek hi URL/path par multiple HTTP methods ko organize karne ke kaam aata hai.

router.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
);


// update route

router.route("/:id")
.get ( wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(
    isLoggedIn,
    isReviewAuthor,
    isOwner,
    wrapAsync(listingController.deleteListing)
);




// Index Route
// router.get("/", wrapAsync(listingController.index));




// Create Route
// router.post(
//     "/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing));


// // Show Route
// router.get("/:id", wrapAsync(listingController.showListing));


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm));


// Update Route
// router.put(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing));


// Delete Listing Route
// router.delete(
//     "/:id",
//     isLoggedIn,
//     isReviewAuthor,
//     isOwner,
//     wrapAsync(listingController.deleteListing));


module.exports = router;