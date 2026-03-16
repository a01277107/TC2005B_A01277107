const Producto = require('../models/producto');

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
      res.status(500).send('Error al cargar el menú.');
    });
};

exports.getAdmin = (req, res) => {
  Producto.fetchAll()
    .then(([rows]) => {
      res.render('admin', {
        pageTitle: 'Administrador',
        productos: rows,
        usuario: req.session.usuario || null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error al cargar el panel de admin.');
    });
};

exports.postAddProducto = (req, res) => {
  const { nombre, descripcion, precio, imagen, categoria } = req.body;

  const nuevoProducto = new Producto(
    nombre,
    descripcion,
    Number(precio),
    imagen,
    categoria
  );

  nuevoProducto
    .save()
    .then(() => {
      res.redirect('/admin');
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error al guardar el producto.');
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
      res.status(500).send('Error al eliminar el producto.');
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
      res.status(500).send('Error al cargar el producto.');
    });
};
