const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const Employee = require("./models/Employee");

const app = express();

// EJS
app.set("view engine", "ejs");

// Form data
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
    session({
        secret: "adminSecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 30
        }
    })
);

// MongoDB connection
mongoose.connect("mongodb+srv://yasvipatel113:br8KsE0mprO6rbOG@clustertest.kf8hltv.mongodb.net/?appName=ClusterTest")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB error:", error);
    });


// ---------------- ADMIN LOGIN ----------------

// Login page
app.get("/", (req, res) => {
    res.render("login", { error: null });
});

// Login
app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if (username === "admin" && password === "admin123") {

        req.session.admin = username;

        res.redirect("/dashboard");

    } else {

        res.render("login", {
            error: "Invalid username or password"
        });
    }
});


// Check admin login
function checkAdmin(req, res, next) {

    if (!req.session.admin) {
        return res.redirect("/");
    }

    next();
}


// ---------------- DASHBOARD ----------------

app.get("/dashboard", checkAdmin, async (req, res) => {

    const employees = await Employee.find();

    res.render("dashboard", {
        employees: employees
    });
});


// ---------------- ADD EMPLOYEE ----------------

app.get("/add", checkAdmin, (req, res) => {

    res.render("add");
});


app.post("/add", checkAdmin, async (req, res) => {

    try {

        const name = req.body.name;
        const email = req.body.email;
        const salary = Number(req.body.salary);

        // Generate employee ID
        const count = await Employee.countDocuments();

        const empid = "EMP" + String(count + 1).padStart(3, "0");

        // Generate password
        const plainPassword = "EMP" + Math.floor(1000 + Math.random() * 9000);

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(plainPassword, 10);


        // Salary calculation
        let hra;
        let da;

        if (salary < 30000) {

            hra = salary * 0.20;
            da = salary * 0.60;

        } else if (salary <= 45000) {

            hra = salary * 0.30;
            da = salary * 0.70;

        } else {

            hra = salary * 0.40;
            da = salary * 0.85;
        }

        const totalSalary = salary + hra + da;


        // Create employee
        const employee = new Employee({

            empid: empid,
            name: name,
            email: email,
            password: encryptedPassword,
            salary: salary,
            hra: hra,
            da: da,
            totalSalary: totalSalary

        });

        await employee.save();


        // Send email
        const transporter = nodemailer.createTransport({

            service: "gmail",

            auth: {
                user: "your_email@gmail.com",
                pass: "your_app_password"
            }

        });


        await transporter.sendMail({

            from: "your_email@gmail.com",

            to: email,

            subject: "ERP Employee Account",

            text:
                `Hello ${name},

Your employee account has been created.

Employee ID: ${empid}
Password: ${plainPassword}

Please keep your password safe.

Thank you.`

        });


        res.redirect("/dashboard");

    } catch (error) {

        console.log(error);

        res.send("Error while adding employee");

    }

});


// ---------------- EDIT EMPLOYEE ----------------

app.get("/edit/:id", checkAdmin, async (req, res) => {

    const employee = await Employee.findById(req.params.id);

    res.render("edit", {
        employee: employee
    });
});


app.post("/edit/:id", checkAdmin, async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const salary = Number(req.body.salary);


    // Salary calculation
    let hra;
    let da;

    if (salary < 30000) {

        hra = salary * 0.20;
        da = salary * 0.60;

    } else if (salary <= 45000) {

        hra = salary * 0.30;
        da = salary * 0.70;

    } else {

        hra = salary * 0.40;
        da = salary * 0.85;
    }

    const totalSalary = salary + hra + da;


    await Employee.findByIdAndUpdate(

        req.params.id,

        {
            name: name,
            email: email,
            salary: salary,
            hra: hra,
            da: da,
            totalSalary: totalSalary
        }

    );

    res.redirect("/dashboard");
});


// ---------------- DELETE EMPLOYEE ----------------

app.get("/delete/:id", checkAdmin, async (req, res) => {

    await Employee.findByIdAndDelete(req.params.id);

    res.redirect("/dashboard");
});


// ---------------- LOGOUT ----------------

app.get("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return res.send("Logout failed");
        }

        res.redirect("/");

    });

});


// ---------------- SERVER ----------------

app.listen(3000, () => {

    console.log("Server started at http://localhost:3000");

});