import k from "./kaplayCtx";

k.scene("game", () => {
  const cursor = k.add([k.circle(5), k.color(255, 0, 0), k.pos(k.mousePos())]);

  k.onUpdate(() => {
    cursor.moveTo(k.mousePos());
  });

  let duck = k.add([k.rect(40, 25), k.pos(50, 200), k.area(), "duck"]);

  k.onUpdate(() => {
    duck.move(120, 0);
  });

  let score = 0;

  const scoreText = k.add([k.text("Score: 0"), k.pos(10, 10)]);

  k.onMousePress(() => {
    if (duck.isHovering()) {
      k.destroy(duck);

      score++;
      scoreText.text = "Score: " + score;
    }
  });
});

k.go("game");
