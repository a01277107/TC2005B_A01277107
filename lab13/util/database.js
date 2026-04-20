const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'crepas_maree',
    password: 'tu_password'
});

module.exports = pool.promise();
