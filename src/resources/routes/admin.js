const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');
const uploadAvatar = multer({ dest: path.join(__dirname, '../../resources/public/img/avatar/') });
const uploadKhung = multer({ dest: path.join(__dirname, '../../resources/public/img/khung/') });
const uploadQC = multer({ dest: path.join(__dirname, '../../resources/public/img/BC/') });

const adminController = require('../controller/adminController');

router.get('/', adminController.index);

router.get('/users-partial', adminController.usersPartial);
router.delete('/user/:id', adminController.deleteUser);
router.put('/user/:id', adminController.editUser);
router.post('/user', adminController.addUser);

router.get('/avatars-partial', adminController.avatarsPartial);
router.delete('/avatar/:id', adminController.deleteAvatar);
router.put('/avatar/:id', uploadAvatar.single('avatarSua'), adminController.editAvatar);
router.post('/avatar', uploadAvatar.single('avatar'), adminController.addAvatar);


router.get('/khung-partial', adminController.khungPartial);
router.delete('/khung/:id', adminController.deleteKhung);
router.put('/khung/:id', uploadKhung.single('khung'), adminController.editKhung);
router.post('/khung', uploadKhung.single('khung'), adminController.addKhung);

router.get('/quanco-partial', adminController.quancoPartial);
router.delete('/quanco/:id', adminController.deleteQuanco);
router.put('/quanco/:id', uploadQC.fields([{ name: 'imgX' }, { name: 'imgO' }]), adminController.editQuanco);
router.post('/quanco', uploadQC.fields([{ name: 'imgX' }, { name: 'imgO' }]), adminController.addQuanco);

module.exports = router;