// Página principal
exports.getIndex = (req, res, next) => {
    const usuario = req.session.usuario || null;
    const visitas = req.session.visitas || 0;
    res.render('index', { pageTitle: 'Inicio', usuario, visitas });
};

// Login: guarda usuario en sesión y cookie
exports.postLogin = (req, res, next) => {
    const usuario = req.body.usuario;
    req.session.usuario = usuario;
    req.session.visitas = 0;
    res.setHeader('Set-Cookie', `usuario=${usuario}; HttpOnly`);
    res.redirect('/menu');
};

// Contador de visitas
exports.getContador = (req, res, next) => {
    if (!req.session.visitas) {
        req.session.visitas = 1;
    } else {
        req.session.visitas++;
    }
    res.render('contador', { 
        pageTitle: 'Contador',
        visitas: req.session.visitas,
        usuario: req.session.usuario || 'Invitado'
    });
};

// Logout: destruye sesión
exports.getLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};