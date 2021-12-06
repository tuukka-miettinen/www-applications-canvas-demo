const offscreen = document
  .querySelector("#myCanvas")
  .transferControlToOffscreen();
const worker = new Worker("worker.js");

if (!location.search) {
  location.search = 500;
}

worker.postMessage(
  {
    canvas: offscreen,
    type: "canvas",
    numberOfNodes: location.search.substring(1),
  },
  [offscreen]
);

const timestampContainer = document.querySelector("#timestamp");

const updateTimestamp = () => {
  timestampContainer.innerText = Date.now();
  requestAnimationFrame(updateTimestamp);
};

updateTimestamp();
