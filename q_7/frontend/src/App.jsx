import { useEffect, useState } from "react";
import axios from "axios";

function App() {

    const [page, setPage] = useState("user");

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [categoryName, setCategoryName] = useState("");
    const [parent, setParent] = useState("");

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [productCategory, setProductCategory] = useState("");

    const [cart, setCart] = useState([]);


    // Get categories
    const getCategories = async () => {

        const response = await axios.get(
            "http://localhost:5000/categories"
        );

        setCategories(response.data);
    };


    // Get products
    const getProducts = async () => {

        const response = await axios.get(
            "http://localhost:5000/products"
        );

        setProducts(response.data);
    };


    useEffect(() => {
        getCategories();
        getProducts();
    }, []);


    // Add category
    const addCategory = async () => {

        if (categoryName === "") {
            alert("Enter category name");
            return;
        }

        await axios.post(
            "http://localhost:5000/categories",
            {
                name: categoryName,
                parent: parent || null
            }
        );

        alert("Category added");

        setCategoryName("");
        setParent("");

        getCategories();
    };


    // Add product
    const addProduct = async () => {

        if (
            productName === "" ||
            price === "" ||
            productCategory === ""
        ) {
            alert("Enter all product details");
            return;
        }

        await axios.post(
            "http://localhost:5000/products",
            {
                name: productName,
                price: price,
                image: image,
                category: productCategory
            }
        );

        alert("Product added");

        setProductName("");
        setPrice("");
        setImage("");
        setProductCategory("");

        getProducts();
    };


    // Delete product
    const deleteProduct = async (id) => {

        await axios.delete(
            `http://localhost:5000/products/${id}`
        );

        getProducts();
    };


    // Add to cart
    const addToCart = (product) => {

        const existingProduct = cart.find(
            (item) => item._id === product._id
        );

        if (existingProduct) {

            setCart(
                cart.map((item) =>
                    item._id === product._id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                )
            );

        } else {

            setCart([
                ...cart,
                {
                    ...product,
                    quantity: 1
                }
            ]);
        }

        alert("Product added to cart");
    };


    // Increase quantity
    const increase = (id) => {

        setCart(
            cart.map((item) =>
                item._id === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        );
    };


    // Decrease quantity
    const decrease = (id) => {

        setCart(
            cart.map((item) =>
                item._id === id
                    ? {
                        ...item,
                        quantity: item.quantity - 1
                    }
                    : item
            ).filter((item) => item.quantity > 0)
        );
    };


    // Remove from cart
    const removeFromCart = (id) => {

        setCart(
            cart.filter((item) => item._id !== id)
        );
    };


    // Calculate total
    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    // =========================
    // ADMIN PAGE
    // =========================

    if (page === "admin") {

        const mainCategories = categories.filter(
            (category) => category.parent === null
        );

        const subCategories = categories.filter(
            (category) => category.parent !== null
        );

        return (
            <div>

                <h1>Admin Site</h1>

                <button onClick={() => setPage("user")}>
                    User Site
                </button>

                <hr />

                <h2>Add Category</h2>

                <input
                    type="text"
                    placeholder="Category name"
                    value={categoryName}
                    onChange={(e) =>
                        setCategoryName(e.target.value)
                    }
                />

                <br /><br />

                <select
                    value={parent}
                    onChange={(e) =>
                        setParent(e.target.value)
                    }
                >

                    <option value="">
                        Main Category
                    </option>

                    {mainCategories.map((category) => (
                        <option
                            key={category._id}
                            value={category._id}
                        >
                            {category.name}
                        </option>
                    ))}

                </select>

                <br /><br />

                <button onClick={addCategory}>
                    Add Category
                </button>


                <h2>Categories</h2>

                {mainCategories.map((main) => (

                    <div key={main._id}>

                        <b>{main.name}</b>

                        {subCategories
                            .filter(
                                (sub) =>
                                    sub.parent === main._id
                            )
                            .map((sub) => (
                                <p key={sub._id}>
                                    → {sub.name}
                                </p>
                            ))}

                    </div>

                ))}


                <hr />

                <h2>Add Product</h2>

                <input
                    type="text"
                    placeholder="Product name"
                    value={productName}
                    onChange={(e) =>
                        setProductName(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) =>
                        setPrice(e.target.value)
                    }
                />

                <br /><br />

                <input
                    type="text"
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) =>
                        setImage(e.target.value)
                    }
                />

                <br /><br />

                <select
                    value={productCategory}
                    onChange={(e) =>
                        setProductCategory(e.target.value)
                    }
                >

                    <option value="">
                        Select Subcategory
                    </option>

                    {subCategories.map((category) => (
                        <option
                            key={category._id}
                            value={category._id}
                        >
                            {category.name}
                        </option>
                    ))}

                </select>

                <br /><br />

                <button onClick={addProduct}>
                    Add Product
                </button>


                <h2>Products</h2>

                {products.map((product) => (

                    <div key={product._id}>

                        <b>{product.name}</b>

                        <p>Price: ₹{product.price}</p>

                        <p>
                            Category:
                            {product.category?.name}
                        </p>

                        <button
                            onClick={() =>
                                deleteProduct(product._id)
                            }
                        >
                            Delete
                        </button>

                        <hr />

                    </div>

                ))}

            </div>
        );
    }


    // =========================
    // USER PAGE
    // =========================

    if (page === "user") {

        return (
            <div>

                <h1>Shopping Cart</h1>

                <button onClick={() => setPage("admin")}>
                    Admin Site
                </button>

                <button onClick={() => setPage("cart")}>
                    Cart ({cart.length})
                </button>

                <hr />

                <h2>Products</h2>

                {products.map((product) => (

                    <div
                        key={product._id}
                        style={{
                            border: "1px solid black",
                            padding: "15px",
                            margin: "10px",
                            width: "250px"
                        }}
                    >

                        {product.image && (
                            <img
                                src={product.image}
                                width="150"
                                alt={product.name}
                            />
                        )}

                        <h3>{product.name}</h3>

                        <p>Price: ₹{product.price}</p>

                        <p>
                            Category:
                            {product.category?.name}
                        </p>

                        <button
                            onClick={() =>
                                addToCart(product)
                            }
                        >
                            Add to Cart
                        </button>

                    </div>

                ))}

            </div>
        );
    }


    // =========================
    // CART PAGE
    // =========================

    return (
        <div>

            <h1>Shopping Cart</h1>

            <button onClick={() => setPage("user")}>
                Back to Products
            </button>

            <hr />

            {cart.length === 0 ? (

                <h2>Cart is empty</h2>

            ) : (

                <div>

                    {cart.map((item) => (

                        <div key={item._id}>

                            <h3>{item.name}</h3>

                            <p>
                                Price: ₹{item.price}
                            </p>

                            <button
                                onClick={() =>
                                    decrease(item._id)
                                }
                            >
                                -
                            </button>

                            <span>
                                {" "}
                                {item.quantity}
                                {" "}
                            </span>

                            <button
                                onClick={() =>
                                    increase(item._id)
                                }
                            >
                                +
                            </button>

                            <p>
                                Total:
                                ₹{item.price * item.quantity}
                            </p>

                            <button
                                onClick={() =>
                                    removeFromCart(item._id)
                                }
                            >
                                Remove
                            </button>

                            <hr />

                        </div>

                    ))}

                    <h2>
                        Grand Total: ₹{total}
                    </h2>

                </div>

            )}

        </div>
    );
}

export default App;