

socket.on("server-send-PhanChiaLuot",function(data){
    arrChat =[]
    phong.forEach(function(item,index){
        if(item.idPhong == data[1]){

            if(item.user1 == data[0]){
                item.luot = true
                item.value = 1;
                if(coBot){
                    bot = new botCaroMinimax(game)
                }
            }
            else{
                item.luot = false
                item.value = -1;
            }
            console.log(item)
            
            if(item.idPhong == phongDangO){
                game.luot = item.luot;
                game.value_Nguoi = item.value; 
                arrChat = item.chat   
                
                $("#user3").html(item.user1)
                $("#user4").html(item.user2)
                
                loadAVT(item.user1,"imguser3","khunguser3")
                if(item.user2 != "bot"){
                    loadAVT(item.user2,"imguser4","khunguser4")
                }
                else{
                    $("#imguser4").attr("src","/img/avatar/bot.png")
                    $("#khunguser4").css("background-image", "url('../img/KHUNG/df.png')");
                }
                if(item.luot){
                    $("#thongBao").html("Đến lượt bạn")
                    $("#thongBao").css("color","green")
                }
                else{
                    $("#thongBao").html("Đến lượt đối thủ")
                    $("#thongBao").css("color","red")
                }


                $("#khungChatTran").html("");
                arrChat.forEach(function(item,index){
                    $("#khungChatTran").append(item)
                })
                $('#khungChatTran').scrollTop($('#khungChatTran')[0].scrollHeight);
            }
        }
    })
}) 


