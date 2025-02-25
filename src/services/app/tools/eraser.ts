import paper from "paper";
import { getCurrentFrame, saveFramesToStorage } from '../handlers/handleFrames';

export class Eraser {
    private tool: paper.Tool;
    private path?: paper.Group;
    private static strokeWidth: number = 4; // Default to small size
    private lastPoint?: paper.Point;

    constructor() {
        this.tool = new paper.Tool();

        // Load saved stroke width
        const savedStrokeWidth = localStorage.getItem("eraserStrokeWidth");
        if (savedStrokeWidth) {
            Eraser.strokeWidth = parseInt(savedStrokeWidth, 10);
            this.updateButtonState(Eraser.strokeWidth);
        }

        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            this.path = new paper.Group();
            // Mark this as an eraser group with specific type for serialization
            this.path.data = {
                isEraserGroup: true,
                eraserType: 'circle' // Important for deserialization
            };

            this.addCircle(event.point);
            this.lastPoint = event.point;

            // Add path to current frame
            const currentFrame = getCurrentFrame();
            if (currentFrame && this.path) {
                currentFrame.addChild(this.path);
            }
        };

        this.tool.onMouseDrag = (event: paper.ToolEvent) => {
            if (this.path && this.lastPoint) {
                this.addCirclesBetween(this.lastPoint, event.point);
            }
            this.lastPoint = event.point;
        };

        this.tool.onMouseUp = () => {
            // Save frame directly after erasing
            saveFramesToStorage();
            console.log('Eraser stroke completed and saved');
        };
    }

    private updateButtonState(strokeWidth: number) {
        // Remove active class from all buttons
        document.querySelectorAll<HTMLButtonElement>(".eraser-size").forEach(button => {
            button.classList.remove("active");
        });

        // Map stroke width to button ID
        const sizeMap: Record<number, string> = {
            4: "eraser-small",
            12: "eraser-medium",
            24: "eraser-large"
        };

        // Add active class to current size button
        const buttonId = sizeMap[strokeWidth];
        if (buttonId) {
            const button = document.querySelector(`button#${buttonId}`);
            button?.classList.add("active");
        }
    }

    private addCircle(point: paper.Point) {
        const radius = Eraser.strokeWidth / 2;

        // Create a filled circle with no stroke
        const circle = new paper.Path.Circle({
            center: point,
            radius: radius,
            fillColor: "white",
            strokeWidth: 0,
            strokeColor: null,
            insert: false // Don't add to project yet
        });

        // Explicitly set no stroke
        circle.strokeWidth = 0;
        circle.strokeColor = null;

        if (this.path) {
            this.path.addChild(circle);
        }
    }

    private addCirclesBetween(from: paper.Point, to: paper.Point) {
        const distance = from.getDistance(to);
        // Adjust step based on size for better coverage
        const step = Math.min(Eraser.strokeWidth / 3, distance / 2);

        if (distance < step) {
            // Just add one circle for very short distances
            this.addCircle(to);
            return;
        }

        const steps = Math.ceil(distance / step);
        for (let i = 0; i <= steps; i++) {
            // Linear interpolation for smoother placement
            const t = i / steps;
            const pos = from.multiply(1 - t).add(to.multiply(t));
            this.addCircle(pos);
        }
    }

    activate() {
        this.tool.activate();
    }

    setEraserSize(size: string) {
        let newStrokeWidth: number;

        switch (size) {
            case "Small":
                newStrokeWidth = 4;
                break;
            case "Medium":
                newStrokeWidth = 12;
                break;
            case "Large":
                newStrokeWidth = 24;
                break;
            default:
                console.warn("Invalid eraser size");
                return;
        }

        Eraser.strokeWidth = newStrokeWidth;
        this.updateButtonState(newStrokeWidth);

        // Save stroke width to localStorage
        localStorage.setItem("eraserStrokeWidth", newStrokeWidth.toString());

        // Also save the size name for persistence
        localStorage.setItem("eraserSize", size);

        console.log(`Eraser size set to: ${size}`);
    }
}

// Initialize eraser size buttons
document.addEventListener("DOMContentLoaded", () => {
    const eraser = new Eraser();

    // Set up size button event listeners
    const sizeButtons = [
        { id: "eraser-small", size: "Small" },
        { id: "eraser-medium", size: "Medium" },
        { id: "eraser-large", size: "Large" }
    ];

    sizeButtons.forEach(({ id, size }) => {
        const button = document.querySelector(`button#${id}`);
        button?.addEventListener("click", () => {
            eraser.setEraserSize(size);
        });
    });

    // Set initial active state based on saved stroke width
    const savedStrokeWidth = localStorage.getItem("eraserStrokeWidth");
    if (savedStrokeWidth) {
        const sizeMap: Record<number, string> = {
            4: "Small",
            12: "Medium",
            24: "Large"
        };
        const size = sizeMap[parseInt(savedStrokeWidth, 10)];
        if (size) {
            eraser.setEraserSize(size);
        }
    }
});