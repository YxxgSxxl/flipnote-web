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
import {setupExportEvents, preloadGifLibrary} from "../handlers/handleExport.ts";

// Components imports
import { AnimateTools } from "../../../components/animateTools.ts";
import { DrawingTools } from "../../../components/drawingTools.ts";

// Paper.js status
document.addEventListener("DOMContentLoaded", () => {
  console.log("Paper.js status:", {
    project: paper.project ? "loaded" : "not loaded",
    view: paper.view ? "loaded" : "not loaded",
    tools: paper.tools ? "loaded" : "not loaded",
  });
});

// Dans la fonction injectApp(), ajoutez l'appel à preloadGifLibrary
export function injectApp() {
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

  canvasInit();

  // Préchargement de GIF.js dès le début
  preloadGifLibrary();

  // Initialiser les outils et animations
  setupToolsEvents();
  setupAnimationsEvents();
  setupExportEvents();

  // Assurez-vous que ces fonctions sont appelées après les précédentes
  setupFrameControls();
  setupOnionSkinningControls();

  // Set up animation preview indicator
  setupAnimationPreviewIndicator();

  // Forcer une mise à jour de l'indicateur de frame après un délai
  setTimeout(() => {
    if (typeof (window as any).updateFrameCounter === 'function') {
      (window as any).updateFrameCounter();
    }
  }, 500);
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