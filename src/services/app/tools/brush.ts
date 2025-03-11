import paper from 'paper';
import { getCurrentFrame, saveFramesToStorage } from '../handlers/handleFrames';
import { animationPlaying } from '../handlers/handleAnimations';

export class Brush {
  private tool: paper.Tool;
  private path?: paper.Path;
  private static strokeWidth: number = 3; // Default to small size

  constructor() {
    this.tool = new paper.Tool();

    // Load saved stroke width
    const savedStrokeWidth = localStorage.getItem('brushStrokeWidth');
    if (savedStrokeWidth) {
      Brush.strokeWidth = parseInt(savedStrokeWidth, 10);
      this.updateButtonState(Brush.strokeWidth);
    }

    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      // Prevent drawing during animation playback
      if (animationPlaying) return;

      // Create new path
      this.path = new paper.Path();
      this.path.strokeColor = new paper.Color('black');
      this.path.strokeWidth = Brush.strokeWidth;
      this.path.add(event.point);

      // Add path to current frame
      const currentFrame = getCurrentFrame();
      if (currentFrame && this.path) {
        currentFrame.addChild(this.path);
      }
    };

    this.tool.onMouseDrag = (event: paper.ToolEvent) => {
      // Prevent drawing during animation playback
      if (animationPlaying) return;

      if (this.path) {
        this.path.add(event.point);
      }
    };

    this.tool.onMouseUp = () => {
      // Prevent drawing during animation playback
      if (animationPlaying) return;

      if (this.path) {
        this.path.simplify();
        // Save frame directly to ensure it gets stored
        saveFramesToStorage();
        console.log('Brush stroke completed and saved');
      }
    };
  }

  private updateButtonState(strokeWidth: number) {
    // Remove active class from all buttons
    document.querySelectorAll<HTMLButtonElement>('.brush-size').forEach(button => {
      button.classList.remove('active');
    });

    // Map stroke width to button ID
    const sizeMap: Record<number, string> = {
      3: 'brush-small',
      5: 'brush-medium',
      8: 'brush-large',
    };

    // Add active class to current size button
    const buttonId = sizeMap[strokeWidth];
    if (buttonId) {
      const button = document.querySelector(`button#${buttonId}`);
      button?.classList.add('active');
    }
  }

  activate() {
    this.tool.activate();
  }

  setBrushSize(size: string) {
    // Don't change settings during animation playback
    if (animationPlaying) return;

    let newStrokeWidth: number;

    switch (size) {
      case 'Small':
        newStrokeWidth = 3;
        break;
      case 'Medium':
        newStrokeWidth = 5;
        break;
      case 'Large':
        newStrokeWidth = 8;
        break;
      default:
        console.warn('Invalid brush size');
        return;
    }

    Brush.strokeWidth = newStrokeWidth;
    this.updateButtonState(newStrokeWidth);

    // Save stroke width to localStorage
    localStorage.setItem('brushStrokeWidth', newStrokeWidth.toString());

    // Also save the size name for persistence
    localStorage.setItem('brushSize', size);

    console.log(`Brush size set to: ${size}`);
  }
}

// Initialize brush size buttons
document.addEventListener('DOMContentLoaded', () => {
  const brush = new Brush();

  // Set up size button event listeners
  const sizeButtons = [
    { id: 'brush-small', size: 'Small' },
    { id: 'brush-medium', size: 'Medium' },
    { id: 'brush-large', size: 'Large' },
  ];

  sizeButtons.forEach(({ id, size }) => {
    const button = document.querySelector(`button#${id}`);
    button?.addEventListener('click', () => {
      // Only respond if animation is not playing
      if (!animationPlaying) {
        brush.setBrushSize(size);
      }
    });
  });

  // Set initial active state based on saved stroke width
  const savedStrokeWidth = localStorage.getItem('brushStrokeWidth');
  if (savedStrokeWidth) {
    const sizeMap: Record<number, string> = {
      3: 'Small',
      5: 'Medium',
      8: 'Large',
    };
    const size = sizeMap[parseInt(savedStrokeWidth, 10)];
    if (size) {
      brush.setBrushSize(size);
    }
  }
});
