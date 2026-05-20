const express = require('express')
const db = require('./database')
const app = express()
const authRoutes = require('./routes/auth')

// Middleware
// Server read JSON from requests
app.use(express.json())
// Server serve your HTML/CSS/JS files to the browser
app.use(express.static('public'))
app.use('/api/auth', authRoutes)

const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`http://localhost:${port}`)
})
