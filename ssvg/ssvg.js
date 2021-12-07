new SSVG({getFps: function(fps) {
  const fpsElement = document.getElementById("fps-element");
  fpsElement.innerHTML = fps;
}});

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


var svg = d3.select("#balls").insert("svg").attr("width", w).attr("height", h);

var color = d3.scaleOrdinal(d3.schemeAccent);

function getCircle(cx, cy, r) {
  return {
    getPointFromAngle: function(angle) {
      return {
        x: cx + Math.sin(angle) * r,
        y: cy - Math.cos(angle) * r
      }
    }
  };
}

function getRandomString(numberOfCharacters) {
  var alphabet = '0123456789abcdef';
  var returnString = '';

  for(var i = 0; i < numberOfCharacters; i++) {
    returnString += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return returnString;
}

var data = [];
for(var i = 0; i < numberOfNodes; i++) {
  const circle = getCircle(w/2, h/2, Math.random() * Math.max(w / 2, h / 2));
  const color = `rgb(
    ${Math.floor(Math.random() * 255)},
    ${Math.floor(Math.random() * 255)},
    ${Math.floor(Math.random() * 255)})`;
  const angle = Math.random() * 360;
  data.push({
    color: color,
    circle: circle,
    angle: Math.random() * 360,
    angularSpeed: (Math.random() / 2 + 0.5) * 0.005,
    position: circle.getPointFromAngle(angle),
    id: i,
    r: 15 * (Math.random() / 2 + 0.25)
  });
}

function updatePositions() {
  data.forEach(function(data, i) {
    var angle = data.angle;
    const circle = data.circle;
    angle += data.angularSpeed;
    data.angle = angle;
    data.position = circle.getPointFromAngle(angle);
  })
}

function updateVis() {
  var circles = svg.selectAll('circle')
    .data(data, function(d) { return d.id });

  circles.enter()
    .append('circle')
    .attr('r', function(d) { return d.r })
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr('fill', function(d) { return d.color });

  circles
    .attr('cx', function(d) {return d.position.x })
    .attr('cy', function(d) {return d.position.y });
}

const raf = function() {
  updatePositions();
  updateVis();

  requestAnimationFrame(raf);
};
raf();