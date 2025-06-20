var express = require('express')
var router = express.Router()

const homeController = require('../controller/homeController')

router.get('/',homeController.index)
router.get('/bxh',homeController.bxh)
router.get('/bxhCN',homeController.bxhCN)
router.get('/loadAvt',homeController.loadAvt)
router.get('/loadAvtUser',homeController.loadAvtUser)
router.get('/winGame',homeController.winGame)
router.get('/themLSD',homeController.themLSD)

module.exports = router