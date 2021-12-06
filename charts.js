// create 3 data sets
var data1 = [
  { group: "Canvas", value: 165 },
  { group: "Offscreen", value: 165 },
  { group: "SVG", value: 78 },
];
var data2 = [
  { group: "Canvas", value: 98 },
  { group: "Offscreen", value: 102 },
  { group: "SVG", value: 39 },
];
var data3 = [
  { group: "Canvas", value: 36 },
  { group: "Offscreen", value: 35 },
  { group: "SVG", value: 13 },
];

var color = ["#003f5c", "#bc5090", "#ffa600"];

// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 600 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// X axis
var x = d3
  .scaleBand()
  .range([0, width])
  .domain(
    data1.map(function (d) {
      return d.group;
    })
  )
  .padding(0.2);
svg
  .append("g")
  .attr("class", "axisX")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear().domain([0, 165]).range([height, 0]);
svg.append("g").attr("class", "axisY").call(d3.axisLeft(y));

// A function that create / update the plot for a given variable:
function update(data) {
  var u = svg.selectAll("rect").data(data);
  u.enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", function (d, i) {
      return color[i % 3]; // here it is picking up colors in sequence
    });
}

// Initialize the plot with the first dataset
update(data1);
