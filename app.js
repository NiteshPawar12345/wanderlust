if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// DATABASE CONNECTION
async function main() {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to Database");
}
main().catch((err) => console.error("❌ DB Connection Error:", err));

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET || "sessionsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
    }
}




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log("🔍 Middleware running - Setting currentUser");
    console.log("req.user:", req.user);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    next();
});

app.get('/', async (req, res) => {
  try {
    const allListings = await Listing.find({});
    
    res.render('listings/index', { allListings });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "Student@gmail.com",
//         username: "delta-studen",
//     });
//     let registerduser = await User.register(fakeUser, "helloworld");
//     res.send(registerduser);
// });
  
    
app.get("/listings/search", async (req, res, next) => {
    let { country } = req.query; 
    console.log("Search Country:", country);

    try {
       let allListings;

if (country) {
    allListings = await Listing.find({
        country: { $regex: country, $options: "i" }
    });
} else {
    allListings = await Listing.find({});
}


        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});



app.get("/listings/trending", async (req, res, next) => {
    try {
        
        const fixedPrice = 4000;

        
        let allListings = await Listing.find({ price: fixedPrice });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});


app.get("/listings/rooms", async (req, res, next) => {
    try {
        
        const fixedPrice = 6000;

        
        let allListings = await Listing.find({ price: fixedPrice });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});


app.get("/listings/iconic", async (req, res, next) => {
    try {
        
        const fixedPrice = 10000;

        
        let allListings = await Listing.find({ price: fixedPrice });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});


app.get("/listings/mountains", async (req, res, next) => {
    try {
        
        const fixedPrice = 8000;

       
        let allListings = await Listing.find({ price: fixedPrice });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});

app.get("/listings/castles", async (req, res, next) => {
    try {
        
        const fixedPrice = 5000;

        
        let allListings = await Listing.find({ price: fixedPrice });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});
app.get("/listings/pool", async (req, res, next) => {
    try {
        
        const fixedPrice = 4000;

        
        let allListings = await Listing.find({ price: fixedPrice });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});

app.get("/listings/camping", async (req, res, next) => {
    try {
        
        const fixedPrice = 3000;

        
        let allListings = await Listing.find({ price: fixedPrice });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});
app.get("/listings/farms", async (req, res, next) => {
    try {
       
        const fixedPrice = 4000;

        
        let allListings = await Listing.find({ price: fixedPrice });

        res.render("listings/index", { allListings });
    } catch (err) {
        next(err);
    }
});










app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);



// Centralized error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    
    res.status(statusCode).render("listings/error.ejs" , {message});
});



app.get("/test", (req, res) => {
    console.log("User:", req.user);
    res.send("Check console");
});



// SERVER START
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