socket.on("server-send-UserDanhCo",function(data){
    if(data[1] == phongDangO){
        game.arr[data[0].i][data[0].j] = data[0].value
        game.valueOBanCo()
        game.luot = ! game.luot
        var a = game.checkWinGame(data[0].i,data[0].j)

        

        phong.forEach(function(item,index){
            if(item.idPhong == data[1]){
                item.luotVuaRoi = data[0];
                item.luot = game.luot;
                item.banCo = game.arr;
                if(!a && !game.gameOver){
                    if(item.luot){
                        $("#thongBao").html("Đến lượt bạn")
                        $("#thongBao").css("color","green")
                    }
                    else{
                        $("#thongBao").html("Đến lượt đối thủ")
                        $("#thongBao").css("color","red")
                    }
                }
                toMauOVuaDanh(data[0])
            }
        })


        if(coBot && !a){
            xy = bot.botDanh()
            game.arr[xy[0]][xy[1]] = xy[2]
            game.valueOBanCo()
            a = game.checkWinGame(xy[0], xy[1])
            game.luot = ! game.luot

            phong.forEach(function(item,index){
                if(item.idPhong == data[1]){
                    lvr ={
                        i: xy[0],
                        j: xy[1]
                    };
                    item.luotVuaRoi = lvr;
                    item.luot = game.luot;
                    item.banCo = game.arr;
                    if(!a){
                        if(item.luot){
                            $("#thongBao").html("Đến lượt bạn")
                            $("#thongBao").css("color","green")
                        }
                        else{
                            $("#thongBao").html("Đến lượt đối thủ")
                            $("#thongBao").css("color","red")
                        }
                    }
                    toMauOVuaDanh(item.luotVuaRoi)
                }
            })
        }
    }
    else{
        phong.forEach(function(item,index){
            if(item.idPhong == data[1]){
                item.luotVuaRoi = data[0];
                item.luot = !item.luot;
                item.banCo[data[0].i][data[0].j] = data[0].value

                if(cheDoThuongTruc){
                    
                    var gameTemp;
                    var idBanCoTemp;
                    var botTemp;
                    switch(index){
                        case 0: {
                            gameTemp = game1;
                            idBanCoTemp = "banCo1";
                            if(item.user2 == "bot")
                                botTemp = bot1;
                            break;
                        }
                        case 1: {
                            gameTemp = game2;
                            idBanCoTemp = "banCo2";
                            if(item.user2 == "bot")
                                botTemp = bot2;
                            break;
                        }
                        case 2: {
                            gameTemp = game3;
                            idBanCoTemp = "banCo3";
                            if(item.user2 == "bot")
                                botTemp = bot3;
                            break;
                        }
                        case 3: {
                            gameTemp = game4;
                            idBanCoTemp = "banCo4";
                            if(item.user2 == "bot")
                                botTemp = bot4;
                            break;
                        }
                    }

                    

                    gameTemp.valueOBanCo(idBanCoTemp);
                    a = gameTemp.checkWinGame(data[0].i,data[0].j);
                    gameTemp.luot = item.luot;
                    toMauOVuaDanh(item.luotVuaRoi, idBanCoTemp);


                    if(!a && item.user2 == "bot"){
                        xy = botTemp.botDanh()
                        gameTemp.arr[xy[0]][xy[1]] = xy[2]
                        gameTemp.valueOBanCo(idBanCoTemp)
                        a = gameTemp.checkWinGame(xy[0], xy[1])
                        gameTemp.luot = ! gameTemp.luot;

                        lvr ={
                            i: xy[0],
                            j: xy[1]
                        };
                        item.luotVuaRoi = lvr;
                        item.luot = gameTemp.luot;
                        item.banCo = gameTemp.arr;
                        toMauOVuaDanh(item.luotVuaRoi, idBanCoTemp);
                        if(a){
                            gameTemp.gameOver = true;
                            item.ketThuc = true;
                            $("#"+idBanCoTemp+"TT").html("Bạn đã thua");
                            $("#"+idBanCoTemp+"TT").css("color", "blue");
                        }
                    }
                    
                    
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

                    if(a && item.ketThuc == false){
                        if(data[0].value == gameTemp.value_Nguoi){
                            gameTemp.gameOver = true;
                            item.ketThuc = true;
                            winGameCapNhatDiem(userName);
                            $("#"+idBanCoTemp+"TT").html("Bạn đã thắng");
                            $("#"+idBanCoTemp+"TT").css("color", "blue");
                        }
                        else{
                            gameTemp.gameOver = true;
                            item.ketThuc = true;
                            $("#"+idBanCoTemp+"TT").html("Bạn đã thua");
                            $("#"+idBanCoTemp+"TT").css("color", "blue");
                        }
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
                }
                
            }
        })
        $("#phongVL"+data[1]).css("background-color","rgb(204, 204, 51)");
    }
})

socket.on("server-send-ChatTran",function(data){
    chat = data[0] +": "+data[1]+" <br>" ;
    $("#khungChatTran").append(chat)
    $('#khungChatTran').scrollTop($('#khungChat')[0].scrollHeight);
    phong.forEach(function(item,index){
        if(item.idPhong == data[2]){
            item.chat.push(chat);
        }
    })
})

socket.on("server-send-DauHang",function(data){
    phong.forEach(function(item,index){
        if(item.idPhong == phongDangO){
            if(item.user1 == userName){
                item.userWin = 2;
                userWin(2)
            }
            else{
                item.userWin = 1;
                userWin(1)
            } 
        }
    })
})

socket.on("server-send-DoiThuDauHang",function(data){

    phong.forEach(function(item,index){
        if(item.idPhong == data && item.user2 != null){
            item.ketThuc = true;
            if(item.user1 == userName){
                item.userWin = 1;
                if(item.idPhong == phongDangO)
                    userWin(1)
            }
            else{
                item.userWin = 2;
                if(item.idPhong == phongDangO)
                    userWin(2)
            }
            winGameCapNhatDiem(userName);
            if(item.user2 != "bot"){
                themLSD(item.user1, item.user2, userName);
            }
            
            if(cheDoThuongTruc){
                
                cheDoThuongTruc = false;
                setTimeout(() => {
                    $("#btnThuongTruc").click();
                    setTimeout(()=>{
                        q = index + 1;
                        $("#banCo"+q+"TT").html("Đối thủ đã đầu hàng");
                        $("#banCo"+q+"TT").css("color", "blue");
                    },2000)
                    
                }, 1000);
            }
            
            
        }
    })
})

socket.on("server-send-ResetPhong",function(data){
    phong.forEach(function(item,index){
        if(item.idPhong == data){
            item.SS = false;
            item.soNguoiSS = 0;
        }
    })
    if(data == phongDangO){
        $("#btnSanSang").show()
        $("#btnHuy").hide()
    }
})


$(document).ready(function(){
    $("#btnGuiChatTran").click(function(){
        socket.emit("chatTran",[$("#chatTran").val(),phongDangO])
        $("#chatTran").val("")
    })


    $('#btnDauHang').click(function () {
        if (confirm("Bạn có chắc chắn muốn đầu hàng không?")) {
            socket.emit("dauHang", phongDangO);
        }
    });

});


function toMauOVuaDanh(data, id = "banCo"){
    // $('td').css("background-color","none");
    id = id + data.i + data.j;

    console.log("toMauOVuaDanh: " + id);
    $('#'+id).css("background-color","red");

}

function winGame(value){
    phong.forEach(function(item,index){
        if(item.idPhong == phongDangO){
            if(item.value == value){
                if(item.user1 == userName){
                    item.userWin = 1;
                    userWin(1)
                }
                else{
                    item.userWin = 2;
                    userWin(2)
                }
                if(item.ketThuc == false)
                    winGameCapNhatDiem(userName);
                if(item.user2 != "bot"){
                    themLSD(item.user1, item.user2, userName);
                }
            }
            else{

                if(item.user1 == userName){
                    item.userWin = 2;
                    userWin(2)
                }
                else{
                    item.userWin = 1;
                    userWin(1)
                } 
            }
            item.ketThuc = true;
        }
    })
}

function userWin(a){
    $("#thongBao").html("Trận đấu đã kết thúc")
    $("#thongBao").css("color","blue")
    if (a ==1){
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

    setTimeout(function(){
        $("#thongBao").hide();
        $("#btnDauHang").hide();
        $("#btnChoiLai").show();
        $("#btnRoiPhong2").show();

        
    }, 100);
}

function rsttphong(){
    $("#vs").show();
    $("#user3vs").show();
    $("#user4vs").show();
    $("#tbWin").hide();
    $("#game").hide(500)
    $("#hangCho").show(700);
    $("#btnSanSang").show()
    $("#btnHuy").hide()
    if(coBot){
        $("#btnThemBot").hide();
        $("#btnXoaBot").show(); 
    }
    else{
        $("#btnThemBot").show();
        $("#btnXoaBot").hide();
    }
    
    $("#user4vs").css("width","40%");
    $("#user4vs").css("justify-content","center");
    $("#user3vs").css("width","40%");
    $("#user3vs").css("justify-content","center");
    $("#thongBao").show();
    $("#btnDauHang").show();
    $("#btnChoiLai").hide();
    $("#btnRoiPhong2").hide();
}

function resetPhong(){
    $("#banCo").html("")    
    arrChat = []
    phong.forEach(function(item,index){
        if(item.idPhong == phongDangO){
            item.SS = false;
            item.soNguoiSS = 0;
            item.banCo = [];
            for (let i = 0; i < 10; i++){
                var ar =[];
                for (let j = 0; j < 10; j++){
                    ar.push(0);
                }
                item.banCo.push(ar);
            }
            item.luot = null;
            item.ketThuc = false;
            item.value = null;
            item.luotVuaRoi = null;
            item.userWin = null;
            arrChat =item.chat;
        }
    })
    $("#khungChat").empty();
    arrChat.forEach(function(i,index){
        $("#khungChat").append(i)
    })
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
    console.log(arrChat)
   
}

function winGameCapNhatDiem(userName){
    $.ajax({
        url: '/winGame?username=' + userName,
        method: 'GET',
        success: function (data) {
            console.log('Cập nhật điểm thành công');
            socket.emit("capNhatDiem");
        },
        error: function () {
            alert('Cập nhật điểm thất bại');
        }
    });
}

function themLSD(user1, user2, userwin) {
    if (!user1 || !user2 || !userwin) {
        return;
    }
    $.ajax({
        url: '/themLSD?user1=' + user1 + '&user2=' + user2 + '&userwin=' + userwin,
        method: 'GET',
        success: function (data) {
            console.log('Thêm lịch sử đấu thành công');
        },
        error: function () {
            console.log("Thêm lịch sử đấu: " + user1 + " vs " + user2 + " - Người thắng: " + userwin);
        }
    });
}