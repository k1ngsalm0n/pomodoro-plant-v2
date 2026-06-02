const express = require('express');
const router = express.Router();
const db = require('../database');
const authToken = require('../middleware/auth/');

router.get('/', authToken, (req, res) => {
    const userId = req.user.id;
    db.all('SELECT flower_id, count, first_unlocked_at FROM collection WHERE user_id = ?', [userId], (err, collection) => {
        if (err) {
            return res.status(500).json( { error: 'Database error' })
        }
        res.json(collection || []);
    });
});

module.exports = router;