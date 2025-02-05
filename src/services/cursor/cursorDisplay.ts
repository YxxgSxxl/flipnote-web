import { toolSelected } from './cursorTools';

document.addEventListener("DOMContentLoaded", () => {
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

        switch (toolSelected) {
            case "Brush":
            cursor.classList.add("brush-cursor");
            cursor.classList.remove("eraser-cursor", "pencil-cursor");
            break;
            case "Eraser":
            cursor.classList.add("eraser-cursor");
            cursor.classList.remove("brush-cursor", "pencil-cursor");
            break;
            case "Pencil":
            cursor.classList.add("pencil-cursor");
            cursor.classList.remove("brush-cursor", "eraser-cursor");
            break;
            default:
            cursor.classList.remove("brush-cursor", "eraser-cursor", "pencil-cursor");
            break;
        }
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
