const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const user = { userId: 'user123', email: 'vivek@example.com', role: 'admin' };
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

module.exports = router;