export function DrawingTools() {
  return `
                <div class="toolbox">
                <button id="Brush"><img src="/img/cursors/brush.png" alt="Brush Icon" width="24" height="24"></button>
                <button id="Pencil"><img src="/img/cursors/pencil.png" alt="Pencil Icon" width="24" height="24"></button>
                <button id="Fill"><img src="/img/cursors/fill.png" alt="Fill Bucket Icon" width="24" height="24"></button>
                <button id="Eraser"><img src="/img/cursors/eraser.png" alt="Eraser Icon" width="24" height="24"></button>
            </div>

            <div class="settings brush-settings">
                <button id="brush-small" class="brush-size"><img src="/img/icons/brush_small_32x32.png" alt="Small Circle 32x32 Icon" width="24" height="24"></button>
                <button id="brush-medium" class="brush-size"><img src="/img/icons/brush_medium_32x32.png" alt="Medium Circle 32x32 Icon" width="24" height="24"></button>
                <button id="brush-large" class="brush-size"><img src="/img/icons/brush_big_32x32.png" alt="Big Circle 32x32 Icon" width="24" height="24"></button>
            </div>

            <div class="settings pencil-settings">
                <button id="pencil-small" class="pencil-size"><img src="/img/icons/pencil_small_32x32.png" alt="Small Circle 32x32 Icon" width="24" height="24"></button>
                <button id="pencil-medium" class="pencil-size"><img src="/img/icons/pencil_medium_32x32.png" alt="Medium Circle 32x32 Icon" width="24" height="24"></button>
                <button id="pencil-large" class="pencil-size"><img src="/img/icons/pencil_big_32x32.png" alt="Big Circle 32x32 Icon" width="24" height="24"></button>
            </div>

            <div class="settings eraser-settings">
            <button id="eraser-small" class="eraser-size"><img src="/img/icons/eraser_small_32x32.png" alt="Big Circle 32x32 Icon" width="24" height="24"></button>
            <button id="eraser-medium" class="eraser-size"><img src="/img/icons/eraser_medium_32x32.png" alt="Medium Circle 32x32 Icon" width="24" height="24"></button>
            <button id="eraser-large" class="eraser-size"><img src="/img/icons/eraser_big_32x32.png" alt="Small Circle 32x32 Icon" width="24" height="24"></button>
            </div>`;
}
