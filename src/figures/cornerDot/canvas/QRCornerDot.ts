import cornerDotTypes from "../../../constants/cornerDotTypes";
import {
  CornerDotType,
  RotateFigureArgsCanvas,
  BasicFigureDrawArgsCanvas,
  DrawArgsCanvas,
} from "../../../types";

export default class QRCornerDot {
  _context: CanvasRenderingContext2D;
  _type: CornerDotType;

  constructor({
    context,
    type,
  }: {
    context: CanvasRenderingContext2D;
    type: CornerDotType;
  }) {
    this._context = context;
    this._type = type;
  }

  draw(x: number, y: number, size: number, rotation: number): void {
    const context = this._context;
    const type = this._type;
    let drawFunction;

    switch (type) {
      case cornerDotTypes.squareGrid:
        drawFunction = this._drawSquareGrid;
        break;
      case cornerDotTypes.square:
        drawFunction = this._drawSquare;
        break;
      case cornerDotTypes.squareRounded:
        drawFunction = this._drawSquareRounded;
        break;
      case cornerDotTypes.rightBottomSquare:
        drawFunction = this._drawSquareRoundedRightBottomEdge;
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
      case cornerDotTypes.diamond:
        drawFunction = this._drawDiamond;
        break;
      // case cornerDotTypes.leaf:
      //   drawFunction = this._drawLeaf;
      //   break;
      case cornerDotTypes.rhombus:
        drawFunction = this._drawRhombus;
        break;
      case cornerDotTypes.leftTopCircle:
        drawFunction = this._drawCircleLeftTopEdge;
        break;
      case cornerDotTypes.rightBottomCircle:
        drawFunction = this._drawCircleRightBottomEdge;
        break;
      case cornerDotTypes.dot:
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

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
      },
    });
  }

  _basicSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size);
      },
    });
  }

  _basicRoundedSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const radius = size / 5; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const halfSize = size / 2;
        context.beginPath();
        context.moveTo(-halfSize + radius, -halfSize);
        context.lineTo(halfSize - radius, -halfSize);
        context.arcTo(
          halfSize,
          -halfSize,
          halfSize,
          -halfSize + radius,
          radius
        );
        context.lineTo(halfSize, halfSize - radius);
        context.arcTo(halfSize, halfSize, halfSize - radius, halfSize, radius);
        context.lineTo(-halfSize + radius, halfSize);
        context.arcTo(
          -halfSize,
          halfSize,
          -halfSize,
          halfSize - radius,
          radius
        );
        context.lineTo(-halfSize, -halfSize + radius);
        context.arcTo(
          -halfSize,
          -halfSize,
          -halfSize + radius,
          -halfSize,
          radius
        );
        context.closePath();
      },
    });
  }

  _basicRoundedSquareRightBottomEdge(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const radius = size / 3; // Adjust the radius as needed

    this._rotateFigure({
      ...args,
      draw: () => {
        const halfSize = size / 2;
        context.beginPath();
        context.moveTo(-halfSize + radius, -halfSize);
        context.lineTo(halfSize - radius, -halfSize);
        context.arcTo(
          halfSize,
          -halfSize,
          halfSize,
          -halfSize + radius,
          radius
        );
        context.lineTo(halfSize, -halfSize + radius);
        context.lineTo(halfSize, halfSize);
        context.lineTo(halfSize - radius, halfSize);
        context.arcTo(
          halfSize - radius,
          halfSize,
          halfSize - radius,
          halfSize - radius,
          radius
        );
        context.lineTo(-halfSize + radius, halfSize);
        context.arcTo(
          -halfSize,
          halfSize,
          -halfSize,
          halfSize - radius,
          radius
        );
        context.lineTo(-halfSize, -halfSize + radius);
        context.arcTo(
          -halfSize,
          -halfSize,
          -halfSize + radius,
          -halfSize,
          radius
        );
        context.closePath();
      },
    });
  }

  // _basicLeaf(args: BasicFigureDrawArgsCanvas): void {
  //   const { size, context } = args;
  //   const extension = size / 4; // Adjust the extension as needed
  //   const cornerRadius = size / 10; // Adjust the corner radius as needed
  
  //   // Move the leaf downwards and to the right by modifying the starting coordinates
  //   const offsetX = size / 9; // Change this value to control how much to move it horizontally
  //   const offsetY = size / 9; // Change this value to control how much to move it vertically
  
  //   this._rotateFigure({
  //     ...args,
  //     draw: () => {
  //       context.beginPath();
  //       context.moveTo(
  //         -size / 2.2 - extension + offsetX, // Apply horizontal shift
  //         -size / 2.2 - extension + offsetY // Apply vertical shift
  //       ); // Start at the top left corner
  //       context.lineTo(size / 2.2 + offsetX, -size / 2.2 + offsetY); // Draw top edge
  //       context.lineTo(size / 2.2 + offsetX, size / 2.2 + offsetY); // Draw right edge
  //       context.lineTo(-size / 2.2 + offsetX, size / 2.2 + offsetY); // Draw bottom edge
  
  //       // Draw rounded left top corner
  //       context.arc(
  //         -size / 2.2 - extension + cornerRadius + offsetX, // Apply horizontal shift
  //         -size / 2.2 + cornerRadius - extension + offsetY, // Apply vertical shift
  //         cornerRadius,
  //         Math.PI,
  //         Math.PI * 1.5
  //       );
  
  //       context.closePath();
  
  //       context.fill();
  //     },
  //   });
  // }
  
  

  _basicCircleLeftTopEdge(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const radius = size / 2; // Radius of the rounded corners
    const cornerSize = radius / 32; // Size of the flat top-left corner

    this._rotateFigure({
      ...args,
      draw: () => {
        const halfSize = size / 2;

        // Draw the full rounded square
        context.beginPath();

        // Move to the starting point of the top-right corner
        context.moveTo(-halfSize + cornerSize, -halfSize);

        // Draw the top-right corner
        context.lineTo(halfSize - radius, -halfSize);
        context.arcTo(
          halfSize,
          -halfSize,
          halfSize,
          -halfSize + radius,
          radius
        );

        // Draw the right side
        context.lineTo(halfSize, halfSize - radius);
        context.arcTo(halfSize, halfSize, halfSize - radius, halfSize, radius);

        // Draw the bottom side
        context.lineTo(-halfSize + radius, halfSize);
        context.arcTo(
          -halfSize,
          halfSize,
          -halfSize,
          halfSize - radius,
          radius
        );

        // Draw the left side
        context.lineTo(-halfSize, -halfSize + cornerSize);

        // Draw the flat top-left corner
        context.lineTo(-halfSize + cornerSize, -halfSize);

        context.closePath();
        // context.fillStyle = '#000'; // Set color for the rounded square
        context.fill();
      },
    });
  }

  _basicCircleRightBottomEdge(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const radius = size / 2; // Radius of the rounded corners
    const cornerSize = radius / 32; // Size of the flat right-bottom corner

    this._rotateFigure({
      ...args,
      draw: () => {
        const halfSize = size / 2;

        context.beginPath();

        // Move to the starting point of the top-left corner
        context.moveTo(-halfSize + radius, -halfSize);

        // Draw the top-left corner
        context.arcTo(
          -halfSize,
          -halfSize,
          -halfSize,
          -halfSize + radius,
          radius
        );

        // Draw the left side
        context.lineTo(-halfSize, halfSize - radius);

        // Draw the bottom-left corner
        context.arcTo(
          -halfSize,
          halfSize,
          -halfSize + radius,
          halfSize,
          radius
        );

        // Draw the bottom side
        context.lineTo(halfSize - cornerSize, halfSize);

        // Flat bottom-right corner
        context.lineTo(halfSize - cornerSize, halfSize);

        // Draw the right side up to the bottom-right corner
        context.lineTo(halfSize, halfSize - cornerSize);

        // Draw the top-right corner
        context.arcTo(
          halfSize,
          -halfSize,
          halfSize - radius,
          -halfSize,
          radius
        );

        // Draw the top side
        context.lineTo(-halfSize + radius, -halfSize);

        context.closePath();
        // context.fillStyle = '#000'; // Set color for the rounded square
        context.fill();
      },
    });
  }

  _basicDiamond(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    const halfSize = size / 2; // Half the size of the diamond

    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();

        // Move to the top point of the diamond
        context.moveTo(0, -halfSize);

        // Draw the right point
        context.lineTo(halfSize, 0);

        // Draw the bottom point
        context.lineTo(0, halfSize);

        // Draw the left point
        context.lineTo(-halfSize, 0);

        // Close the path to the top point
        context.closePath();

        // context.fillStyle = "#000"; // Set color for the diamond
        context.fill();
      },
    });
  }

