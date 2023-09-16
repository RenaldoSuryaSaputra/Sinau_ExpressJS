import mongoose from "mongoose";

const DB_NAME = "shop_db";
// connect menghasilkan promise
try {
  mongoose
    .connect(`mongodb://127.0.0.1:27017/${DB_NAME}`)
    .then(() => console.log("Connected to MongoDB"));
} catch (err) {
  console.log("Error");
}

const personSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
});

// bisa set / get
personSchema.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// middleware
personSchema.pre("save", async function () { // bisa overwrite
  console.log("Pre simpan");
});
personSchema.post("save", async function () {
  console.log("Data berhasil disimpan");
});

//  Model
const Person = mongoose.model("Person", personSchema);

const newPerson = new Person({
  firstName: "Renaldo",
  lastName: "Surya",
});

// console.log(newPerson.fullname)

newPerson
  .save()
  .then((e) => {
    console.log(e);
  })
  .catch((e) => console.log(e));
