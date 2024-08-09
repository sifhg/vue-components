import { Colour, ColourString, isColourString } from "./Colour.js";
import Vector from "./Vector.js";

type Size = { w: number; h: number };

type ShapeTag =
  | { tag: "circle"; r: number }
  | { tag: "rect"; size: Size; borderRadius?: number };
type Shape = {
  pos: Vector;
  label?: string;
  colour?: ColourString | Colour | boolean;
} & ShapeTag;

/**
 * Creates a canvas or links the a canvas project to a specified HTML canvas element.
 */
class GoodCanvas {
  private shapes: Array<Shape>;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private canvasSize: { w: number; h: number };
  private backgroundColour: Colour | undefined;
  private _frameRate: number;
  private _runtimeFrameRate: number;
  private _frameCount: number;
  private _looping: boolean;
  private _mouseHistory: [Vector, Vector];

  /**
   * Create or link a canvas.
   * @param {string} canvasID - ID of the created canvas or of the HTML canvas element you want to link to.
   */
  constructor(canvasID: string) {
    this.shapes = [];
    this._mouseHistory = [new Vector([0, 0]), new Vector([0, 0])];

    document.addEventListener("mousemove", (event) => {
      const MOUSE_POSITION = this.calculateMousePosition(event);
      this._mouseHistory[1] = this._mouseHistory[0].clone();
      this._mouseHistory[0] = MOUSE_POSITION;
    });

    const CANVAS = document.getElementById(canvasID);
    if (!CANVAS) {
      const NEW_CANVAS = document.createElement("canvas");
      NEW_CANVAS.id = canvasID;
      document.getElementsByTagName("body")[0].appendChild(NEW_CANVAS);
      this.canvas = NEW_CANVAS;
    } else if (CANVAS.tagName !== "CANVAS") {
      throw new Error(
        `HTML element of id ${canvasID} bust be a canvas element. HTML element of id is a "${CANVAS.tagName}" element`
      );
    } else {
      this.canvas = <HTMLCanvasElement>CANVAS;
    }
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.canvasSize = {
      w: this.canvas.width,
      h: this.canvas.height,
    };
    this._frameRate = 30;
    this._runtimeFrameRate = this._frameRate;
    this._frameCount = 0;
    this._looping = true;
  }

  /**
   * Set the size of the canvas.
   * @param {number} w - width of the canvas
   * @param {number} h - height of the canvas
   */
  setCanvasSize(w: number, h: number) {
    this.shapes = new Array<Shape>();
    this.canvasSize = {
      w: w,
      h: h,
    };
    this.canvas.width = w;
    this.canvas.height = h;
  }

  /**
   * Set the background colour of the canvas.
   *
   * @param {Colour} colour - background colour.
   */
  background(colour: Colour): void {
    this.backgroundColour = colour;
    this.ctx.fillStyle = this.backgroundColour.toString();
    this.ctx.fillRect(0, 0, this.canvasSize.w, this.canvasSize.h);
  }

  /**
   * Creates and adds a circle to the canvas.
   *
   * @param {number} x
   * @param {number} y
   * @param {number} r
   * @param {Colour | ColourString | boolean} colour
   * @param {string} label
   * @returns
   */
  createCircle(
    x: number,
    y: number,
    r: number,
    colour?: Colour | ColourString | boolean,
    label?: string
  ): Shape {
    const NEW_CIRCLE: Shape = {
      pos: new Vector(x, y),
      tag: "circle",
      r: r,
    };
    if (label) {
      NEW_CIRCLE.label = label;
    }
    if (colour) {
      NEW_CIRCLE.colour = <ColourString>colour.toString();
    }
    this.shapes.push(NEW_CIRCLE);
    return NEW_CIRCLE;
  }

