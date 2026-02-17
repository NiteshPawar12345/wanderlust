const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");

const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });




const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); 
    
    if (error) {
        const msg = error.details.map(el => el.message).join(','); 
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

router.route("/")
.get( wrapAsync(listingController.index))
.post( isLoggedIn, upload.single("listing[image]"),(listingController.createListing));

// New listing form
router.get("/new", isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,upload.single("listing[image][url]"),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

// Edit listing form
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;