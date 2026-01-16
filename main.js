const gameBoard = (function () {
  const players = ["X", "O"];
  const tiles = Array(9).fill("");
  let xWasLast = false; // helps to determine the active player
  let gameWinner;

  function getActivePlayer() {
    return xWasLast ? players[1] : players[0];
  }

  function getWinner() {
    let winner;
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [2, 4, 6],
      [0, 4, 8],
    ];

    winningConditions.forEach((indices) => {
      if (
        tiles[indices[0]] !== "" &&
        tiles[indices[0]] === tiles[indices[1]] &&
        tiles[indices[1]] === tiles[indices[2]]
      ) {
        winner = tiles[indices[0]];
      }
    });

    return winner;
  }

  function playRound(tileIndex) {
    if (gameWinner === undefined && tiles.some((tile) => tile === "")) {
      if (tiles[tileIndex] === "") {
        const activePlayer = getActivePlayer();

        tiles[tileIndex] = activePlayer;
        console.log(tiles);

        gameWinner = getWinner();
        xWasLast = activePlayer === "X";
      }
    } else if (!gameWinner) {
      gameWinner = null; // to prevent further rounds after a draw
      console.log("Draw!");
    }

    if (gameWinner) {
      console.log(`${gameWinner} has won the game!`);
    }
  }

  function resetGame() {
    tiles.fill("");
    xWasLast = false;
    gameWinner = getWinner();
  }

  return { tiles, getActivePlayer, playRound, getWinner, resetGame };
})();

const interface = (function () {
  const boardEl = document.getElementById("board");
  const activePlayerEl = document.getElementById("active-player");
  const tileNodes = document.querySelectorAll(".tile");
  const resetBtn = document.getElementById("reset-btn");
  const resultModal = document.getElementById("result-modal");
  const winnerEl = document.getElementById("winner");
  const messageEl = document.getElementById("message");
  const replayBtn = document.getElementById("replay-btn");

  boardEl.addEventListener("click", handleTileClick);
  resetBtn.addEventListener("click", handleResetClick);
  replayBtn.addEventListener("click", () => {
    handleResetClick();
    resultModal.close();
  });

  function handleTileClick(e) {
    if (Array.from(e.target.classList).includes("tile")) {
      gameBoard.playRound(e.target.getAttribute("data-index"));
    }
    update();
  }

  function handleResetClick() {
    gameBoard.resetGame();
    update();
  }

  function update() {
    activePlayerEl.textContent = gameBoard.getActivePlayer();
    tileNodes.forEach(
      (el) => (el.textContent = gameBoard.tiles[el.getAttribute("data-index")])
    );

    if (gameBoard.getWinner()) {
      winnerEl.textContent = gameBoard.getWinner();
      messageEl.textContent = "wins!";
      resultModal.showModal();
    } else if (!gameBoard.tiles.some((tile) => tile === "")) {
      winnerEl.textContent = "";
      messageEl.textContent = "Draw!";
      resultModal.showModal();
    } else {
      winnerEl.textContent = "";
      messageEl.textContent = "";
    }
  }

  return { update, resultModal };
})();

interface.update();
