idUser = 0;

$(document).ready(function() {
    loadAvatar();
    
    $("#btnDoiAvatar").click(function() {
        $('#cuaHang').show();
        $("#doiTTCN").hide();
        $("#lichSuDau").hide();
        loadAvatar();

    })

    $("#btnDoiKhung").click(function() {
        $('#cuaHang').show();
        $("#doiTTCN").hide();
        $("#lichSuDau").hide();
        loadKhung();
    })

    $("#btnDoiQC").click(function() {
        $('#cuaHang').show();
        $("#doiTTCN").hide();
        $("#lichSuDau").hide();
        loadQC();
    })

    $("#btnDoiThongTinCN").click(function() {
        $('#h3').text("Đổi thông tin cá nhân");
        $('#thanhCongDoiTTCN').hide();
        $('#loiDoiTTCN').hide();
        $('#cuaHang').hide();
        $("#doiTTCN").show();
        $("#lichSuDau").hide();
        $('#tenNguoiDung').val(username);
    });

    $("#btnLichSuDau").click(function() {
        $('#h3').text("Lịch sử đấu");
        $('#thanhCongDoiTTCN').hide();
        $('#loiDoiTTCN').hide();
        $('#cuaHang').hide();
        $("#doiTTCN").hide();
        $("#lichSuDau").show();
        loadLichSuDau();
    });

    $("#btnDoiMatKhau").click(function() {
        $('#thanhCongDoiTTCN').hide();
        $('#loiDoiTTCN').hide();
        $('#doiMatKhau').show();
        $('#doiTenNguoiDung').hide();
    })

    $("#btnDoiTenNguoiDung").click(function() {
        $('#thanhCongDoiTTCN').hide();
        $('#loiDoiTTCN').hide();
        $('#doiTenNguoiDung').show();
        $('#doiMatKhau').hide();
        $('#tenNguoiDung').val(username);
    });
    
    $("#submitDoiTen").click(function() {
        doiTenNguoiDung();
    });

    $("#submitDoiMK").click(function() {
        doiMatKhauNguoiDung();
    });

})

function doiTenNguoiDung() {
    let ten = $('#tenNguoiDung').val();
    if (ten.trim() === '') {
        $('#thanhCongDoiTTCN').hide();
        $('#loiDoiTTCN').show();
        $('#loiDoiTTCN').text('Tên người dùng không được để trống');
        return;
    }
    
    $.ajax({
        url: 'cuaHang/doiTenUser?ten=' + encodeURIComponent(ten),
        method: 'GET',
        success: function(data) {
            if (data.success) {
                $('#thanhCongDoiTTCN').show();
                $('#loiDoiTTCN').hide();
                $('#thanhCongDoiTTCN').text('Đổi tên người dùng thành công');
                username = ten;
                $('#tenNguoiDung').val(username);
            } else {
                $('#thanhCongDoiTTCN').hide();
                $('#loiDoiTTCN').show();
                $('#loiDoiTTCN').text('Lỗi đổi tên người dùng');
            }
        },
        error: function() {
            alert('Lỗi kết nối đến máy chủ');
        }
    });
}

function doiMatKhauNguoiDung() {
    let matKhauMoi = $('#passwordNguoiDung').val();
    let xacNhanMatKhau = $('#repasswordNguoiDung').val();

    if (matKhauMoi.trim() === '' || xacNhanMatKhau.trim() === '') {
        $('#thanhCongDoiTTCN').hide();
        $('#loiDoiTTCN').show();
        $('#loiDoiTTCN').text('Các trường không được để trống');
        return;
    }

    if (matKhauMoi !== xacNhanMatKhau) {
        $('#thanhCongDoiTTCN').hide();
        $('#loiDoiTTCN').show();
        $('#loiDoiTTCN').text('2 mật khẩu không giống nhau');
        return;
    }

    $.ajax({
        url: 'cuaHang/doiMatKhauUser?matKhau=' + encodeURIComponent(matKhauMoi),
        method: 'GET',
        success: function(data) {
            if (data.success) {
                $('#thanhCongDoiTTCN').show();
                $('#loiDoiTTCN').hide();
                $('#thanhCongDoiTTCN').text('Đổi mật khẩu thành công');
                // Reset form fields
                $('#matKhauCu').val('');
                $('#matKhauMoi').val('');
                $('#xacNhanMatKhau').val('');
            } else {
                $('#thanhCongDoiTTCN').hide();
                $('#loiDoiTTCN').show();
                $('#loiDoiTTCN').text('Lỗi đổi mật khẩu');
            }
        },
        error: function() {
            alert('Lỗi kết nối đến máy chủ');
        }
    });
}

