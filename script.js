const gameboard = (function() {
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

    const display = () => console.log(boardArr);

    return {
        mark,
        display,
        reset
    }
})();