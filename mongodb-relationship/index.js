//  one to few
const mongoose = require("mongoose");

mongoose
   .connect("mongodb://127.0.0.1/relation_db")
   .then((result) => console.log("Connected to MongoDB"))
   .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
   name: String,
   addresses: [
      {
         _id: false,
         street: String,
         city: String,
         country: String,
      },
   ],
});

const User = mongoose.model("Users", userSchema);

// const makeUser = async () => {
//    const user = new User({
//       name: "Renaldo",
//    });
//    user.addresses.push({
//       street: "Jakal",
//       city: "DIY",
//       country: "ID",
//    });

//    const res = await user.save()
//    console.log(res);
// };

// makeUser();

const addAddress = async (id) => {
   const user = await User.findById(id);
   user.addresses.push({
      street: "Jamal",
      city: "Solo",
      country: "ID",
   });

   const res = await user.save()
   console.log(res)
};

addAddress("6513f5b8227ae8e099f08250")


