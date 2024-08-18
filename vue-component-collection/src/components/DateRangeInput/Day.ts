import { createColour, PGCanvas, PGShape } from "./GoodCanvas";

class Day {
  private _day: number;
  private _width: number;
  private _unitSize: number;
  private _PGsquare: PGShape | undefined | null;
  constructor(day: number, unitSize: number) {
    this._day = day;
    this._width = unitSize;
    this._unitSize = unitSize;
  }

  public display(x: number, y: number, canvas: PGCanvas) {
    if (this._PGsquare === undefined || this._PGsquare === null) {
      this._PGsquare = canvas.createRect(x, y, this._width, this._unitSize);
      this._PGsquare.colour = createColour("GREYSCALE", 192);
      this._PGsquare.setStroke(1, createColour("GREYSCALE", 0));
      this._PGsquare.borderRadius = this._unitSize / 3;
    } else {
      this._PGsquare.x = x;
      this._PGsquare.y = y;
    }
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
