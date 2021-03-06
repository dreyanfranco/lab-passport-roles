const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// sign up get
router.get("/signup", (req, res) => res.render("auth/signup"));

//sign up post 
router.post("/signup", (req, res, next) => {

    const { username, password } = req.body;

    if (username.length === 0 || password.length === 0) {
        res.render("auth/signup", { errorMsg: "Fill in all the brackets" });
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "This user already exists!" })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(password, salt);

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("auth/signup", { errorMsg: "There was an error" }));
        })
        .catch(error => next(error));
});

//login get
router.get("/login", (req, res) => res.render("auth/login", { errorMsg: req.flash("error") }))

//login post
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router

