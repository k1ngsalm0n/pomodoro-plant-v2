const express = require('express')
const db = require('./database')
const app = express()

// Middleware
// Server read JSON from requests
app.use(express.json())
// Server serve your HTML/CSS/JS files to the browser
app.use(express.static('public'))
app.listen(5001, () => {
        console.log('Server running on port 5001');
})
