//  ONE TO Squiion
const mongoose = require("mongoose");

mongoose
   .connect("mongodb://127.0.0.1/relation_db")
   .then((result) => console.log("Connected to MongoDB"))
   .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
   username: String,
   age: Number,
});

const tweetSchema = new mongoose.Schema({
   text: String,
   likes: Number,
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   },
});

const User = mongoose.model("User", userSchema);

const Tweet = mongoose.model("Tweet", tweetSchema);

const makeTweet = async () => {
   const user = await User.findOne({
      username: "Renaldo",
   });

   const tweet = new Tweet({
      text: "Hello World Part 2",
      likes: 60,
   });

   tweet.user = user;
   //    user.save()
   tweet.save();
};

// makeTweet()

const showTweet = async () => {
   const tweet = await Tweet.findById("6514385798aa39522b1906db").populate("user").then((res) =>
      console.log(res)
   );
};

showTweet()