const nofNodes = params.points ? params.points : 250;
const maxProcessors = window.navigator.hardwareConcurrency - 1;
const offscreenProcessors = params.workers ? params.workers > maxProcessors ? maxProcessors : params.workers : maxProcessors < 3 ? maxProcessors : 3;
const nofNodesPerWindow = Math.floor(nofNodes / offscreenProcessors);

let worker_selection_text = '<span>Worker count: ';
for (let i = 1; i <= maxProcessors; i++) {
  urlSearchParams.set("workers", i)
  worker_selection_text += '<a href="?' + urlSearchParams + '">' + i + '</a>';
  if (i < maxProcessors) {
    worker_selection_text += ', '
  }
}
worker_selection_text += '</span>';

document.getElementById("worker_count_selector").innerHTML = worker_selection_text;

document.getElementById("worker_count").textContent = "Selected worker count: " + offscreenProcessors;

window.onload = function () {
  const workers = []
  const wrapper = document.querySelector("#wrapper");

  for (let i = 0; i < offscreenProcessors; i++) {
    const canv = document.createElement("canvas");
    canv.id = "canvas-" + i;
    canv.height = 750;
    canv.width = 750;
    wrapper.appendChild(canv);
    const worker = new Worker('worker2.js');
    const offscreenCanvas = document.querySelector("#canvas-" + i).transferControlToOffscreen();
    worker.postMessage({ canvas: offscreenCanvas, type: 'canvas', numberOfNodes: nofNodesPerWindow, offscreenIndex: i }, [offscreenCanvas]);
    workers.push(worker)
  }

  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  ctx.canvas.width = 750;
  ctx.canvas.height = 750;
  canvasDemo = new CanvasDemo(ctx, canvas.width, canvas.height, location.search.substring(1), workers);
  canvasDemo.animate(0);
}


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
  #workers;
  constructor(ctx, width, height, numberOfNodes, workers) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#timeMeasurements = [];
    this.#workers = workers;
    this.#fps = 0;
    this.lasttime = 0;
    this.deltatime = 0;
    this.angle = 0;
    this.angle;

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
  #draw() {
    this.#timeMeasurements.push(performance.now());
    const msPassed = this.#timeMeasurements[this.#timeMeasurements.length - 1] - this.#timeMeasurements[0];
    const updateEachSecond = 1;
    const decimalPlaces = 2;
    const decimalPlacesRatio = Math.pow(10, decimalPlaces);

    if (msPassed >= updateEachSecond * 1000) {
      this.#fps = Math.round(this.#timeMeasurements.length / msPassed * 1000 * decimalPlacesRatio) / decimalPlacesRatio;
      this.#timeMeasurements = [];
    }

    this.#ctx.fillStyle = '#000';
    this.#ctx.font = '30px Arial';
    this.#ctx.fillText(`${this.#fps} fps`, 10, 40);
  }
  animate(timestamp) {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    this.deltatime = timestamp - this.lasttime;
    this.lasttime = timestamp;
    this.angle += this.deltatime * 0.001;
    this.#draw();
    for (let i = 0; i < offscreenProcessors; i++) {
      const worker = this.#workers[i]
      worker.postMessage({ type: 'draw', angle: this.angle }, []);
    }
    requestAnimationFrame(this.animate.bind(this));
  }
}


























// timestamp

const timestampContainer = document.querySelector("#timestamp");

const updateTimestamp = () => {
  timestampContainer.innerText = Date.now();
  requestAnimationFrame(updateTimestamp);
};

updateTimestamp();