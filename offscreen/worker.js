let offscreenIndex;

self.addEventListener('message', function (e) {
    const type = e.data.type;
    const numberOfNodes = e.data.numberOfNodes;
    offscreenIndex = e.data.offscreenIndex;

    if (type === 'canvas') {
        const canvas = e.data.canvas;
        const ctx = canvas.getContext('2d');
        ctx.canvas.width = 500;
        ctx.canvas.height = 500;
        canvasDemo = new CanvasDemo(ctx, canvas.width, canvas.height, numberOfNodes);
        canvasDemo.animate(0);
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
    #timeMeasurements;
    #fps;
    constructor(ctx, width, height, numberOfNodes) {
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
        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            this.#drawBall(ball);
        }

        if (offscreenIndex == 0) {
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
            this.#ctx.font = '30px Arial';
            this.#ctx.fillText(`${this.#fps} fps`, 10, 40);
        }
    }
    #drawBall(ball) {
        const xMiddle = this.#width / 2;
        const yMiddle = this.#height / 2;
        this.#ctx.beginPath();
        this.#ctx.arc(
            xMiddle + Math.sin((this.angle + ball.offset) * ball.speed) * ball.position,
            yMiddle + Math.cos((this.angle + ball.offset) * ball.speed) * ball.position,
            ball.size,
            0,
            2 * Math.PI);
        this.#ctx.fillStyle = ball.color;
        this.#ctx.fill();
        this.#ctx.stroke();
    }
    animate(timestamp) {
        this.deltatime = timestamp - this.lasttime;
        this.lasttime = timestamp;
        this.angle += this.deltatime * 0.001;
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        this.#draw(this.angle);
        requestAnimationFrame(this.animate.bind(this));
    }
}