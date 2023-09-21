const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
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

app.get("/", (req, res) => {
  res.send("Helo World das");
});

// Show all product
app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    res.render("products/index", { products, category: "All" });
  }
});

// create product
app.get("/products/create", (req, res) => {
  res.render("products/create");
});

// app.post('/products', wrapAsync(async (req, res) => {
//     const product = new Product(req.body)
//     await product.save()
//     res.redirect(`/products/${product._id}`)
// }))

// product detail
app.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findById(id)
    res.render('products/show', { product })
})

app.listen(3000, () => {
  console.log("Port Listening on http://127.0.0.1:3000 !");
});
