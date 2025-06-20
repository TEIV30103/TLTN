
socket.on("server-send-VaoPhongUser1",function(data){
    $("#menuPhong").hide()
    $("#trangNhapMatKhau").hide();
    $("#phong").show(500);
    $("#user1").html(data[0])
    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){
            item.user1 = data[0]
        }
    })
    

})

socket.on("server-send-ThongTinUser1",function(data){
    $("#user1").html(data[0])
    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){
            item.user1 = data[0]
        }
    })
})

socket.on("server-send-VaoPhongUser2",function(data){
    $("#menuPhong").hide()
    $("#trangNhapMatKhau").hide();
    $("#phong").show(500);
    $("#user2").html(data[0])
    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){
            item.user2 = data[0]
        }
    })
})

socket.on("server-send-ThongTinUser2",function(data){
    $("#user2").html(data[0])
    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){
            item.user2 = data[0]
        }
    })
})

socket.on("server-send-PhongDangCoBot",function(data){
    $("#user2").html("bot")
    coBot = true
    $("#btnThemBot").hide();
    $("#btnXoaBot").show();
})

socket.on("server-send-PhongKhongCoBot",function(data){
    $("#user2").html("")
    coBot = false
    $("#btnThemBot").show();
    $("#btnXoaBot").hide();
})

socket.on("server-send-CoNguoiVaoPhong",function(data){
    chat = data[0] +":  đã vào phòng <br>" ;
    if(data[1] == phongDangO){
        $("#khungChat").append(chat)
        $("#btnSanSang").show()
        $("#btnHuy").hide()
        $("#hangCho").show();
        $("#game").hide()
    }
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);

    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){
            item.SS = false;
            item.soNguoiSS = 0;
            soNguoiSS = item.soNguoiSS;
            item.chat.push(chat);
            item.user1 = $("#user1").html()
            item.user2 = $("#user2").html()
            if(item.user2 != "bot" && item.user2 != null){
                buttonDisable(1)
            }
        }
    })
    
})

socket.on("server-send-YeuCauGuiThongTin",function(data){
    socket.emit("YeuCauGuiThongTin",data)
})

socket.on("server-send-YeuCauGuiThongTinUser2",function(data){
    socket.emit("YeuCauGuiThongTinUser2",data)
})

socket.on("server-send-ChatPhong",function(data){
    // chat = "<p> <span class='chatUserName'>"+ data[0] +"</span> : "+data[1]+" </p>"
    chat = data[0] +": "+data[1]+" <br>" ;
    
    if(data[2] == phongDangO){
        $("#khungChat").append(chat)
    }
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
    phong.forEach(function(item,index){
        if(item.idPhong == data[2]){
            item.chat.push(chat);
        }
    })
})

socket.on("server-send-RoiPhongThanhCong",function(data){
    $("#menuPhong").show(500)
    $("#phong").hide()
    clearThongTinPhong()
    
    phong = phong.filter(function(item) {
        return item.idPhong !== data;
    });
    phongDangO = null;
    hienThiPhongVL()
})

socket.on("server-send-NguoiChoiKhacRoiPhong",function(data){
    // $("#hangCho").show();
    if ($("#user1").html() == data[0]){
        $("#user1").html($("#user2").html()) 
    }
    
    $("#user2").html("")
    // $("#banCo").html("")
    soNguoiSS = 0
    $("#btnSanSang").show()
    $("#btnHuy").hide()

    buttonDisable(0)
    chat = data[0] +":  đã rời phòng <br>" ;
    if(data[1] == phongDangO)
        $("#khungChat").append(chat)
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);

    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){
            if(item.soNguoiSS == 2){
                socket.emit("doiThuDauHang",data[1]);
            }
            item.SS = false;
            item.soNguoiSS = 0;
            if(item.user1 == data[0]){
                item.user1 = item.user2
            }
            item.user2 = null;
            item.chat.push(chat);
        }
    })

})

socket.on("server-send-TenPhong",function(data){
    phongDangO = data
    toMauPhongVL()
    $("#soPhongTTP").html("Số phòng: "+data[0])
    $("#tenPhongTTP").html("Tên phòng: "+data.substring(1))
    
    phong.forEach(function(item,index){
        if(item.idPhong == data){
            // console.log(item)
        }
    })

})

