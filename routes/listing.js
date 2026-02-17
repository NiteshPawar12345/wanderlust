const express = require("express");
const router = express.Router();
const Listing = require("../models/listing"); 
const {isLoggedIn} = require("./middleware.js");



// GET: All listings
router.get("/", async (req, res, next) => {
    try {
        let allListings = await Listing.find({});

        
        allListings = allListings.map(listing => {
            if (!listing.image) {
                listing.image = { url: "/images/default.jpg" };
            }
            return listing;
        });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});

// GET: New listing form
router.get("/new",isLoggedIn,(req, res) => {
    
    res.render("listings/new");
});

// POST: Create new listing
router.post("/", async (req, res, next) => {
    try {
        let { title, description, price, location, country, image } = req.body.listing;

        
        if (!image || !image.url) {
            image = { url: "/images/default.jpg" };
        }

        const newListing = new Listing({
            title,
            description,
            price,
            location,
            country,
            image
        });

        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
});

// GET: Show single listing
router.get("/:id", async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).send("Listing not found");
        }

        if (!listing.image) {
            listing.image = { url: "/images/default.jpg" };
        }

        res.render("listings/show", { listing });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
