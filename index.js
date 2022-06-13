const express = require('express')
const { dbConnection } = require('./database/config')
require('dotenv').config()
const cors = require('cors')

const app = express()

dbConnection()

app.use(cors())

app.use(express.static('public'))

app.use(express.json())

// TODO: Add routes to /api/auth

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
