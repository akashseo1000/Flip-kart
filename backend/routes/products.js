const express = require('express')
const db = require('../config/db')
const authenticateToken = require('./authMiddleware')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [products] = await db.promise().query(
      'SELECT * FROM products ORDER BY created_at DESC'
    )

    res.status(200).json({
      products
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [products] = await db.promise().query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    )

    if (products.length === 0) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }

    res.status(200).json({
      product: products[0]
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      original_price,
      discount,
      category,
      brand,
      stock,
      image
    } = req.body

    if (!name || price === undefined) {
      return res.status(400).json({
        message: 'Product name and price are required'
      })
    }

    const [result] = await db.promise().query(
      `INSERT INTO products
      (name, description, price, original_price, discount, category, brand, stock, image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        price,
        original_price || null,
        discount || 0,
        category || null,
        brand || null,
        stock || 0,
        image || null
      ]
    )

    res.status(201).json({
      message: 'Product created successfully',
      productId: result.insertId
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const {
      name,
      description,
      price,
      original_price,
      discount,
      category,
      brand,
      stock,
      image
    } = req.body

    const [existingProduct] = await db.promise().query(
      'SELECT id FROM products WHERE id = ?',
      [id]
    )

    if (existingProduct.length === 0) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }

    await db.promise().query(
      `UPDATE products
       SET name = ?,
           description = ?,
           price = ?,
           original_price = ?,
           discount = ?,
           category = ?,
           brand = ?,
           stock = ?,
           image = ?
       WHERE id = ?`,
      [
        name,
        description || null,
        price,
        original_price || null,
        discount || 0,
        category || null,
        brand || null,
        stock || 0,
        image || null,
        id
      ]
    )

    res.status(200).json({
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

module.exports = router