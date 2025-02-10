import paper from "paper";

export class Brush {
  private tool: paper.Tool;
  private path?: paper.Path;
  private static strokeWidth: number = 0; // Taille par défaut

  constructor() {
    this.tool = new paper.Tool();

    this.tool.onMouseDown = (event: paper.ToolEvent) => {
      this.path = new paper.Path();
      this.path.strokeColor = new paper.Color("black");
      this.path.strokeWidth = Brush.strokeWidth;
      this.path.add(event.point);
    };

    this.tool.onMouseDrag = (event: paper.ToolEvent) => {
      if (this.path) {
        this.path.add(event.point);
      }
    };

    this.tool.onMouseUp = () => {
      if (this.path) {
        this.path.simplify();
      }
    };
  }

  activate() {
    this.tool.activate();
  }

  setBrushSize(size: string) {
    switch (size) {
      case "Small":
        Brush.strokeWidth = 2;
        break;
      case "Medium":
        Brush.strokeWidth = 3;
        break;
      case "Large":
        Brush.strokeWidth = 5;
        break;
      default:
        console.warn("Invalid brush size");
        return;
    }
    console.log(`Brush size set to: ${size}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const brushSmallButton = document.querySelector("button#brush-small")!;
  const brushMediumButton = document.querySelector("button#brush-medium")!;
  const brushLargeButton = document.querySelector("button#brush-large")!;

  const brush = new Brush();

  [brushSmallButton, brushMediumButton, brushLargeButton].forEach(
    (button, index) => {
      const sizes = ["Small", "Medium", "Large"];
      button.addEventListener("click", () => {
        brush.setBrushSize(sizes[index]);
      });
    }
  );
});
