import { createColour, PGCanvas, PGShape, PGVector } from "./GoodCanvas";

class Day {
  private _day: number;
  private _width: number;
  private _height: number;
  private _PGsquare: PGShape | undefined | null;
  constructor(day: number, unitSize: PGVector) {
    this._day = day;
    this._width = unitSize.x;
    this._height = unitSize.y;
  }

  public display(x: number, y: number, canvas: PGCanvas) {
    this._PGsquare = canvas.createRect(x, y, this._width, this._height);
    this._PGsquare.colour = createColour("GREYSCALE", 192);
    this._PGsquare.setStroke(1, createColour("GREYSCALE", 0));
    this._PGsquare.borderRadius = this._height / 3;
  }

  public get width(): number {
    return this._width;
  }
  public get day(): number {
    return this._day;
  }
  public get x(): number {
    if (this._PGsquare) {
      return this._PGsquare.x;
    }
    throw new Error(`This Day instance has no PGShape member.`);
  }
}

export default Day;
