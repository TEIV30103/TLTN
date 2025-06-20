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

function bxh(callback){
    db.query('SELECT ten, diem, avt.img as imgAvt, khung.img as imgKhung FROM diem,user,khung,avt,useruse '+
		'WHERE diem.idUser = user.id AND user.id = useruse.idUser AND useruse.idAvt = avt.idAvt AND useruse.idKhung = khung.idKhung '+
		'ORDER BY diem DESC LIMIT 5', callback)
	
}


module.exports = bxh