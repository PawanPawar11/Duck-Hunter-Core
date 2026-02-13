import k from "./kaplayCtx";
import gameManager from "./gameManager";

k.scene("menu", () => {
  k.add([k.text("DUCK HUNTER"), k.pos(200, 150)]);

  k.add([k.text("CLICK TO START"), k.pos(200, 200)]);

  k.onMousePress(() => {
    gameManager.resetGame();
    k.go("game");
  });
});

k.scene("game", () => {
  // -----------------------------
  // SCORE + BULLETS
  // -----------------------------

  const scoreText = k.add([k.text("Score: 0"), k.pos(10, 10)]);

  const bulletText = k.add([k.text("Bullets: 3"), k.pos(10, 40)]);

  const roundText = k.add([k.text("Round: 1"), k.pos(10, 70)]);

  // -----------------------------
  // CURSOR
  // -----------------------------
  const cursor = k.add([k.circle(5), k.color(255, 0, 0), k.pos(k.mousePos())]);

  // -----------------------------
  // SPAWN DUCK FUNCTION
  // -----------------------------
  function spawnDuck() {
    return k.add([
      k.rect(40, 25),
      k.pos(0, k.rand(100, 200)),
      k.area(),
      "duck",
    ]);
  }

  let duck = spawnDuck();

  // -----------------------------
  // UPDATE LOOP
  // -----------------------------
  k.onUpdate(() => {
    // move cursor
    cursor.moveTo(k.mousePos());

    // if duck exists, move it
    if (duck.exists()) {
      duck.move(gameManager.duckSpeed, 0);

      // Duck escaped screen
      if (duck.pos.x > k.width()) {
        k.destroy(duck);

        duck = spawnDuck();

        gameManager.bullets = 3;
        bulletText.text = "Bullets: 3";
      }
    }
  });

  // -----------------------------
  // SHOOTING
  // -----------------------------
  k.onMousePress(() => {
    if (gameManager.bullets === 0) return; // No bullets? then stop. Prevent from negative values of bullets.

    gameManager.bullets--;
    bulletText.text = "Bullets: " + gameManager.bullets;

    if (duck.exists() && duck.isHovering()) {
      k.destroy(duck);

      gameManager.score++;
      gameManager.ducksShotThisRound++;

      scoreText.text = "Score: " + gameManager.score;

      // Check if round finished
      if (gameManager.ducksShotThisRound >= 5) {
        gameManager.round++;
        gameManager.ducksShotThisRound = 0;
        gameManager.duckSpeed += 40;

        roundText.text = "Round: " + gameManager.round;

        k.wait(1, () => {
          duck = spawnDuck();
        });
      } else {
        duck = spawnDuck();
      }

      gameManager.bullets = 3;
      bulletText.text = "Bullets: 3";
    }

    // If bullets finished and duck not hit
    if (gameManager.bullets === 0 && duck.exists()) {
      k.wait(0.5, () => {
        if (duck.exists()) {
          k.destroy(duck);
          duck = spawnDuck();
        }

        gameManager.bullets = 3;
        bulletText.text = "Bullets: 3";
      });
    }
  });
});

k.go("menu");
