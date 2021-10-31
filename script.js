let canvas;
let ctx;
let canvasDemo;
let canvasDemoAnimation;

if (!location.search) {
    location.search = 500;
}

window.onload = function() {
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    ctx.canvas.width  = 500;
    ctx.canvas.height = 500;
    canvasDemo = new CanvasDemo(ctx, canvas.width, canvas.height);
    canvasDemo.animate(0);
}

window.addEventListener('resize', function() {
    cancelAnimationFrame(canvasDemoAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasDemo = new CanvasDemo(ctx, canvas.width, canvas.height);
    canvasDemo.animate(0);
})

class CanvasDemo {
    #ctx;
    #width;
    #height;
    #timeMeasurements;
    #fps;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#timeMeasurements = [];
        this.#fps = 0;

        this.lasttime = 0;
        this.deltatime = 0;
        this.angle = 0;
        this.angle;

        this.balls = [];

        const numberOfNodes = location.search.substring(1);

        for (let i = 0; i < numberOfNodes; i++) {
            const distanceFromMiddle = Math.random() * Math.max(this.#width / 2, this.#height / 2);
            const color = `rgb(
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)},
                ${Math.floor(Math.random() * 255)})`;
            this.balls.push({
                distanceFromMiddle: distanceFromMiddle,
                color: color,
                offset: Math.random() * 360,
                speed: Math.random() / 2 + 0.5,
                size: 15 * (Math.random() / 2 + 0.25),
            });
        }
    }
    #draw() {
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            this.#drawBall(ball.size, ball.speed, ball.offset, ball.distanceFromMiddle, ball.color);
        }
        
        // draw FPS
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
        ctx.font = '30px Arial';
        this.#ctx.fillText(`${this.#fps} fps`, 10, 40);
    }
    #drawBall(size, speed, offset, distanceFromMiddle, color) {
        const xMiddle = this.#width / 2;
        const yMiddle = this.#height / 2;
        this.#ctx.beginPath();
        this.#ctx.arc(
            xMiddle + Math.sin((this.angle + offset)*speed)*distanceFromMiddle, 
            yMiddle + Math.cos((this.angle + offset)*speed)*distanceFromMiddle, 
            size, 
            0, 
            2*Math.PI);
        this.#ctx.fillStyle = color;
        this.#ctx.fill();
        this.#ctx.stroke();
    }
    animate(timestamp) {
        this.deltatime = timestamp - this.lasttime;
        this.lasttime = timestamp;
        this.angle += 0.01;
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