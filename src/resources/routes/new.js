var express = require('express')
var router = express.Router()

const newsController = require('../controller/NewsController')

router.use('/:slug',newsController.show)

router.use('/',newsController.index)


module.exports = router