  createRect(x: number, y: number, w: number, h: number): Shape;
  createRect(x: number, y: number, w: number, h: number, label?: string): Shape;
  createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    borderRadius?: number
  ): Shape;
  createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    colour?: Colour | ColourString | boolean
  ): Shape;
  createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    borderRadius?: number,
    label?: string
  ): Shape;
  createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    colour?: Colour | ColourString | boolean,
    label?: string
  ): Shape;
  createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    colour?: Colour | ColourString | boolean,
    borderRadius?: number
  ): Shape;
  createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    colour?: Colour | ColourString | boolean,
    borderRadius?: number,
    label?: string
  ): Shape;
  createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    arg0?: Colour | ColourString | boolean | number | string,
    arg1?: Colour | ColourString | boolean | number | string,
    arg2?: Colour | ColourString | boolean | number | string
  ): Shape {
    const NEW_RECT: Shape = {
      pos: new Vector([x, y]),
      tag: "rect",
      size: {
        w: w,
        h: h,
      },
    };
    const OPTIONAL_ARGS = [arg0, arg1, arg2];
    for (const ARG of OPTIONAL_ARGS) {
      if (typeof ARG === "number") {
        NEW_RECT.borderRadius = ARG;
      }
      if (
        ARG instanceof Colour ||
        isColourString(ARG) ||
        typeof ARG === "boolean"
      ) {
        NEW_RECT.colour = <boolean>ARG;
      }
      if (typeof ARG === "string") {
        NEW_RECT.label = ARG;
      }
    }
    this.shapes.push(NEW_RECT);
    return NEW_RECT;
  }

  /**
   * Renders the current composition to the canvas.
   *
   * @param {boolean} [renderBackground = true] - Whether or not to render the background.
   */
  render(renderBackground: boolean = true) {
    renderBackground = renderBackground === undefined ? true : renderBackground;
    if (!this.backgroundColour) {
      this.ctx.fillStyle = "rgb(255 255 255)";
    } else {
      this.ctx.fillStyle = this.backgroundColour.toString();
    }
    if (renderBackground) {
      this.ctx.fillRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    }
    for (const SHAPE of this.shapes) {
      switch (SHAPE.tag) {
        case "circle":
          this.ctx.beginPath();
          this.ctx.arc(SHAPE.pos.x, SHAPE.pos.y, SHAPE.r, 0, 2 * Math.PI);
          if (
            typeof SHAPE.colour === "string" ||
            SHAPE.colour instanceof Colour
          ) {
            this.ctx.fillStyle = SHAPE.colour.toString();
            this.ctx.fill();
          } else if (SHAPE.colour) {
            this.ctx.fill();
          } else {
            this.ctx.stroke();
          }
          this.ctx.closePath();
          break;
        case "rect":
          const SIZE =
            "w" in SHAPE.size
              ? {
                  w: SHAPE.size.w,
                  h: SHAPE.size.h,
                }
              : {
                  w: SHAPE.size[0],
                  h: SHAPE.size[1],
                };
          if (SHAPE.borderRadius) {
            const BORDER_RADIUS = (() => {
              const ASSIGNED_RADIUS = SHAPE.borderRadius!;
              const MAX_WIDTH = Math.abs(SIZE.w / 2);
              const MAX_HEIGHT = Math.abs(SIZE.h / 2);
              return Math.min(ASSIGNED_RADIUS, MAX_WIDTH, MAX_HEIGHT);
            })();
            this.ctx.beginPath();
            this.ctx.moveTo(SHAPE.pos.x + BORDER_RADIUS, SHAPE.pos.y);
            this.ctx.arcTo(
              SHAPE.pos.x,
              SHAPE.pos.y,
              SHAPE.pos.x,
              SHAPE.pos.y + BORDER_RADIUS,
              BORDER_RADIUS
            );
            this.ctx.lineTo(SHAPE.pos.x, SHAPE.pos.y + SIZE.h - BORDER_RADIUS);
            this.ctx.arcTo(
              SHAPE.pos.x,
              SHAPE.pos.y + SIZE.h,
              SHAPE.pos.x + BORDER_RADIUS,
              SHAPE.pos.y + SIZE.h,
              BORDER_RADIUS
            );
            this.ctx.lineTo(
              SHAPE.pos.x + SIZE.w - BORDER_RADIUS,
              SHAPE.pos.y + SIZE.h
            );
            this.ctx.arcTo(
              SHAPE.pos.x + SIZE.w,
              SHAPE.pos.y + SIZE.h,
              SHAPE.pos.x + SIZE.w,
              SHAPE.pos.y + SIZE.h - BORDER_RADIUS,
              BORDER_RADIUS
            );
            this.ctx.lineTo(SHAPE.pos.x + SIZE.w, SHAPE.pos.y + BORDER_RADIUS);
            this.ctx.arcTo(
              SHAPE.pos.x + SIZE.w,
              SHAPE.pos.y,
              SHAPE.pos.x + SIZE.w - BORDER_RADIUS,
              SHAPE.pos.y,
              BORDER_RADIUS
            );
            this.ctx.lineTo(SHAPE.pos.x + BORDER_RADIUS, SHAPE.pos.y);

            if (
              typeof SHAPE.colour === "string" ||
              SHAPE.colour instanceof Colour
            ) {
              this.ctx.fillStyle = SHAPE.colour.toString();
              this.ctx.fill();
            } else if (SHAPE.colour) {
              this.ctx.fill();
            } else {
              this.ctx.stroke();
            }
            this.ctx.closePath();
            break;
          } else {
            this.ctx.beginPath();
            this.ctx.moveTo(SHAPE.pos.x, SHAPE.pos.y);
            this.ctx.lineTo(SHAPE.pos.x, SHAPE.pos.y + SIZE.h);
            this.ctx.lineTo(SHAPE.pos.x + SIZE.w, SHAPE.pos.y + SIZE.h);
            this.ctx.lineTo(SHAPE.pos.x + SIZE.w, SHAPE.pos.y);
            this.ctx.lineTo(SHAPE.pos.x, SHAPE.pos.y);
            if (
              typeof SHAPE.colour === "string" ||
              SHAPE.colour instanceof Colour
            ) {
              this.ctx.fillStyle = SHAPE.colour.toString();
              this.ctx.fill();
            } else if (SHAPE.colour) {
              this.ctx.fill();
            } else {
              this.ctx.stroke();
            }
            this.ctx.closePath();
            break;
          }
      }
    }
  }
  /**
   * Executes a function for every frame.
   *
   * @param {function} callback
   */
  draw(callback: () => void) {
    let delay = 1000 / this._frameRate;
    this._frameCount++;
    const START = Date.now();
    callback();
    const EXECUTION_TIME = Date.now() - START;
    if (EXECUTION_TIME > 1000 / this._frameRate) {
      delay = 0;
      this._runtimeFrameRate = 1000 / EXECUTION_TIME;
    } else {
      delay = 1000 / this._frameRate - EXECUTION_TIME;
      this._runtimeFrameRate = this._frameRate;
    }
    if (this.isLooping()) {
      const NEXT = () => {
        this.draw(callback);
      };
      setTimeout(NEXT, delay);
    }
  }

  /**
   * Begins executing the draw loop.
   */
  startLoop() {
    this._looping = true;
  }

  /**
   * Stops executing the draw loop.
   */
  stopLoop() {
    this._looping = false;
  }

  /**
   * Checks whether the looping process is currently active.
   *
   * @returns {boolean} `true` if the loop is active, `false` otherwise.
   */
  isLooping(): boolean {
    return this._looping;
  }

  /**
   * Clears the canvas for any shapes.
   */
  clearCanvas() {
    this.shapes = [];
  }

  // DEFINED THIS LATER
  onMouseMove(callback: () => void) {}

  /**
   * Calculates the current mouse position.
   * @param {MouseEvent} event
   * @returns {Vector}
   */
  private calculateMousePosition(event: MouseEvent): Vector {
    return new Vector(
      event.clientX - this.canvas.clientLeft,
      event.clientY - this.canvas.clientTop
    );
  }

  //Setters and getters
  set frameRate(newFrameRate: number) {
    this._frameRate = newFrameRate;
  }
  get frameRate(): number {
    return this._frameRate;
  }
  get runtimeFrameRate(): number {
    return this._runtimeFrameRate;
  }

  get framCount(): number {
    return this._frameCount;
  }
  get width(): number {
    return this.canvasSize.w;
  }
  get height(): number {
    return this.canvasSize.h;
  }
}

export default GoodCanvas;
