const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ErrorHandler = require("./ErrorHandler");
const morgan = require("morgan");
const app = express();
const methodOverride = require("method-override");

// models
const Product = require("./models/product");
const Garment = require("./models/garment");

// Connect to mongoDB
mongoose
   .connect("mongodb://127.0.0.1:27017/shopApp_db")
   .then((result) => {
      console.log("connected to mongodb");
   })
   .catch((error) => {
      console.log(error);
   });

// setup
app.use(morgan("dev"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// method untuk try catch
function wrapAsync(fn) {
   // param function
   return function (req, res, next) {
      fn(req, res, next).catch((err) => next(err)); // try catch ada error masuk catch
   };
}

// Route
app.get("/", (req, res) => {
   res.send("Helo World das");
});

app.get(
   "/garments",
   wrapAsync(async (req, res) => {
      const garments = await Garment.find({});
      res.render("garment/index", { garments });
   })
);

app.get("/garments/create", (req, res) => {
   res.render("garment/create");
});

// post garment
app.post(
   "/garments",
   wrapAsync(async (req, res) => {
      const garment = new Garment(req.body); // lebih baik ada validasi
      await garment.save();
      res.redirect(`/garments`);
   })
);

// get detail
app.get(
   "/garments/:id",
   wrapAsync(async (req, res) => {
      const { id } = req.params;
      // populate uuntuk mengambil data products.. tanpa populate maka hanya tampil _id
      const garment = await Garment.findById(id).populate("products", [
         "name",
         "price",
         "brand",
      ]);
      res.render("garment/show", { garment });
   })
);

// get create product for gamment based on id garment
app.get("/garments/:garment_id/products/create", (req, res) => {
   const { garment_id } = req.params;
   res.render("products/create", { garment_id });
});

// form action create product 
app.post(
   "/garments/:garment_id/products",
   wrapAsync(async (req, res) => {
      const { garment_id } = req.params;
      // buat productnya berdasarkan form
      const product = new Product(req.body);
      // ambil garment yang terlibat
      const garment = await Garment.findById(garment_id);
      garment.products.push(product);
      // set product.garment = garment sekarang
      product.garment = garment;
      await product.save();
      await garment.save();
      console.log(garment);
      res.redirect(`/garments/${garment_id}`);
   })
);

app.get(
   "/garments/:garment_id/edit",
   wrapAsync(async (req, res) => {
      const { garment_id } = req.params;
      const garment = await Garment.findById(garment_id);
      console.log(garment);
      res.render("garment/edit", { garment });
   })
);

app.put(
   "/garments/:garment_id",
   wrapAsync(async (req, res) => {
      const { garment_id } = req.params;
      const garment = await Garment.findByIdAndUpdate(garment_id, req.body, {
         runValidators: true,
      });
      res.redirect(`/garments/${garment_id}`);
   })
);

app.delete(
   "/garments/:garment_id",
   wrapAsync(async (req, res) => {
      const { garment_id } = req.params;
      await Garment.findOneAndDelete({ _id: garment_id })
      res.redirect('/garments')
   })
);

// ===== PRODUCTS =====
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
app.post(
   "/products",
   wrapAsync(async (req, res) => {
      const product = new Product(req.body);
      await product.save();
      res.redirect(`/products/${product._id}`);
   })
);

// product detail
// pada async func jika mau menerapkan ErrorHandler maka harus implemantasi next
// next(err)
// app.get("/products/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);
//     res.render("products/show", { product });
//   } catch (error) {
//     next(new ErrorHandler("Product Not Found", 404));
//   }
// });

app.get(
   "/products/:id",
   wrapAsync(async (req, res) => {
      const { id } = req.params;
      const product = await Product.findById(id).populate("garment");
      console.log(product)
      res.render("products/show", { product });
   })
);

// Edit ejs route
app.get(
   "/products/:id/edit",
   wrapAsync(async (req, res) => {
      const { id } = req.params;
      const product = await Product.findById(id);
      res.render("products/edit", { product });
   })
);

// Edit Method
app.put(
   "/products/:id",
   wrapAsync(async (req, res) => {
      const { id } = req.params;
      const product = await Product.findByIdAndUpdate(id, req.body, {
         runValidators: true,
      });
      res.redirect(`/products/${product._id}`);
   })
);

// Delete Data
app.delete(
   "/products/:id",
   wrapAsync(async (req, res) => {
      const { id } = req.params;
      await Product.findByIdAndDelete(id);
      res.redirect("/products");
   })
);

const validatorHandler = (err) => {
   err.status = 400;
   err.message = Object.values(err.errors).map((item) => item.message);
   return new ErrorHandler(err.message, err.status);
};

app.use((err, req, res, next) => {
   console.dir(err);
   //  Dalam mongoose ada 2 type error ValidationError & CastError
   if (err.name === "ValidationError") err = validatorHandler(err);
   if (err.name === "CastError") {
      err.status = 404;
      err.message = "Product not found";
   }
   next(err);
});

// Kalau ada error program (middleware)
app.use((err, req, res, next) => {
   const { status = 402, message = "Something gone wrong" } = err;
   res.status(status).send(message);
});

app.use((req, res) => {
   res.status(404).send("Page not found");
});

app.listen(3000, () => {
   console.log("Port Listening on http://127.0.0.1:3000 !");
});
