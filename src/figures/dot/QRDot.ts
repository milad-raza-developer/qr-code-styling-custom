import dotTypes from "../../constants/dotTypes";
import { DotType, GetNeighbor, DrawArgs, BasicFigureDrawArgs, RotateFigureArgs, Window } from "../../types";

export default class QRDot {
  _element?: SVGElement;
  _svg: SVGElement;
  _type: DotType;
  _window: Window;

  constructor({ svg, type, window }: { svg: SVGElement; type: DotType; window: Window }) {
    this._svg = svg;
    this._type = type;
    this._window = window;
  }

  draw(x: number, y: number, size: number, getNeighbor: GetNeighbor): void {
    const type = this._type;
    let drawFunction;

    switch (type) {
      case dotTypes.dots:
        drawFunction = this._drawDot;
        break;
      case dotTypes.classy:
        drawFunction = this._drawClassy;
        break;
      case dotTypes.classyRounded:
        drawFunction = this._drawClassyRounded;
        break;
      case dotTypes.rounded:
        drawFunction = this._drawRounded;
        break;
      case dotTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case dotTypes.star:
        drawFunction = this._drawStar;
        break;
      case dotTypes.diamond:
        drawFunction = this._drawDiamond;
        break;
      case dotTypes.heart:
        drawFunction = this._drawHeart;
        break;
      // case dotTypes.cube:
      //   drawFunction = this._drawCube;
      //   break;
      case dotTypes.plus:
        drawFunction = this._drawPlus;
        break;
      case dotTypes.roundedPlus:
        drawFunction = this._drawRoundedPlus;
        break;
      case dotTypes.cross:
        drawFunction = this._drawCross;
        break;
      case dotTypes.verticalBar:
        drawFunction = this._drawVerticalBar;
        break;
      case dotTypes.horizontalBar:
        drawFunction = this._drawHorizontalBar;
        break;
      case dotTypes.square:
      default:
        drawFunction = this._drawSquare;
    }

    drawFunction.call(this, { x, y, size, getNeighbor });
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

  //if rotation === 0 - right side is rounded
  _basicSideRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size / 2}` + //draw line to left bottom corner + half of size right
            `a ${size / 2} ${size / 2}, 0, 0, 0, 0 ${-size}` // draw rounded corner
        );
      }
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size}` + //draw line to right bottom corner
            `v ${-size / 2}` + //draw line to right bottom corner + half of size top
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}` // draw rounded corner
        );
      }
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerExtraRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` + //go to top left position
            `v ${size}` + //draw line to left bottom corner
            `h ${size}` + //draw line to right bottom corner
            `a ${size} ${size}, 0, 0, 0, ${-size} ${-size}` // draw rounded top right corner
        );
      }
    });
  }

  //if rotation === 0 - left bottom and right top corners are rounded
  _basicCornersRounded(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");
        this._element.setAttribute(
          "d",
          `M ${x} ${y}` + //go to left top position
            `v ${size / 2}` + //draw line to left top corner + half of size bottom
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${size / 2} ${size / 2}` + // draw rounded left bottom corner
            `h ${size / 2}` + //draw line to right bottom corner
            `v ${-size / 2}` + //draw line to right bottom corner + half of size top
            `a ${size / 2} ${size / 2}, 0, 0, 0, ${-size / 2} ${-size / 2}` // draw rounded right top corner
        );
      }
    });
  }

  _basicStar(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2.5; // Adjust this ratio to change star pointiness
    const points = 5; // 5-pointed star

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        let path = "";
        for (let i = 0; i <= points * 2; i++) {
          const angle = (i * Math.PI) / points - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const xPos = centerX + radius * Math.cos(angle);
          const yPos = centerY + radius * Math.sin(angle);

          if (i === 0) {
            path += `M ${xPos} ${yPos}`;
          } else {
            path += ` L ${xPos} ${yPos}`;
          }
        }
        path += " Z"; // Close the path

        this._element.setAttribute("d", path);
      }
    });
  }

  _basicDiamond(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const halfSize = size / 2;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        this._element.setAttribute(
          "points",
          `${x + halfSize},${y} ` + // Top center
            `${x + size},${y + halfSize} ` + // Right middle
            `${x + halfSize},${y + size} ` + // Bottom center
            `${x},${y + halfSize}` // Left middle
        );
      }
    });
  }

  _basicHeart(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const width = size * 1.2;
    const height = size;

    const centerX = x + size / 2;
    const bottomY = y + height;

    this._rotateFigure({
      ...args,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // More symmetrical heart shape
        const path = `
                M ${centerX},${y + height * 0.2}
                C ${centerX + width * 0.4},${y - height * 0.2}
                  ${centerX + width * 0.8},${y + height * 0.5}
                  ${centerX},${bottomY}
                C ${centerX - width * 0.8},${y + height * 0.5}
                  ${centerX - width * 0.4},${y - height * 0.2}
                  ${centerX},${y + height * 0.2}
                Z
            `;

        this._element.setAttribute("d", path.replace(/\s+/g, " ").trim());
        this._element.setAttribute("stroke-linejoin", "round");
        this._element.setAttribute("fill", "black"); // Ensures proper visibility
      }
    });
  }

  //   _basicCube(args: BasicFigureDrawArgs): void {
  //     const { size, x, y, gap = 10 } = args; // Adding a gap parameter with a default value of 10

  //     this._rotateFigure({
  //         ...args,
  //         draw: () => {
  //             this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "rect");

  //             this._element.setAttribute("x", (x + gap).toString()); // Adjusting the x position with gap
  //             this._element.setAttribute("y", (y + gap).toString()); // Adjusting the y position with gap
  //             this._element.setAttribute("width", size.toString());
  //             this._element.setAttribute("height", size.toString());
  //             this._element.setAttribute("fill", "black"); // Ensures visibility
  //         }
  //     });
  // }

  _basicPlus(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const thickness = size * 0.2; // 20% thickness
    const center = size / 2;

    this._rotateFigure({
      ...args,
      rotation: 0,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Single continuous path for perfect intersection
        const path = `
                M ${x},${y + center - thickness / 2}
                H ${x + size}
                V ${y + center + thickness / 2}
                H ${x + center + thickness / 2}
                V ${y + size}
                H ${x + center - thickness / 2}
                V ${y + center + thickness / 2}
                H ${x}
                V ${y + center - thickness / 2}
                H ${x + center - thickness / 2}
                V ${y}
                H ${x + center + thickness / 2}
                V ${y + center - thickness / 2}
                Z
            `;

        this._element.setAttribute("d", path.replace(/\s+/g, " ").trim());
      }
    });
  }

  _basicRoundedPlus(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const thickness = size * 0.1; // 20% thickness
    const radius = thickness / 2; // Corner radius
    const center = size / 2;

    this._rotateFigure({
      ...args,
      rotation: 0,
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Rounded plus path with perfect corners
        const path = `
              M ${x + radius},${y + center - thickness / 2}
              H ${x + size - radius}
              A ${radius} ${radius}, 0, 0, 1, ${x + size},${y + center - thickness / 2 + radius}
              V ${y + center + thickness / 2 - radius}
              A ${radius} ${radius}, 0, 0, 1, ${x + size - radius},${y + center + thickness / 2}
              H ${x + center + thickness / 2 + radius}
              V ${y + size - radius}
              A ${radius} ${radius}, 0, 0, 1, ${x + center + thickness / 2},${y + size}
              H ${x + center - thickness / 2}
              A ${radius} ${radius}, 0, 0, 1, ${x + center - thickness / 2 - radius},${y + size - radius}
              V ${y + center + thickness / 2 + radius}
              H ${x + radius}
              A ${radius} ${radius}, 0, 0, 1, ${x},${y + center + thickness / 2 - radius}
              V ${y + center - thickness / 2 + radius}
              A ${radius} ${radius}, 0, 0, 1, ${x + radius},${y + center - thickness / 2}
              H ${x + center - thickness / 2 - radius}
              V ${y + radius}
              A ${radius} ${radius}, 0, 0, 1, ${x + center - thickness / 2},${y}
              H ${x + center + thickness / 2}
              A ${radius} ${radius}, 0, 0, 1, ${x + center + thickness / 2 + radius},${y + radius}
              V ${y + center - thickness / 2 - radius}
              Z
          `;

        this._element.setAttribute("d", path.replace(/\s+/g, " ").trim());
        this._element.setAttribute("stroke-linejoin", "round");
      }
    });
  }

  _basicCross(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const thickness = size * 0.2; // 20% thickness
    const center = size / 2;
    const angle = Math.PI / 4; // 45 degrees

    this._rotateFigure({
      ...args,
      rotation: 0, // No base rotation
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Calculate the diagonal arm dimensions
        const armLength = Math.sqrt(2 * size * size) / 2;
        const halfThickness = thickness / 2;

        // Cross path (two diagonal rectangles)
        const path = `
              M ${x + center - halfThickness * Math.cos(angle)},${y + center - halfThickness * Math.sin(angle)}
              L ${x + center + (armLength - halfThickness) * Math.cos(angle)},${y + center + (armLength - halfThickness) * Math.sin(angle)}
              L ${x + center + (armLength + halfThickness) * Math.cos(angle)},${y + center + (armLength + halfThickness) * Math.sin(angle)}
              L ${x + center + halfThickness * Math.cos(angle)},${y + center + halfThickness * Math.sin(angle)}
              L ${x + size - halfThickness * Math.cos(angle)},${y + size - halfThickness * Math.sin(angle)}
              L ${x + size - (armLength + halfThickness) * Math.cos(angle)},${y + size - (armLength + halfThickness) * Math.sin(angle)}
              L ${x + size - (armLength - halfThickness) * Math.cos(angle)},${y + size - (armLength - halfThickness) * Math.sin(angle)}
              L ${x + center + halfThickness * Math.cos(angle)},${y + center + halfThickness * Math.sin(angle)}
              L ${x + center - (armLength - halfThickness) * Math.cos(angle)},${y + center - (armLength - halfThickness) * Math.sin(angle)}
              L ${x + center - (armLength + halfThickness) * Math.cos(angle)},${y + center - (armLength + halfThickness) * Math.sin(angle)}
              L ${x + halfThickness * Math.cos(angle)},${y + halfThickness * Math.sin(angle)}
              L ${x + (armLength - halfThickness) * Math.cos(angle)},${y + (armLength - halfThickness) * Math.sin(angle)}
              L ${x + (armLength + halfThickness) * Math.cos(angle)},${y + (armLength + halfThickness) * Math.sin(angle)}
              Z
          `;

        this._element.setAttribute("d", path.replace(/\s+/g, " ").trim());
        this._element.setAttribute("stroke-linejoin", "round");
      }
    });
  }

  _basicVerticalBar(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const width = size * 0.4; // 30% of the total size as bar width
    const height = size; // Full height
    const halfWidth = width / 2;
    const centerX = x + size / 2;

    this._rotateFigure({
      ...args,
      rotation: 0, // No rotation needed
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Define the path for a vertical bar (rectangular shape)
        const path = `
              M ${centerX - halfWidth},${y} 
              L ${centerX + halfWidth},${y} 
              L ${centerX + halfWidth},${y + height} 
              L ${centerX - halfWidth},${y + height} 
              Z
          `;

        this._element.setAttribute("d", path.replace(/\s+/g, " ").trim());
        this._element.setAttribute("stroke-linejoin", "round");
      }
    });
  }

  _basicHorizontalBar(args: BasicFigureDrawArgs): void {
    const { size, x, y } = args;
    const width = size; // Full width
    const height = size * 0.4; // 30% of the total size as bar height
    const halfHeight = height / 2;
    const centerY = y + size / 2;

    this._rotateFigure({
      ...args,
      rotation: 0, // No rotation needed
      draw: () => {
        this._element = this._window.document.createElementNS("http://www.w3.org/2000/svg", "path");

        // Define the path for a horizontal bar (rectangular shape)
        const path = `
              M ${x},${centerY - halfHeight} 
              L ${x + width},${centerY - halfHeight} 
              L ${x + width},${centerY + halfHeight} 
              L ${x},${centerY + halfHeight} 
              Z
          `;

        this._element.setAttribute("d", path.replace(/\s+/g, " ").trim());
        this._element.setAttribute("stroke-linejoin", "round");
      }
    });
}


  _drawDot({ x, y, size }: DrawArgs): void {
    this._basicDot({ x, y, size, rotation: 0 });
  }

  _drawSquare({ x, y, size }: DrawArgs): void {
    this._basicSquare({ x, y, size, rotation: 0 });
  }

  _drawRounded({ x, y, size, getNeighbor }: DrawArgs): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicDot({ x, y, size, rotation: 0 });
      return;
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      this._basicSquare({ x, y, size, rotation: 0 });
      return;
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicCornerRounded({ x, y, size, rotation });
      return;
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicSideRounded({ x, y, size, rotation });
      return;
    }
  }

  _drawExtraRounded({ x, y, size, getNeighbor }: DrawArgs): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicDot({ x, y, size, rotation: 0 });
      return;
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      this._basicSquare({ x, y, size, rotation: 0 });
      return;
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicCornerExtraRounded({ x, y, size, rotation });
      return;
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicSideRounded({ x, y, size, rotation });
      return;
    }
  }

  _drawClassy({ x, y, size, getNeighbor }: DrawArgs): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
      return;
    }

    if (!leftNeighbor && !topNeighbor) {
      this._basicCornerRounded({ x, y, size, rotation: -Math.PI / 2 });
      return;
    }

    if (!rightNeighbor && !bottomNeighbor) {
      this._basicCornerRounded({ x, y, size, rotation: Math.PI / 2 });
      return;
    }

    this._basicSquare({ x, y, size, rotation: 0 });
  }

  _drawClassyRounded({ x, y, size, getNeighbor }: DrawArgs): void {
    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicCornersRounded({ x, y, size, rotation: Math.PI / 2 });
      return;
    }

    if (!leftNeighbor && !topNeighbor) {
      this._basicCornerExtraRounded({ x, y, size, rotation: -Math.PI / 2 });
      return;
    }

    if (!rightNeighbor && !bottomNeighbor) {
      this._basicCornerExtraRounded({ x, y, size, rotation: Math.PI / 2 });
      return;
    }

    this._basicSquare({ x, y, size, rotation: 0 });
  }

  _drawStar({ x, y, size }: DrawArgs): void {
    this._basicStar({ x, y, size, rotation: 0 });
  }

  _drawDiamond({ x, y, size }: DrawArgs): void {
    this._basicDiamond({ x, y, size, rotation: 0 });
  }

  _drawHeart({ x, y, size }: DrawArgs): void {
    this._basicHeart({ x, y, size, rotation: 0 });
  }
  // _drawCube({ x, y, size }: DrawArgs): void {
  //   this._basicCube({ x, y, size, rotation: 0 });
  // }

  _drawPlus({ x, y, size }: DrawArgs): void {
    this._basicPlus({ x, y, size, rotation: 0 });
  }

  _drawRoundedPlus({ x, y, size }: DrawArgs): void {
    this._basicRoundedPlus({ x, y, size, rotation: 0 });
  }
  _drawCross({ x, y, size }: DrawArgs): void {
    this._basicCross({ x, y, size, rotation: 0 });
  }

  _drawVerticalBar({ x, y, size }: DrawArgs): void {
    
    this._basicVerticalBar({ x, y, size, rotation: 0 });
  }
  _drawHorizontalBar({ x, y, size }: DrawArgs): void {
    
    this._basicHorizontalBar({ x, y, size, rotation: 0 });
  }
}
