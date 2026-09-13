const Listing = require("../models/listing");

module.exports.index = async (req, res) => {

    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });

}

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");

}


module.exports.showListing = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing
        .findById(id)
        .populate({path:"reviews", 
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });

};


module.exports.createListing = async (req, res) => {

        const newListing = new Listing(req.body.listing);

        newListing.owner = req.user._id;

        await newListing.save();

        req.flash("success", "New Listing created!");

        res.redirect("/listings");

    };




module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });

};


module.exports.updateListing = async (req, res) => {

        let { id } = req.params;

        let listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { new: true, runValidators: true }
        );

        if (!updatedListing) {
            throw new ExpressError(404, "Listing not found");
        }

        req.flash("success", "Listing updated!");

        res.redirect("/listings");

    };



    module.exports.deleteListing = async (req, res) => {

        let { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }

        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "you don't have permission to delete");
            return res.redirect(`/listings/${id}`);
        }

        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            throw new ExpressError(404, "Listing not found");
        }

        req.flash("success", "Listing Deleted!");

        res.redirect("/listings");

    };