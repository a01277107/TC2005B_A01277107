const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3009;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Middleware integrado en Express para procesar formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta principal: inicio
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "rutas.html"));
});

// Ruta del menú
app.get("/menu", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "menu.html"));
});

// Ruta del sistema de fidelidad
app.get("/fidelidad", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "fidelidad.html"));
});

// Procesar formulario de fidelidad (POST)
app.post("/fidelidad", (req, res) => {
  const { nombre, correo, puntos } = req.body;
  const registro = `${nombre}, ${correo}, ${puntos}\n`;

  fs.appendFile("clientes.txt", registro, (err) => {
    if (err) {
      return res.status(500).send("Error al guardar los datos");
    }
    res.send(`<h1>¡Gracias ${nombre}!</h1><p>Tu registro fue exitoso.</p>`);
  });
});

// Ruta del perfil de administrador
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Manejo de rutas inexistentes → 404
app.use((req, res) => {
  res.status(404).send("<h1>404 - Página no encontrada</h1>");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
