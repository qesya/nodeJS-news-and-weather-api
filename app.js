const express = require('express')
const app = express()
const constants = require('./util/enviroment')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const news = require('./api/news')
app.use('/api/', news)

app.listen(constants.PORT, () => console.log(`server running on port: ${constants.PORT}`))
