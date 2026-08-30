const mysql = require('mysql2')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Samanta@2628',
  database: 'flipkart_clone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

module.exports = db