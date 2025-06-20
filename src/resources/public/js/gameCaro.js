class Caro{
    constructor(id = "banCo"){
        this.row = 10;
        this.col = 10;
        this.arr = [];
        this.khaiBaoArr();
        this.veBanCo(id);
        this.EmptyArr();
        this.valueOBanCo(id);
        this.luot = null;
        this.value_Nguoi = 1;
        this.gameOver = false;
        this.id = null;
    }
    khaiBaoArr(){
        for (let i = 0; i < this.row; i++){
            var ar =[];
            for (let j = 0; j < this.col; j++){
                ar.push(0);
            }
            this.arr.push(ar);
        }
    }
    EmptyArr(){
        for (let i = 0; i < this.row; i++){
            for (let j = 0; j < this.col; j++){
                this.arr[i][j] = 0;
            }
        }
    }
    fullArr(){
        for (let i = 0; i < this.row; i++){
            for (let j = 0; j < this.col; j++){
                if (this.arr[i][j] == 0){
                    return false;
                }
            }
        }
        return true;
    }
    veBanCo(id){

        for(let i = 0; i < this.row; i++){
            var tr = document.createElement("tr");
            for (let j = 0; j < this.col; j++){
                var td = document.createElement("td");
                td.setAttribute("id",id+i.toString() + j.toString());
                td.setAttribute('class', 'p-3 border border-dark ');
                td.setAttribute('style', 'max-width: 20px; max-height: 20px; cursor: pointer; overflow: hidden;');
                td.addEventListener("click",()=>{
                    if (this.luot == true && !this.gameOver){ // && soNguoiSS == 2
                        if ( this.arr[i][j] != 0){
                            alert("Ô này đã được đánh rồi");
                        }
                        else{
                            // this.arr[i][j] = this.value_Nguoi;
                            // this.valueOBanCo();
                            // this.luot++;
                            // setTimeout(() => {
                            //     this.checkWinGame(i,j);
                            // }, 300);
                            var a = {
                                value: this.value_Nguoi,
                                i: i,
                                j: j
                            };
                            // console.log(a)
                            if(phongDangO == null){
                                // console.log(this.id)
                                socket.emit("user-danh-co",[a,this.id]);
                            }
                            else{
                                socket.emit("user-danh-co",[a,phongDangO]);
                            }

                        }
                    }
                })
                tr.appendChild(td);
            }
            document.getElementById(id).appendChild(tr);
        }
    }
    valueOBanCo(id = "banCo"){
        var i1 =0;
        for (let i = 0; i < this.row; i++){
            for (let j = 0; j < this.col; j++){
                if (this.arr[i][j] != 0){
                    i1 =1;
                    if (this.arr[i][j] == 1){
                        $("#"+id+i.toString() + j.toString()).attr("style", "background-image: url('/img/BC/"+quanX+"'); background-size: cover; background-position: center;")
                    }
                    else{
                        $("#"+id+i.toString() + j.toString()).attr("style", "background-image: url('/img/BC/"+quanO+"'); background-size: cover; background-position: center;")
                    }
                }
            }
        }
        return i1;
    }
    checkWinGame(i,j,id = "banCo"){
        if (this.checkDoc(i,j) >= 5 || this.checkNgang(i,j) >= 5 || this.checkCheoPhai(i,j) >= 5 || this.checkCheoTrai(i,j) >= 5){
            if( id == "banCo" ){
                // if (this.luot == false){
                    // console.log("win")
                    // socket.emit("Win-game",this.value_Nguoi);
                    // console.log("Win-game",this.arr[i][j]);
                    winGame(this.arr[i][j]);
                    this.gameOver = true;
                    return true;
                // }
            }
        }
        if(this.fullArr()){
            this.gameOver = true;
            $("#thongBao").html("Trận đấu hòa");
            $("#thongBao").css("color","blue")
        }
        return false;
    }

    checkDoc(i,j){
        var count =1;
        var val = this.arr[i][j];
        var i1 = i +1;
        if (i1 < this.row){
            while (this.arr[i1][j] == val){
                count ++;
                i1++;
                if (i1 >= this.row) break;
            }
        }
        i1 = i -1;
        if (i1 >= 0){
            while (this.arr[i1][j] == val){
                count ++;
                i1--;
                if (i1 < 0) break;
            }
        }
        
        return count;
    }

    checkNgang(i,j){
        var count =1;
        var val = this.arr[i][j];
        var j1 = j +1;
        if (j1 < this.col){
            while (this.arr[i][j1] == val ){
                count ++;
                j1++;
                if (j1 >= this.col) break;
            }
        }
        j1 = j -1;
        if (j1 >= 0){
            while (this.arr[i][j1] == val){
                count ++;
                j1--;
                if (j1 < 0) break;
            }
        }

        return count;
    }

    checkCheoTrai(i,j){
        var count =1;
        var val = this.arr[i][j];
        var i1 = i +1;
        var j1 = j +1;
        if (i1 < this.row && j1 < this.col){
            while (this.arr[i1][j1] == val){
                count ++;
                i1++;
                j1++;
                if (i1 >= this.row || j1 >= this.col) break;
            }
        }
        i1 = i -1;
        j1 = j -1;
        if (i1 >= 0 && j1 >=0){
            while (this.arr[i1][j1] == val){
                count ++;
                i1--;
                j1--;
                if (i1 < 0 || j1 < 0) break;
            }
        }

        return count;
    }

    checkCheoPhai(i,j){
        var count =1;
        var val = this.arr[i][j];
        var i1 = i -1;
        var j1 = j +1;
        if (i1 >=0 && j1 < this.col){
            while (this.arr[i1][j1] == val){
                count ++;
                i1--;
                j1++;
                if (i1 < 0 || j1 >= this.col) break;
            }
        }
        
        i1 = i +1;
        j1 = j -1;
        if ( i1 < this.row && j1 >=0){
            while (this.arr[i1][j1] == val){
                count ++;
                i1++;
                j1--;
                if (i1 >= this.row || j1 <0) break;
            }
        }
        return count;
    }
}
