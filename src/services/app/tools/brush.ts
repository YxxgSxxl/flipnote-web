export class Brush {
  constructor() {}

  setBrushSize(size: string) {
    console.log("Small brush size selected" + size);
    // Logic to set small brush size
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const brushSmallButton = document.querySelector("button#brush-small")!;
  const brushMediumButton = document.querySelector("button#brush-medium")!;
  const brushBigButton = document.querySelector("button#brush-large")!;

  const brush = new Brush();

  [brushSmallButton, brushMediumButton, brushBigButton].forEach((button, index) => {
    const sizes = ["Small", "Medium", "Big"];
    button.addEventListener("click", () => {
      brush.setBrushSize(sizes[index]);
    });
  });
});
