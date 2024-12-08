const dn = require('../model/dangNhap')

class dangNhapController{
    
    // [/GET] /dangnhap

        index(req,res){
            if (req.session.username == null)
                res.render('dangNhap')
            else 
                res.redirect('/');

        }

    // [/POST] /dangnhap
        
    dangNhap(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        dn(username,password,(error,results)=>{
            if (error) throw error;
            if (results.length > 0) {
                req.session.username = results[0].username;
                req.session.tenNguoiDung = results[0].tenNguoiDung;
                res.redirect('/');  
            }
        })
    }
    
}

module.exports = new dangNhapController