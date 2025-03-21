class Connect4 {
  constructor() {
    this.board = Array(6).fill().map(() => Array(7).fill(0));
    this.currentPlayer = 1;
    this.gameOver = false;
    this.init();
  }

  init() {
    this.renderBoard();
    this.addEventListeners();
    this.updateStatus();
    document.getElementById('reset').addEventListener('click', () => this.resetGame());
  }

  resetGame() {
    this.board = Array(6).fill().map(() => Array(7).fill(0));
    this.currentPlayer = 1;
    this.gameOver = false;
    this.renderBoard();
    this.updateStatus();
  }

  renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 6; row++) {
      const rowElement = document.createElement('div');
      rowElement.classList.add('row');
      for (let col = 0; col < 7; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (this.board[row][col] !== 0) {
          cell.dataset.player = this.board[row][col];
        }
        cell.dataset.col = col;
        rowElement.appendChild(cell);
      }
      boardElement.appendChild(rowElement);
    }
  }

  addEventListeners() {
    const boardElement = document.getElementById('board');
    boardElement.addEventListener('click', (e) => {
      if (this.gameOver) return;
      
      const cell = e.target;
      if (!cell.classList.contains('cell')) return;
      
      const col = cell.dataset.col;
      if (col === undefined) return;
      
      if (this.makeMove(col, this.currentPlayer)) {
        if (this.checkWin(this.currentPlayer)) {
          this.gameOver = true;
          this.updateStatus(`Player ${this.currentPlayer} wins!`);
          return;
        }
        
        if (this.isBoardFull()) {
          this.gameOver = true;
          this.updateStatus("It's a draw!");
          return;
        }
        
        this.currentPlayer = 2;
        this.updateStatus();
        this.makeAIMove();
      }
    });
  }

  makeMove(col, player) {
    for (let row = 5; row >= 0; row--) {
      if (this.board[row][col] === 0) {
        this.board[row][col] = player;
        this.renderBoard();
        return true;
      }
    }
    return false;
  }

  makeAIMove() {
    const availableColumns = [];
    for (let col = 0; col < 7; col++) {
      if (this.board[0][col] === 0) {
        availableColumns.push(col);
      }
    }
    
    const randomCol = availableColumns[Math.floor(Math.random() * availableColumns.length)];
    this.makeMove(randomCol, 2);
    
    if (this.checkWin(2)) {
      this.gameOver = true;
      this.updateStatus('PC wins!');
      return;
    }
    
    if (this.isBoardFull()) {
      this.gameOver = true;
      this.updateStatus("It's a draw!");
      return;
    }
    
    this.currentPlayer = 1;
    this.updateStatus();
  }

  checkWin(player) {
    // Check horizontal
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === player &&
            this.board[row][col+1] === player &&
            this.board[row][col+2] === player &&
            this.board[row][col+3] === player) {
          return true;
        }
      }
    }

    // Check vertical
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (this.board[row][col] === player &&
            this.board[row+1][col] === player &&
            this.board[row+2][col] === player &&
            this.board[row+3][col] === player) {
          return true;
        }
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === player &&
            this.board[row+1][col+1] === player &&
            this.board[row+2][col+2] === player &&
            this.board[row+3][col+3] === player) {
          return true;
        }
      }
    }

    // Check diagonal (bottom-left to top-right)
    for (let row = 3; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === player &&
            this.board[row-1][col+1] === player &&
            this.board[row-2][col+2] === player &&
            this.board[row-3][col+3] === player) {
          return true;
        }
      }
    }

    return false;
  }

  isBoardFull() {
    return this.board[0].every(cell => cell !== 0);
  }

  updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (message) {
      statusElement.textContent = message;
    } else {
      statusElement.textContent = this.currentPlayer === 1 ? 
        'Your turn (Red)' : 'PC is thinking...';
    }
  }
}

new Connect4();
