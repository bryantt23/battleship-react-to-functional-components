import { Component } from 'react';
import './App.css';
import GameEngine from './components/GameEngine';
import BoardSection from './components/BoardSection';

//basically same function as renderPlayerUi
function renderComputerUi(
  length,
  computerPositionsThatHaveBeenAttacked,
  computerBoard,
  updateBoardSectionStateFn
) {
  const dom = [];
  for (let i = 0; i < length; i++) {
    let arr = [];
    for (let j = 0; j < length; j++) {
      arr.push(
        <BoardSection
          isComputer={true}
          attacked={computerPositionsThatHaveBeenAttacked[i][j]}
          status={computerBoard[i][j]}
          updateBoardSectionState={() => {
            updateBoardSectionStateFn(i, j, 'computerBoard');
          }}
        />
      );
    }
    const div = <tr>{arr}</tr>;
    dom.push(div);
  }
  return dom;
}

function renderPlayerUi(
  length,
  playerPositionsThatHaveBeenAttacked,
  playerBoard
) {
  const dom = [];
  for (let i = 0; i < length; i++) {
    let arr = [];
    for (let j = 0; j < length; j++) {
      arr.push(
        //attacked, not attacked
        //attacked can be hit or miss
        //not attacked will just be the ship or sea
        <BoardSection
          attacked={playerPositionsThatHaveBeenAttacked[i][j]}
          status={playerBoard[i][j]}
          updateBoardSectionState={() => {}}
        />
      );
    }
    const div = <tr>{arr}</tr>;
    dom.push(div);
  }
  console.log(dom);
  return dom;
}

function renderComputerUiCheat(length, computerBoard) {
  const dom = [];
  for (let i = 0; i < length; i++) {
    let arr = [];
    for (let j = 0; j < length; j++) {
      arr.push(
        <BoardSection
          status={computerBoard[i][j]}
          updateBoardSectionState={() => {}}
        />
      );
    }
    const div = <tr>{arr}</tr>;
    dom.push(div);
  }
  return dom;
}

class App extends Component {
  gameEngine;
  playerBoard;
  computerBoard;

  constructor() {
    super();
    this.state = {
      cheat: false,
      playerPositionsThatHaveBeenAttacked: [],
      computerPositionsThatHaveBeenAttacked: [],
      playerBoard: [],
      computerBoard: [],
      allShipsSunk: false,
      winner: null,
      isPlayerTurn: true,
      disabled: false
    };
  }

  componentDidMount() {
    this.gameEngine = new GameEngine();
    this.gameEngine.startGame();
    this.playerBoard = this.gameEngine.playerGameboard;
    this.computerBoard = this.gameEngine.computerGameboard;

    const boardSize = this.gameEngine.playerGameboard.getBoard().length;

    let arr = [];
    for (let i = 0; i < boardSize; i++) {
      arr.push(new Array(boardSize));
    }
    let arr2 = JSON.parse(JSON.stringify(arr));

    this.setState({
      playerBoard: [...this.gameEngine.playerGameboard.getBoard()],
      computerBoard: [...this.gameEngine.computerGameboard.getBoard()],
      playerPositionsThatHaveBeenAttacked: arr,
      computerPositionsThatHaveBeenAttacked: arr2
    });
  }

  computerMove() {
    const [i, j] = this.gameEngine.computer.makePlay(this.playerBoard);

    const attackedBoard = [...this.state.playerPositionsThatHaveBeenAttacked];

    if (this.playerBoard.isValidAttack(i, j, attackedBoard)) {
      this.updateBoardSectionState(i, j, 'playerBoard');
    } else {
      console.log('invalid computer move');
      this.computerMove();
    }
  }

  updateBoardSectionState = (i, j, board) => {
    let attackedProperty;
    if (board === 'playerBoard') {
      attackedProperty = 'playerPositionsThatHaveBeenAttacked';
    } else {
      attackedProperty = 'computerPositionsThatHaveBeenAttacked';
    }

    const attackedBoard = this.state[attackedProperty];

    if (this[board].isValidAttack(i, j, attackedBoard)) {
      console.log('valid move');
      const boardState = this.state[board];
      const [updatedBoardState, updatedAttackBoard] = this[board].receiveAttack(
        i,
        j,
        boardState,
        attackedBoard
      );

      //use this & board to determine winner

      console.log('all sunk', this[board].allShipsSunk());
      const allShipsSunk = this[board].allShipsSunk();
      if (allShipsSunk) {
        let winner;
        if (board === 'playerBoard') {
          winner = 'Computer wins!';
        } else {
          winner = 'Player wins!';
        }
        this.setState({
          allShipsSunk: true,
          winner: winner,
          disabled: true
        });
        return;
      }

      this.setState(
        {
          [attackedProperty]: updatedAttackBoard,
          [board]: updatedBoardState,
          isPlayerTurn: !this.state.isPlayerTurn
        },
        () => {
          if (!this.state.isPlayerTurn) this.computerMove();
        }
      );
    } else {
      console.log('invalid move');
    }
  };

  render() {
    const playerBoardUi = renderPlayerUi(
      this.state.playerBoard.length,
      this.state.playerPositionsThatHaveBeenAttacked,
      this.state.playerBoard
    );
    const computerBoardUi = renderComputerUi(
      this.state.computerBoard.length,
      this.state.computerPositionsThatHaveBeenAttacked,
      this.state.computerBoard,
      this.updateBoardSectionState
    );
    const computerBoardUiCheat = renderComputerUiCheat(
      this.state.computerBoard.length,
      this.state.computerBoard
    );

    return (
      <div className='App'>
        <h1>Battleship</h1>
        <div disabled={this.state.winner !== null} id='gameboard'>
          <h3>Player Board</h3>
          {playerBoardUi}
          <h3>Computer Board</h3>
          {computerBoardUi}
          <br />
        </div>
        {this.state.disabled ? <h2>{this.state.winner}</h2> : ''}
        <button
          onClick={() => {
            this.setState({ cheat: !this.state.cheat });
          }}
        >
          {this.state.cheat ? 'Hide ' : 'Show '} computer's ships{' '}
        </button>
        {this.state.cheat && computerBoardUiCheat}
      </div>
    );
  }
}

export default App;
