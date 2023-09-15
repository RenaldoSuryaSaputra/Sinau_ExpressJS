import mongoose from "mongoose";

const DB_NAME = "shop_db";
// connect menghasilkan promise
try {
  mongoose
    .connect(`mongodb://127.0.0.1:27017/${DB_NAME}`)
    .then(() => console.log("Connected to MongoDB"));
} catch (err) {
  console.log("error");
}

const productSchema = new mongoose.Schema({
  name: {
    type: Number,
  },
  price: {
    type: Number,
  },
});

const Product = mongoose.Model("Products", productSchema);

const newProduct = new Product({
  name: "Baju Kegedean",
  price: 100000,
});

try {
  newProduct.save()
  .then((reseult) => console.log(reseult));
} catch (error) {
    console.log(error)
}
