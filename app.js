const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");

const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const flash = require("connect-flash");
const session = require("express-session");

// Passport
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

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
app.use(express.json());

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "public")));


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};


// ===============================
// Root Route
// ===============================

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


// ===============================
// Session + Flash + Passport
// ===============================

app.use(session(sessionOptions));

app.use(flash());

// Passport initialize
app.use(passport.initialize());

// Passport session
app.use(passport.session());


// Local Strategy
passport.use(new LocalStrategy(User.authenticate()));


// Serialize / Deserialize User
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ===============================
// Flash Middleware
// ===============================

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// ===============================
// Listing Routes
// ===============================

app.use("/listings", listingRouter);


// ===============================
// Review Routes
// ===============================

app.use("/listings/:id/reviews", reviewRouter);


// ===============================
// User Router
// ===============================

app.use("/", userRouter);


// ===============================
// Unknown Routes
// ===============================

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