const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
        }
        
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();

        const populatedReview = await Review.findById(newReview._id).populate("author");
        res.status(201).json({ success: true, review: populatedReview });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.deleteReview = async (req, res) => {
    try {
        let { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        res.json({ success: true, message: "Review Deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
