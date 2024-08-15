import { CornerDotType, RotateFigureArgsCanvas, BasicFigureDrawArgsCanvas, DrawArgsCanvas } from "../../../types";
export default class QRCornerDot {
    _context: CanvasRenderingContext2D;
    _type: CornerDotType;
    constructor({ context, type, }: {
        context: CanvasRenderingContext2D;
        type: CornerDotType;
    });
    draw(x: number, y: number, size: number, rotation: number): void;
    _rotateFigure({ x, y, size, context, rotation, draw, }: RotateFigureArgsCanvas): void;
    _basicDot(args: BasicFigureDrawArgsCanvas): void;
    _basicSquare(args: BasicFigureDrawArgsCanvas): void;
    _basicRoundedSquare(args: BasicFigureDrawArgsCanvas): void;
    _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgsCanvas): void;
    _basicLeaf(args: BasicFigureDrawArgsCanvas): void;
    _basicCircleLeftTopEdge(args: BasicFigureDrawArgsCanvas): void;
    _basicCircleRightBottomEdge(args: BasicFigureDrawArgsCanvas): void;
    _basicDiamond(args: BasicFigureDrawArgsCanvas): void;
    _basicStar(args: BasicFigureDrawArgsCanvas): void;
    _basicPlus(args: BasicFigureDrawArgsCanvas): void;
    _basicCross(args: BasicFigureDrawArgsCanvas): void;
    _drawDot({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawSquare({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawStar({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawPlus({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawCross({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawDiamond({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawSquareRounded({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawSquareRoundedRightBottomEdge({ x, y, size, context, rotation, }: DrawArgsCanvas): void;
    _drawLeaf({ x, y, size, context, rotation }: DrawArgsCanvas): void;
    _drawCircleLeftTopEdge({ x, y, size, context, rotation, }: DrawArgsCanvas): void;
    _drawCircleRightBottomEdge({ x, y, size, context, rotation, }: DrawArgsCanvas): void;
}
