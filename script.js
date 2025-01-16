const Gameboard = function() {
    const boardArr = [[0,0,0],[0,0,0],[0,0,0]];

    const mark = (pointer, r, c) => {
        boardArr[r][c] = pointer;
    };

    const getBoard = () => boardArr;
    const getCell = (rowIndex,colIndex) => boardArr[rowIndex][colIndex];
    const getRow = (rowIndex) => boardArr[rowIndex];
    const getCol = (colIndex) => [boardArr[0][colIndex], boardArr[1][colIndex], boardArr[2][colIndex]];
    const getDiag = () => [boardArr[0][0], boardArr[1][1], boardArr[2][2]];
    const getAntiDiag = () => [boardArr[0][2], boardArr[1][1], boardArr[2][0]];

    const reset = () => {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                boardArr[row][col] = 0;
            }
        }
    }

    const display = () => {
        boardArr.forEach(row => {
            console.log(row);
        });
    };

    return {
        mark,
        getBoard,
        getCell,
        getRow,
        getCol,
        getDiag,
        getAntiDiag,
        display,
        reset
    };
};

const Player = (name, marker) => {
    let moves = 0;
    let playerName = name;

    const getName = () => playerName;
    const getMarker = () => marker;
    const getMoves = () => moves;
    const addMove = () => moves++;
    const resetMoves = () => {
        moves = 0;
    }

    return {
        getName,
        getMarker,
        getMoves,
        addMove,
        resetMoves
    };
}

const Game = (function() {
    
    const board = Gameboard();
    const players = [Player("One", "O"), Player("Two","X")];
    let totalMoves = 0;

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0]? players[1] : players[0];
    };

    const matchPattern = (arr1,arr2) => {
        return arr1.join('') == arr2.join('');
    };

    const playRound = (row, col) => {
        // prevents overwritting a cell if preoccupied cell entered
        if (board.getCell(row,col)) {
            return 0;
        }

        // driver
        board.mark(activePlayer.getMarker(), row, col);
        activePlayer.addMove();
        totalMoves++;

        // winner logic
        if (activePlayer.getMoves() > 2) {
            const marker = activePlayer.getMarker();
            const winningPattern = [marker,marker,marker];
            
            if (matchPattern(board.getRow(row), winningPattern)
                || matchPattern(board.getCol(col), winningPattern)
                || matchPattern(board.getDiag(), winningPattern)
                || matchPattern(board.getAntiDiag(), winningPattern)
            ) {
                // do something when a player has won
                return 1;
            }
        } 
        // draw logic
        if (totalMoves === 9) {
            // do something when tied
            return -1;
        }
        
        switchActivePlayer();
    };

    const reset = () => {
        board.reset();
        totalMoves = 0;

        players.forEach((player) => {
            player.resetMoves();
        });

        activePlayer = players[0];
    }

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        reset
    };
})();

const DOMController = (() => {
    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");
    const resultDiag = document.querySelector(".result");
    const resultMsg = resultDiag.querySelector("p");
    const playAgain = resultDiag.querySelector("button");

    const updateDOM = () => {
        const actPlayer = Game.getActivePlayer();
        turnDiv.textContent = `${actPlayer.getName()}'s turn.. ${actPlayer.getMarker()} to play`;

        boardDiv.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const btn = document.createElement('button');
                btn.classList.add("btn");

                if (Game.getBoard()[i][j]) {
                    btn.textContent = Game.getBoard()[i][j];
                }
    
                btn.dataset.row = i;
                btn.dataset.col = j;
                boardDiv.appendChild(btn);
            }
        }
    };
    
    

    boardDiv.addEventListener('click', (e) => {
        // if line between buttons is clicked
        if (!e.target.dataset.row && !e.target.dataset.col) {
            return;
        }

        const result = Game.playRound(e.target.dataset.row, e.target.dataset.col);
        updateDOM();
        if (result === 1) {
            const winner = Game.getActivePlayer();
            resultMsg.textContent = `3 ${winner.getMarker()}'s in a row, ${winner.getName()} wins!!`;
            resultDiag.showModal();
        }
        if (result === -1) {
            resultMsg.textContent = `It's a tie!`;
            resultDiag.showModal(); 
        }   
    });

    playAgain.addEventListener('click', () => {
        Game.reset();
        updateDOM();
        resultDiag.close();
    });

    updateDOM();
})();