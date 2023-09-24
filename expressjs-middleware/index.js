import express from "express";
import morgan from "morgan"; // library untuk menampila=kan log

const app = express();

app.use(morgan("dev"));
app.use((req, res, next) => {
    //   bisa override method atau nilai
    //   req.timeReqVar = new Date();
    console.log(req.method, req.url);
    next();
});

// Middleware admin valid
const auth = (req, res, next) => {
    const { password } = req.query;
    password != "admin" ? res.send("Anda tidak memiliki akses") : next();
};

app.get("/", (req, res) => {
    res.send("Helo Home");
    console.log("HOME");
});

app.get("/halaman", (req, res) => {
    res.send("Helo Halaman");
    console.log(req.timeReqVar);
    console.log("HAL");
});
app.get("/admin", auth, (req, res) => {
    res.send("Halo Min");
});

app.use((req, res) => {
    res.status(404).send("page not found");
});

app.listen(3000, () => {
    console.log("Listening on port http://127.0.0.1:3000");
});
