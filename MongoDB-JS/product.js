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
    type: String,
    require: true,
  },

  brand: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
    min: 0,
  },
  color: {
    type: String,
    require: true,
  },
  size: [
    {
      type: String,
      require: true,
    },
  ],
  description: {
    type: String,
    require: true,
    maxLength: 150,
  },
  condition: {
    type: String,
    enum: ["baru", "bekas"],
    default: "baru",
  },
  stock: {
    type: Number,
    require: true,
    min: [0, "Data tidak boleh minus"],
  },
  availability: {
    online: {
      type: Boolean,
      require: true,
    },
    offline: {
      type: Boolean,
      require: true,
    },
  },
});

productSchema.methods.outStock = function() {
  this.stock = 0
  this.availability.offline = false;
  this.availability.online = false;

  this.save();
};

const Product = mongoose.model("Products", productSchema);

const changeStock = async (id) => {
  const foundProduct = await Product.findById(id)
  await foundProduct.outStock()
  console.log("Berhasil mengubah data")
}

changeStock("6505afe95d5279d8614158b6")

// const newProduct = new Product(
//   {
// 		"name": "Kemeja Flanel",
// 		"brand": "Hollister",
// 		"price": 750000,
// 		"color": "biru muda",
// 		"size": ["S", "M", "L"],
// 		"description": "Kemeja flanel dengan warna yang cerah, terbuat dari bahan flanel yang nyaman dan berkualitas tinggi.",
// 		"condition": "baru",
// 		"stock": 25,
// 		"availability": {
// 			"online": true,
// 			"offline": true
// 		}
// 	},
// )
// try {
//   newProduct.save().then((reseult) => console.log(reseult));
// } catch (error) {
//   console.log(error);
// }

// Product.findOneAndUpdate(
//   { name: "Kemeja Flanel" },
//   {
//     name: "Kemeja Flanel",
//     brand: "Hollister",
//     price: 60000,
//     color: "biru muda",
//     size: ["S", "M", "L", "XL", "XXL"],
//     description:
//       "Kemeja flanel dengan warna yang cerah, terbuat dari bahan flanel yang nyaman dan berkualitas tinggi.",
//     condition: "baru",
//     stock: -20,
//     availability: {
//       online: true,
//       offline: true,
//     },
//   },
//   { new: true, runValidators: true }
// )
//   .then((result) => console.log(result))
//   .catch((err) => {
//     console.log(err);
//   });
