import paper from 'paper';
import {
  getFramesCount,
  getCurrentFrameIndex,
  switchToFrame,
  toggleOnionSkinning,
} from './handleFrames';
import { getCurrentFps } from './handleAnimations';

// Nous utiliserons gif.js pour créer le GIF
declare const GIF: any;

let isExporting = false;
let gifInstance: any = null;

// Structure pour le modal d'export
export function setupExportEvents() {
  // Créer le modal d'export lors de l'initialisation
  createExportModal();

  // Configurer le bouton d'export dans la barre d'outils
  const exportGifBtn = document.getElementById('ExportGif');
  exportGifBtn?.addEventListener('click', () => {
    openExportModal();
  });

  // Configurer le bouton de génération dans le modal
  const startExportBtn = document.getElementById('start-export');
  startExportBtn?.addEventListener('click', () => {
    if (!isExporting) {
      startGifExport();
    }
  });

  // Configurer les boutons de fermeture du modal
  document.getElementById('close-modal')?.addEventListener('click', closeExportModal);
  document.getElementById('cancel-export')?.addEventListener('click', closeExportModal);

  // Fermer le modal en cliquant à l'extérieur
  const modal = document.getElementById('export-modal');
  if (modal) {
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        closeExportModal();
      }
    });
  }
}

// Créer le modal d'export s'il n'existe pas
function createExportModal() {
  if (!document.getElementById('export-modal')) {
    const modalHTML = `
            <div id="export-modal" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Export Animation as GIF</h2>
                        <button id="close-modal" class="close-button">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="option-group">
                            <label for="gif-quality">Quality:</label>
                            <select id="gif-quality">
                                <option value="10">High</option>
                                <option value="5" selected>Medium</option>
                                <option value="1">Low</option>
                            </select>
                        </div>
                        <div class="option-group">
                            <label for="gif-size">Size:</label>
                            <select id="gif-size">
                                <option value="1">Original (600×400)</option>
                                <option value="0.75">Medium (450×300)</option>
                                <option value="0.5">Small (300×200)</option>
                            </select>
                        </div>
                        <div class="progress-container hidden">
                            <div class="progress-text">Generating GIF: <span id="export-progress">0%</span></div>
                            <div class="progress-bar-container">
                                <div id="progress-bar" class="progress-bar"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="cancel-export" class="secondary-button">Cancel</button>
                        <button id="start-export" class="primary-button">Generate GIF</button>
                    </div>
                </div>
            </div>
        `;

    // Ajouter le modal au body
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    document.body.appendChild(modalElement.firstElementChild as HTMLElement);
  }
}

// Fonction pour désactiver le curseur personnalisé
function disableCustomCursor() {
  const cursor = document.querySelector('.idle-cursor');
  if (cursor) {
    (cursor as HTMLElement).style.display = 'none';
  }

  // Restaurer le curseur standard
  document.body.style.cursor = 'auto';

  // Supprimer temporairement le style "cursor: none" pour montrer le curseur normal
  const elementsWithCursorNone = document.querySelectorAll('*');
  elementsWithCursorNone.forEach(el => {
    if (window.getComputedStyle(el).cursor === 'none') {
      (el as HTMLElement).dataset.hadCursorNone = 'true';
      (el as HTMLElement).style.cursor = 'auto';
    }
  });
}

// Fonction pour réactiver le curseur personnalisé
function enableCustomCursor() {
  const cursor = document.querySelector('.idle-cursor');
  if (cursor) {
    (cursor as HTMLElement).style.display = '';
  }

  // Restaurer le style d'origine
  document.body.style.cursor = '';

  // Restaurer le style "cursor: none" où il était appliqué
  const elementsWithCursorNone = document.querySelectorAll('*[data-had-cursor-none="true"]');
  elementsWithCursorNone.forEach(el => {
    (el as HTMLElement).style.cursor = 'none';
    delete (el as HTMLElement).dataset.hadCursorNone;
  });
}

// Ouvrir le modal d'export
export function openExportModal() {
  const modal = document.getElementById('export-modal');
  if (modal) {
    disableCustomCursor(); // Désactiver le curseur personnalisé
    modal.classList.remove('hidden');

    // Réinitialiser la barre de progression si nécessaire
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('export-progress');

    if (progressContainer) progressContainer.classList.add('hidden');
    if (progressBar) progressBar.style.width = '0%';
    if (progressText) progressText.textContent = '0%';
  } else {
    // Créer le modal s'il n'existe pas déjà
    createExportModal();
    openExportModal();
  }
}

