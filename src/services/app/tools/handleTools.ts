import { setTool } from '../cursor/cursorTools';
import { Brush } from '../tools/brush';
import { Pencil } from '../tools/pencil';
import { Eraser } from '../tools/eraser';

export function setupToolboxEvents() {
    const brushButton = document.querySelector('button#Brush')!;
    const pencilButton = document.querySelector('button#Pencil')!;
    const eraserButton = document.querySelector('button#Eraser')!;
    
    brushButton.addEventListener('click', () => {
        setTool('Brush');
    });

    pencilButton.addEventListener('click', () => {
        setTool('Pencil');
    });

    eraserButton.addEventListener('click', () => {
        setTool('Eraser');
    });

    const brushSmallButton = document.querySelector('button#brush-small')!;
    brushSmallButton.addEventListener('click', () => {
        // Logique pour changer la taille du pinceau
    });
    
    // Répéter la logique pour chaque bouton de taille pour les autres outils
}
