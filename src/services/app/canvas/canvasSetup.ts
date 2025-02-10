import paper from 'paper'

import { toolSelected } from '../cursor/cursorTools.ts'
import { Brush } from '../tools/brush'
import { Pencil } from '../tools/pencil'
import { Eraser } from '../tools/eraser'

import '../cursor/cursorDisplay.ts'
import '../cursor/cursorTools.ts'
import { setupToolboxEvents } from '../tools/handleTools.ts'

export function injectPage() {
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <main>
            <canvas id="canvas" width="600" height="400"></canvas>
            <div class="toolbox">
                <button id="Brush"><img src="/img/cursors/brush.png" alt="Brush Icon" width="24" height="24"></button>
                <button id="Pencil"><img src="/img/cursors/pencil.png" alt="Pencil Icon" width="24" height="24"></button>
                <button id="Eraser"><img src="/img/cursors/eraser.png" alt="Eraser Icon" width="24" height="24"></button>
            </div>

            <div class="settings brush-settings">
                <button id="brush-small"><img src="/img/icons/brush_small_32x32.png" alt="Small Circle 32x32 Icon" width="24" height="24"></button>
                <button id="brush-medium"><img src="/img/icons/brush_medium_32x32.png" alt="Medium Circle 32x32 Icon" width="24" height="24"></button>
                <button id="brush-large"><img src="/img/icons/brush_big_32x32.png" alt="Big Circle 32x32 Icon" width="24" height="24"></button>
            </div>

            <div class="settings pencil-settings">
                <button id="pencil-small"><img src="/img/icons/pencil_small_32x32.png" alt="Small Circle 32x32 Icon" width="24" height="24"></button>
                <button id="pencil-medium"><img src="/img/icons/pencil_medium_32x32.png" alt="Medium Circle 32x32 Icon" width="24" height="24"></button>
                <button id="pencil-large"><img src="/img/icons/pencil_big_32x32.png" alt="Big Circle 32x32 Icon" width="24" height="24"></button>
            </div>

            <div class="settings eraser-settings">
                <button id="eraser-large"><img src="/img/icons/eraser_small_32x32.png" alt="Small Circle 32x32 Icon" width="24" height="24"></button>
                <button id="eraser-medium"><img src="/img/icons/eraser_medium_32x32.png" alt="Medium Circle 32x32 Icon" width="24" height="24"></button>
                <button id="eraser-small"><img src="/img/icons/eraser_big_32x32.png" alt="Big Circle 32x32 Icon" width="24" height="24"></button>
            </div>
        </main>
    `;

    canvasInit();
    setupToolboxEvents();
}

function canvasInit() {
    const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;

    paper.setup(canvas);
    console.log('Canvas setup complete');
}
