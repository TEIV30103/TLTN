class CaroMLBot {
    constructor() {
        this.model = null;
        this.boardSize = 9;
        this.epsilon = 0.1; // Tỷ lệ khám phá ngẫu nhiên
        this.gamma = 0.95;  // Discount factor
        this.memory = [];   // Replay memory
        this.memorySize = 10000;
        this.batchSize = 32;
        this.value = -1;
        
        this.initModel();
    }

    async initModel() {
        // Tạo mô hình deep Q-learning
        this.model = tf.sequential();
        
        // Input layer: Trạng thái bàn cờ (15x15x3)
        // Channel 1: Quân của bot
        // Channel 2: Quân của người chơi
        // Channel 3: Các ô trống
        this.model.add(tf.layers.conv2d({
            inputShape: [this.boardSize,this.boardSize, 3],
            filters: 32,
            kernelSize: 3,
            activation: 'relu',
            padding: 'same'
        }));

        this.model.add(tf.layers.conv2d({
            filters: 64,
            kernelSize: 3,
            activation: 'relu',
            padding: 'same'
        }));

        this.model.add(tf.layers.flatten());
        this.model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
        this.model.add(tf.layers.dense({ units: 81 })); // Output: Q-values cho mỗi vị trí

        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError'
        });
    }


    setBotValue(value) {
        this.value = value;
    }

    boardToState(board) {
        if (!board || !Array.isArray(board)) {
            console.error('Invalid board:', board);
            return null;
        }

        // Tạo mảng 4D: [batch_size, height, width, channels]
        const state = new Array(1).fill(0).map(() => 
            new Array(this.boardSize).fill(0).map(() => 
                new Array(this.boardSize).fill(0).map(() => 
                    new Array(3).fill(0)
                )
            )
        );

        // Điền dữ liệu vào mảng
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (board[i][j] === this.value) {
                    state[0][i][j][0] = 1;  // Kênh 0: quân bot
                } else if (board[i][j] === -this.value) {
                    state[0][i][j][1] = 1;  // Kênh 1: quân người chơi
                } else {
                    state[0][i][j][2] = 1;  // Kênh 2: ô trống
                }
            }
        }

        return tf.tensor4d(state);
    }

    async getAction(board, isTraining = true) {
        // Thêm logic đánh giá cơ bản
        // const evaluateMove = (board, x, y, value) => {
        //     const directions = [
        //         [1, 0], [0, 1], [1, 1], [1, -1]  // Các hướng kiểm tra
        //     ];
        //     let maxCount = 0;
            
        //     directions.forEach(([dx, dy]) => {
        //         let count = 1;
        //         // Kiểm tra theo hướng
        //         for (let i = 1; i < 5; i++) {
        //             const newX = x + dx * i;
        //             const newY = y + dy * i;
        //             if (newX < 0 || newX >= this.boardSize || newY < 0 || newY >= this.boardSize) break;
        //             if (board[newX][newY] === value) count++;
        //             else break;
        //         }
        //         // Kiểm tra hướng ngược lại
        //         for (let i = 1; i < 5; i++) {
        //             const newX = x - dx * i;
        //             const newY = y - dy * i;
        //             if (newX < 0 || newX >= this.boardSize || newY < 0 || newY >= this.boardSize) break;
        //             if (board[newX][newY] === value) count++;
        //             else break;
        //         }
        //         maxCount = Math.max(maxCount, count);
        //     });
        //     return maxCount;
        // };

        // // Nếu có nước thắng, đánh ngay
        // for (let i = 0; i < this.boardSize; i++) {
        //     for (let j = 0; j < this.boardSize; j++) {
        //         if (board[i][j] === 0) {
        //             // Thử đánh và kiểm tra thắng
        //             board[i][j] = this.value;
        //             if (evaluateMove(board, i, j, this.value) >= 5) {
        //                 board[i][j] = 0;
        //                 return { x: i, y: j };
        //             }
        //             board[i][j] = 0;
        //         }
        //     }
        // }

        // // Chặn nước thắng của đối thủ
        // for (let i = 0; i < this.boardSize; i++) {
        //     for (let j = 0; j < this.boardSize; j++) {
        //         if (board[i][j] === 0) {
        //             // Thử đánh và kiểm tra
        //             board[i][j] = -this.value;
        //             if (evaluateMove(board, i, j, -this.value) >= 4) {
        //                 board[i][j] = 0;
        //                 return { x: i, y: j };
        //             }
        //             board[i][j] = 0;
        //         }
        //     }
        // }

        // Nếu không có nước nguy hiểm, sử dụng model
        if (!isTraining && Math.random() > this.epsilon) {
            const state = this.boardToState(board);
            if (!state) return null;

            const qValues = await this.model.predict(state);
            const qArray = await qValues.array();
            
            console.log('Q-values for current state:', qArray[0]);  // Log Q-values
            
            let maxQ = -Infinity;
            let bestMove = null;

            for (let i = 0; i < this.boardSize; i++) {
                for (let j = 0; j < this.boardSize; j++) {
                    const index = i * this.boardSize + j;
                    if (board[i][j] === 0 && qArray[0][index] > maxQ) {
                        maxQ = qArray[0][index];
                        bestMove = { x: i, y: j };
                    }
                }
            }

            if (bestMove) return bestMove;
        }

        // Fallback: random move
        const emptyPositions = [];
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (board[i][j] === 0) {
                    emptyPositions.push([i, j]);
                }
            }
        }
        if (emptyPositions.length === 0) return null;
        const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        return { x: randomPos[0], y: randomPos[1] };
    }

    remember(state, action, reward, nextState, done) {
        console.log('Bot learning:', {
            action: action,
            reward: reward,
            done: done
        });
        
        this.memory.push({
            state: state,
            action: action,
            reward: reward,
            nextState: nextState,
            done: done
        });

        if (this.memory.length > this.memorySize) {
            this.memory.shift();
        }
        console.log('Memory size:', this.memory.length);
    }

    async replay() {
        if (this.memory.length >= this.batchSize) {
            console.log('Starting training with memory size:', this.memory.length);
            
            for (let i = 0; i < 10; i++) {
                // Lấy ngẫu nhiên một batch từ memory
                const batch = [];
                for (let i = 0; i < this.batchSize; i++) {
                    const index = Math.floor(Math.random() * this.memory.length);
                    batch.push(this.memory[index]);
                }

                // Training
                const states = tf.concat(batch.map(exp => exp.state));
                const nextStates = tf.concat(batch.map(exp => exp.nextState));

                const currentQ = await this.model.predict(states);
                const nextQ = await this.model.predict(nextStates);

                const x = [];
                const y = [];

                for (let i = 0; i < this.batchSize; i++) {
                    const experience = batch[i];
                    const current = await currentQ.array();
                    const next = await nextQ.array();

                    const targetQ = current[i];
                    const action = experience.action.x * this.boardSize + experience.action.y;

                    if (experience.done) {
                        targetQ[action] = experience.reward;
                    } else {
                        targetQ[action] = experience.reward + this.gamma * Math.max(...next[i]);
                    }

                    x.push(await experience.state.array());
                    y.push(targetQ);
                }

                const history = await this.model.fit(tf.tensor(x), tf.tensor(y), {
                    epochs: 1,
                    verbose: 1  // Change to 1 to see training progress
                });
                
                console.log('Training loss:', history.history.loss[0]);
            }
        }
    }

    async save() {
        try {
            // Lưu vào IndexedDB
            await this.model.save('indexeddb://caro-model');
            console.log('Model saved successfully');
        } catch (error) {
            console.error('Error saving model:', error);
        }
    }

    async load() {
        try {
            this.model = await tf.loadLayersModel('indexeddb://caro-model');
            console.log('Loaded pretrained model');
        } catch (e) {
            console.log('No pretrained model found');
        }
    }
}