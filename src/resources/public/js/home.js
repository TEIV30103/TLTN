var socket = io();
var soNguoiSS = 0;
var game;


// var coBot = false;
// const bot = new CaroMLBot();
// let lastBotMove = null;
// $(document).ready(async function() {
//     try {
//         await bot.load();
//         console.log('Bot loaded successfully');
//     } catch (error) {
//         console.error('Error loading bot:', error);
//     }
// });



socket.on("server-send-DangNhapThatBai",function(){
    // console.log("dangNhapThatBai")
    window.location.replace("/dangXuat");
})

socket.on("server-send-DanhSachUserOnline",function(data){
    $("#danhSachUserOnline").html("")
    data.forEach(element => {
        $("#danhSachUserOnline").append("<div class='user'>" + element + "</div>")
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
                </div>
            </div>`)
        $("#btnVao"+element[0]).click(function(){
            socket.emit("vaoPhong",element[0]);
        })
    })
})

socket.on("server-send-VaoPhongUser1",function(data){
    $("#menuPhong").hide()
    $("#phong").show(500);
    $("#user1").html(data)
})

socket.on("server-send-VaoPhongUser2",function(data){
    $("#menuPhong").hide()
    $("#phong").show(500);
    $("#user2").html(data)
})

socket.on("server-send-CoNguoiVaoPhong",function(data){
    $("#khungChat").append(data +":  đã vào phòng <br>" )
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
    soNguoiSS =0
})

socket.on("server-send-YeuCauGuiThongTin",function(){
    socket.emit("YeuCauGuiThongTin")
})

socket.on("server-send-ChatPhong",function(data){
    $("#khungChat").append("<p> <span class='chatUserName'>"+ data[0] +"</span> : "+data[1]+" </p>")
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
})

socket.on("server-send-RoiPhongThanhCong",function(){
    $("#menuPhong").show(500)
    $("#phong").hide()
    clearThongTinPhong()
})

socket.on("server-send-NguoiChoiKhacRoiPhong",function(data){
    if ($("#user1").html() == data){
        $("#user1").html($("#user2").html()) 
    }
    $("#user2").html("")
    $("#banCo").html("")
    $("#khungChat").append(data +":  đã rời phòng <br>" )
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
})

socket.on("server-send-TenPhong",function(data){
    $("#soPhongTTP").html("Số phòng: "+data[0])
    $("#tenPhongTTP").html("Tên phòng: "+data.substring(1))
})

socket.on("server-send-ChatTong",function(data){
    $("#chatTong").append("<p> <span class='chatUserName'>"+ data[0] +"</span> : "+data[1]+" </p>")
    $('#chatTong').scrollTop($('#chatTong')[0].scrollHeight);
})

socket.on("server-send-SanSang",function(data){
    soNguoiSS ++
    $("#khungChat").append(data +":  đã sẵn sàng <br>" )
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
    $("#khungChat").append(soNguoiSS )
    if(soNguoiSS == 2 || (soNguoiSS == 1 && coBot)){ // bat su kien bot o day luon
        console.log("bat dau")
        $('#hangCho').removeClass('d-flex').addClass('d-none') // an 
        //$('#hangCho').removeClass('d-none').addClass('d-flex'); hien

        $("#game").show(500)
        game = new Caro()
        socket.emit("phanChiaLuot")
    }
})

socket.on("server-send-PhanChiaLuot",function(data){
    console.log(data)
    if($("#user1").html() == data){
        console.log(1)
        game.luot = true
        game.value_Nguoi = 1;
    }
    else{
        console.log(2)
        game.luot = false
        game.value_Nguoi = -1;
    }
}) 


socket.on("server-send-Huy",function(data){
    soNguoiSS --
    $("#khungChat").append(data +":  đã huỷ sẵn sàng <br>" )
    $('#khungChat').scrollTop($('#khungChat')[0].scrollHeight);
})

socket.on("server-send-UserDanhCo",function(data){
    game.arr[data.i][data.j] = data.value
    game.valueOBanCo()
    game.luot = ! game.luot
    var a = game.checkWinGame(data.i,data.j)

    // if (coBot && !a) {
    //     const currentState = bot.boardToState(game.arr);
        
    //     setTimeout(async () => {
    //         console.log('Bot thinking about move...');
    //         const botMove = await bot.getAction(game.arr, false);
    //         if (botMove) {
    //             console.log('Bot chose move:', botMove);
    //             lastBotMove = botMove;
                
    //             game.arr[botMove.x][botMove.y] = -1
    //             game.valueOBanCo()
    //             game.luot = ! game.luot
                
    //             const nextState = bot.boardToState(game.arr);
    //             const tempReward = 0;
                
    //             console.log('Saving experience to memory');
    //             bot.remember(currentState, botMove, tempReward, nextState, false);
                
    //             console.log('Starting training...');
    //             await bot.replay();
    //         }
    //     }, 500);
    // }
})

// socket.on("server-send-ThemBot",async function(){
//     $("#user2").html("bot")
//     $("#khungChat").append("Bot đã vào <br>" )
//     try {
//         await bot.load();
//         console.log('Bot loaded successfully');
//     } catch (error) {
//         console.error('Error loading bot:', error);
//     }
//     coBot = true
// })




$(document).ready(function(){
    $("#phong").hide();
    chatTong(0)
    $("#chatTongF").hide();
    $("#xepHang").hide();
    $("#btnHuy").hide();

    hoverBtnTaoPhong()

    $("#btnTaoPhong").click(function(){
        socket.emit("taoPhong",$("#tenPhong").val())
    })

    $("#btnGuiChatPhong").click(function(){
        socket.emit("chatPhong",$("#chatPhong").val())
        $("#chatPhong").val("")
    })

    $("#btnRoiPhong").click(function(){
        socket.emit("roiPhong")
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
        setTimeout(chatTong(1),1000)

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
    })

    $("#btnSanSang").click(function(){
        $("#btnHuy").show()
        $("#btnSanSang").hide()
        socket.emit("nguoiChoiSanSang")
    })

    $("#btnHuy").click(function(){
        $("#btnHuy").hide()
        $("#btnSanSang").show()
        socket.emit("nguoiChoiHuy")
    })

    $("#btnThemBot").click(function(){
        socket.emit("themBot")
    })

})









function clearThongTinPhong(){
    $("#user1").html("")
    $("#user2").html("")
    $("#khungChat").html("")
    $("#tenPhong").html("")
    $("#banCo").html("")
}

function chatTong(s){
    if($('#chatTongF').css("flex") == '1 1 0%' || s == 0){
        $('#chatTongF').css("flex",'0')
        $('#chatTongF').css("display",'none')
        $('#chatTongHeight').css("height",'8vh')
        $('#chatTongHeight').css("margin-left",'18px')
        $('#chatTongHeight').addClass('fixed-bottom')
    }
    else{
        $('#chatTongF').css("display",'flex')
        $('#chatTongF').css("flex",'1')
        $('#chatTongHeight').css("height",'70vh')
        $('#chatTongHeight').css("margin-left",'0px')
        $('#chatTongHeight').removeClass('fixed-bottom')
    }
    
}

function hoverBtnTaoPhong(){
    const button = document.getElementById('btnTaoPhong');

    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left; // Tọa độ X của chuột
        const y = e.clientY - rect.top; // Tọa độ Y của chuột

        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
}


// function handleGameEnd(winner) {
//     if (coBot) {
//         const reward = winner === bot.value ? 1 : -1;
//         console.log('Game ended! Final reward:', reward);
        
//         const finalState = bot.boardToState(game.arr);
//         if (lastBotMove) {
//             bot.remember(finalState, lastBotMove, reward, finalState, true);
//             console.log('Training on final game state...');
//             bot.replay();
//             console.log('Saving trained model...');
//             bot.save();
//         }
//     }
// }