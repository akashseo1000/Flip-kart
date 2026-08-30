const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../config/db')
const authenticateToken = require('./authMiddleware')

const router = express.Router()

const JWT_SECRET = 'flipkart_clone_secret_key'

router.get('/test', (req, res) => {
  res.json({
    message: 'Users route is working'
  })
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    const [existingUser] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: 'Email already registered'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.promise().query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    res.status(201).json({
      message: 'User registered successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    const [users] = await db.promise().query(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const user = users[0]

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      })
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.promise().query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    const [addresses] = await db.promise().query(
      `SELECT
        id,
        full_name,
        phone,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude
       FROM user_addresses
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [req.user.id]
    )

    res.status(200).json({
      user: users[0],
      address: addresses.length > 0 ? addresses[0] : null
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

router.post('/profile/address', authenticateToken, async (req, res) => {
  try {
    const {
      full_name,
      phone,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude
    } = req.body

    if (
      !full_name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: 'All address fields are required'
      })
    }

    const [existingAddress] = await db.promise().query(
      `SELECT id
       FROM user_addresses
       WHERE user_id = ?
       LIMIT 1`,
      [req.user.id]
    )

    if (existingAddress.length > 0) {
      await db.promise().query(
        `UPDATE user_addresses
         SET
           full_name = ?,
           phone = ?,
           address = ?,
           city = ?,
           state = ?,
           pincode = ?,
           latitude = ?,
           longitude = ?
         WHERE user_id = ?`,
        [
          full_name,
          phone,
          address,
          city,
          state,
          pincode,
          latitude || null,
          longitude || null,
          req.user.id
        ]
      )
    } else {
      await db.promise().query(
        `INSERT INTO user_addresses
        (
          user_id,
          full_name,
          phone,
          address,
          city,
          state,
          pincode,
          latitude,
          longitude
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          full_name,
          phone,
          address,
          city,
          state,
          pincode,
          latitude || null,
          longitude || null
        ]
      )
    }

    res.status(200).json({
      message: 'Address saved successfully'
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

module.exports = router

module.exports = router