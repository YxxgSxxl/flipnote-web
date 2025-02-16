import paper from "paper";

export class Eraser {
    private tool: paper.Tool;
    private path?: paper.Group;
    private static strokeWidth: number = 0;
    private lastPoint?: paper.Point;

    constructor() {
        this.tool = new paper.Tool();

        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            this.path = new paper.Group();
            this.addSquare(event.point);
            this.lastPoint = event.point;
        };
        
        this.tool.onMouseDrag = (event: paper.ToolEvent) => {
            if (this.path && this.lastPoint) {
                this.addSquaresBetween(this.lastPoint, event.point);
            }
            this.lastPoint = event.point;
        };
    }

    private addSquare(point: paper.Point) {
        const size = Eraser.strokeWidth;
        const rect = new paper.Path.Rectangle({
            point: new paper.Point(point.x - size / 2, point.y - size / 2),
            size: [size, size],
            fillColor: "white",
        });
        if (this.path) {
            this.path.addChild(rect);
        }
    }

    private addSquaresBetween(from: paper.Point, to: paper.Point) {
        const distance = from.getDistance(to);
        const step = Eraser.strokeWidth;
        const direction = to.subtract(from).normalize();

        for (let i = 0; i < distance; i += step) {
            const intermediatePoint = from.add(direction.multiply(i));
            this.addSquare(intermediatePoint);
        }
    }

    activate() {
        this.tool.activate();
    }

    setEraserSize(size: string) {
        document.querySelectorAll<HTMLButtonElement>(".eraser-size").forEach(button => {
            button.classList.remove("active");
        });

        let selectedButton: HTMLButtonElement | null = null;
        switch (size) {
            case "Small":
                Eraser.strokeWidth = 4;
                selectedButton = document.querySelector("button#eraser-small");
                break;
            case "Medium":
                Eraser.strokeWidth = 12;
                selectedButton = document.querySelector("button#eraser-medium");
                break;
            case "Large":
                Eraser.strokeWidth = 24;
                selectedButton = document.querySelector("button#eraser-large");
                break;
            default:
                console.warn("Invalid eraser size");
                return;
        }
        if (selectedButton) {
            selectedButton.classList.add("active");
        }
        console.log(`Eraser size set to: ${size}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const eraserSmallButton = document.querySelector("button#eraser-small")!;
    const eraserMediumButton = document.querySelector("button#eraser-medium")!;
    const eraserLargeButton = document.querySelector("button#eraser-large")!;

    const eraser = new Eraser();

    [eraserSmallButton, eraserMediumButton, eraserLargeButton].forEach(
        (button, index) => {
            const sizes = ["Small", "Medium", "Large"];
            button.addEventListener("click", () => {
                eraser.setEraserSize(sizes[index]);
            });
        }
    );
});