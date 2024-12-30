import cornerSquareTypes from "../../constants/cornerSquareTypes";
import { CornerSquareType, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs, Window } from "../../types";

export default class QRCornerSquare {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: CornerSquareType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: CornerSquareType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
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
        case cornerSquareTypes.circleInSquare:
          drawFunction = this._drawCircleInSquare;
          break;
      case cornerSquareTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopFlat;
        break;
      case cornerSquareTypes.rightBottomCircle:
        drawFunction = this._drawCircleRightBottomFlat;
        break;
      case cornerSquareTypes.peanut:
        drawFunction = this._drawPeanutShape;
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
    this._element?.setAttribute("transform", `rotate(${(180 * rotation) / Math.PI},${cx},${cy})`);
  }

  _basicDot(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
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
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
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
      }
    });
  }

  _basicExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const dotSize = size / 7;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute(
          "d",
          `M ${x} ${y + 2.5 * dotSize}` +
            `v ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${dotSize * 2.5}` +
            `h ${2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${dotSize * 2.5} ${-dotSize * 2.5}` +
            `v ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${-dotSize * 2.5}` +
            `h ${-2 * dotSize}` +
            `a ${2.5 * dotSize} ${2.5 * dotSize}, 0, 0, 0, ${-dotSize * 2.5} ${dotSize * 2.5}` +
            `M ${x + 2.5 * dotSize} ${y + dotSize}` +
            `h ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${dotSize * 1.5}` +
            `v ${2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${dotSize * 1.5}` +
            `h ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${-dotSize * 1.5} ${-dotSize * 1.5}` +
            `v ${-2 * dotSize}` +
            `a ${1.5 * dotSize} ${1.5 * dotSize}, 0, 0, 1, ${dotSize * 1.5} ${-dotSize * 1.5}`
        );
      }
    });
  }

  _basicDottedSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const squareSize = size / 7;
    const gap = squareSize * 1.2;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("fill", "#000"); // Add this line to fill the squares

        let pathData = "";
        // Top edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x + i} ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Right edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x + size - squareSize} ${y + i} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Bottom edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x + size - i - squareSize} ${y + size - squareSize} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Left edge
        for (let i = 0; i <= size - squareSize; i += gap) {
          pathData += `M ${x} ${y + size - i - squareSize} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        }
        // Top-left corner
        pathData += `M ${x} ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Top-right corner
        pathData += `M ${x + size - squareSize} ${y} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Bottom-right corner
        pathData += `M ${x + size - squareSize} ${y + size - squareSize} h ${squareSize} v ${squareSize} h -${squareSize} z `;
        // Bottom-left corner
        pathData += `M ${x} ${y + size - squareSize} h ${squareSize} v ${squareSize} h -${squareSize} z `;

        this._element.setAttribute("d", pathData);
      }
    });
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y, rotation = 0 } = args;
    const radius = size / 3; // Adjust this value to control the rounding radius
    const innerSquareSize = size / 1.4; // Size of the inner square
    const innerSquareRadius = innerSquareSize / 4; // Radius for the inner square
    const innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
    const innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square

    // Center coordinates for rotation
    const cx = x + size / 2;
    const cy = y + size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the combined path for the outer and inner squares
        const pathData =
          `M ${x + radius} ${y}` + // Start at the top-left rounded corner
          `H ${x + size - radius}` + // Draw a horizontal line to the right
          `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
          `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right flat edge
          `H ${x + size}` + // Move to the bottom-right flat edge
          `V ${y + size}` + // Draw a vertical line down to the bottom
          `H ${x + radius}` + // Draw a horizontal line to the left
          `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
          `V ${y + radius}` + // Draw a vertical line up to the starting point
          `a ${radius} ${radius} 0 0 1 ${radius} -${radius}` + // Draw the top-left arc
          `Z` + // Close the outer path
          `M ${innerX + innerSquareRadius} ${innerY}` + // Start at the top-left rounded corner of the inner square
          `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
          `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right flat edge
          `H ${innerX + innerSquareSize}` + // Move to the bottom-right flat edge
          `V ${innerY + innerSquareSize}` + // Draw a vertical line down to the bottom
          `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
          `V ${innerY + innerSquareRadius}` + // Draw a vertical line up to the starting point
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} -${innerSquareRadius}` + // Draw the top-left arc
          `Z`; // Close the inner path

        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "none"); // Set fill to none for the outer shape
        this._element.setAttribute("stroke", "black"); // Set the stroke color
        this._element.setAttribute("stroke-width", "1"); // Set the stroke width

        // Create the inner square path
        const innerPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        innerPath.setAttribute("clip-rule", "evenodd");
        innerPath.setAttribute(
          "d",
          `M ${innerX + innerSquareRadius} ${innerY}` + // Start at the top-left rounded corner
            `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
            `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right flat edge
            `H ${innerX + innerSquareSize}` + // Move to the bottom-right flat edge
            `V ${innerY + innerSquareSize}` + // Draw a vertical line down to the bottom
            `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
            `V ${innerY + innerSquareRadius}` + // Draw a vertical line up to the starting point
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} -${innerSquareRadius}` + // Draw the top-left arc
            `Z`
        );
        innerPath.setAttribute("transform", `rotate(${(rotation * 180) / Math.PI}, ${cx}, ${cy})`);
        innerPath.setAttribute("fill", "white"); // Set fill to white for the inner square

        // Append the elements to the SVG container
        this._element.appendChild(innerPath);
      }
    });
  }

  _basicRoundedSquareLeftTopEdge(args: BasicFigureDrawArgs): void {
    const { size, x, y, rotation = 0 } = args;
    const radius = size / 3; // Adjust this value to control the rounding radius
    const innerSquareSize = size / 1.4; // Size of the inner square
    const innerSquareRadius = innerSquareSize / 4; // Radius for the inner square
    const innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
    const innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square

    // Center coordinates for rotation
    const cx = x + size / 2;
    const cy = y + size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the combined path for the outer and inner squares
        const pathData =
          `M ${x} ${y}` + // Start at the top-left sharp corner
          `H ${x + size - radius}` + // Draw a horizontal line to the right
          `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
          `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right flat edge
          `a ${radius} ${radius} 0 0 1 -${radius} ${radius}` + // Draw the bottom-right arc
          `H ${x + radius}` + // Draw a horizontal line to the left
          `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
          `V ${y}` + // Draw a vertical line up to the starting point
          `Z` + // Close the outer path
          `M ${innerX} ${innerY}` + // Start at the top-left sharp corner of the inner square
          `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
          `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right flat edge
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} ${innerSquareRadius}` + // Draw the bottom-right arc
          `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
          `V ${innerY}` + // Draw a vertical line up to the starting point
          `Z`; // Close the inner path

        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "none"); // Set fill to none for the outer shape
        this._element.setAttribute("stroke", "black"); // Set the stroke color
        this._element.setAttribute("stroke-width", "1"); // Set the stroke width

        // Create the inner square path
        const innerPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        innerPath.setAttribute("clip-rule", "evenodd");
        innerPath.setAttribute(
          "d",
          `M ${innerX} ${innerY}` + // Start at the top-left sharp corner
            `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
            `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right flat edge
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} ${innerSquareRadius}` + // Draw the bottom-right arc
            `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
            `V ${innerY}` + // Draw a vertical line up to the starting point
            `Z`
        );
        innerPath.setAttribute("transform", `rotate(${(rotation * 180) / Math.PI}, ${cx}, ${cy})`);
        innerPath.setAttribute("fill", "white"); // Set fill to white for the inner square

        // Append the elements to the SVG container
        this._element.appendChild(innerPath);
      }
    });
  }

  _basicLeftTopCircle(args: BasicFigureDrawArgs): void {
    const { size, x, y, rotation = 0 } = args;
    const radius = size / 2; // Radius for the outer circle
    const innerRadius = radius / 1.4; // Radius for the inner circle
    const innerX = x + (size - innerRadius * 2) / 2; // X position for the inner circle
    const innerY = y + (size - innerRadius * 2) / 2; // Y position for the inner circle

    // Center coordinates for rotation
    const cx = x + size / 2;
    const cy = y + size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the combined path for the outer and inner circles
        const pathData =
          `M ${x} ${y}` + // Start at the top-left sharp corner
          `H ${x + radius}` + // Draw a horizontal line to the right
          `A ${radius} ${radius} 0 0 1 ${x + size} ${y + radius}` + // Draw the top-right arc
          `A ${radius} ${radius} 0 0 1 ${x + radius} ${y + size}` + // Draw the bottom-right arc
          `A ${radius} ${radius} 0 0 1 ${x} ${y + radius}` + // Draw the bottom-left arc
          `V ${y}` + // Draw a vertical line up to the starting point
          `Z` + // Close the outer path
          `M ${innerX} ${innerY}` + // Start at the top-left sharp corner of the inner circle
          `H ${innerX + innerRadius}` + // Draw a horizontal line to the right
          `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX + innerRadius * 2} ${innerY + innerRadius}` + // Draw the top-right arc
          `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX + innerRadius} ${innerY + innerRadius * 2}` + // Draw the bottom-right arc
          `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX} ${innerY + innerRadius}` + // Draw the bottom-left arc
          `V ${innerY}` + // Draw a vertical line up to the starting point
          `Z`; // Close the inner path

        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "none"); // Set fill to none for the outer shape
        this._element.setAttribute("stroke", "black"); // Set the stroke color
        this._element.setAttribute("stroke-width", "1"); // Set the stroke width

        // Create the inner circle path
        const innerPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        innerPath.setAttribute("clip-rule", "evenodd");
        innerPath.setAttribute(
          "d",
          `M ${innerX} ${innerY}` + // Start at the top-left sharp corner
            `H ${innerX + innerRadius}` + // Draw a horizontal line to the right
            `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX + innerRadius * 2} ${innerY + innerRadius}` + // Draw the top-right arc
            `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX + innerRadius} ${innerY + innerRadius * 2}` + // Draw the bottom-right arc
            `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX} ${innerY + innerRadius}` + // Draw the bottom-left arc
            `V ${innerY}` + // Draw a vertical line up to the starting point
            `Z`
        );
        innerPath.setAttribute("transform", `rotate(${(rotation * 180) / Math.PI}, ${cx}, ${cy})`);
        innerPath.setAttribute("fill", "white"); // Set fill to white for the inner circle

        // Append the elements to the SVG container
        this._element.appendChild(innerPath);
      }
    });
  }

  _basicRightBottomCircle(args: BasicFigureDrawArgs): void {
    const { size, x, y, rotation = 0 } = args;
    const radius = size / 2; // Radius for the outer circle
    const innerRadius = radius / 1.4; // Radius for the inner circle
    const innerX = x + (size - innerRadius * 2) / 2; // X position for the inner circle
    const innerY = y + (size - innerRadius * 2) / 2; // Y position for the inner circle

    // Center coordinates for rotation
    const cx = x + size / 2;
    const cy = y + size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the combined path for the outer and inner circles
        const pathData =
          `M ${x + size} ${y + size}` + // Start at the bottom-right sharp corner
          `H ${x + size - radius}` + // Draw a horizontal line to the left
          `A ${radius} ${radius} 0 0 1 ${x} ${y + size - radius}` + // Draw the bottom-left arc
          `A ${radius} ${radius} 0 0 1 ${x + radius} ${y}` + // Draw the top-left arc
          `A ${radius} ${radius} 0 0 1 ${x + size} ${y + radius}` + // Draw the top-right arc
          `V ${y + size}` + // Draw a vertical line down to the starting point
          `Z` + // Close the outer path
          `M ${innerX + innerRadius * 2} ${innerY + innerRadius * 2}` + // Start at the bottom-right sharp corner of the inner circle
          `H ${innerX + innerRadius}` + // Draw a horizontal line to the left
          `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX} ${innerY + innerRadius}` + // Draw the bottom-left arc
          `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX + innerRadius} ${innerY}` + // Draw the top-left arc
          `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX + innerRadius * 2} ${innerY + innerRadius}` + // Draw the top-right arc
          `V ${innerY + innerRadius * 2}` + // Draw a vertical line down to the starting point
          `Z`; // Close the inner path

        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "none"); // Set fill to none for the outer shape
        this._element.setAttribute("stroke", "black"); // Set the stroke color
        this._element.setAttribute("stroke-width", "1"); // Set the stroke width

        // Create the inner circle path
        const innerPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        innerPath.setAttribute("clip-rule", "evenodd");
        innerPath.setAttribute(
          "d",
          `M ${innerX + innerRadius * 2} ${innerY + innerRadius * 2}` + // Start at the bottom-right sharp corner
            `H ${innerX + innerRadius}` + // Draw a horizontal line to the left
            `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX} ${innerY + innerRadius}` + // Draw the bottom-left arc
            `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX + innerRadius} ${innerY}` + // Draw the top-left arc
            `A ${innerRadius} ${innerRadius} 0 0 1 ${innerX + innerRadius * 2} ${innerY + innerRadius}` + // Draw the top-right arc
            `V ${innerY + innerRadius * 2}` + // Draw a vertical line down to the starting point
            `Z`
        );
        innerPath.setAttribute("transform", `rotate(${(rotation * 180) / Math.PI}, ${cx}, ${cy})`);
        innerPath.setAttribute("fill", "white"); // Set fill to white for the inner circle

        // Append the elements to the SVG container
        this._element.appendChild(innerPath);
      }
    });
  }

  _basicPeanutShape(args: BasicFigureDrawArgs): void {
    const { size, x, y, rotation = 0 } = args;
    const radius = size / 2.2; // Adjust this value to control the rounding radius
    const innerSquareSize = size / 1.4; // Size of the inner square
    const innerSquareRadius = innerSquareSize / 2.2; // Radius for the inner square
    const innerX = x + (size - innerSquareSize) / 2; // X position for the inner square
    const innerY = y + (size - innerSquareSize) / 2; // Y position for the inner square

    // Center coordinates for rotation
    const cx = x + size / 2;
    const cy = y + size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        // Create the combined path for the outer and inner shapes
        const pathData =
          `M ${x + radius} ${y}` + // Start at the top-left flat edge
          `H ${x + size - radius}` + // Draw a horizontal line to the right
          `a ${radius} ${radius} 0 0 1 ${radius} ${radius}` + // Draw the top-right arc
          `V ${y + size - radius}` + // Draw a vertical line down to the bottom-right flat edge
          `a ${radius} ${radius} 0 0 1 -${radius} ${radius}` + // Draw the bottom-right arc
          `H ${x + radius}` + // Draw a horizontal line to the left
          `a ${radius} ${radius} 0 0 1 -${radius} -${radius}` + // Draw the bottom-left arc
          `V ${y + radius}` + // Draw a vertical line up to the starting point
          `a ${radius} ${radius} 0 0 1 ${radius} -${radius}` + // Draw the top-left arc
          `Z` + // Close the outer path
          `M ${innerX + innerSquareRadius} ${innerY}` + // Start at the top-left flat edge of the inner square
          `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
          `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right flat edge
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} ${innerSquareRadius}` + // Draw the bottom-right arc
          `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
          `V ${innerY + innerSquareRadius}` + // Draw a vertical line up to the starting point
          `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} -${innerSquareRadius}` + // Draw the top-left arc
          `Z`; // Close the inner path

        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("d", pathData);
        this._element.setAttribute("fill", "none"); // Set fill to none for the outer shape
        this._element.setAttribute("stroke", "black"); // Set the stroke color
        this._element.setAttribute("stroke-width", "1"); // Set the stroke width

        // Create the inner shape path
        const innerPath = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        innerPath.setAttribute("clip-rule", "evenodd");
        innerPath.setAttribute(
          "d",
          `M ${innerX + innerSquareRadius} ${innerY}` + // Start at the top-left flat edge
            `H ${innerX + innerSquareSize - innerSquareRadius}` + // Draw a horizontal line to the right
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} ${innerSquareRadius}` + // Draw the top-right arc
            `V ${innerY + innerSquareSize - innerSquareRadius}` + // Draw a vertical line down to the bottom-right flat edge
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} ${innerSquareRadius}` + // Draw the bottom-right arc
            `H ${innerX + innerSquareRadius}` + // Draw a horizontal line to the left
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 -${innerSquareRadius} -${innerSquareRadius}` + // Draw the bottom-left arc
            `V ${innerY + innerSquareRadius}` + // Draw a vertical line up to the starting point
            `a ${innerSquareRadius} ${innerSquareRadius} 0 0 1 ${innerSquareRadius} -${innerSquareRadius}` + // Draw the top-left arc
            `Z`
        );
        innerPath.setAttribute("transform", `rotate(${(rotation * 180) / Math.PI}, ${cx}, ${cy})`);
        innerPath.setAttribute("fill", "white"); // Set fill to white for the inner shape

        // Append the elements to the SVG container
        this._element.appendChild(innerPath);
      }
    });
  }

  _basicCircleInSquare(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const borderWidth = size / 4; // Adjust the border width as needed
    const circleRadius = size / 2 - borderWidth / 2;
  
    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        this._element.setAttribute("clip-rule", "evenodd");
        this._element.setAttribute("fill", "none"); // No fill for the square and circle
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
      }
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

  _drawPeanutShape({ x, y, size, rotation }: DrawArgs): void {
    this._basicPeanutShape({ x, y, size, rotation });
  }
}
