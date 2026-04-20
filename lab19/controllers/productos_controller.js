const Producto = require('../models/producto');

exports.getMenu = async (req, res) => {
  try {
    const [productos] = await Producto.fetchAll();
    res.render('menu', { pageTitle: 'Menú', productos });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { pageTitle: 'Error', mensaje: 'Error al cargar el menú.' });
  }
};

exports.getAddProducto = (req, res) => {
  res.render('producto-add', { pageTitle: 'Agregar Producto' });
};

exports.postAddProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;

    if (!req.file) {
      return res.status(400).render('producto-add', {
        pageTitle: 'Agregar Producto',
        error: 'Debes subir una imagen JPG o PNG.'
      });
    }

    const imagenRuta = '/uploads/' + req.file.filename;
    const producto = new Producto(nombre, descripcion, precio, imagenRuta, categoria);
    await producto.save();
    res.redirect('/menu');
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { pageTitle: 'Error', mensaje: 'Error al guardar el producto.' });
  }
};

exports.postDeleteProducto = async (req, res) => {
  try {
    const { id } = req.body;
    await Producto.deleteById(id);
    res.redirect('/menu');
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { pageTitle: 'Error', mensaje: 'Error al eliminar el producto.' });
  }
};