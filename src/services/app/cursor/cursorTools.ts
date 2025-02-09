export let toolSelected: string | null = null;

document.addEventListener("DOMContentLoaded", () => {
    const tools = document.querySelectorAll<HTMLButtonElement>('.toolbox button');

    if (tools.length > 0) {
        toolSelected = tools[0].querySelector('img')?.alt.split(" ")[0] || "Unknown";
        tools[0].classList.add('active');
        window.dispatchEvent(new CustomEvent("toolChanged", { detail: toolSelected }));
    }

    tools.forEach((button) => {
        button.addEventListener('click', () => {
            toolSelected = button.querySelector('img')?.alt.split(" ")[0] || "Unknown";

            tools.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            window.dispatchEvent(new CustomEvent("toolChanged", { detail: toolSelected }));
        });
    });
});
