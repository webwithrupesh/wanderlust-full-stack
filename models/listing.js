const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg/1920px-Altja_j%C3%B5gi_Lahemaal.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail",
        set: (v) => v === "" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Altja_j%C3%B5gi_Lahemaal.jpg/1920px-Altja_j%C3%B5gi_Lahemaal.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail" : v,
    },
    price: Number,
    location: String,
    country: String,

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});



// delete all reviews inside listing
listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});

    }

})

const Listing = mongoose.model("Listing", listingSchema);





module.exports = Listing;