const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'admin',          
  password: 'ingenioware26$$', 
  database: 'ingenioware_db',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
});

module.exports = pool.promise();