import React, { Component } from "react";
import { cloneDeep } from "lodash";
import Board from "./components/Board";
import * as game from "./game";

const appStyle = {
  textAlign: "center"
};

class App extends Component {
  state = cloneDeep(game.INITIAL_STATE);

  makeMove = ({ rowIndex, colIndex, grid, player, moves }) => {
    const clone = cloneDeep(grid);
    const nextPlayer = game.getOpponent(player);
    clone[rowIndex][colIndex] = player;
    const hasWon = game.checkWin({ grid: clone, player });
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
      if (ai && !hasWon && moves < game.ROWS * game.COLS) {
        const { nextRow, nextCol } = game.nextMove({
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
      if (!hasWon && totalMoves === game.ROWS * game.COLS - 1) {
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
            onClick={() => this.setState(cloneDeep(game.INITIAL_STATE))}
          >
            New Game
          </button>
          <button
            className={`ui inverted button ${ai ? "active" : ""}`}
            onClick={() => {
              game.INITIAL_STATE["ai"] = !game.INITIAL_STATE["ai"];
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
                game.INITIAL_STATE["hard"] = false;
                this.setState({ hard: false });
              }}
            >
              Easy
            </button>
            <button
              className={`ui button inverted red ${hard ? "active" : ""}`}
              onClick={() => {
                game.INITIAL_STATE["hard"] = true;
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
