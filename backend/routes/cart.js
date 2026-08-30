const express = require('express')
const db = require('../config/db')
const authenticateToken = require('./authMiddleware')

const router = express.Router()

// Get logged-in user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [cart] = await db.promise().query(
      `SELECT
        cart.id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price,
        products.image
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.user_id = ?`,
      [req.user.id]
    )

    res.status(200).json({
      cart
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

// Add product to cart
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity } = req.body

    if (!product_id) {
      return res.status(400).json({
        message: 'Product ID is required'
      })
    }

    const productQuantity = quantity || 1

    const [products] = await db.promise().query(
      'SELECT id, stock FROM products WHERE id = ?',
      [product_id]
    )

    if (products.length === 0) {
      return res.status(404).json({
        message: 'Product not found'
      })
    }

    if (products[0].stock < productQuantity) {
      return res.status(400).json({
        message: 'Not enough stock available'
      })
    }

    await db.promise().query(
      `INSERT INTO cart (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
       quantity = quantity + VALUES(quantity)`,
      [req.user.id, product_id, productQuantity]
    )

    res.status(201).json({
      message: 'Product added to cart'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

// Update cart item quantity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be at least 1'
      })
    }

    const [cartItems] = await db.promise().query(
      `SELECT cart.id, products.stock
       FROM cart
       JOIN products ON cart.product_id = products.id
       WHERE cart.id = ? AND cart.user_id = ?`,
      [req.params.id, req.user.id]
    )

    if (cartItems.length === 0) {
      return res.status(404).json({
        message: 'Cart item not found'
      })
    }

    if (quantity > cartItems[0].stock) {
      return res.status(400).json({
        message: 'Not enough stock available'
      })
    }

    await db.promise().query(
      `UPDATE cart
       SET quantity = ?
       WHERE id = ? AND user_id = ?`,
      [quantity, req.params.id, req.user.id]
    )

    res.status(200).json({
      message: 'Cart quantity updated'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})


router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const cartId = req.params.id

    const [result] = await db.promise().query(
      `DELETE FROM cart
       WHERE id = ? AND user_id = ?`,
      [cartId, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Cart item not found'
      })
    }

    res.status(200).json({
      message: 'Product removed from cart'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})


module.exports = router