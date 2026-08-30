const db = require('./config/db')

db.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err.message)
    return
  }

  console.log('Database connected successfully!')

  connection.release()
})