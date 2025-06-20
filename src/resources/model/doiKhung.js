const express = require('express')
const session = require('express-session');
const db = require('./connect_DB')

const app = express()

app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

function doiKhung(idKhung,username,callback){
    db.query('UPDATE useruse, user SET idKhung = ?  WHERE useruse.idUser = user.id AND user.taiKhoan = ?'
        ,[idKhung,username], callback)
}


module.exports = doiKhung