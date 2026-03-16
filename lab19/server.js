const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

const rutas = require('./routes/rutas');
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');

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

const csrfProtection = csrf();
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  res.locals.currentUser = req.session.user || null;
  res.locals.roles = req.session.roles || [];
  res.locals.privilegios = req.session.privilegios || [];
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(authRoutes);
app.use(rutas);
app.use(productosRoutes);

app.use((error, req, res, next) => {
  if (error.code === 'EBADCSRFTOKEN') {
    return res.status(403).render('403', {
      pageTitle: 'Sesión inválida',
      mensaje: 'Tu sesión de formulario expiró o el token CSRF es inválido. Intenta recargar la página.'
    });
  }

  console.log(error);
  res.status(500).render('500', {
    pageTitle: 'Error del servidor',
    mensaje: 'Ocurrió un error inesperado en el servidor.'
  });
});

app.use((req, res) => {
  res.status(404).render('404', { pageTitle: '404 - Página no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
