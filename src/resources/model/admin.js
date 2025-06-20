const express = require('express')
const session = require('express-session');
const db = require('./connect_DB')
const path = require('path');
const fs = require('fs');

const app = express()

app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

function getUsers(callback) {
    db.query('SELECT * FROM user', callback);
}

function addUser(taiKhoan, ten, matKhau, quyen, khoa, callback) {
    // Kiểm tra tài khoản hoặc họ tên đã tồn tại chưa
    db.query('SELECT * FROM user WHERE taiKhoan = ? OR ten = ?', [taiKhoan, ten], (err, results) => {
        if (err) return callback('Trùng tên tài khoản hoặc tên người dùng!');
        if (results.length > 0) {
            return callback('Tên đăng nhập hoặc họ tên đã tồn tại!');
        }
        // Thêm user mới
        db.query(
            'INSERT INTO user (taiKhoan, ten, matKhau, quyen, khoa) VALUES (?, ?, ?, ?, ?)',
            [taiKhoan, ten, matKhau, quyen, khoa],
            (err2, result2) => {
                if (err2) return callback('Lỗi khi tạo tài khoản!');
                const userId = result2.insertId;
                // Thêm vào bảng sohuuavt (idAvt = 1)
                db.query('INSERT INTO sohuuavt (idUser, idAvt) VALUES (?, ?)', [userId, 1], (err3) => {
                    if (err3) return callback('Lỗi khi tạo sở hữu avatar!');
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
            }
        );
    });
}

function deleteUser(id, callback) {
    // Xóa user từ bảng useruse
    db.query('DELETE FROM useruse WHERE idUser = ?', [id], (err) => {
        if (err) return callback(err);
        // Xóa user từ bảng sohuukhung
        db.query('DELETE FROM sohuukhung WHERE idUser = ?', [id], (err2) => {
            if (err2) return callback(err2);
            // Xóa user từ bảng sohuuavt
            db.query('DELETE FROM sohuuavt WHERE idUser = ?', [id], (err3) => {
                if (err3) return callback(err3);
                // Xóa user từ bảng diem
                db.query('DELETE FROM sohuuquanco WHERE idUser = ?', [id], (err4) => {
                    if (err4) return callback(err4);
                    // Cuối cùng xóa user từ bảng user
                    db.query('DELETE FROM diem WHERE idUser = ?', [id], (err5) => {
                        if (err5) return callback(err4);
                        // Cuối cùng xóa user từ bảng user
                        db.query('DELETE FROM user WHERE id = ?', [id], callback);
                    });
                });
            });
        });
    });
}


function editUser(id, ten, matKhau, quyen, khoa, callback) {
    let sql, params;
    if(matKhau && matKhau.trim() !== '') {
        sql = 'UPDATE user SET ten = ?, matKhau = ?, quyen = ?, khoa = ? WHERE id = ?';
        params = [ten, matKhau, quyen, khoa, id];
    } else {
        sql = 'UPDATE user SET ten = ?, quyen = ?, khoa = ? WHERE id = ?';
        params = [ten, quyen, khoa, id];
    }
    db.query(sql, params, callback);
}

// Avatar
function getAvatars(callback) {
    db.query('SELECT * FROM avt', callback);
}

function addAvatar(file, callback) {
    if (!file) return callback(new Error('Không có file!'));
    const ext = path.extname(file.originalname);
    const newName = file.filename + ext;
    const newPath = path.join(file.destination, newName);

    fs.rename(file.path, newPath, (err) => {
        if (err) return callback(err);
        db.query('INSERT INTO avt (img) VALUES (?)', [newName], callback);
    });
}

function editAvatar(id, file, callback) {
    if (!file) return callback(new Error('Không có file!'));
    const ext = path.extname(file.originalname);
    const newName = file.filename + ext;
    const newPath = path.join(file.destination, newName);

    fs.rename(file.path, newPath, (err) => {
        if (err) return callback(err);
        db.query('UPDATE avt SET img = ? WHERE idAvt = ?', [newName, id], callback);
    });
}

function deleteAvatar(id, callback) {
    if(id === 1 || id === '1'){
        return callback(new Error('Không thể xóa avatar mặc định!'));
    }
    // Lấy tên file ảnh trước
    db.query('SELECT img FROM avt WHERE idAvt = ?', [id], (err, results) => {
        if (err) return callback(err);
        const fileName = results[0]?.img;
        // Xóa sở hữu avatar trước
        db.query('DELETE FROM sohuuavt WHERE idAvt = ?', [id], (err2) => {
            if (err2) return callback(err2);
            db.query('UPDATE useruse SET idAvt = 1 WHERE idAvt = ?', [id], (err3) => {
                if (err3) return callback(err3);
                db.query('DELETE FROM avt WHERE idAvt = ?', [id], (err4) => {
                    if (err4) return callback(err4);
                    // Xóa file vật lý
                    if (fileName) {
                        const filePath = path.join(__dirname, '../../resources/public/img/avatar/', fileName);
                        fs.unlink(filePath, (err5) => {
                            // Không cần return lỗi nếu file không tồn tại
                            callback(null);
                        });
                    } else {
                        callback(null);
                    }
                });
            });
        });
    });
}

// Khung
function getKhungs(callback) {
    db.query('SELECT * FROM khung', callback);
}

function editKhung(id, file, callback) {
    if (!file) return callback(new Error('Không có file!'));
    const ext = path.extname(file.originalname);
    const newName = file.filename + ext;
    const newPath = path.join(file.destination, newName);

    fs.rename(file.path, newPath, (err) => {
        if (err) return callback(err);
        db.query('UPDATE khung SET img = ? WHERE idKhung = ?', [newName, id], callback);
    });
}

function addKhung(file, callback) {
    if (!file) return callback(new Error('Không có file!'));
    const ext = path.extname(file.originalname);
    const newName = file.filename + ext;
    const newPath = path.join(file.destination, newName);

    fs.rename(file.path, newPath, (err) => {
        if (err) return callback(err);
        db.query('INSERT INTO khung (img) VALUES (?)', [newName], callback);
    });
}

function deleteKhung(id, callback) {
    // Không cho xóa khung mặc định
    if (id === 4 || id === '4') {
        return callback(new Error('Không thể xóa khung mặc định!'));
    }
    // Lấy tên file ảnh trước
    db.query('SELECT img FROM khung WHERE idKhung = ?', [id], (err, results) => {
        if (err) return callback(err);
        const fileName = results[0]?.img;
        // Xóa sở hữu khung trước
        db.query('DELETE FROM sohuukhung WHERE idKhung = ?', [id], (err2) => {
            if (err2) return callback(err2);
            // Sửa useruse về khung mặc định (idKhung = 4) nếu đang dùng khung này
            db.query('UPDATE useruse SET idKhung = 4 WHERE idKhung = ?', [id], (err3) => {
                if (err3) return callback(err3);
                // Cuối cùng xóa khung
                db.query('DELETE FROM khung WHERE idKhung = ?', [id], (err4) => {
                    if (err4) return callback(err4);
                    // Xóa file vật lý
                    if (fileName) {
                        const filePath = path.join(__dirname, '../../resources/public/img/khung/', fileName);
                        fs.unlink(filePath, (err5) => {
                            // Không cần return lỗi nếu file không tồn tại
                            callback(null);
                        });
                    } else {
                        callback(null);
                    }
                });
            });
        });
    });
}

function addQuanco(files, callback) {
    if (!files || !files.imgX || !files.imgO) return callback(new Error('Thiếu file!'));
    const path = require('path');
    const fs = require('fs');
    const imgXFile = files.imgX[0];
    const imgOFile = files.imgO[0];

    const extX = path.extname(imgXFile.originalname);
    const extO = path.extname(imgOFile.originalname);
    const newNameX = imgXFile.filename + extX;
    const newNameO = imgOFile.filename + extO;
    const newPathX = path.join(imgXFile.destination, newNameX);
    const newPathO = path.join(imgOFile.destination, newNameO);

    fs.rename(imgXFile.path, newPathX, (err) => {
        if (err) return callback(err);
        fs.rename(imgOFile.path, newPathO, (err2) => {
            if (err2) return callback(err2);
            db.query('INSERT INTO quanco (imgX, imgO) VALUES (?, ?)', [newNameX, newNameO], callback);
        });
    });
}

function editQuanco(id, files, callback) {
    if (!files || !files.imgX || !files.imgO) return callback(new Error('Thiếu file!'));
    const path = require('path');
    const fs = require('fs');
    const imgXFile = files.imgX[0];
    const imgOFile = files.imgO[0];

    const extX = path.extname(imgXFile.originalname);
    const extO = path.extname(imgOFile.originalname);
    const newNameX = imgXFile.filename + extX;
    const newNameO = imgOFile.filename + extO;
    const newPathX = path.join(imgXFile.destination, newNameX);
    const newPathO = path.join(imgOFile.destination, newNameO);

    fs.rename(imgXFile.path, newPathX, (err) => {
        if (err) return callback(err);
        fs.rename(imgOFile.path, newPathO, (err2) => {
            if (err2) return callback(err2);
            db.query(
                'UPDATE quanco SET imgX = ?, imgO = ? WHERE idQC = ?',
                [newNameX, newNameO, id],
                function (err3, result) {
                    if (err3) return callback(err3);
                    // Trả về tên file mới qua callback
                    callback(null, { imgX: newNameX, imgO: newNameO, result });
                }
            );
        });
    });
}

function deleteQuanco(id, callback) {
    // Không cho xóa quân cờ mặc định
    if (id === 1 || id === '1') {
        return callback(new Error('Không thể xóa quân cờ mặc định!'));
    }
    // Lấy tên file ảnh trước
    db.query('SELECT imgX, imgO FROM quanco WHERE idQC = ?', [id], (err, results) => {
        if (err) return callback(err);
        const fileNameX = results[0]?.imgX;
        const fileNameO = results[0]?.imgO;
        // Xóa sở hữu quân cờ trước
        db.query('DELETE FROM sohuuquanco WHERE idQC = ?', [id], (err2) => {
            if (err2) return callback(err2);
            // Sửa useruse về quân cờ mặc định (idQC = 1) nếu đang dùng quân cờ này
            db.query('UPDATE useruse SET idQC = 1 WHERE idQC = ?', [id], (err3) => {
                if (err3) return callback(err3);
                // Cuối cùng xóa quân cờ
                db.query('DELETE FROM quanco WHERE idQC = ?', [id], (err4) => {
                    if (err4) return callback(err4);
                    // Xóa file vật lý
                    const dir = path.join(__dirname, '../../resources/public/img/BC/');
                    let done = 0;
                    let total = 0;
                    if (fileNameX) total++;
                    if (fileNameO) total++;
                    function finish() { done++; if (done >= total) callback(null); }
                    if (fileNameX) fs.unlink(path.join(dir, fileNameX), () => finish());
                    if (fileNameO) fs.unlink(path.join(dir, fileNameO), () => finish());
                    if (total === 0) callback(null);
                });
            });
        });
    });
}

function getQuancos(callback) {
    db.query('SELECT * FROM quanco', callback);
}

// ...có thể thêm các hàm thêm/sửa/xóa nếu muốn

module.exports = {
    getUsers,
    addUser,
    deleteUser,
    editUser,
    getAvatars,
    getKhungs,
    editAvatar,
    editKhung,
    addAvatar,
    addKhung,
    addQuanco,
    editQuanco,
    getQuancos,
    deleteAvatar,
    deleteKhung,
    deleteQuanco
};