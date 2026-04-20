const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql-maree2.alwaysdata.net',
  user: 'maree2',
  password: 'maree123',
  database: 'maree2_labs',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
