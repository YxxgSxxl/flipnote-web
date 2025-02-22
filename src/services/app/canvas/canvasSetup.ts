import paper from "paper";

// Services imports
import "../cursor/cursorDisplay.ts";
import "../cursor/cursorTools.ts";

// Handlers imports
import { initializeFrameSystem } from "../handlers/handleFrames.ts";
import { setupToolsEvents } from "../handlers/handleTools.ts";
import { setupAnimationsEvents, setupFrameControls, animationPlaying } from "../handlers/handleAnimations.ts";

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

  // Set up animation preview indicator
  setupAnimationPreviewIndicator();
}

function addAnimationStyles() {
  // Check if the styles are already added
  if (document.getElementById('animation-styles')) return;

  const styleSheet = document.createElement('style');
  styleSheet.id = 'animation-styles';
  styleSheet.textContent = `
    /* Animation Controls */
    .animation-controls {
      display: flex;
      align-items: center;
      gap: 15px;
      margin: 10px 0;
      padding: 8px 12px;
      background-color: rgba(200, 200, 200, 0.1);
      border-radius: 4px;
      width: fit-content;
    }

    .animation-controls label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
    }

    /* FPS Toggle Button */
    .fps-toggle button {
      padding: 5px 12px;
      border-radius: 4px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }

    .fps-toggle button.standard-fps {
      background-color: #4a6da7;
      color: white;
    }

    .fps-toggle button.high-fps {
      background-color: #2f9e44;
      color: white;
    }

    .animation-controls .loop-label {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .animation-controls input[type="checkbox"] {
      cursor: pointer;
      width: 16px;
      height: 16px;
    }

    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
      .animation-controls {
        background-color: rgba(50, 50, 50, 0.3);
        color: var(--app-c-text-light);
      }
      
      .fps-toggle button.standard-fps {
        background-color: #3d5a8a;
      }
      
      .fps-toggle button.high-fps {
        background-color: #2a803a;
      }
    }

    /* Animation preview badge */
    .animation-preview-badge {
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: rgba(255, 50, 50, 0.7);
      color: white;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .canvas-container {
      position: relative;
    }

    .canvas-container.playing .animation-preview-badge {
      opacity: 1;
    }

    /* Disabled tool buttons during animation */
    .toolbox button.disabled,
    .settings button.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Canvas style during animation preview */
    .canvas-container.playing canvas {
      cursor: not-allowed !important;
    }
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