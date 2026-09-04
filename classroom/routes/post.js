const express = require("express");
const router = express.Router(); // yaha se router object mila jayega





// Post
// Index 
router.get("/", (req, res) =>{
    res.send("Get for posts");
});

// Show 
router.get("/:id", (req, res) =>{
    res.send("get for  posts id");
});

// post
router.post("/", (req, res) =>{
    res.send("post for  posts");
});

// Delete
router.delete("/:id", (req, res) =>{
    res.send("Delete for  posts id");
});


module.exports = router;