function loadAvatarSH(callback) {
    $.ajax({
        url: 'cuaHang/avatarSH',
        method: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function () {
            alert('Lỗi lấy dữ liệu avatar SH'); 
        }
    });
}

function loadAvatarCH(callback) {
    $.ajax({
        url: 'cuaHang/avatarCH',
        method: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function () {
            alert('Lỗi lấy dữ liệu avatar CH'); 
        }
    });
}

function loadAvatar(){
    $("#h3").text("Đổi avatar");
    loadAvatarSH(function(data) {
        avatarSH = data;
        loadAvatarCH(function(data) {
            avatarCH = data;
            
            $('#cuaHang').empty();
            avatarCH.forEach(function(avatar) {
                SH = false;
                avatarSH.forEach(function(a) {
                    if (a.idAvt == avatar.idAvt) {
                        SH = true;
                    }
                });
                
                if(SH){
                    let src = $("#avatarCH").attr("src");
                    let tenFile = src.replace('/img/avatar/', '');
                    if(tenFile == avatar.img){
                        $('#cuaHang').append(`
                            <div class="itemCH">
                                <img class="imgCH" src="/img/avatar/`+avatar.img+`" alt="">
                                <p style='text-aglin: center'>Đang sử dụng</p>
                            </div>
                        `);
                    }
                    else{
                        $('#cuaHang').append(`
                            <div class="itemCH">
                                <img class="imgCH" src="/img/avatar/`+avatar.img+`" alt="">
                                <button class="suDungImg" id="ImgCH`+avatar.idAvt+`">Sử dụng</button>
                            </div>
                        `);
                        $("#ImgCH" + avatar.idAvt).click(function() {
                            $.ajax({
                                url: 'cuaHang/doiAvatar?idAvt=' + avatar.idAvt,
                                method: 'GET',
                                success: function (data) {
                                    if (data.imgAvt) {
                                        loadAvatar();
                                        $("#avatar").attr("src", "/img/avatar/"+ data.imgAvt);
                                        $("#avatarCH").attr("src", "/img/avatar/"+ data.imgAvt);
                                    }
                                },
                                error: function () {
                                    alert('Lỗi đổi avatar'); 
                                }
                            });
                        })
                    }
                }
                else{
                    $('#cuaHang').append(`
                        <div class="itemCH">
                            <img class="imgCH" src="/img/avatar/`+avatar.img+`" alt="">
                            <button class="suDungImg" id="ImgCH`+avatar.idAvt+`">Nhận</button>
                        </div>
                    `);
                    $("#ImgCH" + avatar.idAvt).click(function() {
                        $.ajax({
                            url: 'cuaHang/muaAvatar?idAvt=' + avatar.idAvt,
                            method: 'GET',
                            success: function (data) {
                                loadAvatar();
                            },
                            error: function () {
                                alert('Lỗi mua avatar'); 
                            }
                        });
                    });
                }

            });

            

        });

    });
}



function loadKhungSH(callback) {
    $.ajax({
        url: 'cuaHang/khungSH',
        method: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function () {
            alert('Lỗi lấy dữ liệu khung SH'); 
        }
    });
}

function loadKhungCH(callback) {
    $.ajax({
        url: 'cuaHang/khungCH',
        method: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function () {
            alert('Lỗi lấy dữ liệu khung CH'); 
        }
    });
}


