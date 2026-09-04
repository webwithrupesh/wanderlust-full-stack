const express = require("express");
const router = express.Router(); // yaha se router object mila jayega


// users


// Index - users
router.get("/", (req, res) =>{
    res.send("Get for users");
});

// Show users
router.get("/:id", (req, res) =>{
    res.send("get for  user id");
});

// post- Routes 
router.post("/users", (req, res) =>{
    res.send("post for  users");
});

// Delete- Routes 
router.delete("/:id", (req, res) =>{
    res.send("Delete for  user id");
});


module.exports = router;