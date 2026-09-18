const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        url: String,
        filename: String,
    },

    price: Number,

    location: {
        type: String,
        required: true
    },

    country: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    latitude: Number,

    longitude: Number,
    // category: {
    //     type: String,
    //     enum: ["mountains", "arctic", "farms", "deserts"]; ye hame khud se implement karna hoga
    // }
});


// delete all reviews inside listing
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing; 