const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', (req, res) => {
  const { user, password } = req.body;

  if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ user: user }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

module.exports = router;
