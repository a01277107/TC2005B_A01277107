exports.getInicio = (req, res) => {
  res.render('inicio', {
    pageTitle: 'Inicio',
    usuario: req.session.usuario || null,
  });
};

exports.getContador = (req, res) => {
  if (!req.session.visitas) {
    req.session.visitas = 1;
  } else {
    req.session.visitas += 1;
  }

  res.render('contador', {
    pageTitle: 'Contador',
    visitas: req.session.visitas,
    usuario: req.session.usuario || 'Invitado',
  });
};

exports.getFidelidad = (req, res) => {
  res.render('fidelidad', {
    pageTitle: 'Rewards',
    usuario: req.session.usuario || null,
    mensaje: null,
  });
};

exports.postFidelidad = (req, res) => {
  const { nombre, correo, puntos } = req.body;

  res.render('fidelidad', {
    pageTitle: 'Rewards',
    usuario: req.session.usuario || null,
    mensaje: `Registro recibido para ${nombre} con correo ${correo} y ${puntos || 0} puntos iniciales.`,
  });
};
