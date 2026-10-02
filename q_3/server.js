const express = require("express");
const session = require("express-session");
const { createClient } = require("redis");
const { RedisStore } = require("connect-redis");

const app = express();

// EJS
app.set("view engine", "ejs");

// Read form data
app.use(express.urlencoded({ extended: true }));

// Create Redis client
const redisClient = createClient({
    url: "redis://localhost:6379"
});

redisClient.connect()
    .then(() => {
        console.log("Redis connected!");
    })
    .catch((error) => {
        console.log("Redis connection error:", error);
    });

// Session
app.use(
    session({
        store: new RedisStore({
            client: redisClient
        }),
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);

// Login page
app.get("/", (req, res) => {
    res.render("login", { error: null });
});

// Login
app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // Simple login
    if (username === "admin" && password === "1234") {

        req.session.username = username;

        res.redirect("/home");

    } else {

        res.render("login", {
            error: "Invalid username or password"
        });
    }
});

// Protected Route 1
app.get("/home", (req, res) => {

    if (!req.session.username) {
        return res.redirect("/");
    }

    res.render("home", {
        username: req.session.username
    });
});

// Protected Route 2
app.get("/profile", (req, res) => {

    if (!req.session.username) {
        return res.redirect("/");
    }

    res.render("profile", {
        username: req.session.username
    });
});

// Logout
app.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return res.send("Logout failed");
        }

        res.redirect("/");
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});