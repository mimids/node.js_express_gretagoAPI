const express = require('express')
require('dotenv').config()

var router = express.Router()

router.use(function timelog(req, res, next) {
  console.log('time ', Date.now)
  next()
})

router.get('/', (req, res) => {
  res.send('welcome on bord!')
})

router.get('/about', (req, res) => {
  res.send('About!')
})

module.exports = router