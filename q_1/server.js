const express = require("express");
const path = require("path");
const multer = require("multer");

const {
    body,
    validationResult
} = require("express-validator");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static(path.join(__dirname, "upload")));

// -------------------- MULTER --------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        if (file.fieldname === "profilePic") {
            cb(null, "upload/profile");
        } else {
            cb(null, "upload/other");
        }
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 2 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        const allowedTypes = /jpg|jpeg|png/;

        const extension = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mimeType = allowedTypes.test(file.mimetype);

        if (extension && mimeType) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, JPEG and PNG images are allowed."));
        }
    }
});

// -------------------- FORM PAGE --------------------

app.get("/", (req, res) => {
    res.render("form", {
        errors: [],
        oldData: {},
        result: null
    });
});

// -------------------- FORM SUBMIT --------------------

app.post(
    "/register",

    upload.fields([
        {
            name: "profilePic",
            maxCount: 1
        },
        {
            name: "otherPics",
            maxCount: 5
        }
    ]),

    [
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required.")
            .isLength({ min: 3 })
            .withMessage("Username must contain at least 3 characters."),

        body("password")
            .notEmpty()
            .withMessage("Password is required.")
            .isLength({ min: 6 })
            .withMessage("Password must contain at least 6 characters."),

        body("confirmPassword")
            .notEmpty()
            .withMessage("Confirm password is required.")
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error("Passwords do not match.");
                }

                return true;
            }),

        body("email")
            .trim()
            .isEmail()
            .withMessage("Please enter a valid email."),

        body("gender")
            .notEmpty()
            .withMessage("Please select gender."),

        body("hobbies")
            .isArray({ min: 1 })
            .withMessage("Please select at least one hobby.")
    ],

    (req, res) => {

        const errors = validationResult(req);

        // If validation fails
        if (!errors.isEmpty()) {

            return res.render("form", {
                errors: errors.array(),
                oldData: req.body,
                result: null
            });
        }

        // Profile picture
        let profilePic = null;

        if (req.files && req.files.profilePic) {
            profilePic = req.files.profilePic[0];
        }

        // Other pictures
        let otherPics = [];

        if (req.files && req.files.otherPics) {
            otherPics = req.files.otherPics;
        }

        // Final result
        const result = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            gender: req.body.gender,
            hobbies: req.body.hobbies,
            profilePic: profilePic,
            otherPics: otherPics
        };

        res.render("form", {
            errors: [],
            oldData: {},
            result: result
        });
    }
);

// -------------------- DOWNLOAD ROUTE --------------------

app.get("/download/:type/:filename", (req, res) => {

    let folder;

    if (req.params.type === "profile") {
        folder = "profile";
    } else if (req.params.type === "other") {
        folder = "other";
    } else {
        return res.send("Invalid file type.");
    }

    const filePath = path.join(
        __dirname,
        "upload",
        folder,
        req.params.filename
    );

    res.download(filePath, (error) => {

        if (error) {
            res.send("File not found.");
        }
    });
});

// -------------------- START SERVER --------------------

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});