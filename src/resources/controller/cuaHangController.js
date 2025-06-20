const avatarSHDB = require('../model/avatarSH')
const khungSHDB = require('../model/khungSH')
const QCSHDB = require('../model/quanCoSH')

const avatarCHDB = require('../model/avatarCH')
const khungCHDB = require('../model/khungCH')
const QCCHDB = require('../model/quanCoCH')

const doiAvatarDB = require('../model/doiAvatar')
const doiKhungDB = require('../model/doiKhung')
const doiQCDB = require('../model/doiQC')


const loadAvt = require('../model/loadAVT')
const loadAvtID = require('../model/loadAVT_id')

const muaAvatarDB = require('../model/muaAvatar')
const muaKhungDB = require('../model/muaKhung')
const muaQCDB = require('../model/muaQC')

const doiTenUserDB = require('../model/doiTenUser')
const doiMatKhauUserDB = require('../model/doiMatKhauUser')
const lichSuDauDB = require('../model/lichSuDau');

const db = require('../model/connect_DB');
const md5 = require('md5');



class cuaHangController{
    index(req,res){
        if(req.session.username != null){
            res.render('cuaHang',  {username: req.session.username, 
                                tenNguoiDung: req.session.tenNguoiDung,
                                imgAvt: req.session.imgAvt,
                                imgKhung: req.session.imgKhung,
                                x: req.session.x,
                                o: req.session.o,
                                idUser: req.session.idUser,
                                quyen: req.session.quyen});
        }
        else res.redirect('/dangNhap');  
    }

    avatarSH(req, res) {
        avatarSHDB(req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn avatar SH' });
            res.json(results);
        });
    }

    khungSH(req, res) {
        khungSHDB(req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn khung SH' });
            res.json(results);
        });
    }

    QCSH(req, res) {
        QCSHDB(req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn QC SH' });
            res.json(results);
        });
    }

    avatarCH(req, res) {
        avatarCHDB((error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn avatar CH' });
            res.json(results);
        });
    }
    
    khungCH(req, res) {
        khungCHDB((error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn khung CH' });
            res.json(results);
        });
    }

    QCCH(req, res) {
        QCCHDB((error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn QC CH' });
            res.json(results);
        });
    }

    doiAvatar(req, res) {
        const idAvt = req.query.idAvt;
        // const username = req.query.username;
        doiAvatarDB(idAvt, req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi cập nhật avatar' });

            loadAvt(req.session.username, (error2, results) => {
                if (error2) return res.status(500).json({ error: 'Lỗi tải avatar và khung' });


                req.session.imgAvt = results[0].avt;

                res.json({ success: true, imgAvt: results[0].avt });
            });
        });
    }

    doiQC(req, res) {
        const idQC= req.query.idQC;
        doiQCDB(idQC, req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi cập nhật QC' });
            db.query('SELECT * FROM quanco WHERE idQC = ?', [idQC], (error2, results2) => {
                if (error2) return res.status(500).json({ error: 'Lỗi tải QC' });

                if (!results2 || results2.length === 0) {
                    return res.status(404).json({ error: 'Không tìm thấy quân cờ!' });
                }

                req.session.x = results2[0].imgX;
                req.session.o = results2[0].imgO;

                res.json({ success: true, x: req.session.x, o: req.session.o });
            });
        });
    }

    doiKhung(req, res) {
        const idKhung = req.query.idKhung;
        // const username = req.query.username;

        doiKhungDB(idKhung, req.session.username, (error1) => {
            if (error1) return res.status(500).json({ error: 'Lỗi cập nhật khung' });

            loadAvt(req.session.username, (error2, results) => {
                if (error2) return res.status(500).json({ error: 'Lỗi tải avatar và khung' });

                req.session.imgAvt = results[0].avt;
                req.session.imgKhung = results[0].khung;

                res.json({ success: true, imgKhung: results[0].khung });
            });
        });
    }

    muaAvatar(req, res) {
        const idAvt = req.query.idAvt;
        // const username = req.query.username;

        muaAvatarDB(idAvt, req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi mua avatar' });
            res.json({ success: true });
        });
    }

    muaKhung(req, res) {
        const idKhung = req.query.idKhung;
        // const username = req.query.username;
        
        muaKhungDB(idKhung, req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi mua khung' });
            res.json({ success: true });
        });
    }

    muaQC(req, res) {
        const idQC = req.query.idQC;
        // const username = req.query.username;

        muaQCDB(idQC, req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi mua QC' });
            res.json({ success: true });
        });
    }

    doiTen(req, res) {
        const ten = req.query.ten;
        // const username = req.query.username;

        doiTenUserDB(ten, req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi cập nhật tên người dùng' });

            req.session.tenNguoiDung = ten;
            res.json({ success: true });
        });
    }

    doiMatKhau(req, res) {
        const matKhau = req.query.matKhau;
        // const username = req.query.username;

        doiMatKhauUserDB(md5(matKhau), req.session.username, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi cập nhật mật khẩu' });
            res.json({ success: true });
        });
    }

    lichSuDau(req, res) {
        lichSuDauDB(req.session.idUser, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn lịch sử đấu' });
            res.json(results);
        });
    }

    loadAvtID(req, res) {
        const id = req.query.id;
        loadAvtID(id, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi tải avatar và khung' });
            res.json(results);
        });
    }

}

module.exports = new cuaHangController