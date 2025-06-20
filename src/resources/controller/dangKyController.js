const dangKyModel = require('../model/dangKy');
const md5 = require('md5');

class dangKyController{
    


    index(req,res){
        if (req.session.username != null)
            res.redirect('/');
        else 
            res.render("dangKy");

    }

    dangKy(req, res) {
        const { username, fullname, password, repassword } = req.body;
        if (password !== repassword) {
            return res.render('dangKy', { error: 'Mật khẩu và nhập lại mật khẩu không giống nhau!' });
        }
        
        dangKyModel(username, fullname, md5(password), (err) => {
            if (err) return res.render('dangKy', { error: err });
            res.redirect('/dangnhap');
        });
    }
}

module.exports = new dangKyController;