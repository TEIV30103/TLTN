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

function layTen(userName,callback){
    db.query('SELECT ten, avt.img as imgAvt, khung.img as imgKhung, khoa, quyen, imgX, imgO FROM user, khung, avt, useruse, quanco '+
		'WHERE user.id = useruse.idUser AND useruse.idAvt = avt.idAvt AND useruse.idQC = quanco.idQC AND useruse.idKhung = khung.idKhung AND user.taiKhoan = ?',[userName],callback)
}


module.exports = layTen