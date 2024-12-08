var express = require('express')
var router = express.Router()

const gameController = require('../controller/gameController')

router.get('/',gameController.index)


module.exports = router