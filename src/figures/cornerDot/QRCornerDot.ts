import cornerDotTypes from "../../constants/cornerDotTypes";
import { CornerDotType, RotateFigureArgs, BasicFigureDrawArgs, DrawArgs, Window } from "../../types";

export default class QRCornerDot {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerDotType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: CornerDotType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.squareRounded:
        drawFunction = this._drawSquareRounded;
        break;
      case cornerDotTypes.rightBottomSquare:
        drawFunction = this._drawSquareRoundedRightBottomEdge;
        break;
      case cornerDotTypes.squareGrid:
        drawFunction = this._drawSquareGrid;
        break;
      case cornerDotTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopEdge;
        break;
      case cornerDotTypes.rightBottomCircle:
        drawFunction = this._drawCircleRightBottomEdge;
        break;
      case cornerDotTypes.diamond:
        drawFunction = this._drawDiamond;
        break;
      case cornerDotTypes.star:
        drawFunction = this._drawStar;
        break;
      case cornerDotTypes.plus:
        drawFunction = this._drawPlus;
        break;
      case cornerDotTypes.cross:
        drawFunction = this._drawCross;
        break;
      case cornerDotTypes.leaf:
        drawFunction = this._drawSquareTopLeftExtended;
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
    this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "circle");
        this._element.setAttribute("cx", String(x + size / 2));
        this._element.setAttribute("cy", String(y + size / 2));
        this._element.setAttribute("r", String(size / 2));
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this._element.setAttribute("x", String(x));
        this._element.setAttribute("y", String(y));
        this._element.setAttribute("width", String(size));
        this._element.setAttribute("height", String(size));
      }
    });
  }

  _basicRoundedSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
        this._element.setAttribute("x", String(x));
        this._element.setAttribute("y", String(y));
        this._element.setAttribute("width", String(size));
        this._element.setAttribute("height", String(size));

        // Set rounded corners
        const cornerRadius = size / 4; // Adjust this value to control the roundness
        this._element.setAttribute("rx", String(cornerRadius));
        this._element.setAttribute("ry", String(cornerRadius));
      }
    });
  }

  _basicSquareGrid(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    // Calculate the size of each smaller square
    const smallSize = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 2; col++) {
            // Create a smaller square for each grid position
            const square = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");
            square.setAttribute("x", String(x + col * smallSize));
            square.setAttribute("y", String(y + row * smallSize));
            square.setAttribute("width", String(smallSize));
            square.setAttribute("height", String(smallSize));

            // Append the small square to the main element
            this._element?.appendChild(square);
          }
        }
      }
    });
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        const cornerRadius = size / 4; // Adjust this value to control the roundness

        // Create a path string for the square with rounded corners except the bottom-right corner
        const pathData = `
        M ${x} ${y + cornerRadius} 
        Q ${x} ${y} ${x + cornerRadius} ${y} 
        H ${x + size - cornerRadius} 
        Q ${x + size} ${y} ${x + size} ${y + cornerRadius} 
        V ${y + size} 
        Q ${x + size} ${y + size} ${x + size - cornerRadius} ${y + size} 
        H ${x + cornerRadius} 
        Q ${x} ${y + size} ${x} ${y + size - cornerRadius} 
        Z
      `;
        // Set the path data and create the element
        this._element.setAttribute("d", pathData);
      }
    });
  }

  _basicCircleLeftTopEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Define radius of the circle
        const radius = size / 2;

        // Create a path string for the circle with a square corner at the top-left
        const pathData = `
          M ${x + radius} ${y} 
          A ${radius} ${radius} 0 1 1 ${x + radius} ${y + size} 
          A ${radius} ${radius} 0 1 1 ${x + radius} ${y} 
          L ${x - radius} ${y + size} 
          L ${x} ${y} 
          Z
        `;
        // Set the path data and create the element
        this._element.setAttribute("d", pathData);
      }
    });
  }

  _basicCircleRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Define radius of the circle
        const radius = size / 2;

        // Create a path string for the circle with a square corner at the bottom-right
        const pathData = `
          M ${x + radius} ${y} 
          A ${radius} ${radius} 0 1 1 ${x + radius} ${y + size} 
          L ${x + size} ${y + size} 
          L ${x + size} ${y + size - radius} 
          A ${radius} ${radius} 0 1 1 ${x + radius} ${y} 
          Z
        `;
        // Set the path data and create the element
        this._element.setAttribute("d", pathData);
      }
    });
  }

  _basicDiamond(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Create a path string for the diamond shape
        const pathData = `
          M ${x + size / 2} ${y} 
          L ${x + size} ${y + size / 2} 
          L ${x + size / 2} ${y + size} 
          L ${x} ${y + size / 2} 
          Z
        `;
        // Set the path data and create the element
        this._element.setAttribute("d", pathData);
      }
    });
  }

  _basicStar(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Create a path string for the star shape
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 1.8;
    const points = 5;
    let pathData = "";

    for (let i = 0; i < points * 2; i++) {
      const angle = (i * Math.PI) / points - Math.PI / 2; // Adjust angle to start from the top
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const xPos = x + size / 2 + radius * Math.cos(angle);
      const yPos = y + size / 2 + radius * Math.sin(angle); // Adjust yPos calculation
      pathData += i === 0 ? `M ${xPos},${yPos}` : `L ${xPos},${yPos}`;
    }
    pathData += " Z";

    // Set the path data and create the element
    this._element.setAttribute("d", pathData);
  }

  _basicPlus(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const armWidth = size / 3; // Width of the arms of the plus shape

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Create a path string for the plus shape
        const pathData = `
          M ${x + size / 2 - armWidth / 2} ${y} 
          L ${x + size / 2 + armWidth / 2} ${y} 
          L ${x + size / 2 + armWidth / 2} ${y + size} 
          L ${x + size / 2 - armWidth / 2} ${y + size} 
          Z
          
          M ${x} ${y + size / 2 - armWidth / 2} 
          L ${x + size} ${y + size / 2 - armWidth / 2} 
          L ${x + size} ${y + size / 2 + armWidth / 2} 
          L ${x} ${y + size / 2 + armWidth / 2} 
          Z
        `;

        // Set the path data and create the element
        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "black"); // Set fill color for visibility
      }
    });
  }

  _basicCross(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const armWidth = size / 2.5; // Width of the arms of the cross shape

    this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

    // Create a path string for the cross shape
    const pathData = `
          M ${x + size / 2 - armWidth / 2} ${y} 
          L ${x + size / 2 + armWidth / 2} ${y} 
          L ${x + size / 2 + armWidth / 2} ${y + size} 
          L ${x + size / 2 - armWidth / 2} ${y + size} 
          Z
          
          M ${x} ${y + size / 2 - armWidth / 2} 
          L ${x + size} ${y + size / 2 - armWidth / 2} 
          L ${x + size} ${y + size / 2 + armWidth / 2} 
          L ${x} ${y + size / 2 + armWidth / 2} 
          Z
        `;

    // Set the path data and create the element
    this._element.setAttribute("d", pathData);
    this._element.setAttribute("fill", "black"); // Set fill color for visibility

    // Rotate the path slightly to the right
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    this._element.setAttribute("transform", `rotate(45, ${centerX}, ${centerY})`);
  }

  _basicSquareTopLeftExtended(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const extension = size / 4; // Adjust this value to control the extension from the top left side

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Create a path string for the square shape with an extension from the top left side
        const pathData = `
          M ${x - extension} ${y - extension}
          L ${x + size} ${y - extension}
          L ${x + size} ${y + size}
          L ${x} ${y + size}
          L ${x} ${y}
          L ${x - extension} ${y}
          Z
        `;

        // Set the path data and create the element
        this._element.setAttribute("d", pathData);
      }
    });
  }


  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }
  _drawSquareRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquare({ x, y, size, rotation });
  }
  _drawSquareGrid({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquareGrid({ x, y, size, rotation });
  }
  _drawSquareRoundedRightBottomEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquareRightBottomEdge({ x, y, size, rotation });
  }
  _drawCircleLeftTopEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicCircleLeftTopEdge({ x, y, size, rotation });
  }
  _drawCircleRightBottomEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicCircleRightBottomEdge({ x, y, size, rotation });
  }
  _drawDiamond({ x, y, size, rotation }: DrawArgs): void {
    this._basicDiamond({ x, y, size, rotation });
  }
  _drawStar({ x, y, size, rotation }: DrawArgs): void {
    this._basicStar({ x, y, size, rotation });
  }
  _drawPlus({ x, y, size, rotation }: DrawArgs): void {
    this._basicPlus({ x, y, size, rotation });
  }
  _drawCross({ x, y, size, rotation }: DrawArgs): void {
    this._basicCross({ x, y, size, rotation });
  }
  _drawSquareTopLeftExtended({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquareTopLeftExtended({ x, y, size, rotation });
  }
}
