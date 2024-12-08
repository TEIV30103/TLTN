socket.on("server-send_DangNhapThatBai",function(){
    // console.log("dangNhapThatBai")
    window.location.replace("/dangXuat");
})

socket.on("server-send-DanhSachUserOnline",function(data){
    $("#danhSachUserOnline").html("")
    data.forEach(element => {
        $("#danhSachUserOnline").append("<div class='user'>" + element + "</div>")
    });
})

$(document).ready(function(){
    
})