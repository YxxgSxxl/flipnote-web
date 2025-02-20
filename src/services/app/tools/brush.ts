import paper from "paper";

export class Brush {
  private tool: paper.Tool;
  private path?: paper.Path;
  private static strokeWidth: number = 0;

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

    // Retrieve the strokeWidth from localStorage if available
    // const savedStrokeWidth = localStorage.getItem("brushStrokeWidth");
    // if (savedStrokeWidth) {
    //   Brush.strokeWidth = parseInt(savedStrokeWidth, 10);
    // }
  }

  activate() {
    this.tool.activate();
  }

  setBrushSize(size: string) {
    document.querySelectorAll<HTMLButtonElement>(".brush-size").forEach(button => {
      button.classList.remove("active");
    });

    let selectedButton: HTMLButtonElement | null = null;
    switch (size) {
      case "Small":
        Brush.strokeWidth = 3;
        selectedButton = document.querySelector("button#brush-small");
        break;
      case "Medium":
        Brush.strokeWidth = 5;
        selectedButton = document.querySelector("button#brush-medium");
        break;
      case "Large":
        Brush.strokeWidth = 8;
        selectedButton = document.querySelector("button#brush-large");
        break;
      default:
        console.warn("Invalid brush size");
        return;
    }
    
    if (selectedButton) {
      selectedButton.classList.add("active");
    }

    // Save the strokeWidth to localStorage
    // localStorage.setItem("brushStrokeWidth", Brush.strokeWidth.toString());

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

  // Set the active button based on the saved strokeWidth
  // const savedStrokeWidth = localStorage.getItem("brushStrokeWidth");
  // if (savedStrokeWidth) {    
  //   const sizeMap: { [key: number]: string } = {
  //     3: "Small",
  //     5: "Medium",
  //     8: "Large"
  //   };
  //   const size = sizeMap[parseInt(savedStrokeWidth, 10)];
  //   if (size) {
  //     brush.setBrushSize(size);
  //   }
  // }
});
