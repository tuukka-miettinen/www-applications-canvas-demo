let w = 750;
let h = 750;

let balls = [];
let timeMeasurements = [];
let fps = 0;
// time at first run
var t0 = Date.now();
let numberOfNodes = 250;

// get number of nodes from url, defaults to 50
if (params.points) {
  numberOfNodes = params.points;
}

// initialize balls array with randomized values for each
for (let i = 0; i < numberOfNodes; i++) {
  const distanceFromMiddle = Math.random() * Math.max(w / 2, h / 2);
  const color = `rgb(
        ${Math.floor(Math.random() * 255)},
        ${Math.floor(Math.random() * 255)},
        ${Math.floor(Math.random() * 255)})`;
  balls.push({
    R: distanceFromMiddle,
    color: color,
    phi0: Math.random() * 360,
    speed: Math.random() / 2 + 0.5,
    r: 15 * (Math.random() / 2 + 0.25),
  });
}

// initialize svg to draw balls on
var svg = d3.select("#balls").insert("svg").attr("width", w).attr("height", h);

// group children to middle
var container = svg
  .append("g")
  .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

// add fps text
container
  .append("text")
  .attr("class", "fpsText")
  .attr("x", -(w / 2) + 8)
  .attr("y", -(h / 2) + 28);

// loop through balls array and add to svg
container
  .selectAll("g.ball")
  .data(balls)
  .enter()
  .append("g")
  .attr("class", "ball")
  .each(function (d, i) {
    d3.select(this)
      .append("circle")
      .attr("r", d.r)
      .attr("cx", d.R)
      .attr("cy", 0)
      .attr("fill", d.color)
      .attr("stroke", "black")
      .attr("class", "ball");
  });

// animate balls and texts
d3.timer(function () {
  var delta = Date.now() - t0;
  svg.selectAll(".ball").attr("transform", function (d) {
    return "rotate(" + (d.phi0 + (delta * d.speed) * 0.025) + ")";
  });

  // draw FPS
  timeMeasurements.push(performance.now());
  const msPassed =
    timeMeasurements[timeMeasurements.length - 1] - timeMeasurements[0];
  const updateEachSecond = 1;
  const decimalPlaces = 2;
  const decimalPlacesRatio = Math.pow(10, decimalPlaces);

  if (msPassed >= updateEachSecond * 1000) {
    fps =
      Math.round(
        (timeMeasurements.length / msPassed) * 1000 * decimalPlacesRatio
      ) / decimalPlacesRatio;
    timeMeasurements = [];
  }
  container.select("text").text(fps + " fps");
});

const timestampContainer = document.querySelector("#timestamp");

const updateTimestamp = () => {
  timestampContainer.innerText = Date.now();
  requestAnimationFrame(updateTimestamp);
};

updateTimestamp();
