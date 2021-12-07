let offscreenIndex;

self.addEventListener('message', function (e) {
  const type = e.data.type;
  const numberOfNodes = e.data.numberOfNodes;
  offscreenIndex = e.data.offscreenIndex;

  if (type === 'canvas') {
    const canvas = e.data.canvas;
    const ctx = canvas.getContext('2d', {
      desynchronized: true,
      // Other options. See below.
    });
    ctx.canvas.width = 750;
    ctx.canvas.height = 750;
    canvasDemo = new CanvasDemo(ctx, canvas.width, canvas.height, numberOfNodes);
  }
  if (type === 'draw') {
    canvasDemo.draw(e.data.angle)
  }

});

class Ball {
  constructor(position, color, offset, speed, size) {
    this.position = position;
    this.color = color;
    this.offset = offset;
    this.speed = speed;
    this.size = size;
  }
}

class CanvasDemo {
  #ctx;
  #width;
  #height;
  constructor(ctx, width, height, numberOfNodes) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.lasttime = 0;
    this.deltatime = 0;
    this.balls = [];

    for (let i = 0; i < numberOfNodes; i++) {
      const position = Math.random() * Math.max(this.#width / 2, this.#height / 2);
      const color = `rgb(
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)})`;
      this.balls.push(new Ball(
        position,
        color,
        Math.random() * 360,
        Math.random() / 2 + 0.5,
        15 * (Math.random() / 2 + 0.25)
      ));
    }
  }
  draw(angle) {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);

    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      this.#drawBall(angle, ball);
    }
  }
  #drawBall(angle, ball) {
    const xMiddle = Math.floor(this.#width / 2);
    const yMiddle = Math.floor(this.#height / 2);
    this.#ctx.beginPath();
    this.#ctx.arc(
      xMiddle + Math.sin((angle + ball.offset) * ball.speed) * ball.position,
      yMiddle + Math.cos((angle + ball.offset) * ball.speed) * ball.position,
      ball.size,
      0,
      2 * Math.PI);
    this.#ctx.fillStyle = ball.color;
    this.#ctx.fill();
    this.#ctx.stroke();
  }
}