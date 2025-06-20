const express = require('express')
const session = require('express-session');
const db = require('../model/connect_DB')

const app = express()

app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

function dangKy(username, fullname, password, callback) {
    // Kiểm tra username hoặc fullname đã tồn tại chưa
    db.query('SELECT * FROM user WHERE taiKhoan = ? OR ten = ?', [username, fullname], (err, results) => {
        if (err) return callback('Lỗi hệ thống!');
        if (results.length > 0) {
            return callback('Tên đăng nhập hoặc họ tên đã tồn tại!');
        }
        // Thêm tài khoản mới
        db.query('INSERT INTO user (taiKhoan, ten, matKhau) VALUES (?, ?, ?)', [username, fullname, password], (err2, result2) => {
            if (err2) return callback('Lỗi khi tạo tài khoản!');
            const userId = result2.insertId;
            // Thêm vào bảng sohuuavt (idAvt = 1)
            db.query('INSERT INTO sohuuavt (idUser, idAvt) VALUES (?, ?)', [userId, 1], (err3) => {
                if (err3) return callback('Lỗi khi tạo sở   hữu avatar!');
                // Thêm vào bảng sohuukhung (idKhung = 4)
                db.query('INSERT INTO sohuukhung (idUser, idKhung) VALUES (?, ?)', [userId, 4], (err4) => {
                    if (err4) return callback('Lỗi khi tạo sở hữu khung!');
                    // Thêm vào bảng useruse (idAvt = 1, idKhung = 4)
                    db.query('INSERT INTO sohuuquanco (idUser, idQC) VALUES (?, ?)', [userId, 1], (err5) => {
                        if (err5) return callback('Lỗi khi tạo sở hữu quân cờ!');
                        // Thành công
                        db.query('INSERT INTO useruse (idUser, idAvt, idKhung, idQC) VALUES (?, ?, ?,?)', [userId, 1, 4, 1], (err6) => {
                            if (err6) return callback('Lỗi khi tạo useruse!');
                            // Thành công
                            db.query('INSERT INTO diem (idUser, diem) VALUES (?, ?)', [userId, 0], (err7) => {
                                if (err7) return callback('Lỗi khi tạo điểm!');
                                // Tạo điểm thành công
                                return callback(null);
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = dangKy;