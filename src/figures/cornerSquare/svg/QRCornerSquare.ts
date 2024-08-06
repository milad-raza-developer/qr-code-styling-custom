import cornerSquareTypes from "../../../constants/cornerSquareTypes";
import {
  CornerSquareType,
  DrawArgs,
  BasicFigureDrawArgs,
  RotateFigureArgs,
} from "../../../types";

export default class QRCornerSquare {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerSquareType;

  constructor({ svg, type }: { svg: SVGElement; type: CornerSquareType }) {
    this._svg = svg;
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
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
      case cornerSquareTypes.dot:
      default:
        drawFunction = this._drawDot;
    }

    drawFunction.call(this, { x, y, size, rotation });
  }

  _rotateFigure({ x, y, size, rotation = 0, draw }: RotateFigureArgs): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    draw();
    this._element?.setAttribute(
      "transform",
      `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`
    );
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x + size / 2} ${y}` + // M cx, y //  Move to top of ring
            `a ${size / 2} ${size / 2} 0 1 0 0.1 0` + // a outerRadius, outerRadius, 0, 1, 0, 1, 0 // Draw outer arc, but don't close it
            `z` + // Z // Close the outer shape
            `m 0 ${dotSize}` + // m -1 outerRadius-innerRadius // Move to top point of inner radius
            `a ${size / 2 - dotSize} ${size / 2 - dotSize} 0 1 1 -0.1 0` + // a innerRadius, innerRadius, 0, 1, 1, -1, 0 // Draw inner arc, but don't close it
            `Z` // Z // Close the inner ring. Actually will still work without, but inner ring will have one unit missing in stroke
        );
      },
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` +
            `v ${size}` +
            `h ${size}` +
            `v ${-size}` +
            `z` +
            `M ${x + dotSize} ${y + dotSize}` +
            `h ${size - 2 * dotSize}` +
            `v ${size - 2 * dotSize}` +
            `h ${-size + 2 * dotSize}` +
            `z`
        );
      },
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + 2.5 * dotSize}` +
            `v ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${
              dotSize * 2.5
            }` +
            `h ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${
              -dotSize * 2.5
            }` +
            `v ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${
              -dotSize * 2.5
            }` +
            `h ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${
              dotSize * 2.5
            }` +
            `M ${x + 2.5 * dotSize} ${y + dotSize}` +
            `h ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${
              dotSize * 1.5
            }` +
            `v ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${
              dotSize * 1.5
            }` +
            `h ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${
              -dotSize * 1.5
            }` +
            `v ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${
              -dotSize * 1.5
            }`
        );
      },
    });
  }

  _basicDottedSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const squareSize = size / 7;
    const gap = squareSize * 1.2;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("fill", "#000"); // Add this line to fill the squares

        let pathData = "";
        // Top edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${
            x + i
          } ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Right edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x + size - squareSize} ${
            y + i
          } h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Bottom edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x + size - i - squareSize} ${
            y + size - squareSize
          } h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Left edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x} ${
            y + size - i - squareSize
          } h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Top-left corner
        pathData += `M ${x} ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Top-right corner
        pathData += `M ${
          x + size - squareSize
        } ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Bottom-right corner
        pathData += `M ${x + size - squareSize} ${
          y + size - squareSize
        } h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Bottom-left corner
        pathData += `M ${x} ${
          y + size - squareSize
        } h ${squareSize} v ${squareSize} h -${squareSize} z `;

        this._element.setAttribute("d", pathData);
      },
    });
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 5;
    const borderWidth = size / 7; // Adjust the border width as needed
  
    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + radius}` + 
            `a ${radius} ${radius} 0 0 1 ${radius} ${-radius}` + // Top-left corner arc
            `h ${size - 2 * radius}` + // Top edge
            `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Top-right corner arc
            `v ${size - 2 * radius}` + // Right edge
            `a ${radius} ${radius} 0 0 1 ${-radius} ${radius}` + // Bottom-right corner arc
            `h ${-size + radius}` + // Bottom edge
            `v ${-size + radius}` + // Left edge
            `a ${radius} ${radius} 0 0 1 ${radius} ${-radius}` + // Bottom-left corner arc
            `M ${x + borderWidth} ${y + radius}` + 
            `v ${size - 2 * radius}` + 
            `a ${radius} ${radius} 0 0 0 ${radius} ${radius}` + 
            `h ${size - 2 * radius - borderWidth}` + 
            `a ${radius} ${radius} 0 0 0 ${radius} ${-radius}` + 
            `v ${-size + 2 * radius}` + 
            `a ${radius} ${radius} 0 0 0 ${-radius} ${-radius}` + 
            `h ${-size + 2 * radius - borderWidth}` + 
            `a ${radius} ${radius} 0 0 0 ${-radius} ${radius}` + 
            `Z`
        );
      },
    });
  }
  

  _basicRoundedSquareLeftTopEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 5;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + size}` +
            `h ${size - radius}` +
            `a ${radius} ${radius} 0 0 0 ${-radius} ${radius}` +
            `v ${-size + radius}` +
            `h ${-size}` +
            `z`
        );
      },
    });
  }

  _basicCircleInSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
  const borderWidth = size / 7; // Adjust the border width as needed
  const circleRadius = size / 2 - borderWidth / 2;

  this._rotateFigure({
    ...args,
    draw: () => {
      this._element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      this._element.setAttribute("fill", "none");
      this._element.setAttribute(
        "d",
        `M ${x} ${y}` +
          `h ${size}` +
          `v ${size}` +
          `h ${-size}` +
          `z` + // Outer square border
          `M ${x + size / 2}, ${y + size / 2}` +
          `m -${circleRadius}, 0` +
          `a ${circleRadius},${circleRadius} 0 1,0 ${2 * circleRadius},0` +
          `a ${circleRadius},${circleRadius} 0 1,0 -${2 * circleRadius},0` // Circle in the center
      );
    },
  });

  }

  _basicLeftTopCircle(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;
    const flatEdgeLength = size / 16; // Adjust this value as needed to control the length of the flat edge
    const smallDotRadius = radius / 1.4; // Adjust this value to control the size of the small dot
  
    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the main shape path
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("clip-rule", "evenodd");
        path.setAttribute(
          "d",
          `M ${x + flatEdgeLength} ${y}` + // Start at the top-left flat edge
            `H ${x + size - radius}` + // Draw a horizontal line to the right
            `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
            `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right
            `a ${radius} ${radius} 0 0 1 -${radius} ${radius}` + // Draw the bottom-right arc
            `H ${x + radius}` + // Draw a horizontal line to the left
            `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
            `V ${y + flatEdgeLength}` + // Draw a vertical line up to the starting point to close the path
            `a ${radius} ${radius} 0 0 1 ${radius} -${radius}` + // Draw the top-left arc
            `Z` // Close the path
        );
        path.setAttribute("fill", "none"); // No fill
        path.setAttribute("stroke", "black"); // Set the stroke color
        path.setAttribute("stroke-width", "1"); // Set the stroke width
        this._element = path;
  
        // Create the white rounded dot with flat corner
        const smallDot = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        smallDot.setAttribute("cx", `${x + radius}`); // Center x
        smallDot.setAttribute("cy", `${y + radius}`); // Center y
        smallDot.setAttribute("r", `${smallDotRadius}`); // Radius of the white circle
        smallDot.setAttribute("fill", "white"); // White fill
        smallDot.setAttribute("stroke", "none"); // No stroke
  
        // Append both elements to the SVG container
        const svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
        if (svgContainer) {
          svgContainer.appendChild(this._element);
          svgContainer.appendChild(smallDot);
        }
      },
    });
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  _basicRightBottomCircle(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const radius = size / 2;
    const flatEdgeLength = size / 16; // Adjust this value as needed to control the length of the flat edge
    const smallDotRadius = radius / 1.4; // Adjust this value to control the size of the small dot
  
    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the main shape path
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("clip-rule", "evenodd");
        path.setAttribute(
          "d",
          `M ${x} ${y + radius}` + // Start at the top-left arc
            `a ${radius} ${radius} 0 0 1 ${radius} -${radius}` + // Draw the top-left arc
            `H ${x + size - radius}` + // Draw a horizontal line to the right
            `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
            `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right flat edge
            `H ${x + size - flatEdgeLength}` + // Draw a horizontal line to the left to the flat edge
            `V ${y + size}` + // Draw a vertical line down to the bottom
            `H ${x + radius}` + // Draw a horizontal line to the left
            `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
            `Z` // Close the path
        );
        path.setAttribute("fill", "none"); // No fill
        path.setAttribute("stroke", "black"); // Set the stroke color
        path.setAttribute("stroke-width", "1"); // Set the stroke width
        this._element = path;
  
        // Create the white rounded dot with flat corner
        const smallDot = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        smallDot.setAttribute("cx", `${x + radius}`); // Center x
        smallDot.setAttribute("cy", `${y + radius}`); // Center y
        smallDot.setAttribute("r", `${smallDotRadius}`); // Radius of the white circle
        smallDot.setAttribute("fill", "white"); // White fill
        smallDot.setAttribute("stroke", "none"); // No stroke
  
        // Append both elements to the SVG container
        const svgContainer = document.querySelector("svg"); // Adjust this selector to match your SVG container
        if (svgContainer) {
          svgContainer.appendChild(this._element);
          svgContainer.appendChild(smallDot);
        }
      },
    });
  }
  

  _drawDot({ x, y, size, rotation }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation });
  }

  _drawSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation });
  }

  _drawExtraRounded({ x, y, size, rotation }: DrawArgs): void {
    this._basicExtraRounded({ x, y, size, rotation });
  }

  _drawDottedSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicDottedSquare({ x, y, size, rotation });
  }

  _drawRoundedSquareRightBottomEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquareRightBottomEdge({ x, y, size, rotation });
  }

  _drawRoundedSquareLeftTopEdge({ x, y, size, rotation }: DrawArgs): void {
    this._basicRoundedSquareLeftTopEdge({ x, y, size, rotation });
  }

  _drawCircleInSquare({ x, y, size, rotation }: DrawArgs): void {
    this._basicCircleInSquare({ x, y, size, rotation });
  }
  
  _drawCircleLeftTopFlat({ x, y, size, rotation }: DrawArgs): void {
    this._basicLeftTopCircle({ x, y, size, rotation });
  }
  
  _drawCircleRightBottomFlat({ x, y, size, rotation }: DrawArgs): void {
    this._basicRightBottomCircle({ x, y, size, rotation });
  }
}
