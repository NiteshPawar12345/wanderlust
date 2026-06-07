const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
       
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            res.status(201).json({ 
                success: true, 
                user: { _id: req.user._id, username: req.user.username, email: req.user.email } 
            });
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.login = async (req, res) => {
    res.json({ 
        success: true, 
        message: "Welcome back!", 
        user: { _id: req.user._id, username: req.user.username, email: req.user.email } 
    });
};

module.exports.loggout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ success: true, message: "You are logged out!" });
    });
};