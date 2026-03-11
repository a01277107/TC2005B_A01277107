const productos = [];

module.exports = class Producto {
  constructor(nombre, precio, descripcion, imagen, categoria) {
    this.nombre = nombre;
    this.precio = precio;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.categoria = categoria; 
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
