const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
       
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            // Use registeredUser details directly to prevent crash if req.user is temporarily undefined
            res.status(201).json({ 
                success: true, 
                user: { 
                    _id: registeredUser._id, 
                    username: registeredUser.username, 
                    email: registeredUser.email 
                } 
            });
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.login = async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "Session could not be established. Please try logging in again." });
    }
    res.json({ 
        success: true, 
        message: "Welcome back!", 
        user: { _id: user._id, username: user.username, email: user.email } 
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