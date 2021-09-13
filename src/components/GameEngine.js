import Player from './Player';
import Ship from './Ship';
import Gameboard from './Gameboard';

//TODO move this into app and make that the gameengine
const shipSizes = [3, 4, 5];

class GameEngine {
  player;
  computer;
  constructor() {}

  getCoordinates() {
    const size = this.playerGameboard.boardSize;
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    return [row, col];
  }

  getOrientation() {
    return Math.round(Math.random()) === 0 ? 'horizontal' : 'vertical';
  }

  placeShips() {
    const shipSizesLen = shipSizes.length;
    let i = 0;

    while (i < shipSizesLen) {
      const ship = new Ship(shipSizes[i]);
      let [row, col] = this.getCoordinates();
      let orientation = this.getOrientation();
      let isValidShipPos = this.playerGameboard.isValidShipPosition(
        row,
        col,
        orientation,
        ship
      );
      while (!isValidShipPos) {
        [row, col] = this.getCoordinates();
        orientation = this.getOrientation();
        isValidShipPos = this.playerGameboard.isValidShipPosition(
          row,
          col,
          orientation,
          ship
        );
      }
      this.playerGameboard.placeShip(row, col, orientation, ship);
      i++;
    }

    i = 0;
    while (i < shipSizesLen) {
      const ship = new Ship(shipSizes[i]);
      let [row, col] = this.getCoordinates();
      let orientation = this.getOrientation();
      let isValidShipPos = this.computerGameboard.isValidShipPosition(
        row,
        col,
        orientation,
        ship
      );
      while (!isValidShipPos) {
        [row, col] = this.getCoordinates();
        orientation = this.getOrientation();
        isValidShipPos = this.computerGameboard.isValidShipPosition(
          row,
          col,
          orientation,
          ship
        );
      }
      this.computerGameboard.placeShip(row, col, orientation, ship);
      i++;
    }
  }

  startGame() {
    this.player = new Player('player');
    this.computer = new Player('computer');
    this.playerGameboard = new Gameboard(10);
    this.computerGameboard = new Gameboard(10);
    this.placeShips();

    // console.log(this.playerGameboard.getBoard());
  }
}

export default GameEngine;
