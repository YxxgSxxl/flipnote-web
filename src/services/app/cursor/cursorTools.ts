export let toolSelected: string = "Brush"; // Default tool is Brush

document.addEventListener("DOMContentLoaded", () => {
  // Load previously selected tool from localStorage
  const savedTool = localStorage.getItem("toolSelected");
  if (savedTool) {
    toolSelected = savedTool;
  }

  console.log(`Loading saved tool: ${toolSelected}`);
  const tools = document.querySelectorAll<HTMLButtonElement>(".toolbox button");

  // Find saved tool button and set it as active
  const savedToolButton = Array.from(tools).find((tool) => tool.id === toolSelected);
  if (savedToolButton) {
    savedToolButton.classList.add("active");

    // Dispatch an event to trigger the tool activation
    setTimeout(() => {
      savedToolButton.click();
    }, 200); // Increased timeout to ensure DOM is fully ready
  } else {
    // Fallback to Brush if saved tool button not found
    const brushButton = Array.from(tools).find((tool) => tool.id === "Brush");
    if (brushButton) {
      brushButton.classList.add("active");
      toolSelected = "Brush";

      setTimeout(() => {
        brushButton.click();
      }, 200);
    }
  }
});

export function setTool(tool: string) {
  toolSelected = tool;
  localStorage.setItem("toolSelected", tool);
  console.log(`Outil sélectionné: ${tool}`);

  const tools = document.querySelectorAll<HTMLButtonElement>(".toolbox button");

  tools.forEach((button) => button.classList.remove("active"));

  const selectedTool = Array.from(tools).find(
      (tool) => tool.id === toolSelected
  );

  if (selectedTool) {
    selectedTool.classList.add("active");
  }

  // Dispatch toolChanged event
  window.dispatchEvent(new Event('toolChanged'));
}

export function getTool() {
  return toolSelected;
}