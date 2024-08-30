import { createColour, PGCanvas, PGShape, PGVector } from "./GoodCanvas";

class Day {
  private _day: number;
  private _x: number;
  private _width: number;
  private _height: number;
  private _PGsquare: PGShape | undefined | null;
  private _selected: boolean;
  private _hover: boolean;
  constructor(day: number, unitSize: PGVector, x: number) {
    this._day = day;
    this._width = unitSize.x;
    this._x = x;
    this._height = unitSize.y;
    this._selected = false;
    this._hover = false;
  }

  public display(
    canvas: PGCanvas,
    displayFineness: Set<"days" | "months" | "years">,
    xVisible0: number,
    xVisible1: number
  ) {
    if (
      !displayFineness.has("days") ||
      this._x + this._width < xVisible0 ||
      this._x > xVisible1
    ) {
      return;
    }
    this._PGsquare = canvas.createRect(this._x, 0, this._width, this._height);
    this._PGsquare.colour = this._selected
      ? createColour("RGB", 0, 0, 255)
      : createColour("GREYSCALE", 223);

    this._PGsquare.borderRadius = this._height / 3;
  }

  public select(): void {
    this._selected = true;
  }
  public deselect(): void {
    this._selected = false;
  }
  public mouseEnter(): void {
    this._hover = true;
  }
  public mouseLeave(): void {
    this._hover = false;
  }

  public get width(): number {
    return this._width;
  }
  public get day(): number {
    return this._day;
  }
  public get x(): number {
    return this._x;
  }
}

export default Day;
