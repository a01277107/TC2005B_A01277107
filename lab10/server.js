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
    res.send(`<h1>¡Gracias ${nombre}!</h1><p>Tu registro fue exitoso.</p><a href="/">Volver</a>`);
  });
});

// Ruta del perfil de administrador (lee clientes.txt)
app.get("/admin", (req, res) => {
  fs.readFile("clientes.txt", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).send("Error al leer registros");
    }

    const filas = data
      .trim()
      .split("\n")
      .map(linea => {
        const [nombre, correo, puntos] = linea.split(",");
        return `<tr><td>${nombre}</td><td>${correo}</td><td>${puntos}</td></tr>`;
      })
      .join("");

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Panel de Administrador</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="style.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
        <h1>Panel de Administrador</h1>
        <div class="card" style="margin:20px;">
          <h2>Clientes registrados</h2>
          <table class="table table-striped">
            <thead class="table-light">
              <tr><th>Nombre</th><th>Correo</th><th>Puntos</th></tr>
            </thead>
            <tbody>
              ${filas}
            </tbody>
          </table>
        </div>
        <a href="/" class="btn-app">Volver al inicio</a>
        <footer>
          <a href="/">Inicio</a>
          <a href="/menu">Menú</a>
          <a href="/fidelidad">Rewards</a>
          <a href="/admin">Perfil</a>
        </footer>
      </body>
      </html>
    `);
  });
});


// Manejo de rutas inexistentes → 404
app.use((req, res) => {
  res.status(404).send("<h1>404 - Página no encontrada</h1>");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
