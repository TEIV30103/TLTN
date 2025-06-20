var socket = io();
var soNguoiSS = 0;
var game;

var userName = null;
var coBot = false;
var bot;
var phong =[];
var phongDangO;
var quanX = null;
var quanO = null;

var cheDoThuongTruc = false;

socket.on("server-send-DangNhapThatBai",function(){
    // console.log("dangNhapThatBai")
    window.location.replace("/dangXuat");
})

socket.on("server-send-DangNhapThanhCong",function(data){
    userName = data;
    $("#khung").show();
    $("#btnDangXuat").show();
})
   

socket.on("server-send-DanhSachUserOnline",function(data){
    $("#danhSachUserOnline").html("")
    data.forEach(element => {
        // $("#danhSachUserOnline").append("<div class='user'>" + element + "</div>")
        $.ajax({
            url: '/loadAvtUser?username=' + element,
            method: 'GET',
            success: function (data) {
                data.forEach(element2 => {
                    if(userName == element){
                        $("#danhSachUserOnline").append("<li class='list-group-item'>"+
                            "<div class='khung-bxh' style=\"background-image: url('../img/KHUNG/" + element2.khung + "');\">" +
                                "<img src='/img/avatar/" + element2.avt + "' class='avatar-bxh' alt='Avatar'>" +
                            "</div>"

                            +
                            "<span style= 'display: block; margin-top: -30px; margin-left: 50px;'> "+element+"</span>"+

                        "</li>")
                    }
                    else{
                        $("#danhSachUserOnline").append("<li class='list-group-item'>"+
                            "<div class='khung-bxh' style=\"background-image: url('../img/KHUNG/" + element2.khung + "');\">" +
                                "<img src='/img/avatar/" + element2.avt + "' class='avatar-bxh' alt='Avatar'>" +
                            "</div>"

                            +
                            "<span style= 'display: block; margin-top: -30px; margin-left: 50px;'> "+element+"</span>"+
                            "<button class='btn btn-primary btnMoiUser' id='btnMoiUser" + element + "'>Mời</button>"+
                        "</li>")
                        $("#btnMoiUser" + element).click(function(){
                            if(phongDangO != null){
                                phong.forEach(function(phongElement){
                                    if(phongElement.idPhong == phongDangO){
                                        if(phongElement.user2 == null){
                                            socket.emit("guiLoiMoiUser", [element, phongDangO, userName]);
                                        }
                                    }
                                });
                            }
                        });
                    }
                    
                });
            },
            error: function () {
                alert('Lỗi lấy dữ liệu BXH');
            }
        });



    });
    
})

socket.on("server-send-GuiPhong",function(data){
    $("#danhSachPhong").html("")
    data.forEach(element =>{
        $("#danhSachPhong").append(`
            <div class='phong card mb-2'> 
                <div class='card-body d-flex justify-content-between align-items-center'>
                    <div>
                        <span class='soPhong badge me-2'>${element[0][0]}</span>
                        <span class='tenPhong'>${element[0].substring(1)}</span>
                    </div>
                    <button class='btnVao btn btn-success' id='btnVao${element[0]}'>Vào</button>
                    <button class='btnVao btn btn-success' id='btnVaoFull${element[0]}'>Vào</button>
                    <button class='btnVao btn btn-success' id='btnVaoMK${element[0]}'>Vào</button>
                    <button class='btnVao btn btn-success' id='btnVaoLai${element[0]}'>Vào</button>
                </div>
            </div>`)

        $("#btnVaoFull"+element[0]).hide();
        $("#btnVaoMK"+element[0]).hide();
        $("#btnVaoLai"+element[0]).hide();

        socket.emit("phongCoMatKhau",element[0]);

        socket.emit("soNguoiTrongPhong",element[0]);
        
        socket.emit("minhCoTrongPhongKhong",element[0])
    })
})

socket.on("server-send-ChatTong",function(data){
    $("#chatTong").append("<p> <span class='chatUserName'>"+ data[0] +"</span> : "+data[1]+" </p>")
    $('#chatTong').scrollTop($('#chatTong')[0].scrollHeight);
})

socket.on("server-send-PhongCoMatKhau",function(data){
    $("#btnVaoMK" + data)
            .text("Nhập mật khẩu") 
            .css("background-color", "brown")  
            .css("color", "white");
    $("#btnVaoMK" + data).click(function(){
        console.log("vao phong co mat khau")
        $("#trangNhapMatKhau").show(1000);
        $("#matKhauPhongNMK").focus();
        $("#idPhongNMK").val(data);
    })

    $("#btnVao"+data).hide();
    $("#btnVaoMK"+data).show();
})

