const path = require("path");
if (process.env.NODE_ENV != "production") {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
}

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");

const Listing = require("./models/listing"); 

const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();
const PORT = 8080;

const dbUrl = process.env.ATLASDB_URL;

// DATABASE CONNECTION
async function main() {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to Database");
}
main().catch((err) => console.error("❌ DB Connection Error:", err));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET || "wanderlustSessionSecretKeyHighEntropyFallback2026!",
    },
    touchAfter: 24 * 3600,
});
store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET || "wanderlustSessionSecretKeyHighEntropyFallback2026!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        // Since we use proxy in development, frontend and backend share same origin.
        // Thus, we don't need complex sameSite or secure settings locally.
    }
};

// Middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "https://wanderlust-ecru-six.vercel.app"
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Category and search API filters
app.get("/api/listings/search", async (req, res, next) => {
    let { country } = req.query; 
    try {
        let allListings;
        if (country) {
            allListings = await Listing.find({
                country: { $regex: country, $options: "i" }
            });
        } else {
            allListings = await Listing.find({});
        }
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

app.get("/api/listings/trending", async (req, res, next) => {
    try {
        const fixedPrice = 4000;
        let allListings = await Listing.find({ price: fixedPrice });
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

app.get("/api/listings/rooms", async (req, res, next) => {
    try {
        const fixedPrice = 6000;
        let allListings = await Listing.find({ price: fixedPrice });
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

app.get("/api/listings/iconic", async (req, res, next) => {
    try {
        const fixedPrice = 10000;
        let allListings = await Listing.find({ price: fixedPrice });
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

app.get("/api/listings/mountains", async (req, res, next) => {
    try {
        const fixedPrice = 8000;
        let allListings = await Listing.find({ price: fixedPrice });
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

app.get("/api/listings/castles", async (req, res, next) => {
    try {
        const fixedPrice = 5000;
        let allListings = await Listing.find({ price: fixedPrice });
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

app.get("/api/listings/pool", async (req, res, next) => {
    try {
        const fixedPrice = 4000;
        let allListings = await Listing.find({ price: fixedPrice });
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

app.get("/api/listings/camping", async (req, res, next) => {
    try {
        const fixedPrice = 3000;
        let allListings = await Listing.find({ price: fixedPrice });
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

app.get("/api/listings/farms", async (req, res, next) => {
    try {
        const fixedPrice = 4000;
        let allListings = await Listing.find({ price: fixedPrice });
        res.json(allListings);
    } catch (err) {
        next(err);
    }
});

// Routers
app.use("/api/listings", listings);
app.use("/api/listings/:id/reviews", reviews);
app.use("/api", userRouter);

// Serve Static Frontend Assets in Production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*all", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Centralized error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).json({ error: message });
});

// SERVER START
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
