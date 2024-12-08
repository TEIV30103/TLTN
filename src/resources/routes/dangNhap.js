var express = require('express')
var router = express.Router()

const DangNhapController = require('../controller/DangNhapController')

// router.use('/:slug',)

router.get('/',DangNhapController.index)
router.post('/',DangNhapController.dangNhap)


module.exports = router