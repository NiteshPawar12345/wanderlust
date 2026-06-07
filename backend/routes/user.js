const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

const userController = require("../controllers/user.js");

router.post("/signup", wrapAsync(userController.signup));

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: info ? info.message : "Authentication failed!" });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return userController.login(req, res);
        });
    })(req, res, next);
});

router.get("/logout", userController.loggout);

router.get("/current-user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: { _id: req.user._id, username: req.user.username, email: req.user.email } });
    } else {
        res.json({ user: null });
    }
});

module.exports = router;
