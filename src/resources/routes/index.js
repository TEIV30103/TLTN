const newRouter = require('./new')
const homeRouter = require('./home')
const dangNhapRouter = require('./dangNhap')
const dangXuatRouter = require('./dangXuat')
const gameRouter = require('./game')

function route(app){
    
    app.use('/',homeRouter)

    app.use('/new',newRouter)

    app.use('/dangnhap',dangNhapRouter)

    app.use('/dangxuat',dangXuatRouter)

    app.use('/game',gameRouter)
}

module.exports = route
