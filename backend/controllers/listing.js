const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.json(allListings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author" },
            })
            .populate("owner");

        if (!listing) {
            return res.status(404).json({ error: "Listing you requested does not exist!" });
        }
        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.createListing = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image file is required!" });
        }
        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };

        // Geocoding location text into [lng, lat] coordinates via OpenStreetMap Nominatim API
        const queryAddress = `${req.body.listing.location}, ${req.body.listing.country}`;
        let coordinates = [77.2090, 28.6139]; // Default fallback coordinates (Delhi)
        try {
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryAddress)}&format=json&limit=1`, {
                headers: { 'User-Agent': 'WanderlustApp/1.0' }
            });
            const geoData = await geoResponse.json();
            if (geoData && geoData.length > 0) {
                coordinates = [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)];
            }
        } catch (e) {
            console.error("Geocoding failed, using fallback coordinates:", e);
        }

        newListing.geometry = {
            type: 'Point',
            coordinates: coordinates
        };

        await newListing.save();
        res.status(201).json({ success: true, listing: newListing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        if (!req.body.listing) {
            return res.status(400).json({ error: "Invalid listing data" });
        }
        const { id } = req.params;
        
        let listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ error: "Listing not found!" });
        }

        // Update basic properties
        listing.title = req.body.listing.title;
        listing.description = req.body.listing.description;
        listing.price = req.body.listing.price;
        listing.location = req.body.listing.location;
        listing.country = req.body.listing.country;

        // Re-geocode stay location coordinate geometry
        const queryAddress = `${req.body.listing.location}, ${req.body.listing.country}`;
        let coordinates = listing.geometry?.coordinates || [77.2090, 28.6139];
        try {
            const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryAddress)}&format=json&limit=1`, {
                headers: { 'User-Agent': 'WanderlustApp/1.0' }
            });
            const geoData = await geoResponse.json();
            if (geoData && geoData.length > 0) {
                coordinates = [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)];
            }
        } catch (e) {
            console.error("Geocoding failed on update, using fallback:", e);
        }

        listing.geometry = {
            type: 'Point',
            coordinates: coordinates
        };

        if (typeof req.file !== "undefined") {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { url, filename };
        }

        await listing.save();
        res.json({ success: true, listing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            return res.status(404).json({ error: "Listing not found!" });
        }
        res.json({ success: true, message: "Listing Deleted!", deletedListing });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};