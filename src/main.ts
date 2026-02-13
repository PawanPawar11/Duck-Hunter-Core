import k from "./kaplayCtx";

function spawnDuck() {
  return k.add([k.rect(40, 25), k.pos(0, k.rand(100, 200)), k.area(), "duck"]);
}

k.scene("game", () => {
  const cursor = k.add([k.circle(5), k.color(255, 0, 0), k.pos(k.mousePos())]);

  let duck = spawnDuck();

  k.onUpdate(() => {
    cursor.moveTo(k.mousePos());

    duck.move(120, 0);

    if (duck.pos.x > k.width()) {
      k.destroy(duck);
      duck = spawnDuck();
    }
  });

  let score = 0;

  const scoreText = k.add([k.text("Score: 0"), k.pos(10, 10)]);

  k.onMousePress(() => {
    if (duck.isHovering()) {
      score++;
      scoreText.text = "Score: " + score;

      k.destroy(duck);

      duck = spawnDuck();
    }
  });
});

k.go("game");
