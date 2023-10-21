const mongoose = require("mongoose");

const Product = require("./product");

const garmentSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, "Nama tidak boleh kosong"],
   },
   location: {
      type: String,
   },
   contact: {
      type: String,
      required: [true, "Kontak tidak boleh kosong"],
   },
   products: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Product",
      },
   ],
});


// Mengacu Pada Method FindOneAndDelete di Index.js pada method delete garment
garmentSchema.post("findOneAndDelete", async function (garment) {
   if (garment.products.length) {
      await Product.deleteMany({ _id: { $in: garment.products } })
         .then((res) => {
            console.log(res);
         })
         .catch((err) => {
            console.log(err);
         });
   }
});

const Garment = mongoose.model("Garment", garmentSchema);

module.exports = Garment;
