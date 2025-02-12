import paper from "paper";

export class Fill {
    private tool: paper.Tool;
    private fillColor: paper.Color;

    constructor() {
        this.tool = new paper.Tool();
        this.fillColor = new paper.Color('red');

        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            console.log("Fill tool clicked at:", event.point);
        
            // Afficher tous les éléments du projet pour debug
            console.log("All items in project:", paper.project.activeLayer.children);
        
            // Test avec des options plus larges
            const hitResult = paper.project.hitTest(event.point, {
                tolerance: 50,
                fill: true,
                stroke: true,
                segments: true,
                curves: true,
                handles: true,
                bounds: true
            });
        
            console.log("Hit result:", hitResult);
        
            if (hitResult) {
                const item = hitResult.item;
                console.log("Found item type:", item.constructor.name);
        
                // Vérifier si l'élément est un groupe créé par le Pencil
                if (item instanceof paper.Group && item.data.isPencilGroup) {
                    console.log("Found a group created by Pencil");
        
                    // Récupérer tous les chemins du groupe
                    const paths = item.children.filter(child => child instanceof paper.Path) as paper.Path[];
        
                    // Comparer chaque paire de chemins dans le groupe
                    for (let i = 0; i < paths.length; i++) {
                        for (let j = i + 1; j < paths.length; j++) {
                            this.detectIntersectionsAndFill(paths[i], paths[j]);
                        }
                    }
        
                    // Forcer le rafraîchissement
                    paper.view.update();
                    console.log("Fill applied");
                } else {
                    console.log("Item is not a Pencil group, no fill applied.");
                }
            }
        };        
    }

    activate() {
        console.log("Fill tool activated");
        this.tool.activate();
    }

    setFillColor(color: string) {
        console.log("Setting fill color to:", color);
        this.fillColor = new paper.Color(color);
    }

    private detectIntersectionsAndFill(pathA: paper.Path, pathB: paper.Path) {
        // Assurez-vous que pathA et pathB sont des instances de paper.Path
        if (pathA instanceof paper.Path && pathB instanceof paper.Path) {
            const intersections = pathA.getIntersections(pathB);
            if (intersections.length > 0) {
                // Si les chemins se croisent, on applique la couleur
                pathA.fillColor = this.fillColor;
                pathB.fillColor = this.fillColor;
                console.log("Paths intersected and filled");
            }
        }
    }    
}
