const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");  

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        return res.status(401).json({ error: "You must be logged in!" });
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    // Left for backward compatibility, not needed for pure API
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found!" });
    }
    const userId = req.user ? req.user._id : null;
    if(!userId || !listing.owner.equals(userId)) {
        return res.status(403).json({ error: "You are not the owner of this listing" });
    }
    next();
};

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if (!review) {
        return res.status(404).json({ error: "Review not found!" });
    }
    const userId = req.user ? req.user._id : null;
    if(!userId || !review.author.equals(userId)) {
        return res.status(403).json({ error: "You are not the author of this review" });
    }
    next();
};