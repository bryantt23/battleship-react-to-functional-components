class Gameboard {
  constructor(boardSize) {
    this.boardSize = boardSize;
    let arr = [];
    for (let i = 0; i < this.boardSize; i++) {
      arr.push(new Array(this.boardSize));
    }
    this.gameBoard = arr;
    this.ships = [];
  }

  allShipsSunk() {
    return this.ships.every(ship => ship.isSunk());
  }

  getBoard() {
    return this.gameBoard;
  }

  isValidAttack(i, j, attackedPositions) {
    return !attackedPositions[i][j];
  }

  //try boolean to know if turn is over
  receiveAttack(i, j, boardState, attackedBoard) {
    if (boardState[i][j] === undefined) {
      //miss
      boardState[i][j] = 'MISS';
    } else {
      //hit
      const ship = this.gameBoard[i][j];
      ship.hit();
      boardState[i][j] = 'HIT';
    }
    attackedBoard[i][j] = true;

    return [boardState, attackedBoard];
  }

  setShip(startingRow, startingCol, orientation, ship) {
    const { length } = ship;
    if (orientation === 'vertical') {
      for (let i = startingRow; i < startingRow + length; i++) {
        this.gameBoard[i][startingCol] = ship;
      }
    } else {
      //horizontal
      for (let i = startingCol; i < startingCol + length; i++) {
        this.gameBoard[startingRow][i] = ship;
      }
    }
  }

  placeShip(startingRow, startingCol, orientation, ship) {
    this.setShip(startingRow, startingCol, orientation, ship);
    this.ships.push(ship);
  }

  isValidShipPosition(startingRow, startingCol, orientation, ship) {
    const { length } = ship;

    if (orientation === 'vertical') {
      if (startingRow + length > this.boardSize) {
        return false;
      }

      for (let i = startingRow; i < startingRow + length; i++) {
        if (this.gameBoard[i][startingCol] !== undefined) {
          return false;
        }
      }
    } else {
      //horizontal
      if (startingCol + length > this.boardSize) {
        return false;
      }

      for (let i = startingCol; i < startingCol + length; i++) {
        if (this.gameBoard[startingRow][i] !== undefined) {
          return false;
        }
      }
    }
    return true;
  }
}

export default Gameboard;