// Fermer le modal d'export
export function closeExportModal() {
  const modal = document.getElementById('export-modal');
  if (modal) {
    modal.classList.add('hidden');
    enableCustomCursor(); // Réactiver le curseur personnalisé
  }
}

function startGifExport() {
  const startExportBtn = document.getElementById('start-export') as HTMLButtonElement;
  if (startExportBtn) {
    startExportBtn.textContent = 'Loading library...';
    startExportBtn.disabled = true;
  }

  if (!window.GIF) {
    console.log('GIF.js not loaded, attempting to load...');
    loadGifJsLibrary()
      .then(() => {
        console.log('GIF.js loaded successfully, starting export');
        if (startExportBtn) {
          startExportBtn.textContent = 'Generate GIF';
          startExportBtn.disabled = false;
        }
        processGifExport();
      })
      .catch(error => {
        console.error('Failed to load gif.js library:', error);
        alert(
          'Failed to load GIF export library. Please check your internet connection and try again.'
        );
        if (startExportBtn) {
          startExportBtn.textContent = 'Generate GIF';
          startExportBtn.disabled = false;
        }
      });
  } else {
    console.log('GIF.js already loaded, starting export directly');
    processGifExport();
  }
}

function loadGifJsLibrary(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Vérifier si déjà chargé
    if (window.GIF) {
      console.log('GIF.js already loaded');
      resolve();
      return;
    }

    console.log('Loading local GIF.js library...');

    // Créer une div pour les messages d'état
    const statusElement = document.createElement('div');
    statusElement.id = 'gif-loading-status';
    statusElement.style.position = 'absolute';
    statusElement.style.bottom = '10px';
    statusElement.style.left = '10px';
    statusElement.style.background = 'rgba(0,0,0,0.7)';
    statusElement.style.color = 'white';
    statusElement.style.padding = '8px';
    statusElement.style.borderRadius = '4px';
    statusElement.style.zIndex = '2001';
    statusElement.textContent = 'Loading GIF.js library...';
    document.body.appendChild(statusElement);

    // Charger gif.js depuis le fichier local
    const script = document.createElement('script');
    script.src = '/lib/gif.js'; // Chemin relatif à partir de public
    script.async = true;

    script.onload = () => {
      console.log('GIF.js loaded successfully');
      statusElement.textContent = 'App loaded successfully!';

      // Nettoyer après 2 secondes
      setTimeout(() => {
        document.body.removeChild(statusElement);
        resolve();
      }, 2000);
    };

    script.onerror = e => {
      console.error('Failed to load local GIF.js script:', e);
      statusElement.textContent = 'Error: Failed to load GIF.js library';
      statusElement.style.background = 'rgba(255,0,0,0.7)';
      reject(new Error('Failed to load local gif.js script'));

      // Ne pas supprimer le message d'erreur pour que l'utilisateur puisse le voir
    };

    document.head.appendChild(script);
  });
}

export function preloadGifLibrary() {
  console.log('Préchargement de GIF.js...');

  // Ne précharge pas si déjà chargé
  if (window.GIF) {
    console.log('GIF.js déjà chargé');
    return Promise.resolve();
  }

  return loadGifJsLibrary()
    .then(() => {
      console.log('GIF.js préchargé avec succès');
    })
    .catch(error => {
      console.error('Échec du préchargement de GIF.js:', error);
    });
}

