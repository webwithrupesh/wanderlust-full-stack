const express = require("express");
const app = express();

const users = require("./routes/user.js");
const posts = require("./routes/post.js");

const cookieParser = require('cookie-parser');

app.use(cookieParser("secretcode"));


// get signedCookies --> matalab no any change in this code

app.get("/getsignedcookies", (req, res) =>{
    res.cookie("made-in", "America", {signed: true});
    res.send("signed cookies sent");
});

// verify cookies

app.get("/verify", (req, res) =>{
    console.log(req.signedCookies);
    res.send("verified");
});


// cookies

app.get("/getcookies", (req, res) =>{
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "India");
    res.send("sent you some cookies");

});

app.get("/greet", (req, res) =>{
    let { name  = "anonymous" } = req.cookies;
    res.send(`Hi, ${name}`); 
})

app.get("/", (req, res) =>{
    console.dir(req.cookies);
    res.send("i am root");
});


app.use("/users", users);

app.use("/posts", posts);


app.listen(8080, () =>{
    console.log("server listen at 8080");
});