const points = [50, 500, 1000, 5000, 10000, 50000];

let html_text = '<p>Point count: ';
for (let i = 0; i < points.length; i++) {
    html_text += '<a href="?' + points[i] + '">' + points[i] + ' points</a>';
    if (i < points.length - 1) {
        html_text += ' | '
    }
}
html_text += '</p>';

document.getElementById("point_count_selector").innerHTML = html_text;