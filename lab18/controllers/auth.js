const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');

exports.getRoot = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/inicio');
  }
  res.redirect('/login');
};

exports.getLogin = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/inicio');
  }

  res.render('login', {
    pageTitle: 'Iniciar sesión',
    error: null,
  });
};

exports.postLogin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).render('login', {
      pageTitle: 'Iniciar sesión',
      error: 'Debes capturar usuario y contraseña.',
    });
  }

  Usuario.findByUsername(username.trim())
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(422).render('login', {
          pageTitle: 'Iniciar sesión',
          error: 'Usuario o contraseña incorrectos.',
        });
      }

      const user = rows[0];

      return bcrypt.compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res.status(422).render('login', {
              pageTitle: 'Iniciar sesión',
              error: 'Usuario o contraseña incorrectos.',
            });
          }

          req.session.isLoggedIn = true;
          req.session.user = {
            id: user.id,
            username: user.username,
          };
          req.session.usuario = user.username;
          if (!req.session.visitas) {
            req.session.visitas = 0;
          }

          return req.session.save((err) => {
            if (err) {
              console.log(err);
              return res.redirect('/login');
            }
            res.redirect('/inicio');
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render('login', {
        pageTitle: 'Iniciar sesión',
        error: 'No se pudo procesar el inicio de sesión.',
      });
    });
};

exports.getRegister = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/inicio');
  }

  res.render('register', {
    pageTitle: 'Registro',
    error: null,
  });
};

exports.postRegister = (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(422).render('register', {
      pageTitle: 'Registro',
      error: 'Debes llenar todos los campos.',
    });
  }

  if (password !== confirmPassword) {
    return res.status(422).render('register', {
      pageTitle: 'Registro',
      error: 'Las contraseñas no coinciden.',
    });
  }

  if (password.length < 6) {
    return res.status(422).render('register', {
      pageTitle: 'Registro',
      error: 'La contraseña debe tener al menos 6 caracteres.',
    });
  }

  const usuario = new Usuario(username.trim(), password);

  usuario
    .save()
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      res.status(422).render('register', {
        pageTitle: 'Registro',
        error: err.message || 'No se pudo registrar el usuario.',
      });
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('usuario');
    res.redirect('/login');
  });
};
