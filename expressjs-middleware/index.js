import express from "express";
import morgan from "morgan"; // library untuk menampila=kan log
import ErrorHandler from './ErrorHandler.js'

const app = express();

app.use(morgan("dev"));
app.use((req, res, next) => {
    console.log("MIDDLEWARE: ", req.method, req.url);
    next();
});

// Middleware admin valid
const auth = (req, res, next) => {
    const { password } = req.query;
    if (password != "admin") {
        res.status(401)
        throw new ErrorHandler("Password Tidak Sesuai", 401)
    } else {
        next()
    }
};

app.get("/", (req, res) => {
    res.send("Helo Home");
    console.log("HOME");
});

app.get("/halaman", (req, res) => {
    res.send("Helo Halaman");
});

//  validasi route admin berdasarkan middleware auth yang telah didefinisikan diatas
app.get("/admin", auth, (req, res) => {
    res.status(200).send("Halo Min");
});

// undefine prop error routes
app.get("/error", (req, res) => {
    dog.fly()
});

app.get("/general/error", (req, res) => {
    throw new ErrorHandler()
});

// Kalau ada error program (middleware)
app.use((err, req, res, next) => {
    const { status = 402, message = "Something gone wrong" } = err
    res.status(status).send(message)
})


app.use((req, res) => {
    res.status(404).send("page not found");
});


app.listen(3000, () => {
    console.log("Listening on port http://127.0.0.1:3000");
});
