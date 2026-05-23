const jwt = require('jsonwebtoken')

const authToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'No token provided' })
    }
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }
        req.user = decoded
        next()
    })
}

module.exports = authToken