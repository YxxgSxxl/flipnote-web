import { toolSelected } from './cursorTools';

document.addEventListener("DOMContentLoaded", () => {
    const brushSettings = document.querySelector(".brush-settings") as HTMLElement;
    const eraserSettings = document.querySelector(".eraser-settings") as HTMLElement;
    const pencilSettings = document.querySelector(".pencil-settings") as HTMLElement;

    brushSettings.classList.add("hidden");
    eraserSettings.classList.add("hidden");
    pencilSettings.classList.add("hidden");

    let x: number = 0;
    let y: number = 0;

    const cursor = document.createElement("div");
    cursor.classList.add("idle-cursor");
    document.body.appendChild(cursor);

    function updateCursor(event: MouseEvent) {
        x = event.clientX;
        y = event.clientY;

        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;

        hideAllSettings();

        switch (toolSelected) {
            case "Brush":
                brushSettings.classList.remove("hidden");
                cursor.classList.add("brush-cursor");
                cursor.classList.remove("eraser-cursor", "pencil-cursor");
                break;
            case "Eraser":
                eraserSettings.classList.remove("hidden");
                cursor.classList.add("eraser-cursor");
                cursor.classList.remove("brush-cursor", "pencil-cursor");
                break;
            case "Pencil":
                pencilSettings.classList.remove("hidden");
                cursor.classList.add("pencil-cursor");
                cursor.classList.remove("brush-cursor", "eraser-cursor");
                break;
            default:
                cursor.classList.remove("brush-cursor", "eraser-cursor", "pencil-cursor");
                break;
        }
    }

    function hideAllSettings() {
        brushSettings.classList.add("hidden");
        eraserSettings.classList.add("hidden");
        pencilSettings.classList.add("hidden");
    }

    function checkHover(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName === "A" || target.tagName === "BUTTON") {
            cursor.classList.add("hover-link");
        }
    }

    function removeHover(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName === "A" || target.tagName === "BUTTON") {
            cursor.classList.remove("hover-link");
        }
    }

    window.addEventListener("mousemove", updateCursor);
    window.addEventListener("mouseover", checkHover);
    window.addEventListener("mouseout", removeHover);
});
