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

function loadAvt(id,callback){
    db.query('SELECT ten, avt.img as avt, khung.img as khung FROM useruse, user, avt, khung '
        +'WHERE user.id = useruse.idUser AND useruse.idAvt = avt.idAvt AND useruse.idKhung = khung.idKhung AND user.id = ?'
        ,[id],callback)
	
}


module.exports = loadAvt