const productos = [];

module.exports = class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }

  save() {
    productos.push(this);
  }

  static fetchAll() {
    return productos;
  }

  static delete(nombre) {
    const index = productos.findIndex(p => p.nombre === nombre);
    if (index !== -1) {
      productos.splice(index, 1);
    }
  }
};