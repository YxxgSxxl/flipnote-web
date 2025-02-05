import './stylesheet/style.css'
import './services/cursor/cursorDisplay.ts'
import './services/cursor/cursorTools.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <main>
        <canvas id="canvas" width="600" height="400"></canvas>
        <div class="toolbox">
            <button><img src="/img/cursors/brush.png" alt="Brush Icon" width="24" height="24"></button>
            <button><img src="/img/cursors/pencil.png" alt="Pencil Icon" width="24" height="24"></button>
            <button><img src="/img/cursors/eraser.png" alt="Eraser Icon" width="24" height="24"></button>
        </div>

        <div class="brush-settings">
            <button id="brush-small">A</button>
            <button id="brush-medium">A</button>
            <button id="brush-large">A</button>
        </div>

        <div class="pencil-settings">
            <button id="pencil-small">B</button>
            <button id="pencil-medium">B</button>
            <button id="pencil-large">B</button>
        </div>

        <div class="eraser-settings">
            <button id="eraser-small">C</button>
            <button id="eraser-medium">C</button>
            <button id="eraser-large">C</button>
        </div>
    </main>
`
