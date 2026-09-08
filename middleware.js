const isAuthenticate = (req, res) => {
    return req.isAuthenticated();
};


module.exports.isLoggedIn = (req, res, next) =>{


  if (!isAuthenticate(req)) {
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();

}