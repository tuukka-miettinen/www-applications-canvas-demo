let canvas;
let ctx;
let canvasDemo;
let canvasDemoAnimation;

const nofNodes = params.points ? params.points : 250;

window.onload = function () {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  ctx.canvas.width = 750;
  ctx.canvas.height = 750;
  canvasDemo = new CanvasDemo(
    ctx,
    canvas.width,
    canvas.height,
    nofNodes
  );
  canvasDemo.animate(0);
};

window.addEventListener("resize", function () {
  cancelAnimationFrame(canvasDemoAnimation);
  canvasDemo.animate(0);
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
  #timeMeasurements;
  #fps;
  #xMiddle;
  #yMiddle;
  constructor(ctx, width, height, numberOfNodes) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#xMiddle = this.#width / 2;
    this.#yMiddle = this.#height / 2;
    this.#timeMeasurements = [];
    this.#fps = 0;

    this.lasttime = 0;
    this.deltatime = 0;
    this.angle = 0;
    this.angle;

    this.balls = [];

    for (let i = 0; i < numberOfNodes; i++) {
      const position =
        Math.random() * Math.max(this.#width / 2, this.#height / 2);
      const color = `rgb(
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)})`;
      this.balls.push(
        new Ball(
          position,
          color,
          Math.random() * 360,
          Math.random() / 2 + 0.5,
          15 * (Math.random() / 2 + 0.25)
        )
      );
    }
  }
  #draw() {
    const chonks = Math.floor(this.balls.length / 1000);
    for (let c = 0; c < chonks; i++) {
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i];
        this.#drawBall(ball);
      }
    }

    // draw FPS
    this.#timeMeasurements.push(performance.now());
    const msPassed =
      this.#timeMeasurements[this.#timeMeasurements.length - 1] -
      this.#timeMeasurements[0];
    const updateEachSecond = 1;
    const decimalPlaces = 2;
    const decimalPlacesRatio = Math.pow(10, decimalPlaces);

    if (msPassed >= updateEachSecond * 1000) {
      this.#fps =
        Math.round(
          (this.#timeMeasurements.length / msPassed) * 1000 * decimalPlacesRatio
        ) / decimalPlacesRatio;
      this.#timeMeasurements = [];
    }

    this.#ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    this.#ctx.fillText(`${this.#fps} fps`, 10, 40);
  }
  #drawBall(ball) {
    this.#ctx.beginPath(); F
    this.#ctx.arc(
      this.#xMiddle + Math.sin((this.angle + ball.offset) * ball.speed) * ball.position,
      this.#yMiddle + Math.cos((this.angle + ball.offset) * ball.speed) * ball.position,
      ball.size,
      0,
      2 * Math.PI
    );
    this.#ctx.fillStyle = ball.color;
    this.#ctx.fill();
    this.#ctx.stroke();
  }
  animate(timestamp) {
    this.deltatime = timestamp - this.lasttime;
    this.lasttime = timestamp;
    this.angle -= this.deltatime * 0.001;
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    this.#draw(this.angle);
    canvasDemoAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}

const timestampContainer = document.querySelector("#timestamp");

const updateTimestamp = () => {
  timestampContainer.innerText = Date.now();
  requestAnimationFrame(updateTimestamp);
};

updateTimestamp();
