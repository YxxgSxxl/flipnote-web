import paper from "paper";

export class Pencil {
    private tool: paper.Tool;
    private path?: paper.Group;
    private static strokeWidth: number = 0;
    private lastPoint?: paper.Point;
    private allPaths: paper.Path[] = [];

    constructor() {
        this.tool = new paper.Tool();

        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            this.path = new paper.Group();
            this.addSquare(event.point);
            this.lastPoint = event.point;

            // Marquer le groupe comme créé par le pencil
            if (this.path) {
                this.path.data.isPencilGroup = true; // Attribuer une marque au groupe
            }
        };
        
        this.tool.onMouseDrag = (event: paper.ToolEvent) => {
            if (this.path && this.lastPoint) {
                this.addSquaresBetween(this.lastPoint, event.point);
            }
            this.lastPoint = event.point;
        };
    }

    private addSquare(point: paper.Point) {
        const size = Pencil.strokeWidth;
        const rect = new paper.Path.Rectangle({
            point: new paper.Point(point.x - size / 2, point.y - size / 2),
            size: [size, size],
            fillColor: "black",
        });
        if (this.path) {
            this.path.addChild(rect);
        }
    }

    private addSquaresBetween(from: paper.Point, to: paper.Point) {
        const distance = from.getDistance(to);
        const step = Pencil.strokeWidth;
        const direction = to.subtract(from).normalize();
    
        for (let i = 0; i < distance; i += step) {
            const intermediatePoint = from.add(direction.multiply(i));
            this.addSquare(intermediatePoint);
        }
    }

    public activate() {
        this.tool.activate();
    }

    public setPencilSize(size: string) {
        document.querySelectorAll<HTMLButtonElement>(".pencil-size").forEach(button => {
            button.classList.remove("active");
        });

        let selectedButton: HTMLButtonElement | null = null;
        switch (size) {
            case "Small":
                Pencil.strokeWidth = 3;
                selectedButton = document.querySelector("button#pencil-small");
                break;
            case "Medium":
                Pencil.strokeWidth = 5;
                selectedButton = document.querySelector("button#pencil-medium");
                break;
            case "Large":
                Pencil.strokeWidth = 8;
                selectedButton = document.querySelector("button#pencil-large");
                break;
            default:
                console.warn("Invalid pencil size");
                return;
        }

        if (selectedButton) {
            selectedButton.classList.add("active");
        }

        console.log(`Pencil size set to: ${size}`);
    }

    public getPaths(): paper.Path[] {
        return this.allPaths;
    }

    // Sauvegarde le chemin chaque fois qu'un trait est terminé
    private addPath(path: paper.Path) {
        this.allPaths.push(path);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const pencilSmallButton = document.querySelector("button#pencil-small")!;
    const pencilMediumButton = document.querySelector("button#pencil-medium")!;
    const pencilLargeButton = document.querySelector("button#pencil-large")!;

    const pencil = new Pencil();

    [pencilSmallButton, pencilMediumButton, pencilLargeButton].forEach(
        (button, index) => {
            const sizes = ["Small", "Medium", "Large"];
            button.addEventListener("click", () => {
                pencil.setPencilSize(sizes[index]);
            });
        }
    );
});
