const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Employee = require("./models/Employee");
const Leave = require("./models/Leave");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Q5 Backend is running successfully!");
});


// MongoDB connection

mongoose.connect("mongodb+srv://yasvipatel113:br8KsE0mprO6rbOG@clustertest.kf8hltv.mongodb.net/?appName=ClusterTest")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB error:", error);
    });


// JWT Secret

const JWT_SECRET = "employeeSecret";


// ---------------- LOGIN ----------------

app.post("/login", async (req, res) => {

    try {

        const { empid, password } = req.body;

        const employee = await Employee.findOne({
            empid: empid
        });

        if (!employee) {

            return res.json({
                success: false,
                message: "Employee not found"
            });

        }

        const validPassword = await bcrypt.compare(
            password,
            employee.password
        );

        if (!validPassword) {

            return res.json({
                success: false,
                message: "Invalid password"
            });

        }

        const token = jwt.sign(
            {
                empid: employee.empid
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            success: true,
            token: token
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Login error"
        });

    }

});


// ---------------- JWT MIDDLEWARE ----------------

function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message: "Token not found. Please login."
        });

    }

    const token = authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            message: "Invalid token"
        });

    }

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.empid = decoded.empid;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }

}

// ---------------- PROFILE ----------------

app.get("/profile", verifyToken, async (req, res) => {

    const employee = await Employee.findOne({
        empid: req.empid
    }).select("-password");

    res.json(employee);

});


// ---------------- ADD LEAVE ----------------

app.post("/leave", verifyToken, async (req, res) => {

    try {

        const { date, reason, grant } = req.body;

        const leave = new Leave({

            empid: req.empid,

            date: date,

            reason: reason,

            grant: grant

        });

        await leave.save();

        res.json({
            message: "Leave added successfully"
        });

    } catch (error) {

        res.json({
            message: "Error adding leave"
        });

    }

});


// ---------------- LIST LEAVE ----------------

app.get("/leave", verifyToken, async (req, res) => {

    const leaves = await Leave.find({
        empid: req.empid
    });

    res.json(leaves);

});


// ---------------- SERVER ----------------

app.listen(5000, () => {

    console.log(
        "Backend running at http://localhost:5000"
    );

});