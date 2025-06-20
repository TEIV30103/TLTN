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

function quanCoSH(userName,callback){
    db.query('SELECT idQC FROM user, sohuuquanco '+
		'WHERE user.id = sohuuquanco.idUser AND user.taiKhoan = ?'
		,[userName], callback)
	
}


module.exports = quanCoSH