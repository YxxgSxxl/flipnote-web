export function AnimateTools() {
    return `
        <div class="toolbox animateBox">
            <div class="animateTools">
                <button id="FirstFrame" title="Go to First Frame">
                    <img src="/img/icons/fullarrow-left_32x32.png" alt="Play Button Icon" width="24" height="24">
                </button>
                <button id="PrevFrame" title="Previous Frame">
                    <img src="/img/icons/arrow-left_32x32.png" alt="Play Button Icon" width="24" height="24">
                </button>
                <button id="Play" title="Play/Pause Animation">
                    <img src="/img/icons/playbtn_32x32.png" alt="Play Button Icon" width="24" height="24">
                </button>
                <button id="NextFrame" title="Next Frame">
                    <img src="/img/icons/arrow-right_32x32.png" alt="Play Button Icon" width="24" height="24">
                </button>
                <button id="LastFrame" title="Go to Last Frame">
                    <img src="/img/icons/fullarrow-right_32x32.png" alt="Play Button Icon" width="24" height="24">
                </button>
            </div>
            <div class="animateTools">
                <button id="AddFrame" title="Add New Frame">
                    <img src="/img/icons/addframe_32x32.png" alt="Play Button Icon" width="24" height="24">
                </button>
                <button id="ClearFrame" title="Clear Current Frame" class="clear-frame">
                    <img src="/img/icons/broom_32x32.png" alt="Broom Wipe frame Icon" width="24" height="24">
                </button>
                <button id="DeleteFrame" title="Delete Current Frame" class="delete-frame">
                    <img src="/img/icons/trash_32x32.png" alt="Delete frame Icon" width="24" height="24">
                </button>
            </div>
        </div>
    `;
}