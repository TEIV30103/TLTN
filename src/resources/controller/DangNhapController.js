const dn = require('../model/dangNhap')
const md5 = require('md5');

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

        dn(username, md5(password), (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                if( results[0].khoa == 1){
                    return res.render('dangNhap', { error: 'Tài khoản của bạn đã bị khóa!' });
                }
                else{
                    req.session.idUser = results[0].id;
                    req.session.quyen = results[0].quyen;
                    req.session.username = results[0].taiKhoan;
                    req.session.tenNguoiDung = results[0].ten;
                    req.session.imgAvt = results[0].imgAvt;
                    req.session.imgKhung = results[0].imgKhung;
                    req.session.x = results[0].imgX;
                    req.session.o = results[0].imgO;
                    res.redirect('/');
                }
            } else {
                res.render('dangNhap', { error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });
            }
        });
    }
    
}

module.exports = new dangNhapController