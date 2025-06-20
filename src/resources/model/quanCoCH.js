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

function quanCoCH(callback){
    db.query('SELECT * FROM quanco', callback)
}


module.exports = quanCoCH