function processGifExport() {
  const progressContainer = document.querySelector('.progress-container');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('export-progress');
  const qualitySelect = document.getElementById('gif-quality') as HTMLSelectElement;
  const sizeSelect = document.getElementById('gif-size') as HTMLSelectElement;
  const startExportBtn = document.getElementById('start-export') as HTMLButtonElement;
  const cancelExportBtn = document.getElementById('cancel-export') as HTMLButtonElement;

  if (!progressContainer || !progressBar || !progressText || !qualitySelect || !sizeSelect) {
    console.error('Required DOM elements not found');
    return;
  }

  // Show progress container, disable buttons
  progressContainer.classList.remove('hidden');
  if (startExportBtn) {
    startExportBtn.disabled = true;
    startExportBtn.textContent = 'Generating...';
  }
  if (cancelExportBtn) {
    cancelExportBtn.disabled = true;
  }

  // Get export settings
  const quality = parseInt(qualitySelect.value);
  const sizeRatio = parseFloat(sizeSelect.value);

  // Calculate dimensions
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const width = Math.round(canvas.width * sizeRatio);
  const height = Math.round(canvas.height * sizeRatio);

  // Save current frame index and onion skinning state to restore later
  const originalFrameIndex = getCurrentFrameIndex();

  // Vérifier si l'onion skinning est actif
  const onionSkinButton = document.getElementById('OnionSkin');
  const isOnionSkinningActive = onionSkinButton?.classList.contains('active') || false;
  let wasOnionSkinningDisabled = false;

  // Désactiver l'onion skinning temporairement s'il est actif
  if (isOnionSkinningActive) {
    console.log('Temporarily disabling onion skinning for export');
    toggleOnionSkinning(); // Désactive l'onion skinning
    wasOnionSkinningDisabled = true;

    // S'assurer que la désactivation de l'onion skinning a eu lieu avant de continuer
    setTimeout(() => {
      startExportProcess();
    }, 100);
  } else {
    startExportProcess();
  }

  function startExportProcess() {
    // Create GIF encoder
    gifInstance = new GIF({
      workers: 4,
      quality: quality,
      width: width,
      height: height,
      workerScript: '/lib/gif.worker.js',
      transparent: 'rgba(0,0,0,0)',
    });

    isExporting = true;

    // Set up GIF encoder events
    gifInstance.on('progress', (p: number) => {
      const percent = Math.round(p * 100);
      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) progressText.textContent = `${percent}%`;
    });

    gifInstance.on('finished', (blob: Blob) => {
      isExporting = false;

      // Create download link
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'flipnote-animation.gif';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Reset UI state
      if (progressBar) progressBar.style.width = '0%';
      if (progressText) progressText.textContent = '0%';
      if (progressContainer) progressContainer.classList.add('hidden');

      if (startExportBtn) {
        startExportBtn.disabled = false;
        startExportBtn.textContent = 'Generate GIF';
      }
      if (cancelExportBtn) {
        cancelExportBtn.disabled = false;
      }

      // Return to original frame
      switchToFrame(originalFrameIndex);

      // Réactiver l'onion skinning si nécessaire
      if (wasOnionSkinningDisabled && onionSkinButton) {
        console.log('Re-enabling onion skinning after export');
        toggleOnionSkinning(); // Réactive l'onion skinning
        // S'assurer que l'UI reflète correctement l'état
        if (!onionSkinButton.classList.contains('active')) {
          onionSkinButton.classList.add('active');
        }
      }

      // Close modal after download
      setTimeout(() => {
        closeExportModal();
      }, 1000);

      // Clean up
      gifInstance = null;
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    // Process each frame
    const totalFrames = getFramesCount();
    const delay = 1000 / getCurrentFps(); // milliseconds between frames

    captureFrames(0, totalFrames, delay, width, height).then(() => {
      // Render GIF
      gifInstance.render();
    });
  }
}

// Modifiez la fonction captureFrames dans handleExport.ts

async function captureFrames(
  currentFrame: number,
  totalFrames: number,
  delay: number,
  width: number,
  height: number
): Promise<void> {
  if (currentFrame >= totalFrames || !isExporting) {
    return;
  }

  // Switch to the frame we want to capture
  switchToFrame(currentFrame);

  // Allow the frame to render
  await new Promise(resolve => setTimeout(resolve, 50));

  // Capture the current state of the canvas
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  // Create a temporary canvas with the desired export size
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext('2d');

  if (ctx) {
    // Fill with white background first (since PaperJS might have transparency)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    // Approche plus directe: masquer temporairement les couches d'onion skinning
    const onionLayers = document.querySelectorAll('[data-is-onion-skin="true"]');
    const hiddenLayers: HTMLElement[] = [];

    // Masquer toutes les couches d'onion skinning
    onionLayers.forEach(layer => {
      if (layer instanceof HTMLElement) {
        if (layer.style.display !== 'none') {
          layer.style.display = 'none';
          hiddenLayers.push(layer);
        }
      }
    });

    // Approche alternative: masquer toutes les couches PaperJS avec données isOnionSkin
    if (paper && paper.project) {
      paper.project.layers.forEach(layer => {
        if (layer.data && layer.data.isOnionSkin) {
          layer.visible = false;
        }
      });
    }

    // Attendre que le rendu soit mis à jour
    await new Promise(resolve => setTimeout(resolve, 10));

    // Draw the main canvas onto the temporary canvas, scaled to the desired size
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

    // Restaurer la visibilité des couches d'onion skinning
    hiddenLayers.forEach(layer => {
      layer.style.display = '';
    });

    // Restaurer la visibilité des couches PaperJS
    if (paper && paper.project) {
      paper.project.layers.forEach(layer => {
        if (layer.data && layer.data.isOnionSkin) {
          layer.visible = true;
        }
      });
    }

    // Add the frame to the GIF
    gifInstance.addFrame(tempCanvas, { delay: delay, copy: true });
  }

  // Process the next frame
  return captureFrames(currentFrame + 1, totalFrames, delay, width, height);
}
