const gameBoard = (function () {
  const tiles = Array(9).fill("");
  const getTiles = () => [...tiles];
  const clearTiles = () => tiles.fill("");
  const isEmptyTile = (index) => tiles[index] === "";
  const markTile = (index, marker) => (tiles[index] = marker);
  const hasEmptyTiles = () => tiles.some((tile) => tile === "");

  return { getTiles, clearTiles, isEmptyTile, markTile, hasEmptyTiles };
})();

const gameController = (function () {
  const createPlayer = (symbol, name = "") => ({ name, symbol });

  const players = [createPlayer("X"), createPlayer("O")];
  let xWasLast = false; // helps to determine the active player
  let state = "playing"; // playing | win | draw
  let winner;

  const getActivePlayer = () => (xWasLast ? players[1] : players[0]);
  const getWinner = () => winner;
  const getState = () => state;

  function setPlayerNames(xName, oName) {
    players[0].name = xName;
    players[1].name = oName;
  }

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
        const winning_symbol = board[indices[0]];

        for (const player of players) {
          if (player.symbol === winning_symbol) {
            return player;
          }
        }
      }
    }
    return;
  }

  function playRound(tileIndex) {
    if (state === "playing") {
      if (gameBoard.isEmptyTile(tileIndex)) {
        const activePlayer = getActivePlayer();
        gameBoard.markTile(tileIndex, activePlayer.symbol);
        xWasLast = activePlayer.symbol === "X";
        winner = calculateWinner(gameBoard.getTiles());
        state = winner ? "win" : "playing";

        // Extra check for draw
        if (!winner && !gameBoard.hasEmptyTiles()) {
          state = "draw";
        }
      }
    }
  }

  function reset() {
    gameBoard.clearTiles();
    xWasLast = false;
    winner = undefined;
    state = "playing";
  }

  return {
    setPlayerNames,
    getActivePlayer,
    getState,
    getWinner,
    playRound,
    reset,
  };
})();

const displayController = (function () {
  const boardEl = document.querySelector("#board");
  const activePlayerEl = document.querySelector("#active-player span");
  const tileNodes = document.querySelectorAll(".tile");
  const newBtn = document.querySelector("#new-btn");
  const resetBtn = document.querySelector("#reset-btn");
  const modal = document.querySelector("dialog");
  const setupView = document.querySelector("#setup-view");
  const setupForm = document.querySelector("#setup-view form");
  const xName = document.querySelector("#x-name");
  const oName = document.querySelector("#o-name");
  const startBtn = document.querySelector("#start-btn");
  const resultView = document.querySelector("#result-view");
  const winnerEl = document.querySelector("#winner");
  const messageEl = document.querySelector("#message");
  const replayBtn = document.querySelector("#replay-btn");

  boardEl.addEventListener("click", handleTileClick);
  setupForm.addEventListener("submit", (e) => handleGameInit(e));
  resetBtn.addEventListener("click", handleResetClick);
  newBtn.addEventListener("click", handleNewClick);
  // startBtn.addEventListener("click", handleGameInit);
  replayBtn.addEventListener("click", handleNewClick);

  function handleTileClick(e) {
    if (Array.from(e.target.classList).includes("tile")) {
      gameController.playRound(Number(e.target.dataset.index));
    }
    update();
  }

  function handleGameInit(e) {
    e.preventDefault();
    gameController.setPlayerNames(xName.value, oName.value);
    modal.close();
    update();
  }

  function handleNewClick() {
    handleResetClick();
    showSetupForm();
  }

  function handleResetClick() {
    gameController.reset();
    update();
  }

  function hide(el) {
    el.style.display = "none";
  }

  function show(el) {
    el.style.display = "flex";
  }

  function showSetupForm() {
    hide(resultView);
    show(setupView);
    modal.showModal();
  }

  function showResult() {
    hide(setupView);
    show(resultView);
    modal.showModal();
  }

  function update() {
    const tiles = gameBoard.getTiles();
    const state = gameController.getState();
    const activePlayer = gameController.getActivePlayer();

    activePlayerEl.textContent = activePlayer.name
      ? activePlayer.name
      : activePlayer.symbol;
    tileNodes.forEach((el) => (el.textContent = tiles[el.dataset.index]));

    if (state === "win") {
      const winner = gameController.getWinner();
      winnerEl.textContent = winner.name ? winner.name : winner.symbol;
      messageEl.textContent = "wins!";
      showResult();
    } else if (state === "draw") {
      winnerEl.textContent = "";
      messageEl.textContent = "Draw!";
      showResult();
    }
  }

  // showSetupForm();

  return { update, showSetupForm };
})();

displayController.showSetupForm();
