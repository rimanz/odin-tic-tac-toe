const gameBoard = (function () {
  const players = ["X", "O"];
  const tiles = Array(9).fill("");
  let xWasLast = false; // helps to determine the active player
  let state = "playing"; // playing | win | draw
  let winner;

  const getTiles = () => [...tiles];
  const getActivePlayer = () => (xWasLast ? players[1] : players[0]);
  const getWinner = () => winner;
  const getState = () => state;

  function calculateWinner(board) {
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

    for (const indices of winningConditions) {
      if (
        board[indices[0]] !== "" &&
        board[indices[0]] === board[indices[1]] &&
        board[indices[1]] === board[indices[2]]
      ) {
        return board[indices[0]];
      }
    }
    return;
  }

  function playRound(tileIndex) {
    if (state === "playing") {
      if (tiles[tileIndex] === "") {
        const activePlayer = getActivePlayer();
        tiles[tileIndex] = activePlayer;
        xWasLast = activePlayer === "X";
        winner = calculateWinner(tiles);
        state = winner ? "win" : "playing";

        if (!winner && !tiles.some((tile) => tile === "")) {
          state = "draw";
        }
      }
    }
  }

  function reset() {
    tiles.fill("");
    xWasLast = false;
    winner = undefined;
    state = "playing";
  }

  return {
    getTiles,
    getActivePlayer,
    getState,
    getWinner,
    playRound,
    reset,
  };
})();

const displayController = (function () {
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
      gameBoard.playRound(Number(e.target.dataset.index));
    }
    update();
  }

  function handleResetClick() {
    gameBoard.reset();
    update();
  }

  function update() {
    const tiles = gameBoard.getTiles();
    const state = gameBoard.getState();

    activePlayerEl.textContent = gameBoard.getActivePlayer();
    tileNodes.forEach((el) => (el.textContent = tiles[el.dataset.index]));

    if (state === "win") {
      winnerEl.textContent = gameBoard.getWinner();
      messageEl.textContent = "wins!";
      resultModal.showModal();
    } else if (state === "draw") {
      winnerEl.textContent = "";
      messageEl.textContent = "Draw!";
      resultModal.showModal();
    }
  }

  return { update, resultModal };
})();

displayController.update();
