class botCaroMinimax{
    constructor(game){
        this.game = game;
        this.valueMay = -1;
        this.arrDiemTanCong = [0, 3, 24, 192, 1536, 12288, 98304];
        this.arrDiemPhongNgu = [0, 1, 9, 81, 729, 6561, 59049];
    }

    setValue(value){
        this.valueMay = value;
    }

    botDanh(id="banCo"){
        if (!this.game.valueOBanCo(id)){
            this.game.arr[5][5] = this.valueMay;
            this.game.valueOBanCo(id);
            return false;
        }
        else{
            return this.timKiemNuocDi(id);
        }
    }

    timKiemNuocDi(id){
        let diemMax = -Infinity;
        let x = -1;
        let y = -1;

        for(let i = 0; i < this.game.row; i++){
            for(let j = 0; j < this.game.col; j++){
                if(this.game.arr[i][j] === 0){
                    let diemTanCong = this.diemTC_duyetDoc(i, j) + this.diemTC_duyetNgang(i, j) + 
                                      this.diemTC_duyetCheoTrai(i, j) + this.diemTC_duyetCheoPhai(i, j);
                    let diemPhongThu = this.diemPT_duyetDoc(i, j) + this.diemPT_duyetNgang(i, j) + 
                                       this.diemPT_duyetCheoTrai(i, j) + this.diemPT_duyetCheoPhai(i, j);

                    let diemTam = Math.max(diemTanCong, diemPhongThu);

                    // Thêm ưu tiên khoảng cách đến tâm bàn cờ
                    let khoangCachDenTam = Math.abs(i - this.game.row / 2) + Math.abs(j - this.game.col / 2);
                    diemTam -= khoangCachDenTam * 0.1;

                    if(diemTam > diemMax){
                        diemMax = diemTam;
                        x = i;
                        y = j;
                    }
                }
            }
        }

        if(x !== -1 && y !== -1){
            return [x, y, this.valueMay];
            // this.game.arr[x][y] = this.valueMay;
            // this.game.valueOBanCo(id);
            // return this.game.checkWinGame(x, y, id);
        }
        return false;
    }

    diemTC_duyetDoc(row, col){
        let diemTong = 0;
        let soQuanTa = 0;
        let soQuanDich = 0;

        for(let dem = 1; dem < 5 && row + dem < this.game.row; dem++){
            if(this.game.arr[row + dem][col] === this.valueMay){
                soQuanTa++;
            } else if(this.game.arr[row + dem][col] === this.game.value_Nguoi){
                soQuanDich++;
                break;
            } else {
                break;
            }
        }

        for(let dem = 1; dem < 5 && row - dem >= 0; dem++){
            if(this.game.arr[row - dem][col] === this.valueMay){
                soQuanTa++;
            } else if(this.game.arr[row - dem][col] === this.game.value_Nguoi){
                soQuanDich++;
                break;
            } else {
                break;
            }
        }

        if(soQuanDich >= 2) return 0;

        diemTong -= this.arrDiemPhongNgu[soQuanDich];
        diemTong += this.arrDiemTanCong[soQuanTa];
        return diemTong;
    }

    diemTC_duyetNgang(row, col){
        let diemTong = 0;
        let soQuanTa = 0;
        let soQuanDich = 0;

        for(let dem = 1; dem < 5 && col + dem < this.game.col; dem++){
            if(this.game.arr[row][col + dem] === this.valueMay){
                soQuanTa++;
            } else if(this.game.arr[row][col + dem] === this.game.value_Nguoi){
                soQuanDich++;
                break;
            } else {
                break;
            }
        }

        for(let dem = 1; dem < 5 && col - dem >= 0; dem++){
            if(this.game.arr[row][col - dem] === this.valueMay){
                soQuanTa++;
            } else if(this.game.arr[row][col - dem] === this.game.value_Nguoi){
                soQuanDich++;
                break;
            } else {
                break;
            }
        }

        if(soQuanDich >= 2) return 0;

        diemTong -= this.arrDiemPhongNgu[soQuanDich];
        diemTong += this.arrDiemTanCong[soQuanTa];
        return diemTong;
    }

    diemTC_duyetCheoTrai(row, col){
        let diemTong = 0;
        let soQuanTa = 0;
        let soQuanDich = 0;

        for(let dem = 1; dem < 5 && row + dem < this.game.row && col + dem < this.game.col; dem++){
            if(this.game.arr[row + dem][col + dem] === this.valueMay){
                soQuanTa++;
            } else if(this.game.arr[row + dem][col + dem] === this.game.value_Nguoi){
                soQuanDich++;
                break;
            } else {
                break;
            }
        }

        for(let dem = 1; dem < 5 && row - dem >= 0 && col - dem >= 0; dem++){
            if(this.game.arr[row - dem][col - dem] === this.valueMay){
                soQuanTa++;
            } else if(this.game.arr[row - dem][col - dem] === this.game.value_Nguoi){
                soQuanDich++;
                break;
            } else {
                break;
            }
        }

        if(soQuanDich >= 2) return 0;

        diemTong -= this.arrDiemPhongNgu[soQuanDich];
        diemTong += this.arrDiemTanCong[soQuanTa];
        return diemTong;
    }

