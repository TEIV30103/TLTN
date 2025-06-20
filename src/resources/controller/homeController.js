const bxhDB = require('../model/bxh')
const bxhCNDB = require('../model/bxhCN')
const loadAvtDB = require('../model/loadAVT')
const loadAvtUserDB = require('../model/loadAVT_username')
const winGameDB = require('../model/winGame')
const layTenDB = require('../model/layTen')
const themLSDDB = require('../model/themLSD')

class homeController{

    // [/GET] /home

    index(req,res){
        if(req.session.username != null){
            layTenDB(req.session.username, (error, results) => {
                if (error) return res.status(500).json({ error: 'Lỗi truy vấn CSDL' });
                req.session.tenNguoiDung = results[0].ten;
                req.session.imgAvt = results[0].imgAvt;
                req.session.imgKhung = results[0].imgKhung;
                req.session.x = results[0].imgX;
                req.session.o = results[0].imgO;
                res.render('home',  {username: req.session.username, 
                                tenNguoiDung: req.session.tenNguoiDung,
                                imgAvt: req.session.imgAvt,
                                imgKhung: req.session.imgKhung,
                                x: req.session.x,
                                o: req.session.o,
                                quyen: req.session.quyen});
            });
        }
        else res.redirect('/dangNhap');  
    }

    bxh(req, res) {
        bxhDB((error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn CSDL' });
            res.json(results);
        });
    }
    
    bxhCN(req, res) {
        const userName = req.query.username;
        bxhCNDB(userName,(error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn CSDL' });
            res.json(results);
        });
    }


    loadAvt(req, res) {
        const userName = req.query.username; 
        loadAvtDB(userName, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn CSDL' });
            res.json(results);
        });
    }

    loadAvtUser(req, res) {
        const userName = req.query.username; 
        loadAvtUserDB(userName, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi truy vấn CSDL' });
            res.json(results);
        });
    }

    winGame(req, res) {
        const userName = req.query.username; 
        winGameDB(userName, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi cập nhật điểm' });
            res.json(results);
        });
    }

    themLSD(req, res) {
        const User1 = req.query.user1;
        const User2 = req.query.user2; 
        const win = req.query.userwin; 
        themLSDDB(User1, User2, win, (error, results) => {
            if (error) return res.status(500).json({ error: 'Lỗi cập nhật lịch sử đấu' });
            res.json(results);
        });
    }
}

module.exports = new homeController
