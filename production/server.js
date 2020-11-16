const process = require('process')
const express = require('express')

const PORT = process.env.PORT || '8000'

const app = express()
app.use(express.static('./build/site'))

app.use('/static/assets', express.static('./build/site/_'))

app.get('/', (req, res) => res.redirect('/developer/'))

app.listen(PORT, () => console.log(`📘 http://localhost:${PORT}`))
