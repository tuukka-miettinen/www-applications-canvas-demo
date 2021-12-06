if (!location.search) {
  location.search = 500;
}

const nofNodes = location.search.substring(1);
const offscreenProcessors = 10 // window.navigator.hardwareConcurrency - 1;
const nofNodesPerWindow = Math.floor(nofNodes / offscreenProcessors);

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

// const timestampContainer = document.querySelector("#timestamp");

const updateTimestamp = () => {
  timestampContainer.innerText = Date.now();
  requestAnimationFrame(updateTimestamp);
};

updateTimestamp();
