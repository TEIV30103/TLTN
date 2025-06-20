const newRouter = require('./new')
const homeRouter = require('./home')
const dangNhapRouter = require('./dangNhap')
const dangXuatRouter = require('./dangXuat')
const dangKyRouter = require('./dangKy')
const gameRouter = require('./game')
const cuaHang = require('./cuaHang')

const admin = require('./admin')

function route(app){
    
    app.use('/',homeRouter)

    app.use('/new',newRouter)

    app.use('/dangnhap',dangNhapRouter)

    app.use('/dangxuat',dangXuatRouter)

    app.use('/dangky',dangKyRouter)

    app.use('/game',gameRouter)

    app.use('/cuaHang',cuaHang)

    app.use('/admin',admin)
}

module.exports = route
