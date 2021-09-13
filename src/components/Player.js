class Player {
  constructor(name) {
    this.name = name;
  }

  makePlay(gameBoard) {
    const size = gameBoard.getBoard().length;
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    return [row, col];
  }
}

export default Player;
