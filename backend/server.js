const usersRoutes = require('./routes/users')
const productsRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/users', usersRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/products', productsRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'E-commerce backend is running'
  })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})