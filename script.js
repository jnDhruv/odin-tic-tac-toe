const Gameboard = function() {
    const boardArr = [[0,0,0],[0,0,0],[0,0,0]];

    const mark = (pointer, r, c) => {
        boardArr[r][c] = pointer;
    }

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
        display,
        reset
    }
};

const Player = (name, marker) => {

    const getName = () => name;
    const getMarker = () => marker;

    return {
        getName,
        getMarker
    };
}

const game = (function() {
    
    const board = Gameboard();

    const players = [Player("One", "O"), Player("Two","X")];

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0]? players[1] : players[0];
    };

    const playRound = (row, col) => {
        board.mark(activePlayer.getMarker(), row, col);
        switchActivePlayer();
        board.display();
    }

    return {
        playRound,
        getActivePlayer
    }
})();