socket.on("server-send-VaoPhong",function(data){
    let tt = {};
    tt.idPhong = data;
    tt.SS = false;
    tt.soNguoiSS = 0;
    tt.banCo = [];
    for (let i = 0; i < 10; i++){
        var ar =[];
        for (let j = 0; j < 10; j++){
            ar.push(0);
        }
        tt.banCo.push(ar);
    }
    tt.luot = null;
    tt.value = null;
    tt.chat = [];
    tt.user1 = null;
    tt.user2 = null;
    tt.luotVuaRoi = null;
    tt.userWin = null;
    tt.ketThuc = false;
    phong.push(tt)
    
    phongDangO = data;
    $("#khungChat").html("");
    hienThiPhongVL()
    toMauPhongVL()
})

socket.on("server-send-SanSang",function(data){
    
    chat = data[0] +":  đã sẵn sàng <br>" ;

    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){
            if(data[0] == userName)
                item.SS = true;
            item.soNguoiSS += 1;
            soNguoiSS = item.soNguoiSS;
            item.chat.push(chat)
            item.userWin = null;
            item.luotVuaRoi = null;
            item.ketThuc = false;
            item.banCo = [];
            for (let i = 0; i < 10; i++){
                var ar =[];
                for (let j = 0; j < 10; j++){
                    ar.push(0);
                }
                item.banCo.push(ar);
            }
            if(item.soNguoiSS == 2 && cheDoThuongTruc){
                cheDoThuongTruc = false;
                setTimeout(function(){
                    $("#btnThuongTruc").click();
                },1000);
            }
        }
    })

    
    if(data[1] == phongDangO)
        $("#khungChat").append(chat)
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
    if(soNguoiSS == 2 || (soNguoiSS == 1 && coBot)){ // bat su kien bot o day luon
        if(data[1] == phongDangO){
            $("#hangCho").hide();

            $("#game").show(500)
            game = new Caro()
            
        } 
        socket.emit("phanChiaLuot",data[1])
    }
})

socket.on("server-send-Huy",function(data){

    chat = data[0] +":  đã huỷ sẵn sàng <br>" 
    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){
            if(data[0] == userName)
                item.SS = false;
            item.soNguoiSS -= 1;
            soNguoiSS = item.soNguoiSS;
            item.chat.push(chat)
            console.log(item)
        }
    })

    if(data[1] == phongDangO)
        $("#khungChat").append(chat)
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
})

socket.on("server-send-ThemBot",async function(data){
    $("#user2").html("bot")
    $("#khungChat").append("Bot đã vào phòng<br>" )
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
    $("#btnThemBot").hide();
    $("#btnXoaBot").show();
    coBot = true
    phong.forEach(function(item,index){
        if(item.idPhong == data){
            item.chat.push("Bot đã vào phòng<br>")
            item.user2 = "bot"
        }
    })
})

socket.on("server-send-XoaBot",async function(data){
    $("#user2").html("")
    $("#khungChat").append("Bot đã rời phòng<br>" )
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
    $("#btnThemBot").show();
    $("#btnXoaBot").hide();
    coBot = false
    phong.forEach(function(item,index){
        if(item.idPhong == data){
            item.chat.push("Bot đã rời phòng<br>")
            item.user2 = null
        }
    })
})

socket.on("server-send-CapNhatLaiNutSS",function(data){
    phong.forEach(function(item,index){
        if(item.idPhong == data){
            if(item.SS == false){
                $("#btnSanSang").show()
                $("#btnHuy").hide()
            }
            else{
                $("#btnSanSang").hide()
                $("#btnHuy").show()
            }
        }
    })
})

