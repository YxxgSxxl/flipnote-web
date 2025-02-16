import paper from "paper";

export class Fill {
    private tool: paper.Tool;
    private fillColor: paper.Color;

    constructor() {
        this.tool = new paper.Tool();
        this.fillColor = new paper.Color('red');

        this.tool.onMouseDown = (event: paper.ToolEvent) => {
            console.log("Fill tool clicked at:", event.point);

            const hitResult = paper.project.hitTest(event.point, {
                fill: true,
                stroke: true,
                tolerance: 5
            });

            if (hitResult && hitResult.item) {
                const item = hitResult.item;

                // Si on clique sur un carré du Pencil
                if (item.parent instanceof paper.Group && item.parent.data.isPencilGroup) {
                    console.log("Found a Pencil group");

                    // Fusionner tous les carrés en une seule forme
                    const mergedPath = this.mergeSquares(item.parent as paper.Group);
                    if (mergedPath) {
                        mergedPath.fillColor = this.fillColor;
                        console.log("Filled a merged shape.");
                    }
                    return;
                }

                // Si on clique sur un autre Path fermé
                if (item instanceof paper.Path && item.closed) {
                    item.fillColor = this.fillColor;
                    console.log("Filled a closed path.");
                    return;
                }
            }

            console.log("Click was outside a fillable area.");
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

    private mergeSquares(group: paper.Group): paper.Path | null {
        const mergedPath = new paper.Path();
        mergedPath.fillColor = null;

        for (const child of group.children) {
            if (child instanceof paper.Path.Rectangle) {
                mergedPath.addSegments(child.segments);
            }
        }

        mergedPath.closed = true;
        mergedPath.simplify();
        return mergedPath;
    }
}
