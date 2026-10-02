const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Category = require("./models/Category");
const Product = require("./models/Product");

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect("mongodb+srv://yasvipatel113:br8KsE0mprO6rbOG@clustertest.kf8hltv.mongodb.net/?appName=ClusterTest")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB error:", error);
    });


// Home
app.get("/", (req, res) => {
    res.send("Shopping Cart Backend is running!");
});


// ===============================
// CATEGORY APIs
// ===============================

// Add category
app.post("/categories", async (req, res) => {
    try {

        const category = new Category({
            name: req.body.name,
            parent: req.body.parent || null
        });

        await category.save();

        res.json({
            message: "Category added",
            category: category
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding category"
        });
    }
});


// Get all categories
app.get("/categories", async (req, res) => {
    try {

        const categories = await Category.find();

        res.json(categories);

    } catch (error) {
        res.status(500).json({
            message: "Error getting categories"
        });
    }
});


// Delete category
app.delete("/categories/:id", async (req, res) => {
    try {

        await Category.findByIdAndDelete(req.params.id);

        res.json({
            message: "Category deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting category"
        });
    }
});


// ===============================
// PRODUCT APIs
// ===============================

// Add product
app.post("/products", async (req, res) => {
    try {

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            image: req.body.image,
            category: req.body.category
        });

        await product.save();

        res.json({
            message: "Product added",
            product: product
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding product"
        });
    }
});


// Get all products
app.get("/products", async (req, res) => {
    try {

        const products = await Product.find()
            .populate("category");

        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: "Error getting products"
        });
    }
});


// Delete product
app.delete("/products/:id", async (req, res) => {
    try {

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting product"
        });
    }
});


// Start server
app.listen(5000, () => {
    console.log("Backend running at http://localhost:5000");
});