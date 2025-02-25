import paper from "paper";

interface PathData {
  pathData: string;
  strokeColor: string | null;
  strokeWidth: number;
  fillColor?: string;
  isCircle?: boolean;
  center?: { x: number, y: number };
  radius?: number;
}

interface GroupData {
  type: 'group';
  children: (PathData | GroupData)[];
  isPencilGroup?: boolean;
  isEraserGroup?: boolean;
  eraserType?: string;
}

interface ItemData {
  type: string;
  data: PathData | GroupData;
}

interface FrameData {
  items: ItemData[];
}

interface StoredData {
  currentFrameIndex: number;
  frames: { [key: number]: FrameData };
}

let frames: paper.Group[] = [];
let currentFrameIndex = 0;

// Helper function to serialize a paper.Item (Path or Group)
function serializeItem(item: paper.Item): ItemData {
  if (item instanceof paper.Path) {
    const pathData: PathData = {
      pathData: item.pathData,
      strokeColor: item.strokeColor ? item.strokeColor.toCSS(true) : null,
      strokeWidth: item.strokeWidth || 0
    };

    if (item.fillColor) {
      pathData.fillColor = item.fillColor.toCSS(true);
    }

    // Special handling for circles (eraser)
    if (item.className === 'Path' && item.segments.length <= 8 && item.closed) {
      // Check if it's likely a circle by approximation
      if (item.bounds.width === item.bounds.height &&
          Math.abs(item.bounds.width - item.segments.length * 8 / Math.PI) < 2) {
        pathData.isCircle = true;
        pathData.center = {
          x: item.bounds.center.x,
          y: item.bounds.center.y
        };
        pathData.radius = item.bounds.width / 2;
      }
    }

    return {
      type: 'path',
      data: pathData
    };
  }
  else if (item instanceof paper.Group) {
    const groupData: GroupData = {
      type: 'group',
      children: item.children.map(child => {
        if (child instanceof paper.Path) {
          return serializeItem(child).data as PathData;
        } else if (child instanceof paper.Group) {
          return serializeItem(child).data as GroupData;
        }
        // Default empty return to satisfy TypeScript
        return {
          pathData: '',
          strokeColor: null,
          strokeWidth: 0
        };
      })
    };

    // Save any special metadata
    if (item.data) {
      if (item.data.isPencilGroup) {
        groupData.isPencilGroup = true;
      }
      if (item.data.isEraserGroup) {
        groupData.isEraserGroup = true;
        if (item.data.eraserType) {
          groupData.eraserType = item.data.eraserType;
        }
      }
    }

    return {
      type: 'group',
      data: groupData
    };
  }

  // Default fallback
  return {
    type: 'unknown',
    data: {
      pathData: '',
      strokeColor: null,
      strokeWidth: 0
    }
  };
}

// Helper function to deserialize data into paper.Item
function deserializeItem(itemData: ItemData): paper.Item | null {
  if (itemData.type === 'path') {
    const pathData = itemData.data as PathData;

    // Special handling for circles
    if (pathData.isCircle && pathData.center && pathData.radius) {
      const circle = new paper.Path.Circle({
        center: new paper.Point(pathData.center.x, pathData.center.y),
        radius: pathData.radius,
        fillColor: pathData.fillColor ? new paper.Color(pathData.fillColor) : 'white',
        strokeWidth: 0,
        strokeColor: null
      });
      return circle;
    }

    // Regular path
    const path = new paper.Path(pathData.pathData);

    // Make sure we explicitly set stroke properties
    if (pathData.strokeColor === null) {
      path.strokeWidth = 0;
      path.strokeColor = null;
    } else {
      path.strokeWidth = pathData.strokeWidth;
      path.strokeColor = new paper.Color(pathData.strokeColor);
    }

    if (pathData.fillColor) {
      path.fillColor = new paper.Color(pathData.fillColor);
    }

    return path;
  }
  else if (itemData.type === 'group') {
    const groupData = itemData.data as GroupData;
    const group = new paper.Group();

    // Restore any special metadata
    if (groupData.isPencilGroup || groupData.isEraserGroup) {
      group.data = {};
      if (groupData.isPencilGroup) {
        group.data.isPencilGroup = true;
      }
      if (groupData.isEraserGroup) {
        group.data.isEraserGroup = true;
        if (groupData.eraserType) {
          group.data.eraserType = groupData.eraserType;
        }
      }
    }

    // Restore children
    groupData.children.forEach(childData => {
      if ('pathData' in childData || 'isCircle' in childData) {
        // It's a path or circle
        let child: paper.Item | null = null;

        if (childData.isCircle && 'center' in childData && 'radius' in childData) {
          // Create circle
          child = new paper.Path.Circle({
            center: new paper.Point(childData.center!.x, childData.center!.y),
            radius: childData.radius!,
            fillColor: childData.fillColor ? new paper.Color(childData.fillColor) : 'white',
            strokeWidth: 0,
            strokeColor: null
          });
        } else {
          // Create regular path
          child = new paper.Path(childData.pathData);

          // Explicitly set stroke properties
          if (childData.strokeColor === null) {
            child.strokeWidth = 0;
            child.strokeColor = null;
          } else {
            child.strokeWidth = childData.strokeWidth;
            child.strokeColor = new paper.Color(childData.strokeColor);
          }

          if (childData.fillColor) {
            child.fillColor = new paper.Color(childData.fillColor);
          }
        }

        if (child) {
          group.addChild(child);
        }
      } else if ('type' in childData && childData.type === 'group') {
        // It's a nested group, recursive call
        const nestedItem = deserializeItem({
          type: 'group',
          data: childData
        });
        if (nestedItem) {
          group.addChild(nestedItem);
        }
      }
    });

    return group;
  }

  return null;
}

