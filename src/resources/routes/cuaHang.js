var express = require('express')
var router = express.Router()

const cuaHangController = require('../controller/cuaHangController')

router.get('/',cuaHangController.index)
router.get('/avatarSH',cuaHangController.avatarSH)
router.get('/khungSH',cuaHangController.khungSH)
router.get('/QCSH',cuaHangController.QCSH)

router.get('/avatarCH',cuaHangController.avatarCH)
router.get('/khungCH',cuaHangController.khungCH)
router.get('/QCCH',cuaHangController.QCCH)

router.get('/doiQC',cuaHangController.doiQC)
router.get('/doiAvatar',cuaHangController.doiAvatar)
router.get('/doiKhung',cuaHangController.doiKhung)

router.get('/muaQC',cuaHangController.muaQC)
router.get('/muaAvatar',cuaHangController.muaAvatar)
router.get('/muaKhung',cuaHangController.muaKhung)

router.get('/doiTenUser',cuaHangController.doiTen)
router.get('/doiMatKhauUser',cuaHangController.doiMatKhau)

router.get('/lichSuDau',cuaHangController.lichSuDau)

router.get('/loadAvtID',cuaHangController.loadAvtID)

module.exports = router