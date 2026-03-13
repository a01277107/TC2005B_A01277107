const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

const productosRoutes = require("./routes/productos");
const rutas = require("./routes/rutas");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: 'mi string secreto muy largo',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use(rutas);
app.use(productosRoutes);

app.get("/fidelidad", (req, res) => {
  res.render("fidelidad");
});

// Ruta inexistente → 404
app.use((req, res) => {
  res.status(404).send("<h1>404 - Página no encontrada</h1>");
});

app.listen(3009, () => {
  console.log("Servidor corriendo en http://localhost:3009");
});



