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

const wrapper = document.querySelector("#wrapper");
for (let i = 0; i < offscreenProcessors; i++) {
  const canv = document.createElement("canvas");
  canv.id = "canvas-" + i;
  canv.height = 500;
  canv.width = 500;
  wrapper.appendChild(canv);
  const worker = new Worker("worker.js");
  const offscreenCanvas = document
    .querySelector("#canvas-" + i)
    .transferControlToOffscreen();
  worker.postMessage(
    {
      canvas: offscreenCanvas,
      type: "canvas",
      numberOfNodes: nofNodesPerWindow,
      offscreenIndex: i,
    },
    [offscreenCanvas]
  );
}

const timestampContainer = document.querySelector("#timestamp");

const updateTimestamp = () => {
  timestampContainer.innerText = Date.now();
  requestAnimationFrame(updateTimestamp);
};

updateTimestamp();
