const express = require("express");
const app = express();

const users = require("./routes/user.js");
const posts = require("./routes/post.js");

const cookieParser = require('cookie-parser');

const session = require("express-session");

const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());

// app.use(cookieParser("secretcode"));


// get signedCookies --> matalab no any change in this code

// app.get("/getsignedcookies", (req, res) =>{
//     res.cookie("made-in", "America", {signed: true});
//     res.send("signed cookies sent");
// });

// // verify cookies

// app.get("/verify", (req, res) =>{
//     console.log(req.signedCookies);
//     res.send("verified");
// });


// // cookies

// app.get("/getcookies", (req, res) =>{
//     res.cookie("greet", "namaste");
//     res.cookie("madeIn", "India");
//     res.send("sent you some cookies");

// });

// app.get("/greet", (req, res) =>{
//     let { name  = "anonymous" } = req.cookies;
//     res.send(`Hi, ${name}`); 
// })

// app.get("/", (req, res) =>{
//     console.dir(req.cookies);
//     res.send("i am root");
// });


// app.use("/users", users);

// app.use("/posts", posts);




// Express Session

// app.get("/reqcount", (req, res) =>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1; // count is variable
//     }
   
//     res.send(`you sent a request ${req.session.count} times`);
// });

// app.get("/test", (req, res) =>{
//     res.send("test successful");

// });


// using session info user register

// middle ware
app.use((req, res, next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();

})

app.get("/register", (req, res) =>{
    let {name = "anonymous" } = req.query; // anonymous is a defoult name
    req.session.name = name;
   
    if(name === "anonymous"){
        req.flash("error", "user not registered");
    }
    else{
        req.flash("success","user registerd successfully!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) =>{
    
    res.render("page.ejs", {name: req.session.name});
});


app.listen(8080, () =>{
    console.log("server listen at 8080");
});