_basicStar(args: BasicFigureDrawArgsCanvas): void {
    const { size, x, y, context } = args;

    const numPoints = 5; // Number of points on the star
    const outerRadius = size / 2; // Outer radius of the star
    const innerRadius = outerRadius / 1.8; // Inner radius for inner vertices
    const step = Math.PI / numPoints; // Angle step between points

    // Starting angle adjustment to ensure the star is upright
    const startAngle = -Math.PI / 2;

    context.beginPath();

    // Draw the star by alternating between outer and inner points
    for (let i = 0; i < 2 * numPoints; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = startAngle + i * step; // Adjust angle to start from top
        const px = x + size / 2 + radius * Math.cos(angle); // X-coordinate
        const py = y + size / 2 + radius * Math.sin(angle); // Y-coordinate

        if (i === 0) {
            context.moveTo(px, py); // Move to the first point
        } else {
            context.lineTo(px, py); // Draw line to the next point
        }
    }

    context.closePath();
    context.stroke(); // Outline the star
    context.fill(); // Fill the star if needed
}


_basicPlus(args: BasicFigureDrawArgsCanvas): void {
  const { size, context } = args;

  const thickness = size / 2.5; // Thickness of the cross lines
  const halfSize = size / 2; // Half size for positioning the lines
  
  this._rotateFigure({
    ...args,
    draw: () => {
      context.beginPath();

      // Set the line width for the plus lines to make them bolder
      context.lineWidth = thickness; 
      // context.lineJoin = 'round'; // Ensure the line joins are rounded
      // context.lineCap = 'round';  // Make the line ends rounded

      // Draw the horizontal line (left to right)
      context.moveTo(-halfSize, 0); // Starting point: left side
      context.lineTo(halfSize, 0);  // Ending point: right side

      // Draw the vertical line (top to bottom)
      context.moveTo(0, -halfSize); // Starting point: top side
      context.lineTo(0, halfSize);  // Ending point: bottom side

      context.stroke(); // Outline the plus shape with the adjusted thickness
      context.closePath();
    },
  });
}


  _basicCross(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    
    const thickness = size / 2.5; // Thickness of the cross lines
    const halfSize = size / 2.5; // Reduce the size of the canvas (width and height of the cross)
    const cornerRadius = thickness / 2; // Radius for rounded corners
    
    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();
    
        // Set the line width for the cross lines to make them bolder
        context.lineWidth = thickness; 
        context.lineJoin = 'round'; // Ensure the line joins are rounded
        context.lineCap = 'round';  // Make the line ends rounded
    
        // Draw the first diagonal line (top-left to bottom-right)
        context.moveTo(-halfSize + cornerRadius, -halfSize + cornerRadius); // Starting point: top-left with a rounded corner
        context.lineTo(halfSize - cornerRadius, halfSize - cornerRadius);   // Ending point: bottom-right with a rounded corner
    
        // Draw the second diagonal line (top-right to bottom-left)
        context.moveTo(halfSize - cornerRadius, -halfSize + cornerRadius);  // Starting point: top-right with a rounded corner
        context.lineTo(-halfSize + cornerRadius, halfSize - cornerRadius);  // Ending point: bottom-left with a rounded corner
          
        context.stroke(); // Outline the cross with the adjusted thickness and rounded corners
        context.closePath();
      },
    });
  }

  _basicRhombus(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
    
    const thickness = size / 2.5; // Thickness of the cross lines
    const halfSize = size / 2.5; // Reduce the size of the canvas (width and height of the cross)
    const cornerRadius = thickness / 2; // Radius for rounded corners
    
    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();
    
        // Set the line width for the cross lines to make them bolder
        context.lineWidth = thickness; 
        context.lineJoin = 'round'; // Ensure the line joins are rounded
        context.lineCap = 'round';  // Make the line ends rounded
    
        // Draw the first diagonal line (top-left to bottom-right)
        context.moveTo(-halfSize + cornerRadius, -halfSize + cornerRadius); // Starting point: top-left with a rounded corner
        context.lineTo(halfSize - cornerRadius, halfSize - cornerRadius);   // Ending point: bottom-right with a rounded corner
    
        // Draw the second diagonal line (top-right to bottom-left)
        context.moveTo(halfSize - cornerRadius, -halfSize + cornerRadius);  // Starting point: top-right with a rounded corner
        context.lineTo(-halfSize + cornerRadius, halfSize - cornerRadius);  // Ending point: bottom-left with a rounded corner
          
        context.stroke(); // Outline the cross with the adjusted thickness and rounded corners
        context.closePath();
      },
    });
  }

  _basicSquareGrid(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;
  
    const boxSize = size / 2.5; // Size of each box
    const gap = size / 12; // Gap between the boxes
  
    // The positions for the boxes
    const startX = -size / 2.2; // Start X position (left side of the grid)
    const startY = -size / 2.2; // Start Y position (top side of the grid)
  
    this._rotateFigure({
      ...args,
      draw: () => {
        context.beginPath();
  
        // Set the line width for the box edges
        context.lineWidth = 2;
        context.lineJoin = 'miter'; // Use sharp corners for the boxes
        context.lineCap = 'butt';  // Use flat line ends
  
        // Draw the top-left box
        context.rect(startX, startY, boxSize, boxSize);
  
        // Draw the top-right box (shifted by the box size + gap)
        context.rect(startX + boxSize + gap, startY, boxSize, boxSize);
  
        // Draw the bottom-left box (shifted down by the box size + gap)
        context.rect(startX, startY + boxSize + gap, boxSize, boxSize);
  
        // Draw the bottom-right box (shifted by both box size + gap horizontally and vertically)
        context.rect(startX + boxSize + gap, startY + boxSize + gap, boxSize, boxSize);
  
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

  _drawStar({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicStar({ x, y, size, context, rotation });
  }

  _drawPlus({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicPlus({ x, y, size, context, rotation });
  }

  _drawCross({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicCross({ x, y, size, context, rotation });
  }

  _drawDiamond({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicDiamond({ x, y, size, context, rotation });
  }

  _drawSquareRounded({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicRoundedSquare({ x, y, size, context, rotation });
  }

  _drawSquareRoundedRightBottomEdge({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicRoundedSquareRightBottomEdge({ x, y, size, context, rotation });
  }

  // _drawLeaf({ x, y, size, context, rotation }: DrawArgsCanvas): void {
  //   this._basicLeaf({ x, y, size, context, rotation });
  // }
  _drawRhombus({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicRhombus({ x, y, size, context, rotation });
  }

  _drawCircleLeftTopEdge({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicCircleLeftTopEdge({ x, y, size, context, rotation });
  }

  _drawCircleRightBottomEdge({
    x,
    y,
    size,
    context,
    rotation,
  }: DrawArgsCanvas): void {
    this._basicCircleRightBottomEdge({ x, y, size, context, rotation });
  }
  _drawSquareGrid({ x, y, size, context, rotation }: DrawArgsCanvas): void {
    this._basicSquareGrid({ x, y, size, context, rotation });
  }
}
