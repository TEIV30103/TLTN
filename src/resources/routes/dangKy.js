var express = require('express')
var router = express.Router()

const dangKyController = require('../controller/dangKyController')

router.get('/',dangKyController.index)
router.post('/',dangKyController.dangKy)


module.exports = router