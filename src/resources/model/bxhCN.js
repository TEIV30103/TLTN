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

function bxhCH(username, callback) {
    const sql = `
        SELECT x.rank, x.ten, x.diem, x.imgAvt, x.imgKhung
        FROM (
            SELECT user.ten, diem.diem,
                   avt.img AS imgAvt,
                   khung.img AS imgKhung,
                   RANK() OVER (ORDER BY diem.diem DESC) AS rank
            FROM diem
            JOIN user ON diem.idUser = user.id
            JOIN useruse ON user.id = useruse.idUser
            JOIN avt ON useruse.idAvt = avt.idAvt
            JOIN khung ON useruse.idKhung = khung.idKhung
        ) AS x
        WHERE x.ten = ?
    `;
    db.query(sql, [username], callback);
}


module.exports = bxhCH