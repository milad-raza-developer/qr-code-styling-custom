import cornerSquareTypes from "../../../constants/cornerSquareTypes";
import {
  CornerSquareType,
  RotateFigureArgsCanvas,
  BasicFigureDrawArgsCanvas,
  DrawArgsCanvas,
} from "../../../types";

export default class QRCornerSquare {
  _context: CanvasRenderingContext2D;
  _type: CornerSquareType;

  constructor({
    context,
    type,
  }: {
    context: CanvasRenderingContext2D;
    type: CornerSquareType;
  }) {
    this._context = context;
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const context = this._context;
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerSquareTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerSquareTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case cornerSquareTypes.dottedSquare:
        drawFunction = this._drawDottedSquare;
        break;
      case cornerSquareTypes.rightBottomSquare:
        drawFunction = this._drawRoundedSquareRightBottomEdge;
        break;
      case cornerSquareTypes.leftTopSquare:
        drawFunction = this._drawRoundedSquareLeftTopEdge;
        break;
      case cornerSquareTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopFlat;
        break;
      case cornerSquareTypes.rightBottomCircle:
        drawFunction = this._drawCircleRightBottomFlat;
        break;
      case cornerSquareTypes.circleInSquare:
        drawFunction = this._drawCircleInSquare;
        break;
      case cornerSquareTypes.peanut:
        drawFunction = this._drawPeanutShape;
        break;
      case cornerSquareTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, context, rotation });
  }

  _rotateFigure({
    x,
    y,
    size,
    context,
    rotation = 0,
    draw,
  }: RotateFigureArgsCanvas): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    context.translate(cx, cy);
    rotation && context.rotate(rotation);
    draw();
    context.closePath();
    rotation && context.rotate(-rotation);
    context.translate(-cx, -cy);
  }

  _basicDot(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
        context.arc(0, 0, size / 2 - dotSize, 0, Math.PI * 2);
      },
    });
  }

  _basicSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size);
        context.rect(
          -size / 2 + dotSize,
          -size / 2 + dotSize,
          size - 2 * dotSize,
          size - 2 * dotSize
        );
      },
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(-dotSize, -dotSize, 2.5 * dotSize, Math.PI, -Math.PI / 2);
        context.lineTo(dotSize, -3.5 * dotSize);
        context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(3.5 * dotSize, -dotSize);
        context.arc(dotSize, dotSize, 2.5 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 3.5 * dotSize);
        context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-3.5 * dotSize, -dotSize);

        context.arc(-dotSize, -dotSize, 1.5 * dotSize, Math.PI, -Math.PI / 2);
        context.lineTo(dotSize, -2.5 * dotSize);
        context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(2.5 * dotSize, -dotSize);
        context.arc(dotSize, dotSize, 1.5 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 2.5 * dotSize);
        context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-2.5 * dotSize, -dotSize);
      },
    });
  }

  _basicDottedSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, x, y, context } = args;
    const squareSize = size / 7;
    const gap = squareSize * 1.2;

    context.save();

    // Top edge
    for (let i = 0; i <= size - squareSize; i += gap) {
      context.beginPath();
      context.rect(x + i, y, squareSize, squareSize);
      context.fill();
      context.closePath();
    }

    // Right edge
    for (let i = 0; i <= size - squareSize; i += gap) {
      context.beginPath();
      context.rect(x + size - squareSize, y + i, squareSize, squareSize);
      context.fill();
      context.closePath();
    }

    // Bottom edge
    for (let i = 0; i <= size - squareSize; i += gap) {
      context.beginPath();
      context.rect(
        x + size - i - squareSize,
        y + size - squareSize,
        squareSize,
        squareSize
      );
      context.fill();
      context.closePath();
    }

    // Left edge
    for (let i = 0; i <= size - squareSize; i += gap) {
      context.beginPath();
      context.rect(x, y + size - i - squareSize, squareSize, squareSize);
      context.fill();
      context.closePath();
    }

    // Top-left corner
    context.beginPath();
    context.rect(x, y, squareSize, squareSize);
    context.fill();
    context.closePath();

    // Top-right corner
    context.beginPath();
    context.rect(x + size - squareSize, y, squareSize, squareSize);
    context.fill();
    context.closePath();

    // Bottom-right corner
    context.beginPath();
    context.rect(
      x + size - squareSize,
      y + size - squareSize,
      squareSize,
      squareSize
    );
    context.fill();
    context.closePath();

    // Bottom-left corner
    context.beginPath();
    context.rect(x, y + size - squareSize, squareSize, squareSize);
    context.fill();
    context.closePath();

    context.restore();
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();
        context.arc(-dotSize, -dotSize, 2.5 * dotSize, Math.PI, -Math.PI / 2);
        context.lineTo(dotSize, -3.5 * dotSize);
        context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(3.5 * dotSize, -dotSize);
        context.lineTo(3.5 * dotSize, 3.5 * dotSize); // Flat bottom-right corner
        context.lineTo(-dotSize, 3.5 * dotSize);
        context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-3.5 * dotSize, -dotSize);
        context.closePath();

        context.arc(-dotSize, -dotSize, 1.5 * dotSize, Math.PI, -Math.PI / 2);
        context.lineTo(dotSize, -2.5 * dotSize);
        context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(2.5 * dotSize, -dotSize);
        context.lineTo(2.5 * dotSize, 2.5 * dotSize); // Flat bottom-right corner
        context.lineTo(-dotSize, 2.5 * dotSize);
        context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-2.5 * dotSize, -dotSize);
      },
    });
  }

  _basicRoundedSquareLeftTopEdge(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();

        // Flat top-left corner
        context.moveTo(-3.5 * dotSize, -3.5 * dotSize);
        context.lineTo(3.5 * dotSize, -3.5 * dotSize);

        context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(3.5 * dotSize, dotSize);
        context.arc(dotSize, dotSize, 2.5 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 3.5 * dotSize);

        context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);

        context.lineTo(-3.5 * dotSize, 3.5 * dotSize);
        context.closePath();

        // Inner cutout with flat top-left corner
        context.moveTo(-2.5 * dotSize, -2.5 * dotSize);
        context.lineTo(2.5 * dotSize, -2.5 * dotSize);
        context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(2.5 * dotSize, dotSize);
        context.arc(dotSize, dotSize, 1.5 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 2.5 * dotSize);

        context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-2.5 * dotSize, dotSize);

        context.closePath();
      },
    });
  }

  _basicLeftTopCircle(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();

        // Flat top-left corner
        context.moveTo(-3.5 * dotSize, -3.5 * dotSize);
        context.lineTo(3.5 * dotSize, -3.5 * dotSize);

        context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(3.5 * dotSize, dotSize);
        context.arc(dotSize, dotSize, 2.5 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 3.5 * dotSize);

        context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);

        context.lineTo(-3.5 * dotSize, 3.5 * dotSize);
        context.closePath();

        // Inner cutout with flat top-left corner
        context.moveTo(-2.5 * dotSize, -2.5 * dotSize);
        context.lineTo(2.5 * dotSize, -2.5 * dotSize);
        context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(2.5 * dotSize, dotSize);
        context.arc(dotSize, dotSize, 1.5 * dotSize, 0, Math.PI / 2);
        context.lineTo(-dotSize, 2.5 * dotSize);

        context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);
        context.lineTo(-2.5 * dotSize, dotSize);

        context.closePath();
      },
    });
  }

  _basicRightBottomCircle(args: BasicFigureDrawArgsCanvas): void {
    const { size, x, y, context } = args;
    const radius = size / 2;
    const flatEdgeLength = size / 16; // Adjust this value as needed to control the length of the flat edge
    const smallDotRadius = radius / 1.4; // Adjust this value to control the size of the small dot

    context.save();

    // Draw the main shape with a flat bottom-right edge
    context.beginPath();
    context.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI); // Draw the top-left arc
    context.lineTo(x + size - radius, y); // Draw a horizontal line to the right
    context.arc(
      x + size - radius,
      y + radius,
      radius,
      1.5 * Math.PI,
      2 * Math.PI
    ); // Draw the top-right arc
    context.lineTo(x + size, y + size - flatEdgeLength); // Draw a vertical line down to the bottom
    context.lineTo(x + size - flatEdgeLength, y + size); // Draw a horizontal line to the left to the flat edge
    context.lineTo(x + radius, y + size); // Draw a vertical line up to the bottom-left
    context.arc(x + radius, y + size - radius, radius, 0, 0.5 * Math.PI); // Draw the bottom-left arc
    context.closePath();
    context.strokeStyle = "black"; // Set the stroke color
    context.lineWidth = 1; // Set the stroke width
    context.stroke();

    // Draw the white rounded dot with a flat corner
    context.beginPath();
    context.arc(x + radius, y + radius, smallDotRadius, 0, 2 * Math.PI); // Center dot
    context.fillStyle = "white"; // White fill
    context.fill();
    context.strokeStyle = "none"; // No stroke for the dot
    context.stroke();

    context.restore();
  }

  _basicCircleInSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 14;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size);

        context.arc(0, 0, size / 2 - dotSize, 0, Math.PI * 2);
      },
    });
  }

  _basicPeanutShape(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();

        // Outer shape
        // Top-left flat corner
        context.moveTo(-3.5 * dotSize, -3.5 * dotSize); // Start from the flat top-left corner
        context.lineTo(-dotSize, -3.5 * dotSize); // Horizontal line to the right

        // Top-right rounded corner
        context.arc(dotSize, -dotSize, 2.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(3.5 * dotSize, -dotSize);

        // Bottom-right flat corner
        context.lineTo(3.5 * dotSize, 3.5 * dotSize); // Vertical line down

        // Bottom-left rounded corner
        context.lineTo(-dotSize, 3.5 * dotSize); // Horizontal line to the left
        context.arc(-dotSize, dotSize, 2.5 * dotSize, Math.PI / 2, Math.PI);

        // Closing the path
        context.lineTo(-3.5 * dotSize, dotSize); // Horizontal line to the left
        context.lineTo(-3.5 * dotSize, -dotSize); // Vertical line up to the top-left flat corner
        context.closePath();

        // Inner shape
        context.moveTo(-2.5 * dotSize, -2.5 * dotSize); // Adjusted start position for inner shape
        context.lineTo(-dotSize, -2.5 * dotSize); // Horizontal line to the right

        context.arc(dotSize, -dotSize, 1.5 * dotSize, -Math.PI / 2, 0);
        context.lineTo(2.5 * dotSize, -dotSize);

        context.lineTo(2.5 * dotSize, 2.5 * dotSize); // Vertical line down
        context.lineTo(-dotSize, 2.5 * dotSize); // Horizontal line to the left
        context.arc(-dotSize, dotSize, 1.5 * dotSize, Math.PI / 2, Math.PI);

        context.lineTo(-2.5 * dotSize, dotSize); // Horizontal line to the left
        context.lineTo(-2.5 * dotSize, -dotSize); // Vertical line up to the inner top-left flat corner
        context.closePath();
      },
    });
  }



  _drawDot({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicDot({ x, y, size, context, rotation });
  }

  _drawSquare({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicSquare({ x, y, size, context, rotation });
  }

  _drawExtraRounded({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicExtraRounded({ x, y, size, context, rotation });
  }

  _drawDottedSquare({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicDottedSquare({ x, y, size, context, rotation });
  }

  _drawRoundedSquareRightBottomEdge({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicRoundedSquareRightBottomEdge({ x, y, size, context, rotation });
  }

  _drawRoundedSquareLeftTopEdge({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicRoundedSquareLeftTopEdge({ x, y, size, context, rotation });
  }

  _drawCircleLeftTopFlat({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicLeftTopCircle({ x, y, size, context, rotation });
  }

  _drawCircleRightBottomFlat({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicRightBottomCircle({ x, y, size, context, rotation });
  }

  _drawCircleInSquare({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicCircleInSquare({ x, y, size, context, rotation });
  }

  _drawPeanutShape({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicPeanutShape({ x, y, size, context, rotation });
  }
}
