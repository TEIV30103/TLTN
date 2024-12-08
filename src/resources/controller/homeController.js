
class homeController{

    // [/GET] /home

    index(req,res){
        if(req.session.username != null)
            res.render('home',  {username: req.session.username, 
                                tenNguoiDung: req.session.tenNguoiDung})
        else res.redirect('/dangNhap');  
    }

    
}

module.exports = new homeController
