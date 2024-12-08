
class gameController{
    index(req,res){
        if(req.session.username != null)
            res.render('game',  {username: req.session.username, 
                                tenNguoiDung: req.session.tenNguoiDung})
        else res.redirect('/dangNhap');
    }
}

module.exports = new gameController
