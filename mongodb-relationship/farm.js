//  ONE TO MANY
const mongoose = require("mongoose");

mongoose
   .connect("mongodb://127.0.0.1/relation_db")
   .then((result) => console.log("Connected to MongoDB"))
   .catch((err) => console.log(err));

const productSchema = new mongoose.Schema({
   name: String,
   price: Number,
   season: {
      type: String,
      enum: ["spring", "summer", "fall", "winter"],
   },
});

const farmSchema = new mongoose.Schema({
   name: String,
   city: String,
   products: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product", // singular
      },
   ],
});

const Product = mongoose.model("Product", productSchema);

const Farm = mongoose.model("Farm", farmSchema);

// Product.insertMany([
//     {
//         name: "Melon",
//         price: 45000,
//         season: "summer"
//     },
//     {
//         name: "Watermelon",
//         price: 30000,
//         season: "fall"
//     },
//     {
//         name: "Berry",
//         price: 20000,
//         season: "winter"
//     },
//     {
//         name: "Dragon Fruit",
//         price: 20000,
//         season: "fall"
//     },
// ])

// const makeFarm = async () => {
//    const farm = new Farm({
//       name: "Farm1",
//       city: "AnyCity",
//    });
//    const melon = await Product.findOne({ name: "Melon" });
//    farm.products.push(melon);
//    await farm.save();
//    console.log(farm);
// };
// const addProductToFarm = async (id) => {
//    const farm = await Farm.findById(id);
//    const melon = await Product.findOne({ name: "Berry" });
//    farm.products.push(melon);
//    await farm.save();
//    console.log(farm);
// };

// makeFarm();
// addProductToFarm("65142b87e43263b8af9b46d0");


Farm.findOne({name: "Farm1"}).populate('products', ["name", "price"]).then((farm) => {
    console.log(farm)
    // for (const product of farm.products) {
    //     console.log(product)
    // }
})