socket.on("server-send-SoNguoiTrongPhong",function(data){
    if(data[0] == 1){
        $("#btnVao"+data[1]).click(function(){
            socket.emit("vaoPhong",data[1]);
        })
    }
    else if(data[0] == 2){
        $("#btnVaoFull" + data[1])
            .text("Đã đầy") 
            .css("background-color", "brown")  
            .css("color", "white"); 
        $("#btnVao"+data[1]).hide();
        $("#btnVaoMK"+data[1]).hide();
        $("#trangNhapMatKhau").hide();
        $("#btnVaoFull"+data[1]).show();
    }
})

socket.on("server-send-MatKhauSai",function(){
    $("#thongBaoMatKhauSai").show(1000).delay(2000).hide(1000);
})

socket.on("server-send-CoTrongPhong",function(data){
    $("#btnVao"+data).hide();
    $("#btnVaoMK"+data).hide();
    $("#btnVaoFull"+data).hide();
    $("#btnVaoLai"+data).show();
    $("#btnVaoLai"+data)
        .text("Vào lại") 
        .css("background-color", "#cce4ff")  
        .css("color", "black");
    $("#btnVaoLai"+data).click(function(){
        socket.emit("vaoPhongLai",data);
    })
})

socket.on("server-send-CapNhatDiem",function(){
    $.ajax({
        url: '/bxh',
        method: 'GET',
        success: function (data) {
            $("#listBXH").html("")
            i =0;
            
            data.forEach(element => {
                i++;
                $("#listBXH").append("<li class='list-group-item'>"+
                    "<span style='float:left; margin-right: 10px;'>"+i+")</span>" +
                    "<div class='khung-bxh' style=\"background-image: url('../img/KHUNG/" + element.imgKhung + "');\">" +
                        "<img src='/img/avatar/" + element.imgAvt + "' class='avatar-bxh' alt='Avatar'>" +
                    "</div>"

                    +
                    "<span style= 'display: block; margin-top: -30px; margin-left: 60px;'> "+element.ten + " <span style='float:right;'>" + element.diem +" Trận thắng </span></span>"+
                    "</li>")
            });
            
            $.ajax({
                url: '/bxhCN?username=' + userName,
                method: 'GET',
                success: function (data) {
                    $("#soXHCN").html(data[0].rank+")"); 
                    $("#avatarCN").attr("src", "/img/avatar/"+ data[0].imgAvt);
                    $("#khungCN").css("background-image", "url('../img/KHUNG/" + data[0].imgKhung +"')");
                    $("#thongTinXHCN").html(data[0].ten +" <span style='float:right;'>" + data[0].diem +" Trận thắng </span>");
                },
                error: function () {
                    alert('Lỗi lấy dữ liệu BXH');
                }
            });
        },
        error: function () {
            alert('Lỗi lấy dữ liệu BXH');
        }
    });
})

socket.on("server-send-LoiMoiUser",function(data){
    console.log(data);
    if($('#khungMoi'+data[1]).length == 0){
        $("#khungThongBao").append("<div class='khungMoi' id='khungMoi"+data[1]+"'>"+
            "<p style='width: 100%;'>"+data[0]+": đang mời bạn vào Phòng "+data[1].substring(1)+" Số "+data[1][0]+"</p>"+
            "<button class='chapNhanMoi' id='chapNhanMoi"+data[1]+"' >Chấp nhận</button>"+
            "<button class='tuChoiMoi' id='tuChoiMoi"+data[1]+"'>Từ chối</button>"+
            "</div>"
        )
        $("#chapNhanMoi"+data[1]).click(function(){
            socket.emit("chapNhanMoiUser",data[1]);
            $("#khungMoi"+data[1]).remove();
        })
        $("#tuChoiMoi"+data[1]).click(function(){
            $("#khungMoi"+data[1]).remove();
        })
    }
})

socket.on("server-send-PhongDaDay",function(data){
    alert("Phong da day" + data);
})

socket.on("server-send-daVaoToiDaPhong",function(data){
    $("#menuPhong").show();
    alert("Bạn đã vào tối đa 4 phòng. Vui lòng thoát một phòng trước khi vào phòng mới.");

})