    diemTC_duyetCheoPhai(row, col){
        let diemTong = 0;
        let soQuanTa = 0;
        let soQuanDich = 0;

        for(let dem = 1; dem < 5 && row - dem >= 0 && col + dem < this.game.col; dem++){
            if(this.game.arr[row - dem][col + dem] === this.valueMay){
                soQuanTa++;
            } else if(this.game.arr[row - dem][col + dem] === this.game.value_Nguoi){
                soQuanDich++;
                break;
            } else {
                break;
            }
        }

        for(let dem = 1; dem < 5 && row + dem < this.game.row && col - dem >= 0; dem++){
            if(this.game.arr[row + dem][col - dem] === this.valueMay){
                soQuanTa++;
            } else if(this.game.arr[row + dem][col - dem] === this.game.value_Nguoi){
                soQuanDich++;
                break;
            } else {
                break;
            }
        }

        if(soQuanDich >= 2) return 0;

        diemTong -= this.arrDiemPhongNgu[soQuanDich];
        diemTong += this.arrDiemTanCong[soQuanTa];
        return diemTong;
    }

    diemPT_duyetDoc(row, col){
        let diemTong = 0;
        let soQuanTa = 0;
        let soQuanDich = 0;

        for(let dem = 1; dem < 5 && row + dem < this.game.row; dem++){
            if(this.game.arr[row + dem][col] === this.valueMay){
                soQuanTa++;
                break;
            } else if(this.game.arr[row + dem][col] === this.game.value_Nguoi){
                soQuanDich++;
            } else {
                break;
            }
        }

        for(let dem = 1; dem < 5 && row - dem >= 0; dem++){
            if(this.game.arr[row - dem][col] === this.valueMay){
                soQuanTa++;
                break;
            } else if(this.game.arr[row - dem][col] === this.game.value_Nguoi){
                soQuanDich++;
            } else {
                break;
            }
        }

        if(soQuanTa >= 2) return 0;

        diemTong += this.arrDiemPhongNgu[soQuanDich];
        return diemTong;
    }

    diemPT_duyetNgang(row, col){
        let diemTong = 0;
        let soQuanTa = 0;
        let soQuanDich = 0;

        for(let dem = 1; dem < 5 && col + dem < this.game.col; dem++){
            if(this.game.arr[row][col + dem] === this.valueMay){
                soQuanTa++;
                break;
            } else if(this.game.arr[row][col + dem] === this.game.value_Nguoi){
                soQuanDich++;
            } else {
                break;
            }
        }

        for(let dem = 1; dem < 5 && col - dem >= 0; dem++){
            if(this.game.arr[row][col - dem] === this.valueMay){
                soQuanTa++;
                break;
            } else if(this.game.arr[row][col - dem] === this.game.value_Nguoi){
                soQuanDich++;
            } else {
                break;
            }
        }

        if(soQuanTa >= 2) return 0;

        diemTong += this.arrDiemPhongNgu[soQuanDich];
        return diemTong;
    }

    diemPT_duyetCheoTrai(row, col){
        let diemTong = 0;
        let soQuanTa = 0;
        let soQuanDich = 0;

        for(let dem = 1; dem < 5 && row + dem < this.game.row && col + dem < this.game.col; dem++){
            if(this.game.arr[row + dem][col + dem] === this.valueMay){
                soQuanTa++;
                break;
            } else if(this.game.arr[row + dem][col + dem] === this.game.value_Nguoi){
                soQuanDich++;
            } else {
                break;
            }
        }

        for(let dem = 1; dem < 5 && row - dem >= 0 && col - dem >= 0; dem++){
            if(this.game.arr[row - dem][col - dem] === this.valueMay){
                soQuanTa++;
                break;
            } else if(this.game.arr[row - dem][col - dem] === this.game.value_Nguoi){
                soQuanDich++;
            } else {
                break;
            }
        }

        if(soQuanTa >= 2) return 0;

        diemTong += this.arrDiemPhongNgu[soQuanDich];
        return diemTong;
    }

    diemPT_duyetCheoPhai(row, col){
        let diemTong = 0;
        let soQuanTa = 0;
        let soQuanDich = 0;

        for(let dem = 1; dem < 5 && row - dem >= 0 && col + dem < this.game.col; dem++){
            if(this.game.arr[row - dem][col + dem] === this.valueMay){
                soQuanTa++;
                break;
            } else if(this.game.arr[row - dem][col + dem] === this.game.value_Nguoi){
                soQuanDich++;
            } else {
                break;
            }
        }

        for(let dem = 1; dem < 5 && row + dem < this.game.row && col - dem >= 0; dem++){
            if(this.game.arr[row + dem][col - dem] === this.valueMay){
                soQuanTa++;
                break;
            } else if(this.game.arr[row + dem][col - dem] === this.game.value_Nguoi){
                soQuanDich++;
            } else {
                break;
            }
        }

        if(soQuanTa >= 2) return 0;

        diemTong += this.arrDiemPhongNgu[soQuanDich];
        return diemTong;
    }
}
