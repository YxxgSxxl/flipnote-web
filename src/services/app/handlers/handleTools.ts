import { setTool } from "../cursor/cursorTools";
import { Brush } from "../tools/brush";
import { Pencil } from "../tools/pencil";
import { Eraser } from "../tools/eraser";
import { Fill } from "../tools/fill";

export function setupToolboxEvents() {
  const brushButton: HTMLButtonElement =
    document.querySelector("button#Brush")!;
  const pencilButton: HTMLButtonElement =
    document.querySelector("button#Pencil")!;
  const fillButton: HTMLButtonElement = document.querySelector("button#Fill")!;
  const eraserButton: HTMLButtonElement =
    document.querySelector("button#Eraser")!;

  const brush = new Brush();
  const pencil = new Pencil();
  const fill = new Fill();
  const eraser = new Eraser();

  brushButton.addEventListener("click", () => {
    setTool("Brush");
    brush.setBrushSize("Small");
    brush.activate();
  });

  pencilButton.addEventListener("click", () => {
    setTool("Pencil");
    pencil.setPencilSize("Small");
    pencil.activate();
  });

  fillButton.addEventListener("click", () => {
    setTool("Fill");
    fill.setFillColor('#ff0000');
    fill.activate();
});

  eraserButton.addEventListener("click", () => {
    setTool("Eraser");
    eraser.setEraserSize("Large");
    eraser.activate();
  });
}
