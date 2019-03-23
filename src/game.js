import { cloneDeep, minBy, maxBy } from "lodash";

export const ROWS = 3;
export const COLS = 3;
const ROW_ARR = new Array(ROWS).fill("");
const COL_ARR = new Array(COLS).fill("");
const GRID = ROW_ARR.map(x => COL_ARR.slice());
export const INITIAL_STATE = {
  player: "X",
  grid: cloneDeep(GRID),
  hasWon: false,
  winMessage: "Tic Tac Toe", // doubles as title
  ai: false,
  moves: 0,
  hard: false,
  history: []
};
// win conditions for 3x3 grid
const winConditions = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]]
];

// get opponent player
export const getOpponent = player => (player === "X" ? "O" : "X");

// get random integer in range [0-max)
const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

// check win condition
export const checkWin = ({ grid, player }) => {
  const playerInGrid = ([row, col]) => {
    return grid[row][col] && grid[row][col] === player;
  };

  for (let i = 0; i < winConditions.length; i++) {
    if (winConditions[i].every(playerInGrid)) {
      return true;
    }
  }

  return false;
};

// minimax algorithm
const miniMax = ({ grid, depth, player, maxPlayer, moves }) => {
  // maximising player (ai) won
  if (checkWin({ grid, player: maxPlayer })) {
    return 10 - depth;
    // minimising player (human) won
  } else if (checkWin({ grid, player: getOpponent(maxPlayer) })) {
    return depth - 10;
    // tie
  } else if (moves >= ROWS * COLS) {
    return 0;
  }
  // empty space(s) left on grid
  const branches = [];
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (grid[i][j]) continue;
      // branch grid
      grid[i][j] = player;
      // recursive lookahead
      const branch = miniMax({
        grid,
        depth: depth + 1,
        player: getOpponent(player),
        maxPlayer,
        moves: moves + 1
      });
      branches.push({ cost: branch, cell: { nextRow: i, nextCol: j } });
      // cleanup branched grid
      grid[i][j] = "";
    }
  }
  // max player turn
  if (player === maxPlayer) {
    const max = maxBy(branches, v => v.cost);
    if (depth === 0) {
      return max.cell;
    } else {
      return max.cost;
    }
    // min player turn
  } else {
    const min = minBy(branches, v => v.cost);
    if (depth === 0) {
      return min.cell;
    } else {
      return min.cost;
    }
  }
};

// pick next row/col for ai move
export const nextMove = ({ grid, player, hard, moves }) => {
  // easy ai
  if (!hard) {
    // pick random empty cell
    let nextRow = getRandomInt(ROWS);
    let nextCol = getRandomInt(COLS);
    while (grid[nextRow][nextCol]) {
      nextRow = getRandomInt(ROWS);
      nextCol = getRandomInt(COLS);
    }
    return { nextRow, nextCol };
    // unbeatable ai
  } else {
    return miniMax({ grid, depth: 0, player, maxPlayer: player, moves });
  }
};
