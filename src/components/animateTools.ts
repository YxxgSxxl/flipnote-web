export function AnimateTools() {
    return `
        <div class="toolbox animatebox">
            <button id="FirstFrame" title="Go to First Frame">⏮️</button>
            <button id="PrevFrame" title="Previous Frame">⬅️</button>
            <button id="Play" title="Play/Pause Animation">
                <img src="/img/icons/playbtn_32x32.png" alt="Play Button Icon" width="24" height="24">
            </button>
            <button id="NextFrame" title="Next Frame">➡️</button>
            <button id="LastFrame" title="Go to Last Frame">⏭️</button>
            <button id="AddFrame" title="Add New Frame">➕</button>
            <span id="frame-indicator">Frame: 1/1</span>
        </div>
    `;
}