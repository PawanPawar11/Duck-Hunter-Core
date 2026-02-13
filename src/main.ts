import k from "./kaplayCtx";
import gameManager from "./gameManager";

// MENU SCENE
k.scene("menu", () => {
  k.add([
    k.text("DUCK HUNTER", { size: 25 }),
    k.anchor("center"),
    k.pos(130, 50),
  ]);

  k.add([
    k.text("Click to Start", { size: 10 }),
    k.anchor("center"),
    k.pos(130, 150),
  ]);

  k.onMousePress(() => {
    gameManager.resetGame();
    k.go("game");
  });
});

// GAME SCENE
k.scene("game", () => {
  // STATE FLOW
  let gameState: "round-start" | "hunt" | "round-end" = "round-start";

  // UI
  const scoreText = k.add([k.text("Score: 0", { size: 8 }), k.pos(10, 10)]);

  const bulletText = k.add([k.text("Bullets: 3", { size: 8 }), k.pos(10, 20)]);

  const roundText = k.add([k.text("Round: 1", { size: 8 }), k.pos(10, 30)]);

  const stateText = k.add([
    k.text("", { size: 8 }),
    k.anchor("center"),
    k.pos(130, 50),
  ]);

  // CURSOR
  const cursor = k.add([k.circle(5), k.color(255, 0, 0), k.pos(k.mousePos())]);

  // SPAWN DUCK
  function spawnDuck() {
    return k.add([k.rect(40, 25), k.pos(0, k.rand(80, 200)), k.area(), "duck"]);
  }

  let duck = spawnDuck();

  // Delay before round starts
  k.wait(1, () => {
    gameState = "hunt";
  });

  // UPDATE LOOP
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

  // SHOOTING
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

    // Out of bullets
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
