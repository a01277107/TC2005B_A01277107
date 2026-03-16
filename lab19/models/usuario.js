const db = require('../util/database');
const bcrypt = require('bcryptjs');

class Usuario {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  save() {
    let connection;

    return Usuario.findByUsername(this.username)
      .then(([rows]) => {
        if (rows.length > 0) {
          throw new Error('El usuario ya existe');
        }
        return bcrypt.hash(this.password, 12);
      })
      .then((hashedPassword) => db.getConnection().then((conn) => {
        connection = conn;
        return connection.beginTransaction()
          .then(() => connection.execute(
            'INSERT INTO usuarios (username, password) VALUES (?, ?)',
            [this.username, hashedPassword]
          ))
          .then(([result]) => connection.execute(
            `INSERT INTO usuario_rol (id_usuario, id_rol)
             SELECT ?, id FROM roles WHERE nombre = 'cliente'`,
            [result.insertId]
          ))
          .then(() => connection.commit())
          .then(() => true)
          .catch((err) => {
            return connection.rollback().then(() => { throw err; });
          })
          .finally(() => connection.release());
      }))
      .catch((err) => {
        if (connection) {
          try { connection.release(); } catch (e) {}
        }
        if (err.code === 'ER_DUP_ENTRY') {
          throw new Error('El usuario ya existe');
        }
        throw err;
      });
  }

  static findByUsername(username) {
    return db.execute('SELECT * FROM usuarios WHERE username = ?', [username]);
  }

  static findById(id) {
    return db.execute('SELECT * FROM usuarios WHERE id = ?', [id]);
  }

  static fetchRolesAndPrivilegesByUserId(idUsuario) {
    const rolesQuery = `
      SELECT DISTINCT r.nombre
      FROM usuario_rol ur
      INNER JOIN roles r ON ur.id_rol = r.id
      WHERE ur.id_usuario = ?
      ORDER BY r.nombre
    `;

    const privilegesQuery = `
      SELECT DISTINCT p.clave
      FROM usuario_rol ur
      INNER JOIN rol_privilegio rp ON ur.id_rol = rp.id_rol
      INNER JOIN privilegios p ON rp.id_privilegio = p.id
      WHERE ur.id_usuario = ?
      ORDER BY p.clave
    `;

    return Promise.all([
      db.execute(rolesQuery, [idUsuario]),
      db.execute(privilegesQuery, [idUsuario])
    ]);
  }

  static fetchAllWithRoles() {
    const query = `
      SELECT u.id, u.username, COALESCE(GROUP_CONCAT(r.nombre ORDER BY r.nombre SEPARATOR ', '), 'Sin rol') AS roles
      FROM usuarios u
      LEFT JOIN usuario_rol ur ON u.id = ur.id_usuario
      LEFT JOIN roles r ON ur.id_rol = r.id
      GROUP BY u.id, u.username
      ORDER BY u.id ASC
    `;

    return db.execute(query);
  }

  static fetchAllRoles() {
    return db.execute('SELECT id, nombre, descripcion FROM roles ORDER BY nombre ASC');
  }

  static replaceRoles(idUsuario, roleIds) {
    let connection;
    const cleaned = Array.isArray(roleIds) ? roleIds : [roleIds];
    const normalized = cleaned
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

    return db.getConnection().then((conn) => {
      connection = conn;
      return connection.beginTransaction()
        .then(() => connection.execute('DELETE FROM usuario_rol WHERE id_usuario = ?', [idUsuario]))
        .then(() => {
          if (normalized.length === 0) {
            return Promise.resolve();
          }
          const values = normalized.map((idRol) => [Number(idUsuario), idRol]);
          return connection.query('INSERT INTO usuario_rol (id_usuario, id_rol) VALUES ?', [values]);
        })
        .then(() => connection.commit())
        .then(() => true)
        .catch((err) => connection.rollback().then(() => { throw err; }))
        .finally(() => connection.release());
    });
  }
}

module.exports = Usuario;
