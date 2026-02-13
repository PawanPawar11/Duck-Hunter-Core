import k from "./kaplayCtx";
import gameManager from "./gameManager";

// -----------------------------
// MENU SCENE
// -----------------------------
k.scene("menu", () => {
  k.add([k.text("DUCK HUNTER"), k.pos(200, 150)]);

  k.add([k.text("Click to Start"), k.pos(200, 200)]);

  k.onMousePress(() => {
    gameManager.resetGame();
    k.go("game");
  });
});

// -----------------------------
// GAME SCENE
// -----------------------------
k.scene("game", () => {
  // SIMPLE STATE FLOW
  let gameState: "round-start" | "hunt" | "round-end" = "round-start";

  // -----------------------------
  // UI
  // -----------------------------
  const scoreText = k.add([k.text("Score: 0"), k.pos(10, 10)]);

  const bulletText = k.add([k.text("Bullets: 3"), k.pos(10, 40)]);

  const roundText = k.add([k.text("Round: 1"), k.pos(10, 70)]);

  const stateText = k.add([k.text(""), k.pos(250, 100)]);

  // -----------------------------
  // CURSOR
  // -----------------------------
  const cursor = k.add([k.circle(5), k.color(255, 0, 0), k.pos(k.mousePos())]);

  // -----------------------------
  // SPAWN DUCK
  // -----------------------------
  function spawnDuck() {
    return k.add([
      k.rect(40, 25),
      k.pos(0, k.rand(150, 300)),
      k.area(),
      "duck",
    ]);
  }

  let duck = spawnDuck();

  // round start delay
  k.wait(1, () => {
    gameState = "hunt";
  });

  // -----------------------------
  // UPDATE LOOP
  // -----------------------------
  k.onUpdate(() => {
    cursor.moveTo(k.mousePos());

    // state text
    if (gameState === "round-start") {
      stateText.text = "ROUND " + gameManager.round;
    } else if (gameState === "round-end") {
      stateText.text = "ROUND COMPLETE";
    } else {
      stateText.text = "";
    }

    if (gameState !== "hunt") return;

    if (duck.exists()) {
      duck.move(gameManager.duckSpeed, 0);

      // Duck escaped
      if (duck.pos.x > k.width()) {
        k.destroy(duck);

        gameManager.bullets = 3;
        bulletText.text = "Bullets: 3";

        duck = spawnDuck();
      }
    }
  });

  // -----------------------------
  // SHOOTING
  // -----------------------------
  k.onMousePress(() => {
    if (gameState !== "hunt") return;
    if (gameManager.bullets === 0) return;

    gameManager.bullets--;
    bulletText.text = "Bullets: " + gameManager.bullets;

    if (duck.exists() && duck.isHovering()) {
      k.destroy(duck);

      gameManager.score++;
      gameManager.ducksShotThisRound++;

      scoreText.text = "Score: " + gameManager.score;

      // Round finished
      if (gameManager.ducksShotThisRound >= 5) {
        gameState = "round-end";

        gameManager.round++;
        gameManager.ducksShotThisRound = 0;
        gameManager.duckSpeed += 40;

        roundText.text = "Round: " + gameManager.round;

        k.wait(1.5, () => {
          duck = spawnDuck();
          gameState = "hunt";
        });
      } else {
        duck = spawnDuck();
      }

      gameManager.bullets = 3;
      bulletText.text = "Bullets: 3";
    }

    // Out of bullets (miss)
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

// START GAME
k.go("menu");
