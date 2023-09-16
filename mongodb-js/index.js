// getting-started.js
import mongoose from "mongoose";

const DB_NAME = "movie_db";
// connect menghasilkan promise
try {
  mongoose
    .connect(`mongodb://127.0.0.1:27017/${DB_NAME}`)
    .then(() => console.log("Connected to MongoDB"));
} catch (err) {
  console.log("error");
}

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  genre: String,
  rating: Number,
  director: String,
});

const Movie = mongoose.model("Movies", movieSchema);

try {
  //   await Movie.findOne({
  //     $or: [{ rating: { $gt: 5.9 } }, { genre: 'Yuri' }],
//   await Movie.updateOne(
//     { title: "Title 2" },
//     { rating: 9 }
//   ).then((result) => {
//     console.log(result);
//   });
// } catch (error) {
//   console.log(error);
// }

await Movie.findByIdAndDelete("650452863f6f38b7032a80e1")
.then((result) => {
  console.log(result);
});
} catch (error) {
console.log(error);
}

// const movie = new Movie({
//   title: "Spiderman",
//   year: 2020,
//   genre: "Action",
//   rating: 8.9,
//   director: "Renaldo",
// });

// Movie.insertMany([
//     {
//         title: "Title 1",
//         year: 2001,
//         genre: "Romance",
//         rating: 6.9,
//         director: "Surya"
//     },
//     {
//         title: "Title 2",
//         year: 2002,
//         genre: "Yuri",
//         rating:9.9,
//         director: "Surya"
//     },
//     {
//         title: "Title 3",
//         year: 2003,
//         genre: "Adventure",
//         rating: 7.9,
//         director: "Surya"
//     },
// ]).then((result) => {
//     console.log("Sukses")
//     console.log(result)
// }).catch((err) => {
//     console.log(err)
// })

// console.log(movie)
// movie.save()
