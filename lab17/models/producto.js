const db = require('../util/database');

class Producto {
  constructor(nombre, descripcion, precio, imagen, categoria) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagen = imagen;
    this.categoria = categoria;
  }

  save() {
    return db.execute(
      'INSERT INTO productos (nombre, descripcion, precio, imagen, categoria) VALUES (?, ?, ?, ?, ?)',
      [this.nombre, this.descripcion, this.precio, this.imagen, this.categoria]
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM productos ORDER BY id DESC');
  }

  static findById(id) {
    return db.execute('SELECT * FROM productos WHERE id = ?', [id]);
  }

  static deleteById(id) {
    return db.execute('DELETE FROM productos WHERE id = ?', [id]);
  }
}

module.exports = Producto;
