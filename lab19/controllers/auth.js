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

  let authenticatedUser;

  Usuario.findByUsername(username.trim())
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(422).render('login', {
          pageTitle: 'Iniciar sesión',
          error: 'Usuario o contraseña incorrectos.',
        });
      }

      const user = rows[0];
      authenticatedUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((doMatch) => {
      if (doMatch === undefined) {
        return;
      }

      if (!doMatch) {
        return res.status(422).render('login', {
          pageTitle: 'Iniciar sesión',
          error: 'Usuario o contraseña incorrectos.',
        });
      }

      return Usuario.fetchRolesAndPrivilegesByUserId(authenticatedUser.id)
        .then(([[roleRows], [privilegeRows]]) => {
          req.session.isLoggedIn = true;
          req.session.user = {
            id: authenticatedUser.id,
            username: authenticatedUser.username,
          };
          req.session.usuario = authenticatedUser.username;
          req.session.roles = roleRows.map((role) => role.nombre);
          req.session.privilegios = privilegeRows.map((privilege) => privilege.clave);

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