function loadKhung(){
    $("#h3").text("Đổi khung");
    loadKhungSH(function(data) {
        khungSH = data;
        loadKhungCH(function(data) {
            khungCH = data;
            
            $('#cuaHang').empty();
            khungCH.forEach(function(khung) {
                SH = false;
                khungSH.forEach(function(a) {
                    if (a.idKhung == khung.idKhung) {
                        SH = true;
                    }
                });
                
                if(SH){
                    let bg = $("#khungCH").css("background-image"); 
                    let url = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    let tenFile = url.split('/').pop();
                    if(tenFile == khung.img){
                        $('#cuaHang').append(`
                            <div class="itemCH">
                                <img class="imgCH" src="/img/khung/`+khung.img+`" alt="">
                                <p style='text-aglin: center'>Đang sử dụng</p>
                            </div>
                        `);
                    }
                    else{
                        $('#cuaHang').append(`
                            <div class="itemCH">
                                <img class="imgCH" src="/img/khung/`+khung.img+`" alt="">
                                <button class="suDungImg" id="ImgCH`+khung.idKhung+`">Sử dụng</button>
                            </div>
                        `);
                        $("#ImgCH" + khung.idKhung).click(function() {
                            $.ajax({
                                url: 'cuaHang/doiKhung?idKhung=' + khung.idKhung,
                                method: 'GET',
                                success: function(data) {
                                    if (data.imgKhung) {
                                        loadKhung();
                                        $("#khung").css("background-image", "url('../img/KHUNG/" + data.imgKhung +"')");
                                        $("#khungCH").css("background-image", "url('../img/KHUNG/" + data.imgKhung +"')");
                                    }
                                },
                                error: function(err) {
                                    alert("Có lỗi xảy ra khi đổi khung!");
                                }
                            });
                        })
                    }
                }
                else{
                    $('#cuaHang').append(`
                        <div class="itemCH">
                            <img class="imgCH" src="/img/khung/`+khung.img+`" alt="">
                            <button class="suDungImg" id="ImgCH`+khung.idKhung+`">Nhận</button>
                        </div>
                    `);

                    $("#ImgCH" + khung.idKhung).click(function() {
                        $.ajax({
                            url: 'cuaHang/muaKhung?idKhung=' + khung.idKhung,
                            method: 'GET',
                            success: function (data) {
                                loadKhung();
                            },
                            error: function () {
                                alert('Lỗi mua khung'); 
                            }
                        });
                    });
                }

            });

            

        });

    });
}

function loadQCSH(callback){
    $.ajax({
        url: 'cuaHang/QCSH',
        method: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function () {
            alert('Lỗi lấy dữ liệu QC SH'); 
        }
    });
}

function loadQCCH(callback){
    $.ajax({
        url: 'cuaHang/QCCH',
        method: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function () {
            alert('Lỗi lấy dữ liệu QC CH'); 
        }
    });
}

