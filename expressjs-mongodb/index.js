const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");

// models
const Product = require("./models/product");

// Connect to mongoDB
mongoose
  .connect("mongodb://127.0.0.1/shopApp_db")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log(error);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Route
app.get("/", (req, res) => {
  res.send("Helo World das");
});

// Show all product
app.get("/products", async (req, res) => {
  const { category } = req.query; // cek apakah ada query pada url dengan nama category
  if (category) {
    const products = await Product.find({ category }); // category: category
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "Semua" });
  }
});

// create product
app.get("/products/create", (req, res) => {
  res.render("products/create");
});

//  Post Product
app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.redirect(`/products/${product._id}`);
});

// product detail
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/show", { product });
});

// Edit ejs route
app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product });
});

// Edit Method
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });
  res.redirect(`/products/${product._id}`);
});

// Delete Data
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params
  await Product.findByIdAndDelete(id)
  res.redirect('/products')
})

app.listen(3000, () => {
  console.log("Port Listening on http://127.0.0.1:3000 !");
});
