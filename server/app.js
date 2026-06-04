const express = require('express')
const db = require('./database')
const app = express()
const authRoutes = require('./routes/auth')
const plantRoutes = require('./routes/plant')
const collectionRoutes = require('./routes/collection')

// Middleware
// Server read JSON from requests
app.use(express.json())
// Server serve your HTML/CSS/JS files to the browser
app.use(express.static('public'))

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/plant', plantRoutes)
app.use('/api/collection', collectionRoutes)

const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`http://localhost:${port}`)
})