$(document).ready(function(){

    $("#phong").hide();
    chatTong(0)
    $("#trangNhapMatKhau").hide();
    $("#thongBaoMatKhauSai").hide();

    $("#chatTongF").hide();
    $("#xepHang").hide();
    $("#btnHuy").hide();
    $("#btnXoaBot").hide();

    $("#divTaoPhong").hide();
    $("#tbWin").hide();

    toMauPhongVL()
    hoverBtnTaoPhong()

    $("#btnMoTaoPhong").click(function(){
        $("#menuPhong").hide(500);
        $("#divTaoPhong").show(1000);
        $("#tenPhong").val("");
        $("#tenPhong").focus();
    });


    $("#btnTaoPhong").click(function(){
        // $("#divPhong").show();
        $("#divTaoPhong").hide();
        clearThongTinPhong()
        buttonDisable(0)
        $("#hangCho").show();
        $("#game").hide()
        if($("#matKhauPhong").val () != ""){
            socket.emit("taoPhongCoMatKhau",[$("#tenPhong").val(),$("#matKhauPhong").val()])
            $("#matKhauPhong").val("");
        }
        else{
            socket.emit("taoPhong",$("#tenPhong").val())
        }
    })

    $("#btnGuiChatTong").click(function(){
        var message = $('#inputChatTong').val().trim(); 
        if (message) { 
            socket.emit('chatTong', message);
            $('#inputChatTong').val('');
        } else {
            alert('Vui lòng nhập tin nhắn trước khi gửi!'); 
        }
    })

    $('#inputChatTong').on('keypress', function(event) {
        if (event.which === 13) { // Kiểm tra nếu phím Enter được nhấn
            var message = $('#inputChatTong').val().trim(); 
            if (message) { 
                socket.emit('chatTong', message);
                $('#inputChatTong').val('');
            } else {
                alert('Vui lòng nhập tin nhắn trước khi gửi!'); 
            }
        }
    });

    $("#chatTongSpan").click(function(){
        $("#danhSachUserOnline").hide(500)
        $("#xepHang").hide(500);
        $("#chatTongF").show(1000);
        setTimeout(chatTong(1),1000);
    })

    $("#danhSachUserSpan").click(function(){
        $("#danhSachUserOnline").show(1000)
        $("#chatTongF").hide(500);
        setTimeout(chatTong(0),500)
        $("#xepHang").hide(500);

    })

    $("#xepHangSpan").click(function(){
        $("#xepHang").show(1000);
        $("#danhSachUserOnline").hide(500)
        $("#chatTongF").hide(500);
        setTimeout(chatTong(0),500)


        $.ajax({
            url: '/bxh',
            method: 'GET',
            success: function (data) {
                $("#listBXH").html("")
                i =0;
                
                data.forEach(element => {
                    i++;
                    $("#listBXH").append("<li class='list-group-item'>"+
                        "<span style='float:left; margin-right: 10px;'>"+i+")</span>" +
                        "<div class='khung-bxh' style=\"background-image: url('../img/KHUNG/" + element.imgKhung + "');\">" +
                            "<img src='/img/avatar/" + element.imgAvt + "' class='avatar-bxh' alt='Avatar'>" +
                        "</div>"

                        +
                        "<span style= 'display: block; margin-top: -30px; margin-left: 60px;'> "+element.ten + " <span style='float:right;'>" + element.diem +" Trận thắng </span></span>"+
                        "</li>")
                });
                
                $.ajax({
                    url: '/bxhCN?username=' + userName,
                    method: 'GET',
                    success: function (data) {
                        $("#soXHCN").html(data[0].rank+")"); 
                        $("#avatarCN").attr("src", "/img/avatar/"+ data[0].imgAvt);
                        $("#khungCN").css("background-image", "url('../img/KHUNG/" + data[0].imgKhung +"')");
                        $("#thongTinXHCN").html(data[0].ten +" <span style='float:right;'>" + data[0].diem +" Trận thắng </span>");
                    },
                    error: function () {
                        alert('Lỗi lấy dữ liệu BXH');
                    }
                });
            },
            error: function () {
                alert('Lỗi lấy dữ liệu BXH');
            }
        });
    })

    $("#CoMatKhau").change(function() {
        if ($(this).prop("checked")) {
            $("#matKhauPhong").prop("disabled", false);
        }
        else {  
            $("#matKhauPhong").val("");
            $("#matKhauPhong").prop("disabled", true);
        }
    });

    $("#dongTrangNhapMatKhau").click(function(){
        $("#trangNhapMatKhau").hide(1000);
        $("#matKhauPhongNMK").val("");
    });

    $("#btnXacNhanMatKhau").click(function(){
        if($("#matKhauPhongNMK").val() == ""){
            $("#thongBaoMatKhauSai").show(1000).delay(2000).hide(1000);
            $("#matKhauPhongNMK").focus();
        }
        else{
            socket.emit("vaoPhongCoMatKhau",[$("#idPhongNMK").val(),$("#matKhauPhongNMK").val()])
            $("#matKhauPhongNMK").val("")
        }
    });


    $("#trangChuHeader").click(function(){
        $("#divTaoPhong").hide();
        $("#phong").hide();
        $("#menuPhong").show();
        clearThongTinPhong()
        socket.emit("guiPhong")
        phongDangO = null;
        toMauPhongVL()
        $("#vs").show();
        $("#user3vs").show();
        $("#user4vs").show();
        $("#user4vs").css("width","40%");
        $("#user4vs").css("justify-content","center");
        $("#user3vs").css("width","40%");
        $("#user3vs").css("justify-content","center");
        $("#tbWin").hide();
        $("#thongBao").show();
        $("#btnDauHang").show();
        $("#btnChoiLai").hide();
        $("#btnRoiPhong2").hide();

        tatThuongTruc();
    })

    $("#ChuongThongBao").click(function(){
        $("#khungThongBao").slideToggle(200);
    })

    $(document).click(function (e) {
        if (!$(e.target).closest('#ChuongThongBao').length) {
            $('#khungThongBao').hide();  
        }
    });

    $("#btnChoiLai").click(function(){
        rsttphong()
        socket.emit("resetPhong",phongDangO)
        resetPhong();
    })

    $("#btnRoiPhong2").click(function(){
        rsttphong()
        socket.emit("roiPhong",phongDangO);
    })


    $("#btnThuongTruc").click(function(){
        if(cheDoThuongTruc){
            $("#divTaoPhong").hide();
            $("#phong").hide();
            $("#menuPhong").show();
            clearThongTinPhong()
            socket.emit("guiPhong")
            phongDangO = null;
            toMauPhongVL()
            $("#vs").show();
            $("#user3vs").show();
            $("#user4vs").show();
            $("#user4vs").css("width","40%");
            $("#user4vs").css("justify-content","center");
            $("#user3vs").css("width","40%");
            $("#user3vs").css("justify-content","center");
            $("#tbWin").hide();
            $("#thongBao").show();
            $("#btnDauHang").show();
            $("#btnChoiLai").hide();
            $("#btnRoiPhong2").hide();

            tatThuongTruc();
            return;
        }

        cheDoThuongTruc = true;
        phongDangO = null;

        $("#divLeft").hide();
        $('#divPhong').removeClass('col-md-9').addClass('col-md-12');

        $("#divTaoPhong").hide();
        $("#phong").hide();
        $("#menuPhong").hide();
        $(".itemHeader").css("background-color", "white");
        $("#btnThuongTruc").css("background-color", "#28a745");
        $("#btnThuongTruc").css("color", "white");


        $("#banCoThuongTruc").show();

        $("#divbanCo1").hide();
        $("#divbanCo2").hide();
        $("#divbanCo3").hide();
        $("#divbanCo4").hide();

        $("#banCo1").html("");
        $("#banCo2").html("");
        $("#banCo3").html("");
        $("#banCo4").html("");

        game1 = new Caro();
        game2 = new Caro();
        game3 = new Caro();
        game4 = new Caro();

        bot1 = new botCaroMinimax(game1);
        bot2 = new botCaroMinimax(game2);
        bot3 = new botCaroMinimax(game3);
        bot4 = new botCaroMinimax(game4);

        phong.forEach(function(item, index) {
            let gameTemp;
            let botTemp;
            let idBanCoTemp;
            if((item.soNguoiSS != 2 && item.user2 != "bot" ) || (item.user2 == "bot" && item.soNguoiSS != 1)){
                return;
            }
            console.log(index)
            switch(index){
                case 0: {
                    gameTemp = game1;
                    idBanCoTemp = "banCo1";
                    $("#divbanCo1").show();
                    if(item.user2 == "bot")
                        botTemp = bot1;
                    break;
                }
                case 1: {
                    gameTemp = game2;
                    idBanCoTemp = "banCo2";
                    $("#divbanCo2").show();
                    if(item.user2 == "bot")
                        botTemp = bot2;
                    break;
                }
                case 2: {
                    gameTemp = game3;
                    idBanCoTemp = "banCo3";
                    $("#divbanCo3").show();
                    if(item.user2 == "bot")
                        botTemp = bot3;
                    break;
                }
                case 3: {
                    gameTemp = game4;
                    idBanCoTemp = "banCo4";
                    $("#divbanCo4").show();
                    if(item.user2 == "bot")
                        botTemp = bot4;
                    break;
                }
            }
    
            gameTemp = new Caro(idBanCoTemp)
                
            gameTemp.value_Nguoi = item.value;
            gameTemp.luot = item.luot;
            gameTemp.gameOver = item.ketThuc;
            gameTemp.id = item.idPhong;

            $("#"+idBanCoTemp+"Ten").html(" Phòng : "+ item.idPhong);
            if(item.luot){
                $("#"+idBanCoTemp+"TT").html("Lượt của bạn");
                $("#"+idBanCoTemp+"TT").css("color", "green");
            }
            else{
                $("#"+idBanCoTemp+"TT").html("Lượt của đối thủ");
                $("#"+idBanCoTemp+"TT").css("color", "red");
            }

            if(gameTemp.gameOver){
                $("#"+idBanCoTemp+"TT").html("Trò chơi đã kết thúc");
                $("#"+idBanCoTemp+"TT").css("color", "blue");
            }
            
            if(item.banCo != []){
                gameTemp.arr = item.banCo;
                gameTemp.valueOBanCo(idBanCoTemp);
                if(item.luotVuaRoi != null)
                    toMauOVuaDanh(item.luotVuaRoi, idBanCoTemp);
            }

            if(item.user2 == "bot"){
                botTemp = new botCaroMinimax(gameTemp)
            }

            switch(index){
                case 0: {
                    game1 = gameTemp;
                    bot1 = botTemp;
                    break;
                }
                case 1: {
                    game2 = gameTemp;
                    bot2 = botTemp;
                    break;
                }
                case 2: {
                    game3 = gameTemp;
                    bot3 = botTemp;
                    break;
                }
                case 3: {
                    game4 = gameTemp;
                    bot4 = botTemp;
                    break;
                }
            }
        });
    });
    
})


