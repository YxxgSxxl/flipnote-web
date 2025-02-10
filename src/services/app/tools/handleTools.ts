import { setTool } from '../cursor/cursorTools';
import { Brush } from '../tools/brush';
import { Pencil } from '../tools/pencil';
import { Eraser } from '../tools/eraser';

export function setupToolboxEvents() {
    const brushButton = document.querySelector('button#Brush')!;
    const pencilButton = document.querySelector('button#Pencil')!;
    const eraserButton = document.querySelector('button#Eraser')!;

    const brush = new Brush();
    
    brushButton.addEventListener('click', () => {
        setTool('Brush');
        brush.setBrushSize('Small');
    });

    pencilButton.addEventListener('click', () => {
        setTool('Pencil');
    });

    eraserButton.addEventListener('click', () => {
        setTool('Eraser');
    });

    // Répéter la logique pour chaque bouton de taille pour les autres outils
}
