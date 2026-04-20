const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

exports.getMenu = (req, res) => {
  Producto.fetchAll()
    .then(([rows]) => {
      res.render('menu', {
        pageTitle: 'Menú',
        productos: rows,
        usuario: req.session.usuario || null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render('500', {
        pageTitle: 'Error del servidor',
        mensaje: 'No se pudo cargar el menú.'
      });
    });
};

exports.getAdmin = (req, res) => {
  Promise.all([
    Producto.fetchAll(),
    Usuario.fetchAllWithRoles(),
    Usuario.fetchAllRoles()
  ])
    .then(([[productos], [usuarios], [roles]]) => {
      res.render('admin', {
        pageTitle: 'Administrador',
        productos,
        usuarios,
        roles,
        usuario: req.session.usuario || null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render('500', {
        pageTitle: 'Error del servidor',
        mensaje: 'No se pudo cargar el panel de administración.'
      });
    });
};


exports.postAddProducto = (req, res) => {
  const { nombre, descripcion, precio, categoria } = req.body;

  if (!req.file) {
    return res.status(400).render('admin', {
      pageTitle: 'Administrador',
      mensaje: 'Debes subir una imagen JPG o PNG.'
    });
  }

  const imagen = '/uploads/' + req.file.filename;

  const nuevoProducto = new Producto(nombre, descripcion, Number(precio), imagen, categoria);

  nuevoProducto
    .save()
    .then(() => res.redirect('/admin'))
    .catch((err) => {
      console.log(err);
      res.status(500).render('500', {
        pageTitle: 'Error del servidor',
        mensaje: 'No se pudo guardar el producto.'
      });
    });
};


exports.postDeleteProducto = (req, res) => {
  const { id } = req.body;

  Producto.deleteById(id)
    .then(() => {
      res.redirect('/admin');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render('500', {
        pageTitle: 'Error del servidor',
        mensaje: 'No se pudo eliminar el producto.'
      });
    });
};

exports.postUpdateUserRoles = (req, res) => {
  const { idUsuario } = req.body;
  const roleIds = req.body.roles;

  Usuario.replaceRoles(idUsuario, roleIds)
    .then(() => {
      if (req.session.user && Number(req.session.user.id) === Number(idUsuario)) {
        return Usuario.fetchRolesAndPrivilegesByUserId(idUsuario)
          .then(([[roleRows], [privilegeRows]]) => {
            req.session.roles = roleRows.map((role) => role.nombre);
            req.session.privilegios = privilegeRows.map((privilege) => privilege.clave);
            return new Promise((resolve) => req.session.save(() => resolve()));
          });
      }
    })
    .then(() => {
      res.redirect('/admin');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render('500', {
        pageTitle: 'Error del servidor',
        mensaje: 'No se pudo actualizar el rol del usuario.'
      });
    });
};

exports.getProducto = (req, res) => {
  const id = req.params.producto_id;

  Producto.findById(id)
    .then(([rows]) => {
      if (rows.length === 0) {
        return res.status(404).render('404', { pageTitle: 'Producto no encontrado' });
      }

      res.render('producto-detalle', {
        pageTitle: rows[0].nombre,
        producto: rows[0],
        usuario: req.session.usuario || null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).render('500', {
        pageTitle: 'Error del servidor',
        mensaje: 'No se pudo cargar el producto.'
      });
    });
};
