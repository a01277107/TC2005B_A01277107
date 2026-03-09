const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3009;

// Configuración de EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/menu", (req, res) => {
  res.render("menu");
});

app.get("/fidelidad", (req, res) => {
  res.render("fidelidad");
});

app.post("/fidelidad", (req, res) => {
  const { nombre, correo, puntos } = req.body;
  const registro = `${nombre}, ${correo}, ${puntos}\n`;

  fs.appendFile("clientes.txt", registro, (err) => {
    if (err) return res.status(500).send("Error al guardar los datos");
    res.redirect("/admin"); // después de registrar, redirige al panel
  });
});

app.get("/admin", (req, res) => {
  fs.readFile("clientes.txt", "utf-8", (err, data) => {
    if (err) return res.status(500).send("Error al leer registros");

    const clientes = data.trim().split("\n").map(linea => {
      const [nombre, correo, puntos] = linea.split(",");
      return { nombre, correo, puntos };
    });

    res.render("admin", { clientes });
  });
});

// Ruta inexistente → 404
app.use((req, res) => {
  res.status(404).send("<h1>404 - Página no encontrada</h1>");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
