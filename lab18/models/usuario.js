const db = require('../util/database');
const bcrypt = require('bcryptjs');

class Usuario {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  save() {
    return Usuario.findByUsername(this.username)
      .then(([rows]) => {
        if (rows.length > 0) {
          throw new Error('El usuario ya existe');
        }

        return bcrypt.hash(this.password, 12);
      })
      .then((hashedPassword) => {
        return db.execute(
          'INSERT INTO usuarios (username, password) VALUES (?, ?)',
          [this.username, hashedPassword]
        );
      })
      .catch((err) => {
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
}

module.exports = Usuario;
