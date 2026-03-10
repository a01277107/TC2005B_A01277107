const express = require("express");
const path = require("path");

const app = express();
const productosRoutes = require("./routes/productos");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rutas de productos
app.use(productosRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

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








