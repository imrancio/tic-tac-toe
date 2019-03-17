import React, { Component } from "react";
import { cloneDeep, minBy, maxBy } from "lodash";
import Board from "./components/Board";

const ROWS = 3;
const COLS = 3;
const ROW_ARR = new Array(ROWS).fill("");
const COL_ARR = new Array(COLS).fill("");
const GRID = ROW_ARR.map(x => COL_ARR.slice());
const INITIAL_STATE = {
  player: "X",
  grid: cloneDeep(GRID),
  hasWon: false,
  winMessage: "Tic Tac Toe", // doubles as title
  ai: false,
  moves: 0,
  hard: false
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

const appStyle = {
  textAlign: "center"
};

// get opponent player
const getOpponent = player => (player === "X" ? "O" : "X");

// get random integer in range [0-max)
const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

// check win condition
const checkWin = ({ grid, player }) => {
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
const nextMove = ({ grid, player, hard, moves }) => {
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

class App extends Component {
  state = cloneDeep(INITIAL_STATE);

  makeMove = ({ rowIndex, colIndex, grid, player, moves }) => {
    const clone = cloneDeep(grid);
    const nextPlayer = getOpponent(player);
    clone[rowIndex][colIndex] = player;
    const hasWon = checkWin({ grid: clone, player });
    const { winMessage } = this.state;
    this.setState({
      grid: clone,
      player: nextPlayer,
      moves: moves + 1,
      hasWon,
      winMessage: hasWon ? `Player ${player} has won!` : winMessage
    });
    // return new state for ai
    return { grid: clone, player: nextPlayer, moves: moves + 1, hasWon };
  };

  handleClick = ({ rowIndex, colIndex }) => {
    const { ai, hasWon: gameOver, hard, moves: totalMoves } = this.state;
    if (!gameOver) {
      // Player move logic
      const { grid, player, moves, hasWon } = this.makeMove({
        rowIndex,
        colIndex,
        grid: this.state.grid,
        player: this.state.player,
        moves: this.state.moves
      });
      // AI move logic
      if (ai && !hasWon && moves < ROWS * COLS) {
        const { nextRow, nextCol } = nextMove({
          grid: grid,
          player,
          hard,
          moves
        });
        this.makeMove({
          rowIndex: nextRow,
          colIndex: nextCol,
          grid,
          player,
          moves
        });
      }
      // game tied
      if (!hasWon && totalMoves === ROWS * COLS - 1) {
        this.setState({ winMessage: "Tie!" });
      }
    }
  };

  render() {
    const { grid, winMessage, ai, hard } = this.state;
    return (
      <div style={appStyle}>
        <h1>{winMessage}</h1>
        <Board rows={grid} onClick={this.handleClick} />
        <div className="ui vertical segment">
          <button
            className="ui inverted button primary"
            onClick={() => this.setState(cloneDeep(INITIAL_STATE))}
          >
            New Game
          </button>
          <button
            className={`ui inverted button ${ai ? "active" : ""}`}
            onClick={() => {
              INITIAL_STATE["ai"] = !INITIAL_STATE["ai"];
              this.setState({ ai: !ai });
            }}
          >
            AI
          </button>
        </div>
        <div className={`ui vertical segment ${ai ? "" : "hidden"}`}>
          <div className="ui buttons">
            <button
              className={`ui button inverted green ${hard ? "" : "active"}`}
              onClick={() => {
                INITIAL_STATE["hard"] = false;
                this.setState({ hard: false });
              }}
            >
              Easy
            </button>
            <button
              className={`ui button inverted red ${hard ? "active" : ""}`}
              onClick={() => {
                INITIAL_STATE["hard"] = true;
                this.setState({ hard: true });
              }}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
