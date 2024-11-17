import cornerDotTypes from "../../../constants/cornerDotTypes";
import {
  CornerDotType,
  RotateFigureArgs,
  BasicFigureDrawArgs,
  DrawArgs,
} from "../../../types";

export default class QRCornerDot {
  _svg: SVGElement;
  _type: CornerDotType;
  _element: SVGElement | null;

  constructor({ svg, type }: { svg: SVGElement; type: CornerDotType }) {
    this._svg = svg;
    this._type = type;
    this._element = null;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.squareGrid:
        drawFunction = this._drawSquareGrid;
        break;
      case cornerDotTypes.star:
        drawFunction = this._drawStar;
        break;
      case cornerDotTypes.squareRounded:
        drawFunction = this._drawSquareRounded;
        break;
      case cornerDotTypes.rightBottomSquare:
        drawFunction = this._drawSquareRoundedRightBottomEdge;
        break;
      case cornerDotTypes.plus:
        drawFunction = this._drawPlus;
        break;
      case cornerDotTypes.cross:
        drawFunction = this._drawCross;
        break;
      case cornerDotTypes.rhombus:
        drawFunction = this._drawRhombus;
        break;
      // case cornerDotTypes.leaf:
      //   drawFunction = this._drawLead;
      //   break;
      case cornerDotTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopEdge;
        break;
      case cornerDotTypes.rightBottomCircle:
        drawFunction = this._drawCircleRightBottomEdge;
        break;
      case cornerDotTypes.diamond:
        drawFunction = this._drawDiamond;
        break;
      case cornerDotTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    const lastChild = this._svg.lastChild as SVGElement | null;
    if (lastChild) {
      lastChild.setAttribute(
        "transform",
        `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`
      );
    }
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", String(x + size / 2));
        circle.setAttribute("cy", String(y + size / 2));
        circle.setAttribute("r", String(size / 2));
        this._svg.appendChild(circle);
      },
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(size));
        rect.setAttribute("height", String(size));
        this._svg.appendChild(rect);
      },
    });
  }

  _basicRoundedSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 5; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(size));
        rect.setAttribute("height", String(size));
        rect.setAttribute("rx", String(radius));
        rect.setAttribute("ry", String(radius));
        this._svg.appendChild(rect);
      },
    });
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 3; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(size));
        rect.setAttribute("height", String(size));
        rect.setAttribute("rx", String(radius));
        rect.setAttribute("ry", String(radius));

        // Create a small rectangle to cover the bottom right corner
        const flatCornerRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        flatCornerRect.setAttribute("x", String(x + size - radius));
        flatCornerRect.setAttribute("y", String(y + size - radius));
        flatCornerRect.setAttribute("width", String(radius));
        flatCornerRect.setAttribute("height", String(radius));

        this._svg.appendChild(rect);
        this._svg.appendChild(flatCornerRect);
      },
    });
  }

  // _basicLeaf(args: BasicFigureDrawArgs): void {
  //   const { size, x, y } = args;
  //   const extension = size / 4; // Adjust the extension as needed
  //   const cornerRadius = size / 10; // Adjust the corner radius as needed
  
  //   // Adjusted offsets for positioning
  //   const offsetX = size /2;
  //   const offsetY = size/2 ;
  
  //   this._rotateFigure({
  //     ...args,
  //     draw: () => {
  //       const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

  //     // Adjust the path commands for the SVG
  //     const d = `
  //       M ${x - size / 2.2 - extension + offsetX},${y - size / 2.2 - extension + offsetY}  // Move to the top left corner
  //       L ${x + size / 2.2 + offsetX},${y - size / 2.2 + offsetY}  // Draw top edge
  //       L ${x + size / 2.2 + offsetX},${y + size / 2.2 + offsetY}  // Draw right edge
  //       L ${x - size / 2.2 + offsetX},${y + size / 2.2 + offsetY}  // Draw bottom edge
  //       A ${cornerRadius},${cornerRadius} 0 0 1 ${x - size / 2.2 - extension + cornerRadius + offsetX},${y - size / 2.2 + cornerRadius - extension + offsetY}  // Draw rounded left top corner
  //       Z  // Close the path
  //     `
  //       .replace(/\/\/.*$/gm, "")  // Remove comments from the path string
  //       .trim(); // Trim any extra spaces

  //     path.setAttribute("d", d);
  //     this._svg.appendChild(path);
  //     },
  //   });
  // }
  

  _basicCircleLeftTopEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create a circle for the curved part
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", String(x + radius));
        circle.setAttribute("cy", String(y + radius));
        circle.setAttribute("r", String(radius));

        // Create a rectangle for the flat corner
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x));
        rect.setAttribute("y", String(y));
        rect.setAttribute("width", String(radius));
        rect.setAttribute("height", String(radius));

        // Add both shapes to the SVG
        this._svg.appendChild(circle);
        this._svg.appendChild(rect);
      },
    });
  }

  _basicCircleRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create a circle for the curved part
        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", String(x + radius));
        circle.setAttribute("cy", String(y + radius));
        circle.setAttribute("r", String(radius));

        // Create a rectangle for the flat bottom-right corner
        const rect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        rect.setAttribute("x", String(x + radius));
        rect.setAttribute("y", String(y + radius));
        rect.setAttribute("width", String(radius));
        rect.setAttribute("height", String(radius));

        // Add both shapes to the SVG
        this._svg.appendChild(circle);
        this._svg.appendChild(rect);
      },
    });
  }

  _basicDiamond(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        const polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        polygon.setAttribute(
          "points",
          `
          ${x + size / 2}, ${y}
          ${x + size}, ${y + size / 2}
          ${x + size / 2}, ${y + size}
          ${x}, ${y + size / 2}
        `
        );
        this._svg.appendChild(polygon);
      },
    });
  }
  _basicStar(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const numPoints = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 1.8;
    const step = Math.PI / numPoints;

    // Adjust starting angle to ensure the star is upright
    const startAngle = -Math.PI / 2;

    const points = [];
    for (let i = 0; i < 2 * numPoints; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = startAngle + i * step; // Adjusted angle
      const px = x + size / 2 + radius * Math.cos(angle);
      const py = y + size / 2 + radius * Math.sin(angle);
      points.push(`${px},${py}`);
    }

    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    polygon.setAttribute("points", points.join(" "));

    this._svg.appendChild(polygon);
  }

  _basicPlus(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const thickness = size / 2.5;
    const halfThickness = thickness / 2;
    const halfSize = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        const verticalRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
        verticalRect.setAttribute("y", String(y));
        verticalRect.setAttribute("width", String(thickness));
        verticalRect.setAttribute("height", String(size));
        group.appendChild(verticalRect);

        const horizontalRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        horizontalRect.setAttribute("x", String(x));
        horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
        horizontalRect.setAttribute("width", String(size));
        horizontalRect.setAttribute("height", String(thickness));
        group.appendChild(horizontalRect);

        this._svg.appendChild(group);
      },
    });
  }

  _basicCross(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const thickness = size / 2.5;
    const halfThickness = thickness / 2;
    const halfSize = size / 2;

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // Vertical line (rect)
    const verticalRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
    verticalRect.setAttribute("y", String(y));
    verticalRect.setAttribute("width", String(thickness));
    verticalRect.setAttribute("height", String(size));
    verticalRect.setAttribute("rx", String(thickness / 2)); // rounded corners
    verticalRect.setAttribute(
      "transform",
      `rotate(45 ${x + halfSize} ${y + halfSize})`
    );
    group.appendChild(verticalRect);

    // Horizontal line (rect)
    const horizontalRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    horizontalRect.setAttribute("x", String(x));
    horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
    horizontalRect.setAttribute("width", String(size));
    horizontalRect.setAttribute("height", String(thickness));
    horizontalRect.setAttribute("rx", String(thickness / 2)); // rounded corners

    // Rotate the horizontal rect by 45 degrees to form the cross
    horizontalRect.setAttribute(
      "transform",
      `rotate(45 ${x + halfSize} ${y + halfSize})`
    );
    group.appendChild(horizontalRect);

    this._svg.appendChild(group);
  }

  _basicRhombus(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const thickness = size / 1.8;
    const halfThickness = thickness / 2;
    const halfSize = size / 2;

    // Vertical rectangle
    const verticalRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    verticalRect.setAttribute("x", String(x + halfSize - halfThickness));
    verticalRect.setAttribute("y", String(y));
    verticalRect.setAttribute("width", String(thickness));
    verticalRect.setAttribute("height", String(size));

    // Top triangle
    const verticalTopTriangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    verticalTopTriangle.setAttribute(
      "points",
      `
            ${x + halfSize - halfThickness},${y}
            ${x + halfSize},${y - halfThickness}
            ${x + halfSize + halfThickness},${y}
        `
    );

    // Bottom triangle
    const verticalBottomTriangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    verticalBottomTriangle.setAttribute(
      "points",
      `
            ${x + halfSize - halfThickness},${y + size}
            ${x + halfSize},${y + size + halfThickness}
            ${x + halfSize + halfThickness},${y + size}
        `
    );

    // Horizontal rectangle
    const horizontalRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    horizontalRect.setAttribute("x", String(x));
    horizontalRect.setAttribute("y", String(y + halfSize - halfThickness));
    horizontalRect.setAttribute("width", String(size));
    horizontalRect.setAttribute("height", String(thickness));

    // Left triangle
    const horizontalLeftTriangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    horizontalLeftTriangle.setAttribute(
      "points",
      `
            ${x},${y + halfSize - halfThickness}
            ${x - halfThickness},${y + halfSize}
            ${x},${y + halfSize + halfThickness}
        `
    );

    // Right triangle
    const horizontalRightTriangle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    horizontalRightTriangle.setAttribute(
      "points",
      `
            ${x + size},${y + halfSize - halfThickness}
            ${x + size + halfThickness},${y + halfSize}
            ${x + size},${y + halfSize + halfThickness}
        `
    );

    // Add all elements to the SVG container
    this._svg.appendChild(verticalRect);
    this._svg.appendChild(verticalTopTriangle);
    this._svg.appendChild(verticalBottomTriangle);
    this._svg.appendChild(horizontalRect);
    this._svg.appendChild(horizontalLeftTriangle);
    this._svg.appendChild(horizontalRightTriangle);
  }

  _basicSquareGrid(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    const boxSize = size / 2.5; // Size of each box
    const gap = size / 12; // Gap between the boxes

    // The positions for the boxes
    const startX = size / 16; // Start X position (left side of the grid)
    const startY = size / 16; // Start Y position (top side of the grid)

    this._rotateFigure({
      ...args,
      draw: () => {
        const group = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );

        // Create the top-left box
        const box1 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        box1.setAttribute("x", String(x + startX));
        box1.setAttribute("y", String(y + startY));
        box1.setAttribute("width", String(boxSize));
        box1.setAttribute("height", String(boxSize));
        group.appendChild(box1);

        // Create the top-right box (shifted by the box size + gap)
        const box2 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        box2.setAttribute("x", String(x + startX + boxSize + gap));
        box2.setAttribute("y", String(y + startY));
        box2.setAttribute("width", String(boxSize));
        box2.setAttribute("height", String(boxSize));
        group.appendChild(box2);

        // Create the bottom-left box (shifted down by the box size + gap)
        const box3 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        box3.setAttribute("x", String(x + startX));
        box3.setAttribute("y", String(y + startY + boxSize + gap));
        box3.setAttribute("width", String(boxSize));
        box3.setAttribute("height", String(boxSize));
        group.appendChild(box3);

        // Create the bottom-right box (shifted by both box size + gap horizontally and vertically)
        const box4 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect"
        );
        box4.setAttribute("x", String(x + startX + boxSize + gap));
        box4.setAttribute("y", String(y + startY + boxSize + gap));
        box4.setAttribute("width", String(boxSize));
        box4.setAttribute("height", String(boxSize));
        group.appendChild(box4);

        // Append the group of boxes to the SVG
        this._svg.appendChild(group);
      },
    });
  }

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawStar({ x, y, size, rotation }: DrawArgs): void {
    this._basicStar({ x, y, size, rotation });
  }

  _drawPlus({ x, y, size, rotation }: DrawArgs): void {
    this._basicPlus({ x, y, size, rotation });
  }

  _drawSquareRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquare({ x, y, size, rotation });
  }

  _drawSquareRoundedRightBottomEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquareRightBottomEdge({ x, y, size, rotation });
  }

  // _drawLead({ x, y, size, rotation }: DrawArgs): void {
  //   this._basicLeaf({ x, y, size, rotation });
  // }

  _drawCircleLeftTopEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicCircleLeftTopEdge({ x, y, size, rotation });
  }
  _drawCircleRightBottomEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicCircleRightBottomEdge({ x, y, size, rotation });
  }

  _drawDiamond({ x, y, size, rotation }: DrawArgs): void {
    this._basicDiamond({ x, y, size, rotation });
  }
  _drawCross({ x, y, size, rotation }: DrawArgs): void {
    this._basicCross({ x, y, size, rotation });
  }

  _drawRhombus({ x, y, size, rotation }: DrawArgs): void {
    this._basicRhombus({ x, y, size, rotation });
  }
  _drawSquareGrid({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquareGrid({ x, y, size, rotation });
  }
}