function tatThuongTruc(){
    cheDoThuongTruc = false;
    $('#divPhong').removeClass('col-md-12').addClass('col-md-9');
    $("#divLeft").show();
    $("#banCoThuongTruc").hide();

    $("#btnThuongTruc").css("background-color", "white");
    $("#btnThuongTruc").css("color", "black");
}






function clearThongTinPhong(){
    $("#user1").html("")
    $("#user2").html("")
    $("#khungChat").html("")
    $("#tenPhong").html("")
    $("#banCo").html("")
    $("#btnSanSang").show()
    $("#btnHuy").hide()
    $("#btnThemBot").show();
    $("#btnXoaBot").hide();
    soNguoiSS = 0
    coBot = false
    bot = null
}

function chatTong(s){
    if(s == 0){
        $("#chatTongF").hide(1000);
    }
    else{
        $("#chatTongF").show(1000);
    }
}

function hoverBtnTaoPhong(){
    const button = document.getElementById('btnMoTaoPhong');

    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left; // Tọa độ X của chuột
        const y = e.clientY - rect.top; // Tọa độ Y của chuột

        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
}

function toMauPhongVL(){
    toMauTrang()
    if (phongDangO == null){
        $("#trangChuHeader").css("background-color", "#cce4ff")
    }
    else{
        $("#phongVL"+phongDangO).css("background-color", "#cce4ff")
    }
}

function toMauTrang(){
    // $(".itemHeader").css("background-color", "white")
    phong.forEach(function(item, index) {
        if ($("#phongVL" + item.idPhong).css("background-color") != "rgb(204, 204, 51)") {
            $("#phongVL" + item.idPhong).css("background-color", "white");
        }
    });
}

function buttonDisable(i){
    if(i == 1){
        $("#btnThemBot").prop('disabled', true);
    }
    else{
        $("#btnThemBot").prop('disabled', false);
    }
}