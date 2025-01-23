import { Game, Gameboard, Player } from "./game.js";

const DOMController = (() => {
    const infoDiag = document.querySelector(".player-info");
    const infoForm = infoDiag.querySelector("form");
    const playerOneInput = infoForm.querySelector("#player-one-name");
    const playerTwoInput = infoForm.querySelector("#player-two-name");

    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");

    const resultDiag = document.querySelector(".result");
    const resultMsg = resultDiag.querySelector("p");
    const playAgain = resultDiag.querySelector("button");

    const resetBtn = document.querySelector(".reset");

    let game;

    infoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        game = Game([Player(playerOneInput.value, 'O'), Player(playerTwoInput.value, 'X')]);
        updateDOM();
        infoForm.reset();
        infoDiag.close();
    });

    const updateDOM = () => {
        const actPlayer = game.getActivePlayer();
        turnDiv.textContent = `${actPlayer.getName()}'s turn.. ${actPlayer.getMarker()} to play`;

        boardDiv.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const btn = document.createElement('button');
                btn.classList.add("btn");

                if (game.getBoard()[i][j]) {
                    if (game.getBoard()[i][j] === 'X') {
                        btn.style.color = '#ef4444';
                    }
                    btn.textContent = game.getBoard()[i][j];
                }

                btn.dataset.row = i;
                btn.dataset.col = j;
                boardDiv.appendChild(btn);
            }
        }
    };

    function btnClickHandler(e) {
        // if line between buttons is clicked
        if (!e.target.dataset.row && !e.target.dataset.col) {
            return;
        }

        const result = game.playRound(e.target.dataset.row, e.target.dataset.col);
        updateDOM();

        if (result === 1) {
            const winner = game.getActivePlayer();
            resultMsg.textContent = `3 ${winner.getMarker()}'s in a row, ${winner.getName()} wins!!`;
            resultDiag.showModal();
        }
        if (result === -1) {
            resultMsg.textContent = `It's a tie!`;
            resultDiag.showModal();
        }
    }

    boardDiv.addEventListener('click', btnClickHandler);

    playAgain.addEventListener('click', () => {
        game.reset();
        updateDOM();
        resultDiag.close();
    });

    resetBtn.addEventListener('click', () => {
        infoDiag.showModal();
    })

    infoDiag.showModal();
})();