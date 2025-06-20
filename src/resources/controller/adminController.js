const adminModel = require('../model/admin');
const db = require('../model/connect_DB');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');

class AdminController {
    // Trang dashboard admin
    index(req, res) {
        if(req.session.username != null && req.session.quyen == 0)
            res.render('admin',  {
                username: req.session.username, 
                tenNguoiDung: req.session.tenNguoiDung,
                imgAvt: req.session.imgAvt,
                imgKhung: req.session.imgKhung,
                quyen: req.session.quyen
            });
        else res.redirect('/dangNhap'); 
    }

    // Trang quản lý người dùng
    usersPartial(req, res) {
        adminModel.getUsers((err, users) => {
            if (err) return res.send('Lỗi lấy danh sách user!');
            res.render('partials/admin_users_table', { users, layout: false });
        });
    }

    deleteUser(req, res) {
        const id = req.params.id;
        adminModel.deleteUser(id, (err) => {
            if (err) return res.status(500).send('Lỗi xóa user!');
            res.send('OK');
        });
    }

    editUser(req, res) {
        const { ten, matKhau, quyen, khoa } = req.body;
        const id = req.params.id;
        adminModel.editUser(id, ten, md5(matKhau), quyen, khoa, (err, result) => {
            if (err) return res.status(500).send('Lỗi sửa user!');
            res.send('OK');
        });
    }

    addUser(req, res) {
        const { taiKhoan, ten, matKhau, quyen, khoa } = req.body;
        adminModel.addUser(taiKhoan, ten, md5(matKhau), quyen, khoa, (err, result) => {
            if (err) return res.status(500).send('Lỗi thêm user!');
            res.send('OK');
        });
    }

    avatarsPartial(req, res) {
        adminModel.getAvatars((err, avatars) => {
            if (err) return res.send('Lỗi lấy danh sách avatar!');
            res.render('partials/admin_avatars_table', { avatars, layout: false });
        });
    }

    deleteAvatar(req, res) {
        const id = req.params.id;
        adminModel.deleteAvatar(id, (err) => {
            if (err) return res.status(500).send(err);
            res.send('OK');
        });
    }

    editAvatar(req, res) {
        const id = req.params.id;
        const file = req.file;
        adminModel.editAvatar(id, file, (err, result) => {
            if (err) {
                console.error('Lỗi sửa avatar:', err);
                return res.status(500).send('Lỗi sửa avatar!');
            }
            res.send('OK');
        });
    }

    addAvatar(req, res) {
        const file = req.file;
        adminModel.addAvatar(file, (err) => {
            if (err) return res.status(500).send('Lỗi thêm avatar!');
            res.send('OK');
        });
    }

    khungPartial(req, res) {
        adminModel.getKhungs((err, khungs) => {
            if (err) return res.send('Lỗi lấy danh sách khung!');
            res.render('partials/admin_khung_table', { khungs, layout: false });
        });
    }

    deleteKhung(req, res) {
        const id = req.params.id;
        adminModel.deleteKhung(id, (err) => {
            if (err) return res.status(500).send('Lỗi xóa khung!');
            res.send('OK');
        });
    }

    editKhung(req, res) {
        const id = req.params.id;
        const file = req.file;
        adminModel.editKhung(id, file, (err, result) => {
            if (err) {
                console.error('Lỗi sửa khung:', err);
                return res.status(500).send('Lỗi sửa khung!');
            }
            res.send('OK');
        });
    }

    addKhung(req, res) {
        const file = req.file;
        adminModel.addKhung(file, (err) => {
            if (err) return res.status(500).send('Lỗi thêm khung!');
            res.send('OK');
        });
    }

    addQuanco(req, res) {
        const files = req.files;
        adminModel.addQuanco(files, (err) => {
            if (err) return res.status(500).send('Lỗi thêm quân cờ!');
            res.send('OK');
        });
    }

    editQuanco(req, res) {
        const id = req.params.id;
        const files = req.files;
        adminModel.editQuanco(id, files, (err, data) => {
            if (err) return res.status(500).send('Lỗi sửa quân cờ!');
            // Lưu vào session nếu muốn
            req.session.x = data.imgX;
            req.session.o = data.imgO;
            res.send('OK');
        });
    }

    deleteQuanco(req, res) {
        const id = req.params.id;
        adminModel.deleteQuanco(id, (err) => {
            if (err) return res.status(500).send('Lỗi xóa quân cờ!');
            res.send('OK');
        });
    }

    quancoPartial(req, res) {
        adminModel.getQuancos((err, quancos) => {
            if (err) return res.send('Lỗi lấy danh sách quân cờ!');
            res.render('partials/admin_quanco_table', { quancos, layout: false });
        });
    }
}

module.exports = new AdminController();