function loadQC(){
    $("#h3").text("Đổi Quân Cờ");
    loadQCSH(function(data) {
        QCSH = data;
        loadQCCH(function(data) {
            QCCH = data;
            
            $('#cuaHang').empty();
            QCCH.forEach(function(QC) {
                SH = false;
                QCSH.forEach(function(a) {
                    if (a.idQC == QC.idQC) {
                        SH = true;
                    }
                });
                
                if(SH){
                    if(quanX == QC.imgX && quanO == QC.imgO){
                        $('#cuaHang').append(`
                            <div class="itemCH">
                                <img class="imgCH" style="height: 35%" src="/img/BC/`+QC.imgX+`" alt="">
                                <img class="imgCH" style="height: 35%" src="/img/BC/`+QC.imgO+`" alt="">
                                <p style='text-aglin: center'>Đang sử dụng</p>
                            </div>
                        `);
                    }
                    else{
                        $('#cuaHang').append(`
                            <div class="itemCH">
                                <img class="imgCH" style="height: 35%" src="/img/BC/`+QC.imgX+`" alt="">
                                <img class="imgCH" style="height: 35%" src="/img/BC/`+QC.imgO+`" alt="">
                                <button class="suDungImg" id="ImgCH`+QC.idQC+`">Sử dụng</button>
                            </div>
                        `);
                        $("#ImgCH" + QC.idQC).click(function() {
                            $.ajax({
                                url: 'cuaHang/doiQC?idQC=' + QC.idQC,
                                method: 'GET',
                                success: function(data) {
                                    if (data.x && data.o) {
                                        quanX = data.x;
                                        quanO = data.o;
                                        loadQC();

                                    }
                                },
                                error: function(err) {
                                    alert("Có lỗi xảy ra khi đổi QC! " +err);
                                }
                            });
                        })
                    }
                }
                else{
                    $('#cuaHang').append(`
                        <div class="itemCH">
                            <img class="imgCH" style="height: 35%" src="/img/BC/`+QC.imgX+`" alt="">
                            <img class="imgCH" style="height: 35%" src="/img/BC/`+QC.imgO+`" alt="">
                            <button class="suDungImg" id="ImgCH`+QC.idQC+`">Nhận</button>
                        </div>
                    `);

                    $("#ImgCH" + QC.idQC).click(function() {
                        $.ajax({
                            url: 'cuaHang/muaQC?idQC=' + QC.idQC,
                            method: 'GET',
                            success: function (data) {
                                loadQC();
                            },
                            error: function () {
                                alert('Lỗi mua QC'); 
                            }
                        });
                    });
                }

            });

            

        });

    });
}


function loadLichSuDau() {
    $.ajax({
        url: 'cuaHang/lichSuDau',
        method: 'GET',
        success: function (data) {
            $('#lichSuDau').empty();
            if (data.length === 0) {
                $('#lichSuDau').append('<p>Không có lịch sử đấu.</p>');
            } else {
                data.forEach(function(match, idx) {
                    let count = idx + 1; // Đảm bảo mỗi lần lặp có count riêng
                    let userLoad = (idUser == match.User1) ? match.User2 : match.User1;

                    loadAvtID(userLoad, function(dataAvt) {
                        $("#lichSuDau").append(`
                            <div class="match" id="match_${count}">
                                <div style="width:30%; float: left;">
                                    <div id="khungUser1_${count}" class="khungUser" style="float: left;">
                                        <img id="avatarUser1_${count}" class="avatarUser" alt="Avatar">
                                    </div>
                                    <span style="float: left; display: inline-block; margin-top: 11vh; margin-left: -10vh">${dataAvt[0].ten}</span>
                                </div>
                                <div style="width:30%; float: right; text-align: center; padding-right: 2vh;">
                                    <span style="font-size: 4vh; color: #000000;">${formatDate(match.thoiGian)}</span><br>
                                </div>
                            </div>
                        `);
                        if(match.UserWin == idUser){
                            $("#match_" + count).css("background-color", "#d4edda");
                        }else{
                            $("#match_" + count).css("background-color", "#f8d7da");
                        }
                        $("#khungUser1_" + count).css("background-image", "url('/img/khung/" + dataAvt[0].khung + "')");
                        $("#avatarUser1_" + count).attr("src","/img/avatar/"+ dataAvt[0].avt);
                        $("#avatarUser1_" + count).attr("alt", dataAvt[0].ten);
                    });
                });
            }
        },
        error: function () {
            alert('Lỗi lấy dữ liệu lịch sử đấu'); 
        }
    });
}

function formatDate(dateString) {
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    // Lấy ngày/tháng/năm
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function loadAvtID(id, callback) {
    console.log("loadAvtID: " + id);
    $.ajax({
        url: 'cuaHang/loadAvtID?id=' + id,
        method: 'GET',
        success: function (data) {
            callback(data);
        },
        error: function () {
            alert('Lỗi lấy dữ liệu avatar và khung'); 
        }
    });
}