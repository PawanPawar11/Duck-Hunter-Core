import k from "./kaplayCtx";

k.scene("game", () => {
  // -----------------------------
  // SCORE + BULLETS
  // -----------------------------
  let score = 0;
  let bullets = 3;

  const scoreText = k.add([k.text("Score: 0"), k.pos(10, 10)]);

  const bulletText = k.add([k.text("Bullets: 3"), k.pos(10, 40)]);

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
      duck.move(120, 0);

      // Duck escaped screen
      if (duck.pos.x > k.width()) {
        k.destroy(duck);

        duck = spawnDuck();

        bullets = 3;
        bulletText.text = "Bullets: 3";
      }
    }
  });

  // -----------------------------
  // SHOOTING
  // -----------------------------
  k.onMousePress(() => {
    if (bullets === 0) return; // No bullets? then stop. Prevent from negative values of bullets.

    bullets--;
    bulletText.text = "Bullets: " + bullets;

    if (duck.exists() && duck.isHovering()) {
      k.destroy(duck);

      score++;
      scoreText.text = "Score: " + score;

      duck = spawnDuck();
      bullets = 3;
      bulletText.text = "Bullets: 3";
    }

    // If bullets finished and duck not hit
    if (bullets === 0 && duck.exists()) {
      k.wait(0.5, () => {
        if (duck.exists()) {
          k.destroy(duck);
          duck = spawnDuck();
        }

        bullets = 3;
        bulletText.text = "Bullets: 3";
      });
    }
  });
});

k.go("game");
