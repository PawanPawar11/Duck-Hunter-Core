const gameManger = {
  score: 0,
  bullets: 3,
  round: 1,
  ducksShotThisRound: 0,
  duckSpeed: 120,

  resetGame() {
    this.score = 0;
    this.bullets = 3;
    this.round = 1;
    this.ducksShotThisRound = 0;
    this.duckSpeed = 120;
  },
};

export default gameManger;
