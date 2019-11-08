const express = require('express')
const router = express.Router()
const helper = require('../util/news-helper')

router.get('/news', async (req, res) => {
  const data = await helper.getDataFeed()
  console.log(data)

  if (data === null) {
    res.status(200).json({
      isError: true,
      message: 'server error try after some time!'
    })
  } else {
    res.status(200).json(data)
  }
})

module.exports = router
