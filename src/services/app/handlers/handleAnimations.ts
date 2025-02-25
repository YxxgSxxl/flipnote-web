import {
    nextFrame,
    previousFrame,
    addFrame,
    switchToFrame,
    getFramesCount,
    clearCurrentFrame,
    deleteCurrentFrame, toggleOnionSkinning
} from "../handlers/handleFrames.ts";

export let animationPlaying: boolean = false;
let animationInterval: number | null = null;
const LOW_FPS = 8;  // Slower animation fps
const STANDARD_FPS = 12; // Standard animation fps
let currentFps = STANDARD_FPS; // Default to standard fps
let loopAnimation = true; // Whether animation should loop by default

export function setupAnimationsEvents() {
    const playButton: HTMLButtonElement = document.querySelector("button#Play")!;

    playButton.addEventListener("click", () => {
        playAnimation(playButton);
    });

    // Set up keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Space bar toggles play/pause
        if (event.code === 'Space' && !isInputFocused()) {
            event.preventDefault(); // Prevent scrolling
            playAnimation(playButton);
        }
    });

    // Add FPS controls if they don't exist
    setupFpsControls();
}

function isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement;
}

function setupFpsControls() {
    // Check if controls already exist
    if (document.getElementById('fps-controls')) return;

    // Create FPS controls container
    const fpsControls = document.createElement('div');
    fpsControls.id = 'fps-controls';
    fpsControls.classList.add('animation-controls');

    // Load saved preferences
    loadAnimationPreferences();

    fpsControls.innerHTML = `
        <div class="fps-toggle">
            <button id="fps-toggle-btn" class="${currentFps === STANDARD_FPS ? 'standard-fps' : 'low-fps'}">
                ${currentFps}fps
            </button>
        </div>
        <label for="loop-checkbox" class="loop-label">
        
            <input type="checkbox" id="loop-checkbox" ${loopAnimation ? 'checked' : ''}>
            Loop
        </label>
        <span id="frame-indicator">Frame: 1/1</span>
    `;

    // Find the animatebox to insert controls after it
    const animateBox = document.querySelector('.animateBox');
    if (animateBox && animateBox.parentNode) {
        animateBox.parentNode.insertBefore(fpsControls, animateBox.nextSibling);

        // Add event listeners for new controls
        const fpsToggleBtn = document.getElementById('fps-toggle-btn');
        const loopCheckbox = document.getElementById('loop-checkbox') as HTMLInputElement;

        fpsToggleBtn?.addEventListener('click', () => {
            currentFps = currentFps === STANDARD_FPS ? LOW_FPS : STANDARD_FPS;
            if (fpsToggleBtn) {
                fpsToggleBtn.textContent = `${currentFps}fps`;
                fpsToggleBtn.className = currentFps === STANDARD_FPS ? 'standard-fps' : 'low-fps';
            }

            // If animation is playing, restart it with new FPS
            if (animationPlaying) {
                stopAnimation();
                startAnimation();
            }

            // Save preference
            localStorage.setItem('animationFps', currentFps.toString());
        });

        loopCheckbox?.addEventListener('change', () => {
            loopAnimation = loopCheckbox.checked;
            // Save preference
            localStorage.setItem('animationLoop', loopAnimation.toString());
        });
    }

    setTimeout(() => {
        if (typeof (window as any).updateFrameCounter === 'function') {
            (window as any).updateFrameCounter();
        }
    }, 200);
}

export function setupOnionSkinningControls() {
    const onionToggle = document.getElementById('onion-toggle') as HTMLInputElement;
    const opacitySlider = document.getElementById('onion-opacity') as HTMLInputElement;
    const opacityValue = document.getElementById('onion-opacity-value');
    const prevFramesSelect = document.getElementById('onion-prev-frames') as HTMLSelectElement;

    // Charger les préférences sauvegardées
    const savedOnionEnabled = localStorage.getItem('onionSkinningEnabled');
    const savedOpacity = localStorage.getItem('onionSkinningOpacity');
    const savedPrevFrames = localStorage.getItem('onionSkinningPrevFrames');

    // Appliquer les préférences sauvegardées
    if (savedOnionEnabled === 'true' && onionToggle) {
        onionToggle.checked = true;
        toggleOnionSkinning(); // Activer l'onion skinning
    }

    if (savedOpacity && opacitySlider) {
        const opacity = parseInt(savedOpacity);
        opacitySlider.value = opacity.toString();
        if (opacityValue) {
            opacityValue.textContent = `${opacity}%`;
        }
        setOnionSkinningOpacity(opacity / 100); // Convertir le pourcentage en valeur entre 0 et 1.
    }

    if (savedPrevFrames && prevFramesSelect) {
        prevFramesSelect.value = savedPrevFrames;
        setOnionSkinningFrames(parseInt(savedPrevFrames), 0);
    }

    // Configuration des événements
    if (onionToggle) {
        onionToggle.addEventListener('change', () => {
            const isEnabled = toggleOnionSkinning();
            localStorage.setItem('onionSkinningEnabled', isEnabled.toString());
        });
    }

    if (opacitySlider) {
        opacitySlider.addEventListener('input', () => {
            const opacity = parseInt(opacitySlider.value);
            if (opacityValue) {
                opacityValue.textContent = `${opacity}%`;
            }
            setOnionSkinningOpacity(opacity / 100);
            localStorage.setItem('onionSkinningOpacity', opacity.toString());
        });
    }

    if (prevFramesSelect) {
        prevFramesSelect.addEventListener('change', () => {
            const prevFrames = parseInt(prevFramesSelect.value);
            setOnionSkinningFrames(prevFrames, 0);
            localStorage.setItem('onionSkinningPrevFrames', prevFrames.toString());
        });
    }
}

