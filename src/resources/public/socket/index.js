function socket(io){
    var mangUser = []
    var mangSocketID = []
    var phongCoBot = []
    var phongCoMatKhau = []

    io.on("connection",function(socket){
        console.log("co nguoi ket noi",socket.id)
        socket.phong = []

        socket.on("disconnect",function(){
            if (socket.userName) { // Kiểm tra xem userName có phải là null không
                const index = mangUser.indexOf(socket.userName);
                if (index >= 0) {
                    socket.phong.forEach(element => {
                        io.to(element).emit("server-send-NguoiChoiKhacRoiPhong",[socket.userName,element])
                        let vitri = phongCoBot.indexOf(element);
                        if (vitri !== -1) {
                            phongCoBot.splice(vitri, 1);
                        }
                        vitri = phongCoMatKhau.indexOf(element)
                        if (vitri !== -1) {
                            phongCoMatKhau.splice(vitri,1)
                        }

                        socket.leave(element)
                    });
                    
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
                console.log("dang nhap thanh cong " + data)
                mangUser.push(data)
                mangSocketID.push(socket.id)
                socket.userName = data
                socket.emit("server-send-DangNhapThanhCong",data)
                io.sockets.emit("server-send-DanhSachUserOnline",mangUser)
                
                socket.emit("server-send-GuiPhong",phong(socket,mangSocketID))
            }
        })

        socket.on("taoPhong",function(data){
            if(socket.phong.length >= 4){
                socket.emit("server-send-daVaoToiDaPhong")
                return;
            } 

            arrRoom = phong(socket,mangSocketID)
            soPhong = arrRoom.length;
            soPhong ++;
            while(kiemTaSoPhongCoTonTai(arrRoom, soPhong)){
                soPhong++;
            }
            idphong = soPhong + data.replace(/\s+/g, '');
            socket.join(idphong)
            socket.phong.push(idphong)

            // socket.phong[socket.phong.length-1].user1 = socket.userName

            io.sockets.emit("server-send-GuiPhong",phong(socket,mangSocketID))
            socket.emit("server-send-VaoPhong",idphong)
            socket.emit("server-send-VaoPhongUser1",[socket.userName,idphong])
            socket.emit("server-send-TenPhong",idphong)
            io.to(idphong).emit("server-send-CoNguoiVaoPhong",[socket.userName,data])
            
        })

        socket.on("taoPhongCoMatKhau",function(data){
            if(socket.phong.length >= 4){
                socket.emit("server-send-daVaoToiDaPhong")
                return;
            } 

            arrRoom = phong(socket,mangSocketID)
            soPhong = arrRoom.length;
            soPhong ++;
            while(kiemTaSoPhongCoTonTai(arrRoom, soPhong)){
                soPhong++;
            }
            idphong = soPhong+data[0].replace(/\s+/g, '');
            socket.join(idphong)
            socket.phong.push(idphong)
            phongCoMatKhau.push([idphong,data[1]])
            // console.log(phongCoMatKhau)
            // socket.phong[socket.phong.length-1].user1 = socket.userName


            io.sockets.emit("server-send-GuiPhong",phong(socket,mangSocketID))
            socket.emit("server-send-VaoPhong",idphong)
            socket.emit("server-send-VaoPhongUser1",[socket.userName,idphong])
            socket.emit("server-send-TenPhong",idphong)
            io.to(idphong).emit("server-send-CoNguoiVaoPhong",[socket.userName,data])
            
        })


        socket.on("soNguoiTrongPhong",function(data){
            socket.emit("server-send-SoNguoiTrongPhong",[soNguoiTrongPhong(io,phongCoBot,data),data])
        })

        socket.on("phongCoMatKhau",function(data){
            if (phongCoMatKhauKhong(data,phongCoMatKhau)){
                socket.emit("server-send-PhongCoMatKhau",data)
            }
        })



        socket.on("guiPhong",function(data){
            socket.emit("server-send-GuiPhong",phong(socket,mangSocketID))
        })




        socket.on("vaoPhong",function(data){
            if(socket.phong.length >= 4){
                socket.emit("server-send-daVaoToiDaPhong")
                return;
            } 

            socket.join(data)
            socket.phong.push(data)
            socket.to(data).emit("server-send-YeuCauGuiThongTin",data)
            socket.emit("server-send-VaoPhong",data)
            socket.emit("server-send-VaoPhongUser2",[socket.userName,data])
            socket.to(data).emit("server-send-ThongTinUser2",[socket.userName,data])
            socket.emit("server-send-TenPhong",data)
            io.to(data).emit("server-send-CoNguoiVaoPhong",[socket.userName,data])
            socket.broadcast.emit("server-send-GuiPhong",phong(socket,mangSocketID))
            
        })

        socket.on("vaoPhongLai",function(data){
            
            arrRoom = nguoiOTrongPhong(io,phongCoBot,data)
            for(let i = 0; i < arrRoom.length; i++){
                if (arrRoom[i] == socket.id){
                    if(i == 0){
                        socket.emit("server-send-VaoPhongUser1",[socket.userName,data])
                        if(arrRoom.length == 2){
                            socket.to(data).emit("server-send-YeuCauGuiThongTinUser2",data)
                        }
                        else{
                            if(phongCoBot.indexOf(data) >= 0){
                                socket.emit("server-send-PhongDangCoBot")
                            }
                            else{
                                socket.emit("server-send-PhongKhongCoBot")
                            }
                        }
                    }
                        
                    if(i == 1){
                        socket.to(data).emit("server-send-YeuCauGuiThongTin",data)
                        socket.emit("server-send-VaoPhongUser2",[socket.userName,data])
                    }
                }
            }
            socket.emit("server-send-TenPhong",data)
            socket.emit("server-send-CapNhatLaiNutSS",data)
            socket.emit("server-send-KiemTraTranDauBatDau",data)
            socket.emit("server-send-chat",data)
        })

        socket.on("vaoPhongCoMatKhau",function(data){
            if(phongDungMatKhauKhong(data[0],phongCoMatKhau,data[1])){
                socket.join(data[0])
                socket.phong.push(data[0])
                socket.to(data[0]).emit("server-send-YeuCauGuiThongTin",data[0])
                socket.emit("server-send-VaoPhong",idphong)
                socket.emit("server-send-VaoPhongUser2",[socket.userName,data])
                socket.to(data[0]).emit("server-send-ThongTinUser2",[socket.userName,data])
                socket.emit("server-send-TenPhong",data[0])
                io.to(data[0]).emit("server-send-CoNguoiVaoPhong",[socket.userName,data[0]])
                socket.broadcast.emit("server-send-GuiPhong",phong(socket,mangSocketID))
                
            }
            else{
                socket.emit("server-send-MatKhauSai")
            }
        })

        socket.on("minhCoTrongPhongKhong",function(data){
            if (socket.phong.indexOf(data) >= 0){
                socket.emit("server-send-CoTrongPhong",data)
            }
        })

        socket.on("YeuCauGuiThongTin",function(data){
            socket.to(data).emit("server-send-ThongTinUser1",[socket.userName,data]);
        })

        socket.on("YeuCauGuiThongTinUser2",function(data){
            socket.to(data).emit("server-send-ThongTinUser2",[socket.userName,data]);
        })

        socket.on("chatPhong",function(data){
            if (data[0] != "")
                io.to(data[1]).emit("server-send-ChatPhong",[socket.userName,data[0],data[1]])
        })

        socket.on("chatTran",function(data){
            if (data[0] != "")
                io.to(data[1]).emit("server-send-ChatTran",[socket.userName,data[0],data[1]])
        })

        socket.on("roiPhong",function(data){
            io.to(data).emit("server-send-NguoiChoiKhacRoiPhong",[socket.userName,data])
            
            cobot = false;
            let vitri = phongCoBot.indexOf(data);
            if (vitri !== -1) {
                cobot = true;
                phongCoBot.splice(vitri, 1);
            }

            phongCoMatKhau.forEach((item, index) => {
                if (item[0] === data) {
                    soNguoi = soNguoiTrongPhong(io, phongCoBot, data)
                    // console.log("so nguoi trong phong: " + soNguoi)
                    if( soNguoi==1 || (soNguoi == 2 && cobot))
                        phongCoMatKhau.splice(index, 1);
                }
            });

            socket.leave(data)
            vitri = socket.phong.indexOf(data)
            if (vitri !== -1) {
                socket.phong.splice(vitri, 1);
            }

            socket.emit("server-send-RoiPhongThanhCong",data)
            io.sockets.emit("server-send-GuiPhong",phong(socket,mangSocketID))
        })






        socket.on("chatTong",function(data){
            io.sockets.emit("server-send-ChatTong",[socket.userName,data])
        })

        socket.on("nguoiChoiSanSang",function(data){
            io.to(data).emit("server-send-SanSang",[socket.userName,data])
        })

        socket.on("nguoiChoiHuy",function(data){
            io.to(data).emit("server-send-Huy",[socket.userName,data])
        })

        socket.on("user-danh-co",function(data){
            io.to(data[1]).emit("server-send-UserDanhCo",data)
        })

        socket.on("phanChiaLuot",function(data){
            socket.emit("server-send-PhanChiaLuot",[socket.userName,data])
        })

        socket.on("themBot",function(data){
            phongCoBot.push(data)
            socket.emit("server-send-ThemBot",data)
            socket.broadcast.emit("server-send-GuiPhong",phong(socket,mangSocketID))
        })

        socket.on("xoaBot",function(data){
            phongCoBot.splice(phongCoBot.indexOf(data),1)
            socket.emit("server-send-XoaBot",data)
            socket.broadcast.emit("server-send-GuiPhong",phong(socket,mangSocketID))
        })

        socket.on("dauHang",function(data){
            socket.emit("server-send-DauHang",data);
            socket.to(data).emit("server-send-DoiThuDauHang",data);
        })

        socket.on("doiThuDauHang",function(data){
            socket.emit("server-send-DoiThuDauHang",data);
        })
        
        socket.on("capNhatDiem",function(){
            io.sockets.emit("server-send-CapNhatDiem");
        })

        socket.on("guiLoiMoiUser",function(data){
            const recipientSocket = findSocketByUsername(io, data[0]);
            if (recipientSocket) {
                io.to(recipientSocket.id).emit("server-send-LoiMoiUser", [data[2], data[1]]);
            }
        })

        socket.on("chapNhanMoiUser",function(data){
            if(soNguoiTrongPhong(io, phongCoBot, data) < 2){
                socket.join(data)
                socket.phong.push(data)
                socket.to(data).emit("server-send-YeuCauGuiThongTin",data)
                socket.emit("server-send-VaoPhong",data)
                socket.emit("server-send-VaoPhongUser2",[socket.userName,data])
                socket.to(data).emit("server-send-ThongTinUser2",[socket.userName,data])
                socket.emit("server-send-TenPhong",data)
                io.to(data).emit("server-send-CoNguoiVaoPhong",[socket.userName,data])
                socket.broadcast.emit("server-send-GuiPhong",phong(socket,mangSocketID))
            }
            else{
                socket.emit("server-send-PhongDaDay",data)
            }
        })

        socket.on("resetPhong",function(data){
            io.to(data).emit("server-send-ResetPhong", data);
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

function kiemTaSoPhongCoTonTai(arrRoom, soPhong){
    for (let i = 0; i < arrRoom.length; i++){
        if (arrRoom[i][0][0] == soPhong){
            
            return true
        }
    }
    return false
}

function nguoiOTrongPhong(io,phongCoBot,tenPhong){
    const room = io.sockets.adapter.rooms.get(tenPhong);
    let roomArray = room ? [...room] : [];
    return roomArray;
}


function soNguoiTrongPhong(io,phongCoBot,tenPhong){
    const room = io.sockets.adapter.rooms.get(tenPhong);
    const count = room ? room.size : 0;

    if(phongCoBot.indexOf(tenPhong) >= 0){
        return count+1;
    }

    return count;
}

function phongCoMatKhauKhong(tenPhong,phongCoMatKhau){
    for (let i = 0; i < phongCoMatKhau.length; i++){
        if (phongCoMatKhau[i][0] == tenPhong){
            return true
        }
    }
    return false
}

function phongDungMatKhauKhong(tenPhong,phongCoMatKhau,matKhau){
    for (let i = 0; i < phongCoMatKhau.length; i++){
        if (phongCoMatKhau[i][0] == tenPhong){
            if (phongCoMatKhau[i][1] == matKhau){
                return true
            }
            else{
                return false
            }
        }
    }
    return false
}

function findSocketByUsername(io, username) {
    for (let [id, socket] of io.of("/").sockets) {
        if (socket.userName === username) {
            return socket;
        }
    }
    return null;
}

module.exports = socket