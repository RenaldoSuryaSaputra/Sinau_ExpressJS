const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
   username: {
      type: String,
      required: [true, "Username is required"],
   },
   password: {
      type: String,
      required: [true, "Password is required"],
   },
});

// login
userSchema.statics.findByCredentials = async function (username, password) {
   const user = await this.findOne({ username });
   if (user == null) {
      return false;
   } else {
      const isMatch = await bcrypt.compare(password, user.password);
      return isMatch ? user : false;
   }
};

// register
userSchema.pre("save", async function (next) {
    // jika data password tidak diperbarui
    // untuk handle jika ada kasus edit, karena edit pasti pakai save
   if (!this.isModified("password")) {
      return next();
   }
   this.password = await bcrypt.hash(this.password, 10);
   next();
});

module.exports = mongoose.model("User", userSchema);
