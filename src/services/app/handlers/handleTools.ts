import { setTool } from '../cursor/cursorTools';
import { Brush } from '../tools/brush';
import { Pencil } from '../tools/pencil';
import { Eraser } from '../tools/eraser';
// import { Fill } from "../tools/fill";

export function setupToolsEvents() {
  const brushButton: HTMLButtonElement = document.querySelector('button#Brush')!;
  const pencilButton: HTMLButtonElement = document.querySelector('button#Pencil')!;
  // const fillButton: HTMLButtonElement = document.querySelector("button#Fill")!;
  const eraserButton: HTMLButtonElement = document.querySelector('button#Eraser')!;

  const brush = new Brush();
  const pencil = new Pencil();
  // const fill = new Fill();
  const eraser = new Eraser();

  brushButton.addEventListener('click', () => {
    setTool('Brush');

    // Get saved brush size or default to Small
    const savedBrushSize = localStorage.getItem('brushSize') || 'Small';
    brush.setBrushSize(savedBrushSize);
    brush.activate();
  });

  pencilButton.addEventListener('click', () => {
    setTool('Pencil');

    // Get saved pencil size or default to Small
    const savedPencilSize = localStorage.getItem('pencilSize') || 'Small';
    pencil.setPencilSize(savedPencilSize);
    pencil.activate();
  });

  //   fillButton.addEventListener("click", () => {
  //     setTool("Fill");
  //     fill.setFillColor('black');
  //     fill.activate();
  // });

  eraserButton.addEventListener('click', () => {
    setTool('Eraser');

    // Get saved eraser size or default to Large
    const savedEraserSize = localStorage.getItem('eraserSize') || 'Large';
    eraser.setEraserSize(savedEraserSize);
    eraser.activate();
  });
}
