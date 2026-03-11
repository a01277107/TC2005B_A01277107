const Producto = require("../models/producto");

// Mostrar menú al cliente
exports.getMenu = (req, res, next) => {
  const productos = Producto.fetchAll();
  res.render("menu", { pageTitle: "Menú", productos: productos });
};

// Mostrar panel admin
exports.getAdmin = (req, res, next) => {
  const productos = Producto.fetchAll();
  res.render("admin", { pageTitle: "Panel Admin", productos: productos });
};

// Agregar producto
  exports.postAdd = (req, res, next) => {
  const { nombre, precio, descripcion, imagen, categoria } = req.body;
  const producto = new Producto(nombre, precio, descripcion, imagen, categoria);
  producto.save();
  res.redirect("/admin");
};

// Eliminar producto
exports.postDelete = (req, res, next) => {
  const nombre = req.body.nombre;
  Producto.delete(nombre);
  res.redirect("/admin");
};

