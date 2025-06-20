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

function doiMK(matKhau,username,callback){
    db.query('UPDATE user SET matKhau = ? WHERE user.taiKhoan = ?'
        ,[matKhau,username], callback)
}


module.exports = doiMK