const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const rutas = require('./routes/rutas');
const productosRoutes = require('./routes/productos');

const app = express();
const PORT = 3009;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'maree_crepe_secret_session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, 'public')));

app.use(rutas);
app.use(productosRoutes);

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: '404 - Página no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${3009}`);
});