export function saveFramesToStorage() {
  const frameData: { [key: number]: FrameData } = {};

  frames.forEach((frame, index) => {
    frameData[index] = {
      items: frame.children.map(child => serializeItem(child))
    };
  });

  const dataToSave: StoredData = {
    currentFrameIndex,
    frames: frameData
  };

  try {
    localStorage.setItem('frameDrawings', JSON.stringify(dataToSave));
    console.log('Frames saved to storage. Current frame:', currentFrameIndex);
  } catch (error) {
    console.error('Error saving frames to storage:', error);
  }
}

export function loadFramesFromStorage(): boolean {
  const savedData = localStorage.getItem('frameDrawings');
  if (!savedData) return false;

  try {
    const parsedData: StoredData = JSON.parse(savedData);
    console.log('Loaded data from storage:', parsedData);

    // Clear existing frames
    frames.forEach(frame => frame.remove());
    frames = [];

    // Récupérer la liste des frames par index
    const frameIndices = Object.keys(parsedData.frames).map(index => parseInt(index));
    const maxIndex = Math.max(...frameIndices, -1);

    // Créer un tableau de frames correctement dimensionné
    frames = new Array(maxIndex + 1);

    // Recreate frames from saved data
    Object.entries(parsedData.frames).forEach(([frameIndex, frameData]) => {
      const frame = new paper.Group();

      frameData.items.forEach(itemData => {
        const item = deserializeItem(itemData);
        if (item) {
          frame.addChild(item);
        }
      });

      frames[parseInt(frameIndex)] = frame;
      frame.visible = false;
    });

    // Set the current frame index
    currentFrameIndex = parsedData.currentFrameIndex;

    // Make current frame visible
    if (frames[currentFrameIndex]) {
      frames[currentFrameIndex].visible = true;
    } else if (frames.length > 0) {
      // Fallback to first frame if current frame doesn't exist
      currentFrameIndex = 0;
      frames[0].visible = true;
    }

    // Update the frame indicator in the UI - avec un petit délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      updateFrameIndicator();
    }, 100);

    console.log(`Loaded ${frames.length} frames, restored to frame: ${currentFrameIndex}`);
    return true;
  } catch (error) {
    console.error('Error loading frames:', error);
    return false;
  }
}

// Update the frame indicator in the UI
function updateFrameIndicator() {
  // Find frame indicator if it exists
  const frameIndicator = document.getElementById('frame-indicator');
  if (frameIndicator) {
    frameIndicator.textContent = `Frame: ${currentFrameIndex + 1}/${frames.length}`;
  }
}

export function setupFrames() {
  frames = [];
  const loaded = loadFramesFromStorage();
  if (!loaded) {
    addFrame();
  }

  // Set up auto-save
  window.addEventListener('frameUpdated', () => {
    console.log('Frame updated, saving...');
    saveFramesToStorage();
  });

  console.log(`Setup complete: ${frames.length} frame(s) initialized.`);
}

export function addFrame() {
  const newFrame = new paper.Group();

  const insertIndex = currentFrameIndex + 1;

  if (insertIndex < frames.length) {
    frames.splice(insertIndex, 0, newFrame);
  } else {
    frames.push(newFrame);
  }

  switchToFrame(insertIndex);
  saveFramesToStorage();

  console.log(`Added new frame at position ${insertIndex + 1}. Total frames: ${frames.length}`);
}

export function switchToFrame(index: number): number | null {
  if (index < 0 || index >= frames.length) return null;

  if (frames[currentFrameIndex]) {
    frames[currentFrameIndex].visible = false;
  }

  frames[index].visible = true;
  currentFrameIndex = index;

  // Update frame indicator
  updateFrameIndicator();

  // Save current frame index to storage
  saveFramesToStorage();

  console.log(`Switched to frame ${index} (Total: ${frames.length})`);
  return currentFrameIndex;
}

export function clearCurrentFrame() {
  if (frames[currentFrameIndex]) {
    frames[currentFrameIndex].removeChildren();
    saveFramesToStorage();
    console.log('Current frame cleared');
  }
}

export function deleteCurrentFrame() {
  if (frames.length <= 1) {
    // Ne pas supprimer s'il n'y a qu'une seule frame
    console.log('Cannot delete the only frame');
    return false;
  }

  // Supprimer la frame courante
  if (frames[currentFrameIndex]) {
    frames[currentFrameIndex].remove();
    frames.splice(currentFrameIndex, 1);
  }

  // Ajuster l'index si nécessaire
  if (currentFrameIndex >= frames.length) {
    currentFrameIndex = frames.length - 1;
  }

  // Rendre visible la nouvelle frame courante
  if (frames[currentFrameIndex]) {
    frames[currentFrameIndex].visible = true;
  }

  // Mettre à jour l'indicateur de frame dans l'UI
  updateFrameIndicator();

  // Sauvegarder l'état actuel
  saveFramesToStorage();

  console.log(`Deleted frame. Now at frame ${currentFrameIndex + 1} of ${frames.length}`);
  return true;
}

export function previousFrame() {
  if (currentFrameIndex > 0) {
    switchToFrame(currentFrameIndex - 1);
  }
}

export function nextFrame() {
  if (currentFrameIndex < frames.length - 1) {
    switchToFrame(currentFrameIndex + 1);
  }
}

export function getCurrentFrame(): paper.Group | null {
  return frames[currentFrameIndex] || null;
}

export function getCurrentFrameIndex(): number {
  return currentFrameIndex;
}

export function getFramesCount(): number {
  return frames.length;
}

export function initializeFrameSystem() {
  setupFrames();

  setTimeout(() => {
    updateFrameIndicator();
  }, 500);
}