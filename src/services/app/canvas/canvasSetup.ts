import paper from "paper";

// Services imports
import "../cursor/cursorDisplay.ts";
import "../cursor/cursorTools.ts";
import { setupToolsEvents } from "../handlers/handleTools.ts";
import { setupAnimationsEvents } from "../handlers/handleAnimations.ts";

// Components imports
import { AnimateTools } from "../../../components/animateTools.ts";
import { DrawingTools } from "../../../components/drawingTools.ts";

// Instantiate Paper.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Paper.js status:", {
      project: paper.project ? "loaded" : "not loaded",
      view: paper.view ? "loaded" : "not loaded",
      tools: paper.tools ? "loaded" : "not loaded"
  });
});

export function injectPage() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <main>
            <canvas id="canvas" width="600" height="400"></canvas>

            <!-- Animating Tools -->
            ${AnimateTools()}

            <!-- Drawing Tools -->
            ${DrawingTools()}
        </main>
    `;

  canvasInit();
  setupToolsEvents();
  setupAnimationsEvents();
}

function canvasInit() {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

  paper.setup(canvas);

  // Appelle cette fonction après avoir initialisé Paper.js
paper.project.activeLayer.addChild(new paper.Layer());
addBackground();

  console.log("Canvas setup complete");
}

function addBackground() {
  const background = new paper.Path.Rectangle({
      point: [0, 0],
      size: paper.view.size,
      fillColor: "white"
  });
  background.sendToBack();
}
