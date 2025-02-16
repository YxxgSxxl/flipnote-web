export let toolSelected: string = localStorage.getItem("toolSelected") || "";

document.addEventListener("DOMContentLoaded", () => {
  const tools = document.querySelectorAll<HTMLButtonElement>(".toolbox button");
  const defaultTool = Array.from(tools).find((tool) => tool.id === toolSelected);
  
  if (defaultTool) {
    defaultTool.classList.add("active");
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
}

export function getTool() {
  return toolSelected;
}
