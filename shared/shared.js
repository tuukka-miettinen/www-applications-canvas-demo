const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

const points = [50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000];

let html_text = '<p>Point count: ';
for (let i = 0; i < points.length; i++) {
  let extraParams = "";
  if (params.workers) {
    extraParams += "&workers=" + params.workers
  }
  html_text += '<a href="?points=' + points[i] + extraParams + '">' + points[i] + ' points</a>';
  if (i < points.length - 1) {
    html_text += ' | '
  }
}
html_text += '</p>';

document.getElementById("point_count_selector").innerHTML = html_text;

document.getElementById("point_count").textContent = "Selected point count: " + params.points;