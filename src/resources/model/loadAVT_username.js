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

function loadAvt(userName,callback){
    db.query('SELECT avt.img as avt, khung.img as khung FROM useruse, user, avt, khung '
        +'WHERE user.id = useruse.idUser AND useruse.idAvt = avt.idAvt AND useruse.idKhung = khung.idKhung AND user.ten = ?'
        ,[userName],callback)
	
}


module.exports = loadAvt