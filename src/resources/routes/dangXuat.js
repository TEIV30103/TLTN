var express = require('express')
var router = express.Router()

const dangXuatController = require('../controller/dangXuatController')

router.get('/',dangXuatController.index)


module.exports = router