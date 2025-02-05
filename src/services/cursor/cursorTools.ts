export let toolSelected: string | null = null;

document.addEventListener("DOMContentLoaded", () => {
    const tools = document.querySelectorAll<HTMLButtonElement>('.toolbox button');

    console.log(`Nombre de boutons trouvés : ${tools.length}`);

    tools.forEach((button) => {
        if (tools.length > 0) {
            toolSelected = tools[0].querySelector('img')?.alt.split(" ")[0] || "Unknown";
            tools[0].classList.add('active');

            console.log(`Outil sélectionné par défaut : ${toolSelected}`);
        }

        button.addEventListener('click', () => {
            toolSelected = button.querySelector('img')?.alt.split(" ")[0] || "Unknown";

            // console.log(toolSelected)

            tools.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});
