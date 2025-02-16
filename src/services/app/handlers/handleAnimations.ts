export let animationPlaying: boolean = false;


export function setupAnimationsEvents() {
    const playButton: HTMLButtonElement = document.querySelector("button#Play")!;

    playButton.addEventListener("click", () => {
        playAnimation(playButton);
    });
}

function playAnimation(playButton: HTMLButtonElement) {
    const playButtonImg: HTMLImageElement = playButton.querySelector("img")!;

    if (animationPlaying === false) {
        console.log("Playing animation...");
        playButtonImg.src = "/img/icons/stopbtn_32x32.png";
        animationPlaying = true;
        return;
    } else if (animationPlaying === true) {
        console.log("Stopping animation...");
        playButtonImg.src = "/img/icons/playbtn_32x32.png";
        animationPlaying = false;
    }
}