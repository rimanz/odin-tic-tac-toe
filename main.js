const game = (function () {
  const players = ["X", "O"];
  // const tiles = Array(9).fill("");
  const tiles = ["X", "O", "O", "O", "O", "X", "X", "X", "O"];
  let xWasLast = false; // helps to determine the turn owner
  let gameWinner = determineWinner();

  function getTileIndex(player) {
    const index = prompt(`Please select a tile for ${player}! (0 ~ 8)`);
    if (tiles[index] === "") {
      return index;
    } else {
      return getTileIndex();
    }
  }

  function determineWinner() {
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

  function printTiles() {
    console.log(tiles.slice(0, 3));
    console.log(tiles.slice(3, 6));
    console.log(tiles.slice(6));
  }

  function playRound() {
    if (gameWinner) {
      console.log(`${gameWinner} has won the game!`);
    } else if (tiles.some((tile) => tile === "")) {
      const turnOwner = xWasLast ? players[1] : players[0];
      console.log(turnOwner);

      const index = getTileIndex(turnOwner);
      tiles[index] = turnOwner;
      printTiles();

      winner = determineWinner();

      xWasLast = turnOwner === "X";
    } else {
      console.log("Draw!");
    }
  }

  return { playRound, gameWinner, printTiles };
})();
