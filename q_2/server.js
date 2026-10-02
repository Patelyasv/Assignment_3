
const express = require("express");
const path = require("path");
const session = require("express-session");
const FileStore = require("session-file-store")(session);

const app = express();

// EJS
app.set("view engine", "ejs");

// Read form data
app.use(express.urlencoded({ extended: true }));


// ---------------- SESSION ----------------

const sessionPath = path.join(__dirname, "sessions");

app.use(
    session({
        store: new FileStore({
            path: sessionPath
        }),

        secret: "mySecretKey",

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);


// ---------------- LOGIN PAGE ----------------

app.get("/", (req, res) => {

    res.render("login", {
        error: null
    });

});


// ---------------- LOGIN ----------------

app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username === "admin" && password === "1234") {

        // Create session
        req.session.username = username;

        // Save session
        req.session.save((error) => {

            if (error) {
                console.log("Session save error:", error);
                return res.send("Session error");
            }

            console.log("Session created!");

            res.redirect("/home");

        });

    } else {

        res.render("login", {
            error: "Invalid username or password"
        });

    }

});


// ---------------- PROTECTED ROUTE 1 ----------------

app.get("/home", (req, res) => {

    if (!req.session.username) {

        return res.redirect("/");

    }

    res.render("home", {
        username: req.session.username
    });

});


// ---------------- PROTECTED ROUTE 2 ----------------

app.get("/profile", (req, res) => {

    if (!req.session.username) {

        return res.redirect("/");

    }

    res.render("profile", {
        username: req.session.username
    });

});


// ---------------- LOGOUT ----------------

app.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            return res.send("Logout failed");

        }

        console.log("User logged out");

        res.redirect("/");

    });

});


// ---------------- SERVER ----------------

app.listen(3000, () => {

    console.log("Server started at http://localhost:3000");

});
