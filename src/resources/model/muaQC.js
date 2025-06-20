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

function muaQC(idQC,username,callback){
    db.query('INSERT INTO sohuuquanco(idUser, idQC) '+
            'SELECT id, ? FROM user WHERE user.taiKhoan = ?'
            ,[idQC,username], callback)
}


module.exports = muaQC