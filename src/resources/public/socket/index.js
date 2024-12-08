function socket(io){
    var mangUser = []
    var mangSocketID = []

    io.on("connection",function(socket){
        console.log("co nguoi ket noi",socket.id)

        socket.on("disconnect",function(){
            if (socket.userName) { // Kiểm tra xem userName có phải là null không
                const index = mangUser.indexOf(socket.userName);
                if (index >= 0) {
                    io.to(socket.phong).emit("server-send-NguoiChoiKhacRoiPhong",socket.userName)

                    socket.leave(socket.phong)
                    socket.phong = null
                    socket.emit("server-send-RoiPhongThanhCong")
                    io.sockets.emit("server-send-GuiPhong",phong(socket,mangSocketID))
                    
                    mangUser.splice(index, 1); // Xóa phần tử tại vị trí index
                    mangSocketID.splice(index, 1); // Xóa phần tử tại vị trí index
                    socket.broadcast.emit("server-send-DanhSachUserOnline",mangUser)
                }
            }
            console.log(socket.id+" da ngat ket noi")
        })

        socket.on("username",function(data){
            if(mangUser.indexOf(data) >=0 ){
                //fail
                console.log("that bai dang nhap" + data)
                socket.emit("server-send-DangNhapThatBai")
            }
            else{
                // true
                mangUser.push(data)
                mangSocketID.push(socket.id)
                socket.userName = data
                io.sockets.emit("server-send-DanhSachUserOnline",mangUser)
                
                socket.emit("server-send-GuiPhong",phong(socket,mangSocketID))
            }
        })

        socket.on("taoPhong",function(data){
            soPhong = phong(socket,mangSocketID).length
            soPhong ++;
            idphong = soPhong+data
            socket.join(idphong)
            socket.phong = idphong

            io.sockets.emit("server-send-GuiPhong",phong(socket,mangSocketID))
            socket.emit("server-send-VaoPhongUser1",socket.userName)
            socket.emit("server-send-TenPhong",idphong)
            io.to(idphong).emit("server-send-CoNguoiVaoPhong",socket.userName)
        })

        socket.on("vaoPhong",function(data){
            
            socket.join(data)
            socket.phong = data
            socket.to(data).emit("server-send-YeuCauGuiThongTin")
            io.to(data).emit("server-send-VaoPhongUser2",socket.userName)
            socket.emit("server-send-TenPhong",data)
            io.to(data).emit("server-send-CoNguoiVaoPhong",socket.userName)
        })

        socket.on("YeuCauGuiThongTin",function(){
            socket.to(socket.phong).emit("server-send-VaoPhongUser1",socket.userName);
        })

        socket.on("chatPhong",function(data){
            io.to(socket.phong).emit("server-send-ChatPhong",[socket.userName,data])
        })

        socket.on("roiPhong",function(data){
            io.to(socket.phong).emit("server-send-NguoiChoiKhacRoiPhong",socket.userName)
            socket.leave(socket.phong)
            socket.phong = null
            socket.emit("server-send-RoiPhongThanhCong")
            io.sockets.emit("server-send-GuiPhong",phong(socket,mangSocketID))
        })






        socket.on("chatTong",function(data){
            io.sockets.emit("server-send-ChatTong",[socket.userName,data])
        })

        socket.on("nguoiChoiSanSang",function(){
            io.to(socket.phong).emit("server-send-SanSang",socket.userName)
        })

        socket.on("nguoiChoiHuy",function(){
            io.to(socket.phong).emit("server-send-Huy",socket.userName)
        })

        socket.on("user-danh-co",function(data){
            io.to(socket.phong).emit("server-send-UserDanhCo",data)
        })

        socket.on("phanChiaLuot",function(){
            socket.emit("server-send-PhanChiaLuot",socket.userName)
        })

        socket.on("themBot",function(){
            socket.emit("server-send-ThemBot")
        })

    })
}

function phong(socket , mangSocketID){
    var arrRoom = []
    for(r of socket.adapter.rooms){
        if (mangSocketID.indexOf(r[0]) < 0){
            arrRoom.push(r)
        }
    }
    return arrRoom
}

module.exports = socket