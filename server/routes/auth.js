const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../database')

router.post('/register', (req, res) => {
    const { username, password } = req.body
    if ( !username || !password ) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    db.get('SELECT id FROM users WHERE username = ?', [username], (err, user) => {
            if (user) {
                return res.status(400).json({ error: 'Username already exists' })
            }
            
            const hash = bcrypt.hashSync(password, 10)
            db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Database error' })
                }
                res.status(201).json({ message: 'User created successfully' })
            })
        })
})

router.post('/login', (req, res) => {
    const { username, password } = req.body
    if ( !username || !password ) {
        return res.status(400).json({ error: 'Username and password are required' })
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(400).json({ error: 'Database error' })
        }

        if ( !user ) {
            return res.status(400).json({ error: 'Invalid username or password' })
        }

        const match = bcrypt.compareSync(password, user.password)
        if ( !match ) {
            return res.status(400).json({ error: 'Invalid username or password' })
        }

        const token = jwt.sign(
            {
                id: user.id, 
                username: user.username
            },
            'your_secret_key',
            { expiresIn: '30d' }
        )
        res.json({ token })
    })
})

module.exports = router