socket.on("server-send-KiemTraTranDauBatDau",function(data){
    phong.forEach(function(item,index){
        if(item.idPhong == data){
            if(item.soNguoiSS == 2 || (item.soNguoiSS == 1 && coBot)){
                $("#hangCho").hide();
                $("#game").show()
                game = new Caro()
                
                game.value_Nguoi = item.value;
                game.luot = item.luot;
                game.gameOver = item.ketThuc;
                if(item.luot){
                    $("#thongBao").html("Đến lượt bạn")
                    $("#thongBao").css("color","green")
                }
                else{
                    $("#thongBao").html("Đến lượt đối thủ")
                    $("#thongBao").css("color","red")
                }

                if(item.userWin == null){
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
                }
                else{
                    $("#thongBao").html("Trận đấu đã kết thúc")
                    $("#thongBao").css("color","blue")
                    $("#thongBao").hide();
                    $("#btnDauHang").hide();
                    $("#btnChoiLai").show();
                    $("#btnRoiPhong2").show();
                    if(item.userWin == 1){
                        $("#vs").hide();
                        $("#user4vs").hide();
                        $("#user3vs").show();
                        $("#user3vs").css("width","50%");
                        $("#user3vs").css("justify-content","right");
                        $("#tbWin").show(100);
                    }
                    else{
                        $("#vs").hide();
                        $("#user3vs").hide();
                        $("#user4vs").show();
                        $("#user4vs").css("width","50%");
                        $("#user4vs").css("justify-content","right");
                        $("#tbWin").show(100);
                    }
                }

                if(item.banCo != []){
                    game.arr = item.banCo;
                    game.valueOBanCo()
                }
                
                if(item.luotVuaRoi != null){
                    toMauOVuaDanh(item.luotVuaRoi)
                    if(item.userWin == null)
                        game.checkWinGame(item.luotVuaRoi.i,item.luotVuaRoi.j)
                }
                
                if(coBot){
                    bot = new botCaroMinimax(game)
                }

                arrChat = item.chat
                $("#khungChatTran").html("");
                arrChat.forEach(function(item,index){
                    $("#khungChatTran").append(item)
                })
                $('#khungChatTran').scrollTop($('#khungChatTran')[0].scrollHeight);
                
                $("#user3").html(item.user1)
                $("#user4").html(item.user2)

                loadAVT(item.user1,"imguser3","khunguser3")
                if(item.user2 != "bot"){
                    loadAVT(item.user2,"imguser4","khunguser4")
                }
                else{
                    $("#imguser4").attr("src", "/img/avatar/bot.png");
                    $("#khunguser4").css("background-image", "url('../img/KHUNG/df.png')");
                }


                
            }
            else{
                $("#hangCho").show();
                $("#game").hide()
                if(item.user2 != "bot" && item.user2 != null){
                    buttonDisable(1)
                }
                else{
                    buttonDisable(0)
                }
            }
        }
    })
})

socket.on("server-send-chat",function(data){
    arrChat =[]
    phong.forEach(function(item,index){
        if(item.idPhong == data){
            arrChat = item.chat
        }
    })

    arrChat.forEach(function(item,index){
        $("#khungChat").append(item)
    })
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
})



$(document).ready(function(){


    $("#btnGuiChatPhong").click(function(){
        socket.emit("chatPhong",[$("#chatPhong").val(),phongDangO])
        $("#chatPhong").val("")
        
    })

    $("#btnRoiPhong").click(function(){
        console.log(phongDangO);
        socket.emit("roiPhong",phongDangO)
    })

    $("#btnSanSang").click(function(){
        $("#btnHuy").show()
        $("#btnSanSang").hide()
        socket.emit("nguoiChoiSanSang",phongDangO)
    })

    $("#btnHuy").click(function(){
        $("#btnHuy").hide()
        $("#btnSanSang").show()
        socket.emit("nguoiChoiHuy",phongDangO)
    })

    $("#btnThemBot").click(function(){
        socket.emit("themBot",phongDangO)
    })

    $("#btnXoaBot").click(function(){
        socket.emit("xoaBot",phongDangO)
    })

});


function hienThiPhongVL(){
    $("#menuHeader").html("")
    if(phong.length == 0){
        $("#btnDADD").prop('disabled', false);
        $("#btnDangXuat").prop('disabled', false);
        $("#btnAdmin").prop('disabled', false);
    }
    else{
        $("#btnDADD").prop('disabled', true);
        $("#btnDangXuat").prop('disabled', true);
        $("#btnAdmin").prop('disabled', true);
    }
    phong.forEach(function(item,index){
        $("#menuHeader").append("<div class='itemHeader' id ='phongVL"+item.idPhong+"'>  <span>"+item.idPhong+"</span>  </div>")
        $("#phongVL"+item.idPhong).click(function(){
            tatThuongTruc()
            clearThongTinPhong()
            socket.emit("vaoPhongLai",item.idPhong);
        })
    })
}

function loadAVT(userName,idAvt,idKhung){
    $.ajax({
        url: '/loadAvtUser?username=' + userName,
        method: 'GET',
        success: function (data) {
            $("#"+idAvt).attr("src", "/img/avatar/" + data[0].avt);
            $("#"+idKhung).css("background-image", "url('../img/KHUNG/" + data[0].khung + "')");
        },
        error: function () {
            alert('Lỗi lấy dữ liệu avatar');
        }
    });
}

