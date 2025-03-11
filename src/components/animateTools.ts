export function AnimateTools() {
  return `
        <div class="toolbox animateBox">
            <div class="animateTools">
                <button id="FirstFrame" title="Go to First Frame">
                    <img src="/img/icons/fullarrow-left_32x32.png" alt="First Frame Icon" width="32" height="32">
                </button>
                <button id="PrevFrame" title="Previous Frame">
                    <img src="/img/icons/arrow-left_32x32.png" alt="Previous Frame Icon" width="32" height="32">
                </button>
                <button id="Play" title="Play/Pause Animation">
                    <img src="/img/icons/playbtn_32x32.png" alt="Play Button Icon" width="32" height="32">
                </button>
                <button id="NextFrame" title="Next Frame">
                    <img src="/img/icons/arrow-right_32x32.png" alt="Next Frame Icon" width="32" height="32">
                </button>
                <button id="LastFrame" title="Go to Last Frame">
                    <img src="/img/icons/fullarrow-right_32x32.png" alt="Last Frame Icon" width="32" height="32">
                </button>
            </div>
            <div class="animateTools">
                <button id="AddFrame" title="Add New Frame">
                    <img src="/img/icons/addframe_32x32.png" alt="Add Frame Icon" width="32" height="32">
                </button>
                <button id="DeleteFrame" title="Delete Current Frame" class="delete-frame">
                    <img src="/img/icons/trash_32x32.png" alt="Delete Frame Icon" width="32" height="32">
                </button>
                <button id="ClearFrame" title="Clear Current Frame" class="clear-frame">
                    <img src="/img/icons/broom_32x32.png" alt="Broom Wipe frame Icon" width="32" height="32">
                </button>
                <button id="OnionSkin" title="Toggle Onion Skinning" class="onion-skin">
                    <img src="/img/icons/onion_32x32.png" alt="Onion Skin Icon" width="32" height="32">
                </button>
                <button id="ExportGif" title="Export Animation as GIF">
                    <img src="/img/icons/export_32x32.png" alt="Export GIF Icon" width="32" height="32">
                </button>
            </div>
        </div>
    `;
}