function loadAnimationPreferences() {
    const savedFps = localStorage.getItem('animationFps');
    if (savedFps) {
        const fps = parseInt(savedFps);
        // Only accept valid values (8 or 12)
        currentFps = fps === LOW_FPS || fps === STANDARD_FPS ? fps : STANDARD_FPS;
    }

    const savedLoop = localStorage.getItem('animationLoop');
    if (savedLoop !== null) {
        loopAnimation = savedLoop === 'true';
    }
}

function playAnimation(playButton: HTMLButtonElement) {
    const playButtonImg: HTMLImageElement = playButton.querySelector("img")!;

    if (!animationPlaying) {
        console.log("Playing animation...");
        playButtonImg.src = "/img/icons/stopbtn_32x32.png";
        animationPlaying = true;
        disableDrawing(true);
        startAnimation();
    } else {
        console.log("Stopping animation...");
        playButtonImg.src = "/img/icons/playbtn_32x32.png";
        animationPlaying = false;
        disableDrawing(false);
        stopAnimation();
    }
}

// Function to disable/enable drawing tools during animation
function disableDrawing(disable: boolean) {
    // Disable/enable drawing tool buttons
    const toolButtons = document.querySelectorAll('.drawingbox button');
    toolButtons.forEach(button => {
        const btn = button as HTMLButtonElement;
        btn.disabled = disable;
        if (disable) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });

    // Disable/enable size setting buttons
    const sizeButtons = document.querySelectorAll('.settings button');
    sizeButtons.forEach(button => {
        const btn = button as HTMLButtonElement;
        btn.disabled = disable;
        if (disable) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
}

function startAnimation() {
    if (animationInterval !== null) {
        clearInterval(animationInterval);
    }

    // Calculate milliseconds per frame
    const frameDelay = 1000 / currentFps;

    // Set canvas container to preview mode
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
        canvasContainer.classList.add('playing');
    }

    // Count the total frames (we'll get this in the first animation tick)
    let totalFrames = 0;
    const frameIndicator = document.getElementById('frame-indicator');
    if (frameIndicator) {
        const match = frameIndicator.textContent?.match(/Frame: \d+\/(\d+)/);
        if (match && match[1]) {
            totalFrames = parseInt(match[1]);
        }
    }

    // Start interval for frame cycling
    animationInterval = window.setInterval(() => {
        // Get current frame index from indicator
        const frameIndicator = document.getElementById('frame-indicator');
        if (frameIndicator) {
            const match = frameIndicator.textContent?.match(/Frame: (\d+)\/(\d+)/);
            if (match && match[1] && match[2]) {
                const currentFrameNum = parseInt(match[1]);
                totalFrames = parseInt(match[2]);

                if (currentFrameNum < totalFrames) {
                    // Move to next frame
                    nextFrame();
                } else {
                    // We've reached the end of the animation
                    if (loopAnimation) {
                        // Loop back to first frame
                        switchToFrame(0);
                    } else {
                        // Stop animation
                        stopAnimation();
                        // Reset play button
                        const playButton = document.querySelector("button#Play");
                        if (playButton) {
                            const playButtonImg = playButton.querySelector("img");
                            if (playButtonImg) {
                                playButtonImg.src = "/img/icons/playbtn_32x32.png";
                            }
                            animationPlaying = false;
                            disableDrawing(false);
                        }
                    }
                }
            }
        }
    }, frameDelay);
}

function stopAnimation() {
    if (animationInterval !== null) {
        clearInterval(animationInterval);
        animationInterval = null;
    }

    // Remove preview mode from canvas container
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
        canvasContainer.classList.remove('playing');
    }
}

// Function to go to first frame
export function goToFirstFrame() {
    switchToFrame(0);
}

// Function to go to last frame
export function goToLastFrame() {
    const totalFrames = getFramesCount();
    if (totalFrames > 0) {
        switchToFrame(totalFrames - 1);
    }
}


export function setupFrameControls() {
    document.getElementById("AddFrame")?.addEventListener("click", addFrame);
    document.getElementById("PrevFrame")?.addEventListener("click", previousFrame);
    document.getElementById("NextFrame")?.addEventListener("click", nextFrame);
    document.getElementById("FirstFrame")?.addEventListener("click", goToFirstFrame);
    document.getElementById("LastFrame")?.addEventListener("click", goToLastFrame);
    document.getElementById("DeleteFrame")?.addEventListener("click", () => {
        if (!animationPlaying) {
            deleteCurrentFrame();
        }
    });
    document.getElementById("ClearFrame")?.addEventListener("click", () => {
        if (!animationPlaying) {
            clearCurrentFrame();
        }
    });
    document.getElementById("OnionSkin")?.addEventListener("click", () => {
        if (!animationPlaying) {
            const button = document.getElementById("OnionSkin");
            const isEnabled = toggleOnionSkinning();

            // Mise à jour visuelle du bouton
            if (button) {
                if (isEnabled) {
                    button.classList.add("active");
                } else {
                    button.classList.remove("active");
                }
            }

            // Sauvegarder la préférence
            localStorage.setItem('onionSkinningEnabled', isEnabled.toString());
        }
    });

    // Restaurer l'état du bouton d'onion skinning depuis localStorage
    const savedOnionEnabled = localStorage.getItem('onionSkinningEnabled');
    if (savedOnionEnabled === 'true') {
        const button = document.getElementById("OnionSkin");
        if (button) {
            button.classList.add("active");
        }
        toggleOnionSkinning(); // Activer l'onion skinning
    }
}