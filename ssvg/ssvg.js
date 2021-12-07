let w = 750;
let h = 750;

// let balls = [];
// let timeMeasurements = [];
// let fps = 0;
// // time at first run
// var t0 = Date.now();
// let numberOfNodes = 250;

// // get number of nodes from url, defaults to 50
// if (params.points) {
//   numberOfNodes = params.points;
// }

// // initialize balls array with randomized values for each
// for (let i = 0; i < numberOfNodes; i++) {
//   const distanceFromMiddle = Math.random() * Math.max(w / 2, h / 2);
//   const color = `rgb(
//         ${Math.floor(Math.random() * 255)},
//         ${Math.floor(Math.random() * 255)},
//         ${Math.floor(Math.random() * 255)})`;
//   balls.push({
//     R: distanceFromMiddle,
//     color: color,
//     phi0: Math.random() * 360,
//     speed: Math.random() / 2 + 0.5,
//     r: 15 * (Math.random() / 2 + 0.25),
//   });
// }

// // initialize svg to draw balls on
// var svg = d3.select("#balls").insert("svg").attr("width", w).attr("height", h);

// // group children to middle
// var container = svg
//   .append("g")
//   .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

// // add fps text
// container
//   .append("text")
//   .attr("class", "fpsText")
//   .attr("x", -(w / 2) + 8)
//   .attr("y", -(h / 2) + 28);

// // loop through balls array and add to svg
// container
//   .selectAll("g.ball")
//   .data(balls)
//   .enter()
//   .append("g")
//   .attr("class", "ball")
//   .each(function (d, i) {
//     d3.select(this)
//       .append("circle")
//       .attr("r", d.r)
//       .attr("cx", d.R)
//       .attr("cy", 0)
//       .attr("fill", d.color)
//       .attr("stroke", "black")
//       .attr("class", "ball");
//   });

// // animate balls and texts
// d3.timer(function () {
//   var delta = Date.now() - t0;
//   svg.selectAll(".ball").attr("transform", function (d) {
//     return "rotate(" + (d.phi0 + (delta * d.speed) * 0.025) + ")";
//   });

//   // draw FPS
//   timeMeasurements.push(performance.now());
//   const msPassed =
//     timeMeasurements[timeMeasurements.length - 1] - timeMeasurements[0];
//   const updateEachSecond = 1;
//   const decimalPlaces = 2;
//   const decimalPlacesRatio = Math.pow(10, decimalPlaces);

//   if (msPassed >= updateEachSecond * 1000) {
//     fps =
//       Math.round(
//         (timeMeasurements.length / msPassed) * 1000 * decimalPlacesRatio
//       ) / decimalPlacesRatio;
//     timeMeasurements = [];
//   }
//   container.select("text").text(fps + " fps");
// });

// const timestampContainer = document.querySelector("#timestamp");

// const updateTimestamp = () => {
//   timestampContainer.innerText = Date.now();
//   requestAnimationFrame(updateTimestamp);
// };

// updateTimestamp();


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
for(var i = 0; i < 3000; i++) {
  const circle = getCircle(300, 300, 100 + Math.random() * 200);
  data.push({
    color: '#' + getRandomString(6), //color(Math.floor(Math.random() * 20)),
    circle: circle,
    angle: 0,
    angularSpeed: 0.001 + Math.random() * 0.01,
    position: circle.getPointFromAngle(0),
    id: i
  });
}

var updates = 0;
function updatePositions() {
  updates++;
  data.forEach(function(data, i) {
    var angle = data.angle;
    const circle = data.circle;
    if(updates > i) {
      angle += data.angularSpeed;
    }
    data.angle = angle;
    data.position = circle.getPointFromAngle(angle);
  })
}

function updateVis() {
  var circles = svg.selectAll('rect')
    .data(data, function(d) { return d.id });

  circles.enter()
    .append('rect')
    .attr('width', 5)
    .attr('height', 5)
    .attr('fill', function(d) { return d.color });

  circles
    .attr('x', function(d) {return d.position.x })
    .attr('y', function(d) {return d.position.y });
}

const raf = function() {
  updatePositions();
  updateVis();

  requestAnimationFrame(raf);
};
raf();