const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const ejsMate = require("ejs-mate");


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(MONGO_URL);
}


// ===============================
// App Configuration
// ===============================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // form/body ke alawa JSON requests ke liye bhi

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));


// ===============================
// Listing Routes
// ===============================

app.use("/listings", listings);


// ===============================
// Review Routes
// ===============================

app.use("/listings/:id/reviews", reviews);


// ===============================
// Root Route
// ===============================

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


// ===============================
// Unknown Routes
// ===============================

// Express 5 syntax. Agar Express 4 use kar rahe ho to isse "*" se replace karo
app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// ===============================
// Error Handling
// ===============================

app.use((err, req, res, next) => {

    let {
        statusCode = 500,
        message = "Something went Wrong!"
    } = err;

    res.status(statusCode).render("error.ejs", { message });

});


// ===============================
// Server
// ===============================

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});