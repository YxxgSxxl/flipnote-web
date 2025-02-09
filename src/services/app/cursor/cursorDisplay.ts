import { toolSelected } from './cursorTools.ts';

document.addEventListener("DOMContentLoaded", () => {
    const toolSettings: Record<string, HTMLElement | null> = {
        "Brush": document.querySelector(".brush-settings"),
        "Eraser": document.querySelector(".eraser-settings"),
        "Pencil": document.querySelector(".pencil-settings"),
    };

    Object.values(toolSettings).forEach(setting => setting?.classList.add("hidden"));

    let x = 0, y = 0;

    const cursor = document.createElement("div");
    cursor.classList.add("idle-cursor");
    document.body.appendChild(cursor);

    function updateCursor(event?: MouseEvent) {
        if (event) {
            x = event.clientX;
            y = event.clientY;
            cursor.style.left = `${x}px`;
            cursor.style.top = `${y}px`;
        }

        toggleToolSettings(toolSelected ?? "");
        updateCursorClass(toolSelected ?? "");
    }

    function toggleToolSettings(tool: string) {
        Object.values(toolSettings).forEach(setting => setting?.classList.add("hidden"));

        toolSettings[tool]?.classList.remove("hidden");
    }

    function updateCursorClass(tool: string) {
        cursor.classList.remove("brush-cursor", "eraser-cursor", "pencil-cursor");

        if (tool === "Brush") cursor.classList.add("brush-cursor");
        else if (tool === "Eraser") cursor.classList.add("eraser-cursor");
        else if (tool === "Pencil") cursor.classList.add("pencil-cursor");
    }

    function checkHover(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (["A", "BUTTON"].includes(target.tagName)) {
            cursor.classList.add("hover-link");
        }
    }

    function removeHover(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (["A", "BUTTON"].includes(target.tagName)) {
            cursor.classList.remove("hover-link");
        }
    }

    window.addEventListener("toolChanged", () => updateCursor()); // custom eventListener tool clicked
    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mouseover", checkHover);
    window.addEventListener("mouseout", removeHover);
});
