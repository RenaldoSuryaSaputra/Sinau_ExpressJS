import express from "express";
import morgan from "morgan"; // library untuk menampila=kan log

const app = express();

app.use(morgan("tiny"));
app.use((req, res, next) => {
  console.log("Middleware Pertama")
  next();
  console.log("Middleware Pertama Setelah Next")
});
app.use((req, res, next) => {
    console.log("Middleware Kedua")
    next();
    console.log("Middleware Kedua Setelah Next")
});

app.get("/", (req, res) => {
  res.send("Helo Home");
  console.log("HOME")
});

app.get("/halaman", (req, res) => {
  res.send("Helo Halaman");
  console.log("HAL")
});

app.listen(3000, () => {
  console.log("Listening on port http://127.0.0.1:3000");
});
