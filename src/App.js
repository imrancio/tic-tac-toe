import React, { Component } from "react";
import { cloneDeep } from "lodash";
import { Header, Button, Segment } from "semantic-ui-react";

import Board from "./components/Board";
import Settings from "./components/Settings";
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
    const { winMessage, history } = this.state;
    this.setState({
      grid: clone,
      player: nextPlayer,
      moves: moves + 1,
      hasWon,
      winMessage: hasWon ? `Player ${player} has won!` : winMessage,
      history: history.concat([this.state]) // cache state
    });
    // return new state for ai
    return { grid: clone, player: nextPlayer, moves: moves + 1, hasWon };
  };

  changePlayer = () => {
    const { player } = this.state;
    game.INITIAL_STATE["player"] = game.getOpponent(player);
    this.setState({ player: game.getOpponent(player) });
  };

  changeColour = (player, colour) => {
    if (player === "X") {
      game.INITIAL_STATE["xColour"] = colour;
      this.setState({ xColour: colour });
    } else {
      game.INITIAL_STATE["oColour"] = colour;
      this.setState({ oColour: colour });
    }
  };

  handleClick = ({ rowIndex, colIndex }) => {
    const { ai, hasWon: gameOver, difficulty, moves: totalMoves } = this.state;
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
          grid,
          player,
          difficulty,
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
    const {
      grid,
      winMessage,
      ai,
      difficulty,
      history,
      player,
      xColour,
      oColour
    } = this.state;
    const colour = player === "X" ? xColour : oColour;
    return (
      <div style={appStyle}>
        <Header as="h1" inverted>
          {winMessage}
        </Header>
        <Board
          rows={grid}
          onClick={this.handleClick}
          xColour={xColour}
          oColour={oColour}
        />
        <Segment vertical>
          <Button
            inverted
            icon="undo"
            disabled={history.length === 0}
            onClick={() => this.setState(cloneDeep(history.pop()))}
          />
          <Button
            inverted
            color="blue"
            onClick={() => this.setState(cloneDeep(game.INITIAL_STATE))}
          >
            New Game
          </Button>
          <Button
            inverted
            active={ai}
            onClick={() => {
              game.INITIAL_STATE["ai"] = !game.INITIAL_STATE["ai"];
              this.setState({ ai: !ai });
            }}
          >
            AI
          </Button>
          <Settings
            player={player}
            colour={colour}
            changeColour={this.changeColour}
            changePlayer={this.changePlayer}
          />
        </Segment>
        <Segment vertical className={ai ? "" : "hidden"}>
          <Button.Group>
            <Button
              inverted
              color="green"
              active={difficulty === 0}
              onClick={() => {
                game.INITIAL_STATE["difficulty"] = 0;
                this.setState({ difficulty: 0 });
              }}
            >
              Easy
            </Button>
            <Button
              inverted
              color="orange"
              active={difficulty === 1}
              onClick={() => {
                game.INITIAL_STATE["difficulty"] = 1;
                this.setState({ difficulty: 1 });
              }}
            >
              Medium
            </Button>
            <Button
              inverted
              color="red"
              active={difficulty === 2}
              onClick={() => {
                game.INITIAL_STATE["difficulty"] = 2;
                this.setState({ difficulty: 2 });
              }}
            >
              Hard
            </Button>
          </Button.Group>
        </Segment>
      </div>
    );
  }
}

export default App;
