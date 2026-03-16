module.exports = (permisoRequerido) => {
  return (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.redirect('/login');
    }

    const privilegios = req.session.privilegios || [];

    if (!privilegios.includes(permisoRequerido)) {
      return res.status(403).render('403', {
        pageTitle: 'Acceso denegado',
        mensaje: 'No cuentas con el permiso requerido para acceder a esta sección.'
      });
    }

    next();
  };
};
