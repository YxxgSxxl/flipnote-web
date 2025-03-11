import paper from 'paper';
import { getCurrentFrame, saveFramesToStorage } from '../handlers/handleFrames';

export class Pencil {
  private tool: paper.Tool;
  private path?: paper.Group;
  private static strokeWidth: number = 5; // Default to small size
  private lastPoint?: paper.Point;

  constructor() {
    this.tool = new paper.Tool();

    // Load saved stroke width
    const savedStrokeWidth = localStorage.getItem('pencilStrokeWidth');
    if (savedStrokeWidth) {
      Pencil.strokeWidth = parseInt(savedStrokeWidth, 10);
      this.updateButtonState(Pencil.strokeWidth);
    }

    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      this.path = new paper.Group();
      this.addSquare(event.point);
      this.lastPoint = event.point;

      // Marquer le groupe comme créé par le pencil
      if (this.path) {
        this.path.data = { isPencilGroup: true }; // Attribuer une marque au groupe

        // Add path to current frame
        const currentFrame = getCurrentFrame();
        if (currentFrame) {
          currentFrame.addChild(this.path);
        }
      }
    };

    this.tool.onMouseDrag = (event: paper.ToolEvent) => {
      if (this.path && this.lastPoint) {
        this.addSquaresBetween(this.lastPoint, event.point);
      }
      this.lastPoint = event.point;
    };

    this.tool.onMouseUp = () => {
      // Save frame directly to ensure it gets stored
      saveFramesToStorage();
      console.log('Pencil stroke completed and saved');
    };
  }

  private updateButtonState(strokeWidth: number) {
    // Remove active class from all buttons
    document.querySelectorAll<HTMLButtonElement>('.pencil-size').forEach(button => {
      button.classList.remove('active');
    });

    // Map stroke width to button ID
    const sizeMap: Record<number, string> = {
      5: 'pencil-small',
      8: 'pencil-medium',
      10: 'pencil-large',
    };

    // Add active class to current size button
    const buttonId = sizeMap[strokeWidth];
    if (buttonId) {
      const button = document.querySelector(`button#${buttonId}`);
      button?.classList.add('active');
    }
  }

  private addSquare(point: paper.Point) {
    const size = Pencil.strokeWidth;
    const rect = new paper.Path.Rectangle({
      point: new paper.Point(point.x - size / 2, point.y - size / 2),
      size: [size, size],
      fillColor: 'black',
      strokeWidth: 0, // No stroke border
      strokeColor: null, // No stroke color
    });
    if (this.path) {
      this.path.addChild(rect);
    }
  }

  private addSquaresBetween(from: paper.Point, to: paper.Point) {
    const distance = from.getDistance(to);

    // Fixed step size calculation for consistent pixel-art style
    // For small size, use exactly the stroke width as step
    const step = Pencil.strokeWidth === 3 ? 3 : Pencil.strokeWidth / 2;

    const direction = to.subtract(from).normalize();

    // For small stroke, use a different approach to ensure squares don't overlap
    if (Pencil.strokeWidth === 5) {
      // Calculate number of steps needed
      const steps = Math.floor(distance / step);

      for (let i = 0; i <= steps; i++) {
        // Calculate position at each step
        const t = i / Math.max(1, steps);
        const pos = from.multiply(1 - t).add(to.multiply(t));
        this.addSquare(pos);
      }
    } else {
      // For larger stroke sizes, use the regular implementation
      for (let i = 0; i < distance; i += step) {
        const intermediatePoint = from.add(direction.multiply(i));
        this.addSquare(intermediatePoint);
      }
    }
  }

  activate() {
    this.tool.activate();
  }

  setPencilSize(size: string) {
    let newStrokeWidth: number;

    switch (size) {
      case 'Small':
        newStrokeWidth = 5;
        break;
      case 'Medium':
        newStrokeWidth = 8;
        break;
      case 'Large':
        newStrokeWidth = 10;
        break;
      default:
        console.warn('Invalid pencil size');
        return;
    }

    Pencil.strokeWidth = newStrokeWidth;
    this.updateButtonState(newStrokeWidth);

    // Save stroke width to localStorage
    localStorage.setItem('pencilStrokeWidth', newStrokeWidth.toString());

    // Also save the size name for persistence
    localStorage.setItem('pencilSize', size);

    console.log(`Pencil size set to: ${size}`);
  }
}

// Initialize pencil size buttons
document.addEventListener('DOMContentLoaded', () => {
  const pencil = new Pencil();

  // Set up size button event listeners
  const sizeButtons = [
    { id: 'pencil-small', size: 'Small' },
    { id: 'pencil-medium', size: 'Medium' },
    { id: 'pencil-large', size: 'Large' },
  ];

  sizeButtons.forEach(({ id, size }) => {
    const button = document.querySelector(`button#${id}`);
    button?.addEventListener('click', () => {
      pencil.setPencilSize(size);
    });
  });

  // Set initial active state based on saved stroke width
  const savedStrokeWidth = localStorage.getItem('pencilStrokeWidth');
  if (savedStrokeWidth) {
    const sizeMap: Record<number, string> = {
      5: 'Small',
      8: 'Medium',
      10: 'Large',
    };
    const size = sizeMap[parseInt(savedStrokeWidth, 10)];
    if (size) {
      pencil.setPencilSize(size);
    }
  }
});
