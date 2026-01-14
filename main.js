const gameBoard = (function () {
  const players = ["X", "O"];
  const tiles = Array(9).fill("");
  let xWasLast = false; // helps to determine the active player
  let gameWinner = getWinner();

  function getTileIndex(player) {
    // Returns the tile's index selected by a player
    const index = prompt(`Please select a tile for ${player}! (0 ~ 8)`);
    if (tiles[index] === "") {
      return index;
    } else {
      return getTileIndex(); // If the selected tile has already been taken
    }
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

  function playRound() {
    if (gameWinner === undefined && tiles.some((tile) => tile === "")) {
      const activePlayer = xWasLast ? players[1] : players[0];

      const index = getTileIndex(activePlayer);
      tiles[index] = activePlayer;
      console.log(tiles);

      gameWinner = getWinner();
      xWasLast = activePlayer === "X";
    } else if (!gameWinner) {
      gameWinner = null; // to prevent further rounds
      console.log("Draw!");
    }

    if (gameWinner) {
      console.log(`${gameWinner} has won the game!`);
    }
  }

  return { playRound, gameWinner, getWinner, tiles };
})();
