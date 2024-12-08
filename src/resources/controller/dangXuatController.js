
class dangXuatController{


    index(req,res){
        req.session.username = null;
        req.session.tenNguoiDung = null;
        res.redirect('/dangNhap');
    }
}

module.exports = new dangXuatController
