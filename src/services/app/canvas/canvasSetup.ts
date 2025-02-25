import paper from "paper";

// Services imports
import "../cursor/cursorDisplay.ts";
import "../cursor/cursorTools.ts";

// Handlers imports
import { initializeFrameSystem } from "../handlers/handleFrames.ts";
import { setupToolsEvents } from "../handlers/handleTools.ts";
import {
  setupAnimationsEvents,
  setupFrameControls,
  animationPlaying,
  setupOnionSkinningControls
} from "../handlers/handleAnimations.ts";

// Components imports
import { AnimateTools } from "../../../components/animateTools.ts";
import { DrawingTools } from "../../../components/drawingTools.ts";

// Instantiate Paper.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Paper.js status:", {
    project: paper.project ? "loaded" : "not loaded",
    view: paper.view ? "loaded" : "not loaded",
    tools: paper.tools ? "loaded" : "not loaded",
  });
});

// DEBUG PURPOSE
console.log(localStorage)

export function injectPage() {
  document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <main>        
            <div class="canvas-container">
                <canvas id="canvas" width="600" height="400"></canvas>
                <div class="animation-preview-badge">PREVIEW</div>
            </div>

            <!-- Animating Tools -->
            ${AnimateTools()}
            
            <!-- Drawing Tools -->
            ${DrawingTools()}
        </main>
    `;

  // Add animation styles
  addAnimationStyles();

  canvasInit();
  setupToolsEvents();
  setupAnimationsEvents();
  setupFrameControls();
  setupOnionSkinningControls(); // Nouvelle fonction pour configurer les contrôles d'onion skinning

  // Set up animation preview indicator
  setupAnimationPreviewIndicator();
}

function addAnimationStyles() {
  // Check if the styles are already added
  if (document.getElementById('animation-styles')) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = 'animation-styles';
  styleSheet.textContent = `

  `;
  document.head.appendChild(styleSheet);
}

function setupAnimationPreviewIndicator() {
  // Check animation state periodically and update the indicator
  setInterval(() => {
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
      if (animationPlaying) {
        canvasContainer.classList.add('playing');
      } else {
        canvasContainer.classList.remove('playing');
      }
    }
  }, 100);
}

function canvasInit() {
  const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;

  paper.setup(canvas);

  initializeFrameSystem();

  console.log("Canvas setup complete");
}

function forceUpdateFrameIndicator() {
  import('../handlers/handleFrames.ts').then(module => {
    const frameCount = module.getFramesCount();
    const currentIndex = module.getCurrentFrameIndex();
    const frameIndicator = document.getElementById('frame-indicator');
    if (frameIndicator) {
      frameIndicator.textContent = `Frame: ${currentIndex + 1}/${frameCount}`;
    }
  });
}

// Rendre la fonction accessible globalement
(window as any).updateFrameCounter = forceUpdateFrameIndicator;